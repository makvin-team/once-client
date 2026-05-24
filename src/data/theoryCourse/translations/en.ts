import type { TheoryDictionary } from "../../theoryCourse";

export const theoryCourseEn: TheoryDictionary = {
  ui: {
    eyebrow: "Theory Mode",
    pageTitle: "Web Course",
    pageDescription:
      "The readable companion to the 3D Simulator. Every scenario you can practise in the simulator has a matching theory lesson here — read it first, or use it as a refresher after.",
    pillarLabel: "Pillar",
    modulesCount: (n, minutes) => `${n} modules · ${minutes} min`,
    open: "Open",
    breadcrumbRoot: "Web Course",
    pillarSubtitleLine: (priority, subtitle) =>
      `Pillar ${priority} · ${subtitle}`,
    read: "Read",
    moduleMeta: (minutes, indicators) =>
      `${minutes} min read · ${indicators} indicators · 1 decision`,
    aboutPillar: "About this pillar",
    pillarSummary: (title, count) => `${title} · ${count} modules`,
    aboutPillarLessons: (n) => `${n} theory lessons`,
    aboutPillarMinutes: (m) => `~${m} minutes total`,
    aboutPillarMaps: "Each lesson maps to a simulator scenario",
    aboutPillarFooter:
      "Read the theory, then open the same scenario in the 3D Simulator to practise the decision under time pressure.",
    pillarNotFoundTitle: "Pillar not found",
    pillarNotFoundDescription: "The requested pillar does not exist.",
    backToPillars: "Back to all pillars",
    moduleEyebrow: (pillar, minutes) => `${pillar} · ${minutes} min read`,
    learningObjective: "Learning objective",
    sectionOverview: "Overview",
    sectionIndicators: "Indicators to watch for",
    sectionDecision: "The decision",
    sectionTakeaways: "Key takeaways",
    sectionReferences: "References",
    severity: {
      critical: "CRITICAL",
      high: "HIGH",
      medium: "MEDIUM",
      low: "LOW",
    },
    decisionCorrect: "Correct",
    decisionPartial: "Partial",
    decisionFail: "Fail",
    pointsLabel: (n) => `${n} points`,
    previousModule: "← Previous module",
    nextModule: "Next module →",
    allPillarModules: (pillar) => `All ${pillar} modules`,
    lessonNotFoundTitle: "Lesson not found",
    lessonNotFoundDescription: "The requested theory lesson does not exist.",
  },
  pillars: {
    aml: {
      title: "AML",
      subtitle: "Anti-Money Laundering",
      description:
        "Recognise and respond to money-laundering patterns: structured cash, beneficial-ownership opacity, sanctions hits, PEP risk, and the discipline of writing a usable SAR.",
    },
    cyber: {
      title: "Cyber",
      subtitle: "Cybersecurity",
      description:
        "Triage phishing, alerts, and incidents using the same playbooks SOC teams use in production. Zero-trust thinking and modern social-engineering defences.",
    },
    fraud: {
      title: "Fraud",
      subtitle: "Fraud detection & response",
      description:
        "Spot mule activity, synthetic identities, card skimming, and friendly fraud — and tune the AI models that catch them without crushing customer experience.",
    },
    cx: {
      title: "CX",
      subtitle: "Customer experience",
      description:
        "Verify, communicate, and de-escalate. The interpersonal counterpart to the compliance pillars: how to apply controls without losing the relationship.",
    },
  },
  modules: {
    "aml-m1": {
      title: "Suspicious transaction · CTR / SAR",
      subtitle: "Cash deposit, structuring, and the SAR decision",
      objective:
        "Recognise the red flags of a structured cash deposit and choose the right filing action without tipping off the client.",
      overview:
        "A walk-in client deposits a sum that lands just under the reporting threshold, in clean small bills, with no clear source of funds. The operator must decide whether to file a Suspicious Activity Report (SAR), escalate, release the transaction, or — worst of all — explain the policy to the client. This module covers the legal definition of structuring, the CTR threshold, the SAR filing window, and the anti-tipping-off rule.",
      indicators: [
        {
          label: "Amount just below threshold",
          detail:
            "Deposit of 187M sum sits ~7% below the 200M CTR cut-off. Structuring is a federal-level offence regardless of underlying intent.",
          severity: "critical",
        },
        {
          label: "Cash source unverified",
          detail:
            "Client cannot or will not document where the cash came from. Source-of-funds is mandatory for any cash transaction over 50M sum.",
          severity: "critical",
        },
        {
          label: "Risk score elevated (74)",
          detail:
            "The client's behavioural risk score crossed the bank's 70-point threshold last month and has not been reviewed.",
          severity: "high",
        },
        {
          label: "Cross-border tail (UZ → AE)",
          detail:
            "Funds are wired onward to an AE corporate account within 24 hours — classic layering pattern.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "File a SAR within 3 business days",
        rationale:
          "Filing the SAR is the only legally compliant route. It documents the suspicion, freezes the audit trail, and shields the bank and operator from secondary liability. The client is not informed.",
      },
      partialAction: {
        label: "Escalate to compliance for review",
        rationale:
          "Better than nothing — buys a second pair of eyes — but the SAR clock keeps ticking. Use this only when you are genuinely uncertain whether the pattern qualifies, not as a way to avoid filing.",
      },
      failAction: {
        label: "Release the transaction or tip off the client",
        rationale:
          "Releasing destroys the evidence chain. Tipping off (telling the client a SAR is being filed) is a separate criminal offence under the AML law — it carries personal liability for the operator.",
      },
      takeaways: [
        "Structuring is illegal even if no underlying crime is proven.",
        "SAR must be filed within 3 business days of the suspicion arising.",
        "Never disclose to the client that a SAR is being filed — tipping off is a crime.",
        "Source-of-funds documentation is mandatory above the cash threshold.",
      ],
      references: [
        "FATF Recommendation 20 — Reporting of suspicious transactions",
        "Central Bank of Uzbekistan AML/CFT Regulation 2.4",
      ],
    },
    "aml-m2": {
      title: "Enhanced KYC · beneficial owner",
      subtitle: "Lifting the corporate veil on shell ownership",
      objective:
        "Identify when a corporate structure requires Ultimate Beneficial Owner (UBO) verification and refuse to onboard until the chain is clear.",
      overview:
        "A new corporate account application lists a nominee director and a parent entity registered in a high-secrecy jurisdiction. FATF requires you to look through the structure to the natural person(s) who ultimately own or control ≥25% of the entity. This module covers the legal threshold, acceptable evidence, and when to walk away from an onboarding.",
      indicators: [
        {
          label: "Nominee director on file",
          detail:
            "Director is a professional service provider, not a real principal. Common in legitimate trust structures but also the #1 shell-company tell.",
          severity: "high",
        },
        {
          label: "Parent in high-secrecy jurisdiction",
          detail:
            "Parent registered in a jurisdiction on the FATF grey list with no public beneficial-ownership register.",
          severity: "critical",
        },
        {
          label: "Ownership chain >3 layers deep",
          detail:
            "Each additional layer multiplies the opacity. Above 3 layers, the burden of proof shifts to the client.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Reject onboarding until UBO is documented",
        rationale:
          "The 25% rule is non-negotiable. Without a verified natural-person UBO, the account cannot be opened — full stop. Document the rejection and notify compliance.",
      },
      partialAction: {
        label: "Open with restricted limits pending UBO",
        rationale:
          "Some banks allow this for low-risk corporates, but it transfers the risk to the operator who approved it. Only acceptable if compliance has pre-approved a UBO remediation window.",
      },
      failAction: {
        label: "Open the account on the nominee's signature alone",
        rationale:
          "This is the textbook way shell companies enter the banking system. The bank is then on the hook for whatever the unknown UBO does with the account.",
      },
      takeaways: [
        "The UBO threshold is 25% direct or indirect ownership/control.",
        "Nominee structures are a yellow flag; nominee + secrecy jurisdiction is red.",
        "Never accept 'the lawyer will send it later' — UBO docs are pre-onboarding.",
        "Document the rejection reason; refusals are auditable too.",
      ],
      references: ["FATF Recommendation 24 — Transparency of legal persons"],
    },
    "aml-m3": {
      title: "Sanctions screening · OFAC / UN",
      subtitle: "Name matching, fuzzy hits, and the freeze decision",
      objective:
        "Triage a sanctions screening hit and decide whether to block, escalate, or clear as a false positive.",
      overview:
        "A wire transfer to a beneficiary in a sanctioned jurisdiction triggers a fuzzy-match alert against the OFAC SDN list. The match score is 82% — above the bank's auto-review threshold but below the auto-block line. This module covers OFAC vs UN vs EU sanctions, the 50-percent rule, and what counts as adequate evidence to clear a hit.",
      indicators: [
        {
          label: "Fuzzy match score 82%",
          detail:
            "Name is a transliteration variant of a listed individual. Same DOB band, different middle initial.",
          severity: "critical",
        },
        {
          label: "Beneficiary jurisdiction is comprehensively sanctioned",
          detail:
            "Country-level OFAC programme blocks all transactions absent a specific licence.",
          severity: "critical",
        },
        {
          label: "Originator urgency",
          detail:
            "Client pushes for same-day execution and offers to indemnify the bank. Pressure is itself a red flag.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Block the wire and file an OFAC report",
        rationale:
          "A fuzzy hit at this score plus a comprehensive sanctions jurisdiction is a mandatory block. The bank is required to file the report within 10 business days regardless of intent.",
      },
      partialAction: {
        label: "Hold and escalate to sanctions desk",
        rationale:
          "Acceptable when the match score is borderline and the jurisdiction is non-comprehensive. The wire still cannot be released until cleared.",
      },
      failAction: {
        label: "Release based on client indemnity",
        rationale:
          "Client indemnities are worthless against OFAC penalties. The bank carries strict liability — civil penalties can reach the transaction value plus 2x.",
      },
      takeaways: [
        "Sanctions liability is strict — intent does not matter.",
        "The 50-percent rule: entities owned ≥50% by sanctioned persons are themselves sanctioned even if not listed.",
        "Never accept an indemnity in lieu of clearing a hit.",
        "Document false-positive clearances with the evidence used.",
      ],
      references: ["OFAC SDN List", "UN Security Council Consolidated List"],
    },
    "aml-m4": {
      title: "PEP risk · politically exposed persons",
      subtitle: "Enhanced due diligence for politically exposed clients",
      objective:
        "Apply enhanced due diligence (EDD) to a politically exposed person (PEP) and recognise indirect PEP exposure through family or associates.",
      overview:
        "A new private banking client turns out to be the adult son of a sitting deputy minister. He is not a PEP himself, but is a Relative and Close Associate (RCA) — which under FATF carries the same EDD obligation as a primary PEP. This module covers the PEP/RCA definitions, the 12-month look-back for former PEPs, and the senior-management sign-off requirement.",
      indicators: [
        {
          label: "Family link to government official",
          detail:
            "RCA status applies to immediate family of any PEP — domestic, foreign, or international organisation.",
          severity: "high",
        },
        {
          label: "Wealth not aligned with declared profession",
          detail:
            "Stated income of $40k/yr does not explain a $2M deposit. Source-of-wealth (not just source-of-funds) is required.",
          severity: "critical",
        },
        {
          label: "Account purpose is vague",
          detail:
            "'Investments' with no investment plan, no destination, no time horizon. PEPs warrant a documented account-purpose statement.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Apply EDD with senior-management approval",
        rationale:
          "PEP/RCA onboarding requires source-of-wealth verification, ongoing enhanced monitoring, and explicit sign-off from a senior officer (not just compliance).",
      },
      partialAction: {
        label: "Onboard as standard and review at next refresh cycle",
        rationale:
          "Misses the point — EDD must be applied at onboarding, not at the next periodic review. Acceptable only if you have documented evidence the RCA link was discovered post-onboarding.",
      },
      failAction: {
        label: "Onboard without flagging the PEP relationship",
        rationale:
          "Hiding or failing to detect a PEP relationship is one of the most common causes of personal sanctions on AML officers. The audit trail will show what was knowable.",
      },
      takeaways: [
        "PEP status extends to family and close associates (RCAs).",
        "PEP status persists 12 months after the official leaves office.",
        "EDD requires source-of-wealth, not just source-of-funds.",
        "Senior management — not compliance alone — must approve PEP onboarding.",
      ],
      references: ["FATF Recommendation 12 — PEPs"],
    },
    "aml-m5": {
      title: "Writing a Suspicious Activity Report",
      subtitle: "Narrative discipline, facts vs conclusions, and the 5 W's",
      objective:
        "Draft a SAR narrative that is factual, complete, and useful to the Financial Intelligence Unit (FIU).",
      overview:
        "A vague SAR (\"Client seemed nervous\") is worse than no SAR — it wastes FIU analyst time and exposes the bank to a quality-of-reporting finding. This module is a practical writing workshop: how to structure the narrative around the 5 W's, when to include screenshots, and how to separate observed facts from inferred conclusions.",
      indicators: [
        {
          label: "Narrative omits the 'Why suspicious'",
          detail:
            "FIU analysts triage hundreds of SARs daily. A SAR without a clear suspicion paragraph gets archived.",
          severity: "high",
        },
        {
          label: "Facts and conclusions mixed",
          detail:
            "Statements like 'The client is laundering money' are conclusions. Replace with 'The client deposited X on date Y; the source could not be verified.'",
          severity: "high",
        },
        {
          label: "Supporting documents missing",
          detail:
            "Screenshots of the transaction, KYC mismatches, and the alert that triggered the review must be attached.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Use the 5W structure: Who / What / Where / When / Why-suspicious",
        rationale:
          "Each section is a fact statement with timestamps. The 'Why suspicious' is the last paragraph and ties facts to typology (structuring, layering, mule, etc.).",
      },
      partialAction: {
        label: "Submit the template with minor edits",
        rationale:
          "Templates speed up filing but generic narratives are flagged as low-quality by FIU. Use the template only as a scaffold.",
      },
      failAction: {
        label: "Submit a narrative based on gut feeling alone",
        rationale:
          "Subjective statements without supporting facts can be ruled defamatory in jurisdictions where the report is later disclosed in litigation.",
      },
      takeaways: [
        "Lead with facts; conclude with typology.",
        "Always attach the triggering alert and KYC snapshot.",
        "Avoid adjectives like 'suspicious', 'strange', 'nervous' — use observed behaviour.",
        "Re-read your SAR as if you were the FIU analyst seeing it cold.",
      ],
    },
    "cyber-m1": {
      title: "Phishing triage · domain analysis",
      subtitle: "Sender, urgency, link — the three-second test",
      objective:
        "Identify a phishing email in under ten seconds using sender domain, urgency language, and link hover.",
      overview:
        "An email arrives from 'IT Security' asking the recipient to verify their credentials before their account is locked. The sender display name matches but the underlying domain is a lookalike. This module covers SPF/DKIM/DMARC at the level a non-technical reader needs, common urgency triggers, and the safe way to inspect a link without clicking.",
      indicators: [
        {
          label: "Sender domain is a lookalike",
          detail:
            "Display name says 'IT Security' but the From address is it-security@bаnk.uz — note the Cyrillic 'а'. Homoglyph attacks are now the dominant phishing vector.",
          severity: "critical",
        },
        {
          label: "Urgency / fear language",
          detail:
            "'Your account will be locked in 15 minutes' is designed to bypass deliberation. Legitimate IT notices give days, not minutes.",
          severity: "critical",
        },
        {
          label: "Link target ≠ link text",
          detail:
            "Hover (don't click) — if the URL preview differs from the visible text, it is phishing until proven otherwise.",
          severity: "high",
        },
        {
          label: "Unexpected attachment",
          detail:
            "ISO, HTML and OneNote files are 2025's malware delivery formats of choice — they bypass Office macro defences.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Report to SOC via the Report-Phishing button",
        rationale:
          "Reporting puts the email in the SOC queue for IoC extraction (sender, URL, attachment hash) and triggers a tenant-wide block. One report protects every other inbox.",
      },
      partialAction: {
        label: "Quarantine and delete",
        rationale:
          "Removes your personal exposure but the rest of the organisation remains vulnerable. SOC loses the IoCs they need to block the campaign.",
      },
      failAction: {
        label: "Reply with the credentials to confirm identity",
        rationale:
          "Game over. Credentials harvested → attacker logs in → MFA push-bombs the user → data exfiltrated. Most banking breaches start exactly here.",
      },
      takeaways: [
        "Hover before you click — always.",
        "Urgency is a phishing tell, not a reason to act faster.",
        "Use the Report-Phishing button, not the Delete key.",
        "Homoglyphs (Cyrillic letters in Latin domains) defeat visual inspection.",
      ],
    },
    "cyber-m2": {
      title: "SOC alert triage",
      subtitle: "Severity, false positives, and analyst fatigue",
      objective:
        "Apply the alert triage funnel — Acknowledge → Validate → Classify → Act — to a noisy SOC queue.",
      overview:
        "A Tier-1 SOC analyst opens the shift with 240 alerts in the queue. Most are false positives from tuning gaps; a handful are real. This module covers the triage funnel, how to use enrichment to validate quickly, and why under-triage is more dangerous than over-triage.",
      indicators: [
        {
          label: "Alert volume above baseline",
          detail:
            "Sudden spike from one source is usually a tuning issue — but occasionally a real probe.",
          severity: "medium",
        },
        {
          label: "Correlation across multiple sources",
          detail:
            "Same IP triggering EDR, NetFlow, and WAF rules is a true positive until proven otherwise.",
          severity: "high",
        },
        {
          label: "Asset criticality",
          detail:
            "Alert on a domain controller is never low priority, no matter what the rule says.",
          severity: "critical",
        },
      ],
      correctAction: {
        label: "Triage by criticality, not by arrival order",
        rationale:
          "FIFO triage is what burns SOCs out. Sort the queue by asset criticality and source correlation, then handle the long tail.",
      },
      partialAction: {
        label: "Bulk-close low-severity alerts as false positive",
        rationale:
          "Sometimes correct, sometimes catastrophic. Bulk-close only after sampling a few and confirming the pattern.",
      },
      failAction: {
        label: "Close alerts to clear the queue before shift end",
        rationale:
          "Queue-emptying behaviour is how breaches get missed. The next shift sees a clean board and assumes there was nothing to find.",
      },
      takeaways: [
        "Triage funnel: Acknowledge → Validate → Classify → Act.",
        "Asset criticality beats alert severity.",
        "Document false-positive reasoning — it feeds detection tuning.",
        "Never close to clear; close to record a decision.",
      ],
    },
    "cyber-m3": {
      title: "Incident response · NIST 800-61",
      subtitle: "Preparation → Detection → Containment → Eradication → Recovery → Lessons",
      objective:
        "Walk a confirmed incident through the NIST IR lifecycle without conflating containment and eradication.",
      overview:
        "Endpoint EDR confirms a ransomware staging tool on a finance workstation. The clock starts. This module walks the six NIST 800-61 phases and the one error that kills more responses than any other: rebuilding hosts before evidence is preserved.",
      indicators: [
        {
          label: "Staging tool on disk",
          detail:
            "Mimikatz / Cobalt Strike beacon means an operator has interactive access. Hours, not days, to dwell time.",
          severity: "critical",
        },
        {
          label: "Lateral movement attempts",
          detail:
            "EDR shows SMB enumeration from the affected host — the attacker is mapping.",
          severity: "critical",
        },
        {
          label: "Domain admin tokens cached",
          detail:
            "If an admin logged in to this host recently, the token is harvestable. Plan for credential rotation.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Isolate host, preserve memory, then eradicate",
        rationale:
          "Network-isolate (don't power off — RAM evidence). Image disk. Then eradicate and rotate credentials. Recovery only after eradication is verified.",
      },
      partialAction: {
        label: "Reimage the host immediately",
        rationale:
          "Stops the bleed but destroys evidence. Acceptable only when the host is non-critical and IR team cannot get to it within the dwell-time budget.",
      },
      failAction: {
        label: "Power off the host to 'stop the attack'",
        rationale:
          "Destroys volatile memory (credentials, encryption keys, attacker artefacts) and triggers ransomware encryption on reboot in many strains.",
      },
      takeaways: [
        "Isolate at the network layer, not the power button.",
        "Preserve memory before disk; disk before reboot.",
        "Containment ≠ eradication. Don't skip phases.",
        "Lessons Learned is mandatory, not optional.",
      ],
      references: ["NIST SP 800-61r2 — Computer Security Incident Handling Guide"],
    },
    "cyber-m4": {
      title: "Zero Trust access",
      subtitle: "Never trust, always verify — at every request",
      objective:
        "Apply the Zero Trust principle (verify per-request, least privilege, assume breach) to an access decision.",
      overview:
        "A developer requests access to the production database 'just for an hour' to debug a customer issue. The legacy VPN model would grant the access and forget. Zero Trust requires verification of identity, device posture, and intent — every time. This module covers the three pillars and the difference between Zero Trust and VPN replacement.",
      indicators: [
        {
          label: "Unmanaged device requesting access",
          detail:
            "Device not enrolled in MDM has no posture signal. Access denied by default.",
          severity: "critical",
        },
        {
          label: "Privileged action outside change window",
          detail:
            "Production access at 02:00 on a Saturday with no incident ticket is a behavioural anomaly.",
          severity: "high",
        },
        {
          label: "Step-up auth bypassed in policy",
          detail:
            "Policy allows the access without re-authentication. That is a policy bug.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Require step-up auth + time-bound scope + approval",
        rationale:
          "Identity (MFA), device (managed + healthy), and intent (approved ticket) all checked. Access granted for one hour with full session recording.",
      },
      partialAction: {
        label: "Grant standing access with elevated monitoring",
        rationale:
          "Better than open VPN but still violates least-privilege. Acceptable only as a transition pattern, not a destination.",
      },
      failAction: {
        label: "Re-use the developer's existing VPN session",
        rationale:
          "Implicit trust. If the VPN credential is later compromised, the attacker has the same path the developer just used.",
      },
      takeaways: [
        "Verify identity, device, and intent — every request.",
        "Default deny; explicit allow with scope and time.",
        "Zero Trust is a model, not a product.",
        "Record privileged sessions — recordings are auditable evidence.",
      ],
    },
    "cyber-m5": {
      title: "Deepfake voice verification",
      subtitle: "When the CEO's voice asks for an urgent wire",
      objective:
        "Recognise a voice-deepfake social engineering attempt and apply out-of-band verification before any financial action.",
      overview:
        "A treasury operator gets a phone call. The caller ID is internal, the voice is unmistakably the CEO's, the request is for an emergency wire to a new vendor. Voice cloning is now a 30-second job with 3 seconds of source audio. This module covers the audio tells (when they still exist), the policy of out-of-band callback, and why 'I know that voice' is no longer a control.",
      indicators: [
        {
          label: "Emotional pressure / time urgency",
          detail:
            "Almost every voice-deepfake scam pairs the cloned voice with 'I'm in a meeting, do this now.' Urgency disables your verification habits.",
          severity: "critical",
        },
        {
          label: "Request bypasses normal channel",
          detail:
            "Treasury wires have a documented approval flow. Any request to skip the flow is the red flag — voice or not.",
          severity: "critical",
        },
        {
          label: "Caller resists callback",
          detail:
            "'I can't take a callback, my battery is dying' — the attacker can't survive a callback because the real number won't reach them.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Hang up, call back on the known internal number",
        rationale:
          "Out-of-band verification on a number you trust (from the directory, not from the caller ID) defeats voice cloning entirely. No exceptions.",
      },
      partialAction: {
        label: "Ask a knowledge question",
        rationale:
          "OK as a delay tactic while you arrange the callback, but knowledge questions can leak online and modern attackers brief themselves. Don't rely on it alone.",
      },
      failAction: {
        label: "Execute the wire on caller-ID confidence",
        rationale:
          "Caller ID is trivially spoofed. Wire goes out, money is gone in minutes, recoverable only if you catch it within the SWIFT recall window.",
      },
      takeaways: [
        "Voice is no longer authentication — treat it as identification only.",
        "Out-of-band callback on a directory-listed number is the control.",
        "Urgency is the attack vector, not a reason to skip controls.",
        "Document and report — these attempts seed your awareness training.",
      ],
    },
    "fraud-m1": {
      title: "Mule account detection",
      subtitle: "Velocity, age, and the in-out pattern",
      objective:
        "Spot a money-mule account from its transaction shape and freeze it before it is drained.",
      overview:
        "A young account receives a rapid sequence of small inbound transfers from unrelated retail customers, immediately followed by outbound wires to a single beneficiary abroad. This is the classic mule pattern — the account holder may even be a victim themselves. This module covers velocity scoring, the age × value heuristic, and the freeze-vs-monitor decision.",
      indicators: [
        {
          label: "Velocity 9.4× baseline",
          detail:
            "Transaction frequency is nearly an order of magnitude above the account's own baseline — the account is being used.",
          severity: "critical",
        },
        {
          label: "Inbound from unrelated parties",
          detail:
            "10+ unique senders in 24 hours, none of whom have a prior relationship with the holder.",
          severity: "high",
        },
        {
          label: "Outbound concentration",
          detail:
            "All inbounds funnel to a single overseas account within hours — money never rests.",
          severity: "critical",
        },
        {
          label: "Account age 11 days",
          detail:
            "Mule accounts are usually new — recruited via job-scam adverts or compromised existing accounts.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Freeze the account immediately",
        rationale:
          "The pattern is unambiguous. Freeze, file the internal SAR, and notify the holder via secure channel — the holder is often a victim and needs to know.",
      },
      partialAction: {
        label: "Escalate to fraud team for review",
        rationale:
          "Acceptable when velocity is borderline. At 9.4× baseline with concentration, you don't have the luxury — the money will be gone by the time fraud reviews.",
      },
      failAction: {
        label: "Continue to monitor",
        rationale:
          "Monitoring without freezing watches the money leave. Mule chains move funds across borders in hours.",
      },
      takeaways: [
        "Velocity + concentration + youth = freeze.",
        "Mule holders are often victims; treat the freeze as protective.",
        "File the internal SAR even after freezing.",
        "Monitor-only is a decision; document why you chose it.",
      ],
    },
    "fraud-m2": {
      title: "Synthetic identity fraud",
      subtitle: "Real SSN + fake name + 18-month grooming",
      objective:
        "Detect synthetic identities at onboarding and during credit-line build-up.",
      overview:
        "An applicant uses a real tax ID belonging to a minor combined with a fabricated name and a fabricated employment history. They make every payment on time for 18 months — building a clean credit file — then bust out with a 100k credit-line draw and disappear. This module covers the data-stitching tells, third-party-data validation, and the bust-out pattern.",
      indicators: [
        {
          label: "Tax ID belongs to a different age band",
          detail:
            "ID was issued to a minor; applicant claims to be 35. Cross-bureau age mismatches are the strongest single signal.",
          severity: "critical",
        },
        {
          label: "Thin file, perfect history",
          detail:
            "Two credit lines, both paid on time, both opened in the same 60-day window. The 'perfect customer' pattern.",
          severity: "high",
        },
        {
          label: "Address shared with multiple thin files",
          detail:
            "Network analysis shows the address linked to 4 other thin files opened in the past year.",
          severity: "critical",
        },
      ],
      correctAction: {
        label: "Reject onboarding + flag the ID across the bureau",
        rationale:
          "Cross-bureau flagging is what kills the synthetic — they can no longer use that ID anywhere. Acting alone is a one-bank fix.",
      },
      partialAction: {
        label: "Approve with low limit and monitor",
        rationale:
          "Some banks accept synthetic risk for the small ones. Defensible only if your fraud model includes a bust-out trigger.",
      },
      failAction: {
        label: "Approve at requested limit",
        rationale:
          "You will see the bust-out 18 months later. By then, the loss is fully realised.",
      },
      takeaways: [
        "Synthetic ≠ stolen identity — there is no real victim to call.",
        "Age-band mismatch across bureaus is the smoking gun.",
        "Bust-out is a planned event 12–24 months after onboarding.",
        "Cross-bureau flagging multiplies the impact of each catch.",
      ],
    },
    "fraud-m3": {
      title: "Card skimming · behavioural detection",
      subtitle: "Geography, terminal hashes, and the cashout window",
      objective:
        "Detect card-skimming compromise by behavioural cluster, not by single-transaction inspection.",
      overview:
        "A small cluster of cards is suddenly being used in the same foreign city within hours of each other. None of the holders are travelling. The common factor is a single ATM they all used in the past month. This module covers cluster analysis, the BIN-level rollup, and why card-by-card inspection misses skimming entirely.",
      indicators: [
        {
          label: "Geographic cluster impossible without travel",
          detail:
            "Cards used 3,000 km from holder address with no travel signal in airline data or roaming records.",
          severity: "critical",
        },
        {
          label: "Common point-of-compromise",
          detail:
            "All affected cards swiped the same ATM within a 30-day window.",
          severity: "critical",
        },
        {
          label: "Cashout pattern: small probes, then max-out",
          detail:
            "Attackers test with a $20 charge; if it clears, the card is drained within hours.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Block the cluster + recall the compromised terminal",
        rationale:
          "Block all cards that touched the point-of-compromise within the window, reissue PINs, and coordinate with the acquirer to inspect the terminal physically.",
      },
      partialAction: {
        label: "Block reactively as fraud reports come in",
        rationale:
          "You are racing the attacker. Every hour of delay is more cards drained.",
      },
      failAction: {
        label: "Wait for chargeback dispute volume to spike",
        rationale:
          "Chargebacks are 30–60 days behind the fraud event. By then the cards are drained, the attacker is gone, and you eat the loss.",
      },
      takeaways: [
        "Single-card inspection misses skimming.",
        "Cluster + common point-of-compromise = block the cluster.",
        "Coordinate with acquirer for terminal recall.",
        "The cashout window is hours, not days.",
      ],
    },
    "fraud-m4": {
      title: "Chargeback triage",
      subtitle: "First-party fraud, friendly fraud, and the representment decision",
      objective:
        "Classify an inbound chargeback correctly and decide whether to accept or represent.",
      overview:
        "A customer disputes a $1,200 electronics purchase as 'not received'. Delivery confirmation shows signed receipt at the customer's address. This is friendly fraud (sometimes called first-party fraud) — the customer received the goods but disputes anyway. This module covers reason-code mapping, evidence standards, and when to represent vs accept.",
      indicators: [
        {
          label: "Customer has prior chargeback history",
          detail:
            "Three disputes in the past year. Friendly-fraud serial offenders are usually serial.",
          severity: "high",
        },
        {
          label: "Delivery confirmed",
          detail:
            "Signed POD with customer's address. Strong evidence for representment.",
          severity: "medium",
        },
        {
          label: "Reason code mismatch",
          detail:
            "Customer claims 'not received' but used the item online (linked account login from the device).",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Represent with full evidence bundle",
        rationale:
          "POD + device match + chargeback history = strong representment case. Accepting friendly fraud trains the customer that it works.",
      },
      partialAction: {
        label: "Represent without all evidence",
        rationale:
          "Half-evidence representments lose more than they win and burn issuer goodwill.",
      },
      failAction: {
        label: "Accept the chargeback to avoid the fight",
        rationale:
          "Short-term cost minimisation, long-term mistake. Each accepted dispute teaches the customer the pattern works and increases your network-level chargeback ratio.",
      },
      takeaways: [
        "Friendly fraud is fraud. Represent it.",
        "Evidence quality determines win rate.",
        "Track chargeback ratio — network programmes penalise high ratios.",
        "Accept only when evidence is genuinely thin.",
      ],
    },
    "fraud-m5": {
      title: "AI anomaly tuning",
      subtitle: "Precision, recall, and the cost of a false positive",
      objective:
        "Tune a fraud detection model to balance false positives and false negatives against business cost.",
      overview:
        "The fraud model is generating 12% false positives, which is hammering legitimate customer experience. Loosening the threshold reduces false positives but raises false negatives — actual fraud slipping through. This module covers precision/recall tradeoffs, cost-weighted optimisation, and the trap of optimising for accuracy in an imbalanced problem.",
      indicators: [
        {
          label: "False positive rate above 5%",
          detail:
            "Above 5%, customer complaints spike and the operations team starts auto-approving alerts — defeating the model.",
          severity: "high",
        },
        {
          label: "Feedback loop broken",
          detail:
            "Operators close alerts without labelling outcome. Without labels, the model cannot retrain.",
          severity: "critical",
        },
        {
          label: "Data drift",
          detail:
            "Model trained 18 months ago; transaction mix has shifted (more contactless, less ATM). Performance degrades silently.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Tune to cost-weighted threshold + restore feedback loop",
        rationale:
          "Find the threshold that minimises (false-positive cost × FP rate) + (fraud loss × FN rate). Force operators to label outcomes — no feedback, no retraining.",
      },
      partialAction: {
        label: "Loosen the threshold uniformly",
        rationale:
          "Reduces false positives but loses fraud catches proportionally. Cost-weighting almost always beats uniform tuning.",
      },
      failAction: {
        label: "Add manual override exceptions for noisy segments",
        rationale:
          "Exception lists become permanent. The model goes stale around them and your fraud team never gets back to fixing the root cause.",
      },
      takeaways: [
        "Accuracy is a useless metric in fraud — use precision and recall.",
        "Cost-weight the threshold; uniform tuning is a blunt tool.",
        "No feedback loop = no model. Operators must label.",
        "Monitor data drift; retrain on a schedule, not on a complaint.",
      ],
    },
    "cx-m1": {
      title: "Address change · verification",
      subtitle: "The small request that hides account takeover",
      objective:
        "Verify an address-change request without alienating a legitimate customer or enabling an account takeover.",
      overview:
        "A customer calls to change their registered address. The new address is in a different region. Address change is the single most common precursor to account takeover — change the address, then request a card reissue to the new address. This module covers the verification ladder and how to keep the customer experience warm while applying it.",
      indicators: [
        {
          label: "New address in different region",
          detail:
            "Cross-region moves warrant extra verification; same-city moves usually do not.",
          severity: "medium",
        },
        {
          label: "Caller cannot verify knowledge factor",
          detail:
            "Cannot recall the last transaction amount or the linked phone number.",
          severity: "critical",
        },
        {
          label: "Recent password reset",
          detail:
            "Password was changed in the past 48 hours from an unrecognised device. Address change after password reset is the takeover sequence.",
          severity: "critical",
        },
      ],
      correctAction: {
        label: "Verify via two factors, apply 24-hour cooling period",
        rationale:
          "Two-factor verification + a delay before reissue catches the takeover without blocking the legitimate request. Customer is informed kindly.",
      },
      partialAction: {
        label: "Verify via one factor, change immediately",
        rationale:
          "Acceptable for low-risk profiles. Not acceptable when the password-reset signal is present.",
      },
      failAction: {
        label: "Change on the caller's stated knowledge alone",
        rationale:
          "Account takeover complete. Next call will be 'where is my new card' from the attacker.",
      },
      takeaways: [
        "Address change is high-risk despite feeling routine.",
        "Verify with two factors when risk signals are present.",
        "Cooling periods catch takeovers without insulting customers.",
        "Frame the verification as care, not suspicion.",
      ],
    },
    "cx-m2": {
      title: "Account block · with empathy",
      subtitle: "Delivering bad news without losing the relationship",
      objective:
        "Communicate a compliance-driven account block to a customer with clarity, empathy, and a path forward.",
      overview:
        "A customer arrives at the branch furious that their card declined at a restaurant. The block is compliance-driven (sanctions screen hit on an outbound wire) and you cannot disclose the specific reason. This module covers the language of empathy without disclosure, the escalation script, and the documentation requirement.",
      indicators: [
        {
          label: "Customer is publicly embarrassed",
          detail:
            "Declined card at a restaurant in front of guests. Emotional state matters as much as the operational fix.",
          severity: "high",
        },
        {
          label: "You cannot disclose the reason",
          detail:
            "Sanctions and AML blocks are confidential. Disclosing tips off — see the AML SAR module.",
          severity: "critical",
        },
        {
          label: "Customer is a long-tenured account",
          detail:
            "10-year relationship. Friction here is a relationship cost as well as a CX cost.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Acknowledge, apologise, escalate same-day",
        rationale:
          "Acknowledge their experience, apologise for the friction, commit to a same-day escalation to compliance, and follow up personally. Empathy + ownership + speed.",
      },
      partialAction: {
        label: "Take a callback and route via the standard queue",
        rationale:
          "Acceptable in a quiet branch. Not acceptable when the customer is in distress in front of you.",
      },
      failAction: {
        label: "Tell the customer the reason for the block",
        rationale:
          "Tipping-off violation. Legal and regulatory consequences for the operator personally.",
      },
      takeaways: [
        "Empathy first, process second.",
        "You can acknowledge without disclosing.",
        "Same-day escalation is the relationship-saver.",
        "Document the customer's emotional state — it is part of the case.",
      ],
    },
    "cx-m3": {
      title: "Customers with disabilities",
      subtitle: "Reasonable accommodation as a default, not an exception",
      objective:
        "Serve a customer with a disability with the same dignity and effectiveness as any other customer.",
      overview:
        "A customer with low vision needs help completing a withdrawal form. Standard policy says 'customer must sign the form themselves.' Accessibility law and good practice say 'find a way.' This module covers the WCAG-adjacent service principles, the role of trusted-helper documentation, and the language to avoid.",
      indicators: [
        {
          label: "Customer is being rushed by other staff",
          detail:
            "Visible discomfort, queue building. Time pressure is the enemy of accessibility.",
          severity: "high",
        },
        {
          label: "Form requires reading small print",
          detail:
            "Standard form is not accessible. Have large-print or audio alternative ready.",
          severity: "medium",
        },
        {
          label: "Trusted helper present but unrecognised",
          detail:
            "Friend or family member came along. Recognise them, document the role.",
          severity: "low",
        },
      ],
      correctAction: {
        label: "Move to a private desk, read the form aloud, confirm understanding",
        rationale:
          "Time + privacy + plain language = inclusion. Document the accommodation as a service note for next time.",
      },
      partialAction: {
        label: "Ask a colleague to help while you serve the next customer",
        rationale:
          "OK if the colleague has training. Not OK as a way of offloading the 'difficult' interaction.",
      },
      failAction: {
        label: "Refuse to process without a signed standard form",
        rationale:
          "Likely violates equal-access law. Always a relationship failure.",
      },
      takeaways: [
        "Accessibility is a default, not a special case.",
        "Time + privacy + plain language is the formula.",
        "Document accommodations — they should be ready next visit.",
        "The trusted-helper relationship needs explicit recognition.",
      ],
    },
    "cx-m4": {
      title: "Internal escalation protocol",
      subtitle: "When to escalate, who to escalate to, and what to bring",
      objective:
        "Escalate a case to the right internal team without wasting your own time or the escalation team's.",
      overview:
        "A complex case spans treasury, compliance, and operations. Escalating to one team alone will bounce back. This module covers the escalation matrix, the case-summary format the escalation team expects, and the difference between escalation and abdication.",
      indicators: [
        {
          label: "Case spans multiple teams",
          detail:
            "Single-team escalation will be returned. Identify all owners upfront.",
          severity: "high",
        },
        {
          label: "SLA clock has started",
          detail:
            "Regulatory or contractual clock; document the start time in the escalation.",
          severity: "critical",
        },
        {
          label: "Customer has been informed",
          detail:
            "If not, do it before escalating — the customer will call again and the next operator will be cold.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Write a structured case summary + identify all owners + cc customer-facing lead",
        rationale:
          "Summary template: who/what/when/why-now/what-you-tried. All owners cc'd. Customer-facing lead aware so they can absorb a callback.",
      },
      partialAction: {
        label: "Forward the email thread with 'please advise'",
        rationale:
          "Forces the next person to reconstruct the case. Acceptable only for very simple cases.",
      },
      failAction: {
        label: "Tell the customer 'I have escalated' without doing so",
        rationale:
          "Trust violation. The follow-up call destroys the relationship.",
      },
      takeaways: [
        "Escalation is a transfer of ownership, not a removal of it.",
        "Structured summaries cut response time in half.",
        "Identify all owners upfront; partial escalations bounce.",
        "Inform the customer before, not after.",
      ],
    },
    "cx-m5": {
      title: "Difficult customer · de-escalation",
      subtitle: "Calm the person, then solve the problem",
      objective:
        "De-escalate an angry customer interaction using acknowledged language patterns and reset the conversation toward a solution.",
      overview:
        "A customer is shouting in the branch about a fee they say they were never told about. They are angry, partially right, and the queue behind them is growing. This module covers the three-step de-escalation pattern (acknowledge → name → offer), the words that escalate further, and when to involve a manager.",
      indicators: [
        {
          label: "Customer's volume is rising",
          detail:
            "Matching their volume amplifies; dropping yours by a notch is the cue that resets the room.",
          severity: "high",
        },
        {
          label: "Customer is partially correct",
          detail:
            "The fee was disclosed but in fine print. Acknowledging the legitimate part of the grievance is the unlock.",
          severity: "medium",
        },
        {
          label: "Other customers are watching",
          detail:
            "Move to a private desk if at all possible — public anger feeds on audience.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Acknowledge the feeling, name the issue, offer a next step",
        rationale:
          "'I can see this has been frustrating. The disclosure was in small print — let me get the fee reviewed and call you in 30 minutes.' Three sentences. The customer is heard and a path is set.",
      },
      partialAction: {
        label: "Offer a goodwill credit immediately",
        rationale:
          "Solves the symptom, not the relationship. Acceptable when the customer is short on time but not when they need to be heard.",
      },
      failAction: {
        label: "Defend the policy verbatim",
        rationale:
          "Escalates every time. The customer hears 'you are wrong and I do not care.'",
      },
      takeaways: [
        "Acknowledge → name → offer is the de-escalation pattern.",
        "Drop your volume; the room follows.",
        "Move to private space when feasible.",
        "Goodwill is a tool, not a substitute for being heard.",
      ],
    },
  },
};
