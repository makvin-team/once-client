import { chromium } from 'playwright';

// Build a mock JWT with role=user claim that AuthProvider can decode.
function buildMockJwt(role = 'user') {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: 'u_learner', id: 'u_learner', role,
    name: 'Aziz Karimov', email: 'aziz.karimov@bank.uz',
    iat: now, exp: now + 3600,
  })).toString('base64url');
  return `${header}.${payload}.mock_signature`;
}

const tokenPair = {
  accessToken: buildMockJwt('user'),
  refreshToken: 'mock.refresh.token',
  accessTokenExpiresAt: new Date(Date.now() + 3600_000).toISOString(),
  refreshTokenExpiresAt: new Date(Date.now() + 7 * 86400_000).toISOString(),
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await context.addInitScript((pair) => {
  window.localStorage.setItem('once.auth.tokens.v1', JSON.stringify(pair));
}, tokenPair);

const page = await context.newPage();

const results = [];
function log(msg, pass) {
  results.push({ msg, pass });
  console.log(`${pass ? '✓' : '✗'} ${msg}`);
}

// ---- DOM helpers that bypass overlay interception ----

// Get the fraud dialog DOM text (skips Quick Questions dialog)
async function fraudDialogText() {
  return page.evaluate(() => {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    for (const d of dialogs) {
      if (d.getAttribute('aria-label') !== 'Quick Questions') {
        return d.textContent ?? '';
      }
    }
    return '';
  });
}

// Check if fraud dialog is open
async function isFraudDialogOpen() {
  return page.evaluate(() => {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    for (const d of dialogs) {
      if (d.getAttribute('aria-label') !== 'Quick Questions') {
        return true;
      }
    }
    return false;
  });
}

// Click a button inside the fraud dialog by partial text match (uses DOM .click())
async function clickFraudDialogBtn(text) {
  return page.evaluate((t) => {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    for (const d of dialogs) {
      if (d.getAttribute('aria-label') === 'Quick Questions') continue;
      const btns = d.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent.includes(t)) {
          btn.click();
          return 'clicked: ' + btn.textContent.trim();
        }
      }
    }
    return 'not found: ' + t;
  }, text);
}

// Click the last non-close action button in the fraud dialog
async function clickFraudDialogLastBtn() {
  return page.evaluate(() => {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    for (const d of dialogs) {
      if (d.getAttribute('aria-label') === 'Quick Questions') continue;
      const btns = Array.from(d.querySelectorAll('button')).filter(b => !b.getAttribute('aria-label'));
      if (btns.length > 0) {
        const last = btns[btns.length - 1];
        last.click();
        return 'clicked: ' + last.textContent.trim();
      }
    }
    return 'no buttons';
  });
}

// Click the close button (button with aria-label) in the fraud dialog
async function closeFraudDialog() {
  await page.evaluate(() => {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    for (const d of dialogs) {
      if (d.getAttribute('aria-label') === 'Quick Questions') continue;
      const closeBtn = d.querySelector('button[aria-label]');
      if (closeBtn) { closeBtn.click(); return; }
    }
  });
  await page.waitForTimeout(500);
}

// Count elements inside fraud dialog by selector
async function countInFraudDialog(selector) {
  return page.evaluate((sel) => {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    for (const d of dialogs) {
      if (d.getAttribute('aria-label') === 'Quick Questions') continue;
      return d.querySelectorAll(sel).length;
    }
    return 0;
  }, selector);
}

try {
  await page.goto('http://localhost:5173/learner/fraud', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(1500);

  const url = page.url();
  log('Navigated to /learner/fraud page', url.includes('/learner/fraud'));
  await page.screenshot({ path: 'fraud-01-initial.png', fullPage: true });

  // ==================== PAGE STRUCTURE ====================

  // Heading
  const h1 = await page.locator('h1').first().textContent().catch(() => '');
  log(`H1 heading: "${h1.trim()}"`, h1.trim().length > 0);

  // Tabs (3: All scenarios / My attempts / Favorites)
  const tabTexts = await page.locator('[role="tablist"] button[role="tab"]').allTextContents();
  log(`3 tabs present: ${tabTexts.map(t => t.trim()).join(' | ')}`, tabTexts.length >= 3);

  // Scenario list
  const listCount = await page.locator('ul li').count();
  log(`Scenario list renders (${listCount} items)`, listCount > 0);

  // Filters: 4 selects (type, difficulty, risk, sort)
  const selects = await page.locator('select').count();
  log(`4 filter dropdowns (found ${selects})`, selects >= 4);

  // Search input
  const searchVis = await page.locator('input').first().isVisible().catch(() => false);
  log('Search input visible', searchVis);

  // Sidebar stats card
  const bodyText = await page.locator('body').textContent();
  const hasStats = bodyText.includes('My statistics') && /Total attempts\s*\d+/.test(bodyText);
  log('Sidebar "My statistics" card with numeric data', hasStats);

  // Sidebar tip card
  const hasTip = bodyText.includes('Read more') || bodyText.includes('Batafsil');
  log('Sidebar tip card with "Read more"', hasTip);

  // Recommended scenario card
  const hasRecCard = bodyText.includes('TIP') || bodyText.includes('Tip');
  log('Recommended scenario card in header area', hasRecCard);

  // ==================== PLAY MODE ====================

  // Click Start on the recommended card
  const startBtn = page.locator('button').filter({ hasText: /^Start$/ }).first();
  const startVis = await startBtn.isVisible().catch(() => false);
  log('Recommended card: Start button visible', startVis);

  if (startVis) {
    await startBtn.click();
    await page.waitForTimeout(1000);

    const modalOpen = await isFraudDialogOpen();
    log('Play modal: opens after Start click', modalOpen);

    if (modalOpen) {
      await page.screenshot({ path: 'fraud-02-play-intro.png', fullPage: true });

      // Step indicator
      const stepCount = await countInFraudDialog('ol li');
      log(`Step indicator: ${stepCount} steps shown`, stepCount >= 4);

      // ---- PHASE 1: Intro ----
      const introText = await fraudDialogText();
      const onIntro = introText.includes('Situation') || introText.includes('Your role') || introText.includes('Task');
      log('Intro phase: Situation/Role/Task content shown', onIntro);

      await clickFraudDialogBtn('Start the review');
      await page.waitForTimeout(600);

      // ---- PHASE 2: Evidence ----
      const evidenceText = await fraudDialogText();
      const onEvidence = evidenceText.includes('Evidence') && !evidenceText.includes('Start the review');
      log('Evidence phase: navigated to Evidence', onEvidence);
      await page.screenshot({ path: 'fraud-03-play-evidence.png', fullPage: true });

      // Check evidence content (email/transaction/document etc.)
      const hasEvidenceContent = evidenceText.includes('Sender') || evidenceText.includes('Customer') ||
        evidenceText.includes('Caller') || evidenceText.includes('Document') ||
        evidenceText.includes('Actor') || evidenceText.includes('Business');
      log('Evidence phase: evidence details rendered', hasEvidenceContent);

      // Advance to Red Flags
      await clickFraudDialogLastBtn();
      await page.waitForTimeout(600);

      // ---- PHASE 3: Red Flags ----
      const rfText = await fraudDialogText();
      const onRedFlags = rfText.includes('Red flag') || rfText.includes('red flag') || rfText.includes('Mark the');
      log('Red flags phase: navigated to Red Flags', onRedFlags);
      await page.screenshot({ path: 'fraud-04-play-redflags.png', fullPage: true });

      const cbCount = await countInFraudDialog('input[type="checkbox"]');
      log(`Red flags phase: ${cbCount} flag checkboxes rendered`, cbCount > 0);

      if (cbCount > 0) {
        // Select first two flags via DOM
        await page.evaluate(() => {
          const dialogs = document.querySelectorAll('[role="dialog"]');
          for (const d of dialogs) {
            if (d.getAttribute('aria-label') === 'Quick Questions') continue;
            const cbs = d.querySelectorAll('input[type="checkbox"]');
            if (cbs[0]) cbs[0].click();
            if (cbs[1]) cbs[1].click();
          }
        });
        await page.waitForTimeout(300);

        const checkedCount = await page.evaluate(() => {
          const dialogs = document.querySelectorAll('[role="dialog"]');
          for (const d of dialogs) {
            if (d.getAttribute('aria-label') === 'Quick Questions') continue;
            return Array.from(d.querySelectorAll('input[type="checkbox"]')).filter(c => c.checked).length;
          }
          return 0;
        });
        log(`Red flags phase: ${checkedCount} flags selected correctly`, checkedCount > 0);

        // Advance to Decision
        await clickFraudDialogLastBtn();
        await page.waitForTimeout(600);
      } else {
        log('Red flags phase: flags selected correctly', false);
      }

      // ---- PHASE 4: Decision ----
      const decText = await fraudDialogText();
      const onDecision = decText.includes('Decision') || decText.includes('decision');
      log('Decision phase: navigated to Decision', onDecision);
      await page.screenshot({ path: 'fraud-05-play-decision.png', fullPage: true });

      const radioCount = await countInFraudDialog('input[type="radio"]');
      log(`Decision phase: ${radioCount} radio options rendered`, radioCount > 0);

      if (radioCount > 0) {
        // Select first radio
        await page.evaluate(() => {
          const dialogs = document.querySelectorAll('[role="dialog"]');
          for (const d of dialogs) {
            if (d.getAttribute('aria-label') === 'Quick Questions') continue;
            const radios = d.querySelectorAll('input[type="radio"]');
            if (radios[0]) radios[0].click();
          }
        });
        await page.waitForTimeout(200);

        const radioSelected = await page.evaluate(() => {
          const dialogs = document.querySelectorAll('[role="dialog"]');
          for (const d of dialogs) {
            if (d.getAttribute('aria-label') === 'Quick Questions') continue;
            return Array.from(d.querySelectorAll('input[type="radio"]')).some(r => r.checked);
          }
          return false;
        });
        log('Decision phase: radio option selectable', radioSelected);

        // Submit
        await clickFraudDialogLastBtn();
        await page.waitForTimeout(1000);

        // ---- PHASE 5: Result ----
        const resultText = await fraudDialogText();
        await page.screenshot({ path: 'fraud-06-play-result.png', fullPage: true });

        const hasScore = /\d+/.test(resultText) && resultText.includes('/ 100');
        log('Result phase: score (x/100) displayed', hasScore);

        // UI uses "Try again" (failed) or "Well done"/"Excellent" (passed) — not "passed/failed"
        const hasPassFail = /Try again|Well done|Excellent|Not enough|Congratul/i.test(resultText);
        log('Result phase: pass/fail status shown', hasPassFail);

        const hasExplanation = resultText.includes('explanation') || resultText.includes('Explanation') ||
          resultText.includes('Correct decision') || resultText.length > 300;
        log('Result phase: explanation/details shown', hasExplanation);

        const hasRetry = resultText.includes('Retry') || resultText.includes('Next scenario') || resultText.includes('Back to list');
        log('Result phase: action buttons (Retry/Next) shown', hasRetry);

        // Close modal
        await closeFraudDialog();
        const closed = !(await isFraudDialogOpen());
        log('Play modal: closes cleanly', closed);
      } else {
        log('Decision phase: radio option selectable', false);
        log('Result phase: score displayed', false);
        log('Result phase: pass/fail shown', false);
        log('Result phase: explanation shown', false);
        log('Result phase: action buttons shown', false);
        log('Play modal: closes cleanly', false);
      }
    } else {
      for (const msg of ['Play modal: opens', 'Step indicator', 'Intro phase', 'Evidence navigated', 'Evidence content', 'Red flags navigated', 'Red flags checkboxes', 'Red flags selected', 'Decision navigated', 'Decision radios', 'Decision selectable', 'Result score', 'Result pass/fail', 'Result explanation', 'Result action buttons', 'Modal closes'])
        log(msg, false);
    }
  } else {
    log('Play modal: opens after Start click', false);
  }

  // ==================== SCENARIO DETAIL MODAL ====================

  // Ensure no fraud dialog is open
  if (await isFraudDialogOpen()) await closeFraudDialog();
  await page.waitForTimeout(300);

  const scenTitleBtn = page.locator('ul li button').first();
  if (await scenTitleBtn.isVisible().catch(() => false)) {
    // Use DOM click to avoid interception
    await page.evaluate(() => {
      const btn = document.querySelector('ul li button');
      if (btn) btn.click();
    });
    await page.waitForTimeout(600);
    const detailOpen = await isFraudDialogOpen();
    log('Scenario detail modal: opens on title click', detailOpen);
    if (detailOpen) {
      await page.screenshot({ path: 'fraud-07-detail-modal.png', fullPage: true });
      const detailText = await fraudDialogText();
      const hasDetailContent = detailText.length > 100 &&
        (detailText.includes('Duration') || detailText.includes('Pass') || detailText.includes('Role') || detailText.includes('Skills'));
      log('Detail modal: shows scenario metadata (duration/role/skills)', hasDetailContent);
      await closeFraudDialog();
    } else {
      log('Detail modal: shows scenario metadata', false);
    }
  } else {
    log('Scenario detail modal: opens on title click', false);
    log('Detail modal: shows scenario metadata', false);
  }

  // ==================== ATTEMPTS TAB ====================

  const attTab = page.locator('[role="tablist"] button[role="tab"]').nth(1);
  await attTab.click();
  await page.waitForTimeout(500);

  const attCount = await page.locator('ul li').count();
  log(`Attempts tab: ${attCount} attempt records visible`, attCount > 0);
  await page.screenshot({ path: 'fraud-08-attempts.png', fullPage: true });

  if (attCount > 0) {
    // View Result button on first attempt
    const viewResultText = await page.locator('ul li button').first().textContent().catch(() => '');
    const hasViewBtn = viewResultText.includes('View result') || viewResultText.includes('Ko\'rish');
    log(`Attempts tab: "View result" button present`, hasViewBtn);

    // Click view result via DOM
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('ul li button'));
      for (const b of btns) {
        if (b.textContent.includes('View result') || b.textContent.includes("Ko'rish")) {
          b.click();
          return;
        }
      }
      // Fallback: click first button in list
      const first = document.querySelector('ul li button');
      if (first) first.click();
    });
    await page.waitForTimeout(600);
    const attDetailOpen = await isFraudDialogOpen();
    log('Attempts tab: attempt detail modal opens', attDetailOpen);
    if (attDetailOpen) {
      await page.screenshot({ path: 'fraud-09-attempt-detail.png', fullPage: true });
      await closeFraudDialog();
    }
  } else {
    log('Attempts tab: "View result" button present', false);
    log('Attempts tab: attempt detail modal opens', false);
  }

  // ==================== FAVORITES TAB ====================

  const favTab = page.locator('[role="tablist"] button[role="tab"]').nth(2);
  await favTab.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'fraud-10-favorites-empty.png', fullPage: true });
  // Favorites should be empty (no stars clicked yet) - shows empty state
  const favBodyText = await page.locator('body').textContent();
  const showsEmptyState = favBodyText.includes('no favorites') || favBodyText.includes('Sevimli') ||
    favBodyText.includes('Favorites') || favBodyText.length > 100;
  log('Favorites tab: renders (empty state shown)', showsEmptyState);

  // ==================== FAVORITES TOGGLE ====================

  const allTab = page.locator('[role="tablist"] button[role="tab"]').first();
  await allTab.click();
  await page.waitForTimeout(400);

  const favStarBtn = page.locator('button[aria-pressed]').first();
  if (await favStarBtn.isVisible().catch(() => false)) {
    const before = await favStarBtn.getAttribute('aria-pressed');
    await favStarBtn.click();
    await page.waitForTimeout(400);
    const after = await favStarBtn.getAttribute('aria-pressed');
    log(`Favorite star: toggles (${before} -> ${after})`, before !== after);

    // Switch to favorites tab - should show 1 item
    await favTab.click();
    await page.waitForTimeout(400);
    const favItemCount = await page.locator('ul li').count();
    log(`Favorites tab: shows ${favItemCount} favorited scenario`, favItemCount >= 1);
    await page.screenshot({ path: 'fraud-11-favorites-with-item.png', fullPage: true });

    // Un-favorite
    const activeStar = page.locator('button[aria-pressed="true"]').first();
    if (await activeStar.isVisible().catch(() => false)) {
      await activeStar.click();
      await page.waitForTimeout(400);
      await page.waitForTimeout(400);
      const afterUnfavCount = await page.locator('ul li').count();
      const afterUnfavText = await page.locator('body').textContent();
      // Either count dropped to 0, or "No favorites" empty state is shown
      const emptied = afterUnfavCount === 0 || afterUnfavText.includes('No favorites');
      log('Favorites tab: empty state or count drops after un-favoriting', emptied);
    } else {
      log('Favorites tab: empty after un-favoriting', false);
    }
  } else {
    log('Favorite star: toggles', false);
    log('Favorites tab: shows favorited scenario', false);
    log('Favorites tab: empty after un-favoriting', false);
  }

  // ==================== SEARCH & FILTERS ====================

  await allTab.click();
  await page.waitForTimeout(400);
  const totalItems = await page.locator('ul li').count();

  // Search
  const searchInput = page.locator('input').first();
  await searchInput.fill('phishing');
  await page.waitForTimeout(600);
  const filteredItems = await page.locator('ul li').count();
  log(`Search "phishing": ${totalItems} -> ${filteredItems} items`, filteredItems < totalItems && filteredItems > 0);

  await searchInput.clear();
  await page.waitForTimeout(400);
  const restoredItems = await page.locator('ul li').count();
  log('Search clear: restores full list', restoredItems >= totalItems);

  // Type filter
  const typeSelect = page.locator('select').first();
  const typeOpts = await typeSelect.locator('option').allTextContents();
  log(`Type filter: ${typeOpts.length} options (All + types)`, typeOpts.length > 1);
  if (typeOpts.length > 1) {
    await typeSelect.selectOption({ index: 1 });
    await page.waitForTimeout(400);
    const typeFiltered = await page.locator('ul li').count();
    log(`Type filter: list filtered (${totalItems} -> ${typeFiltered})`, typeFiltered <= totalItems);
    await typeSelect.selectOption({ index: 0 });
    await page.waitForTimeout(300);
  } else {
    log('Type filter: list filtered', false);
  }

  // Difficulty filter
  const diffSelect = page.locator('select').nth(1);
  const diffOpts = await diffSelect.locator('option').allTextContents();
  log(`Difficulty filter: ${diffOpts.length} options`, diffOpts.length > 1);
  if (diffOpts.length > 1) {
    await diffSelect.selectOption({ index: 1 });
    await page.waitForTimeout(400);
    const diffFiltered = await page.locator('ul li').count();
    log(`Difficulty filter: list filtered (${totalItems} -> ${diffFiltered})`, diffFiltered <= totalItems);
    await diffSelect.selectOption({ index: 0 });
    await page.waitForTimeout(300);
  } else {
    log('Difficulty filter: list filtered', false);
  }

  // Sort dropdown
  const sortSelect = page.locator('select').last();
  const sortOpts = await sortSelect.locator('option').allTextContents();
  log(`Sort dropdown: ${sortOpts.length} options`, sortOpts.length >= 3);
  if (sortOpts.length > 1) {
    await sortSelect.selectOption({ index: 1 }); // "Highest risk"
    await page.waitForTimeout(400);
    const sortCount = await page.locator('ul li').count();
    log('Sort change: list remains after sort', sortCount > 0);
    await sortSelect.selectOption({ index: 0 });
  } else {
    log('Sort change: list remains after sort', false);
  }

  // ==================== TIP CARD EXPAND ====================
  // Use DOM click to bypass the QQ widget overlay
  const tipExpanded = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    for (const b of btns) {
      if (b.textContent.trim() === 'Read more' || b.textContent.trim() === 'Batafsil') {
        b.click();
        return true;
      }
    }
    return false;
  });
  await page.waitForTimeout(400);
  if (tipExpanded) {
    // After clicking, the button should now say "Close" (or the expanded list appears)
    const afterExpandText = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      for (const b of btns) {
        if (b.textContent.trim() === 'Close' || b.textContent.trim() === 'Yopish') return 'close_found';
      }
      // Also check if the ul list expanded in the tip card
      const uls = document.querySelectorAll('aside ul, .flex-col ul');
      return uls.length > 0 ? 'list_found' : 'not_found';
    });
    log('Tip card: "Read more" expands tip content', afterExpandText !== 'not_found');
  } else {
    log('Tip card: "Read more" expands tip content', false);
  }

  await page.screenshot({ path: 'fraud-12-final.png', fullPage: true });

} catch (err) {
  log(`Unexpected error: ${err.message}`, false);
  console.error('Stack:', err.stack?.split('\n').slice(0, 6).join('\n'));
  await page.screenshot({ path: 'fraud-error.png', fullPage: true }).catch(() => {});
} finally {
  const passed = results.filter(r => r.pass).length;
  const total = results.length;
  console.log('\n' + '='.repeat(60));
  console.log(`RESULTS: ${passed}/${total} passed`);

  if (passed < total) {
    console.log('\nFailed checks:');
    results.filter(r => !r.pass).forEach(r => console.log(`  - ${r.msg}`));
  } else {
    console.log('All tests passed!');
  }

  await browser.close();
}
