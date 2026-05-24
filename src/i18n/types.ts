// LandingContent — shared shape across all locales.
//
// English (en.ts) is the source of truth and defines the literal types via
// `as const`. Other locales (uz, uz-Cyrl, ru) import this type and must
// match key-for-key.

export type LandingContent = {
  meta: {
    title: string;
    description: string;
    siteName: string;
  };
  brand: {
    name: string;
    tagline: string;
  };
  nav: {
    links: ReadonlyArray<{ label: string; href: string }>;
    primaryCta: string;
    primaryCtaHref: string;
    secondaryCta: string;
    secondaryCtaHref: string;
    languageLabel: string;
    themeLabelLight: string;
    themeLabelDark: string;
    openMenu: string;
    closeMenu: string;
  };
  promo: {
    text: string;
    badge: string;
    href: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    primaryCtaHref: string;
    secondaryCtaHref: string;
    badges: ReadonlyArray<{
      tone: "yellow" | "coral" | "teal" | "rose";
      label: string;
    }>;
    mockup: {
      title: string;
      stickyNotes: ReadonlyArray<{
        tone: "yellow" | "coral" | "teal" | "rose" | "orange";
        lines: ReadonlyArray<string>;
      }>;
    };
  };
  problem: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: ReadonlyArray<{
      tone: "canvas" | "yellow" | "coral" | "rose";
      title: string;
      body: string;
    }>;
  };
  solution: {
    eyebrow: string;
    title: string;
    body: string;
    items: ReadonlyArray<{ title: string; body: string }>;
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: ReadonlyArray<{
      tone: "yellow" | "coral" | "teal" | "rose" | "canvas";
      badge: string;
      title: string;
      body: string;
      bullets: ReadonlyArray<string>;
    }>;
  };
  fraud: {
    eyebrow: string;
    title: string;
    subtitle: string;
    capsTitle: string;
    capsEyebrow: string;
    scenarios: ReadonlyArray<{
      tone: "coral" | "yellow" | "teal" | "rose" | "orange" | "canvas";
      title: string;
      body: string;
    }>;
    aiCapabilities: ReadonlyArray<string>;
  };
  businessValue: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stats: ReadonlyArray<{ value: string; label: string }>;
    items: ReadonlyArray<string>;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    steps: ReadonlyArray<{ step: string; title: string; body: string }>;
  };
  targetUsers: {
    eyebrow: string;
    title: string;
    alsoFor: string;
    primary: ReadonlyArray<{
      tone: "yellow" | "coral" | "teal" | "rose";
      title: string;
      body: string;
    }>;
    extras: ReadonlyArray<string>;
  };
  pilot: {
    eyebrow: string;
    title: string;
    scope: { title: string; items: ReadonlyArray<string> };
    outcomes: { title: string; items: ReadonlyArray<string> };
    cta: string;
  };
  demo: {
    eyebrow: string;
    title: string;
    subtitle: string;
    fields: {
      fullName: { label: string; placeholder: string };
      companyName: { label: string; placeholder: string };
      jobTitle: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      phone: { label: string; placeholder: string };
      interestedModule: {
        label: string;
        options: ReadonlyArray<string>;
      };
      message: { label: string; placeholder: string };
    };
    submit: string;
    submitting: string;
    success: string;
    successTitle: string;
    sendAnother: string;
    consent: string;
    errors: {
      required: string;
      email: string;
      phone: string;
      submit: string;
      timeout: string;
      duplicate: string;
    };
  };
  faq: {
    eyebrow: string;
    title: string;
    items: ReadonlyArray<{ q: string; a: string }>;
  };
  footer: {
    tagline: string;
    contactLabel: string;
    contactEmail: string;
    privacy: string;
    copyright: string;
    columns: ReadonlyArray<{
      title: string;
      links: ReadonlyArray<{ label: string; href: string }>;
    }>;
  };
  app: {
    common: {
      comingSoon: string;
      comingSoonBody: string;
      backToLanding: string;
      logout: string;
      save: string;
      cancel: string;
      search: string;
      filter: string;
      export: string;
      create: string;
      edit: string;
      delete: string;
      view: string;
      upload: string;
      assign: string;
      publish: string;
    };
    assistant: {
      title: string;
      newChat: string;
      sessionsTitle: string;
      sessionsEmpty: string;
      groupToday: string;
      groupYesterday: string;
      groupThisWeek: string;
      groupOlder: string;
      welcomeTitle: string;
      welcomeBody: string;
      samplePromptsLabel: string;
      samplePrompts: ReadonlyArray<string>;
      placeholder: string;
      send: string;
      sending: string;
      sourcesLabel: string;
      thumbsUp: string;
      thumbsDown: string;
      feedbackThanks: string;
      privacyNote: string;
      typing: string;
      renameSession: string;
      deleteSession: string;
      openSessions: string;
    };
    learner: {
      dashboard: string;
      plans: string;
      assistant: string;
      playground: string;
      dialog: string;
      fraud: string;
      progress: string;
      notifications: string;
      settings: string;
      practiceTitle: string;
      youTitle: string;
    };
    fraud: {
      title: string;
      subtitle: string;
      eyebrow: string;
      primaryCta: string;
      tabs: { all: string; attempts: string; favorites: string };
      filters: {
        searchPlaceholder: string;
        all: string;
        types: {
          phishing: string;
          transaction: string;
          document: string;
          deepfake_call: string;
          social_engineering: string;
          aml_kyc: string;
        };
        difficulty: { beginner: string; intermediate: string; advanced: string };
        risk: { low: string; medium: string; high: string };
        sort: {
          updated: string;
          highestRisk: string;
          easiest: string;
          mostAttempts: string;
          bestScore: string;
        };
      };
      status: {
        not_started: string;
        in_progress: string;
        completed: string;
        failed: string;
      };
      list: {
        scenario: string;
        type: string;
        difficulty: string;
        risk: string;
        avgScore: string;
        attempts: string;
        updated: string;
        actions: string;
      };
      actions: {
        start: string;
        continue: string;
        retry: string;
        viewDetail: string;
        viewResult: string;
        addFavorite: string;
        removeFavorite: string;
        clearFilters: string;
        gotoAll: string;
        cancel: string;
        close: string;
        goBack: string;
      };
      sidebar: {
        statsTitle: string;
        totalAttempts: string;
        averageScore: string;
        bestScore: string;
        passedFailed: string;
        tipTitle: string;
        tips: ReadonlyArray<string>;
      };
      detail: {
        durationLabel: string;
        durationMinutes: string;
        passScoreLabel: string;
        redFlagCountLabel: string;
        previousBestLabel: string;
        skillsLabel: string;
        roleLabel: string;
      };
      play: {
        steps: {
          situation: string;
          evidence: string;
          redFlags: string;
          decision: string;
        };
        intro: {
          eyebrow: string;
          roleLabel: string;
          taskLabel: string;
          startCta: string;
        };
        evidence: {
          eyebrow: string;
          nextCta: string;
          phishing: {
            sender: string;
            received: string;
            link: string;
            attachment: string;
          };
          transaction: {
            customer: string;
            accountAge: string;
            amount: string;
            destination: string;
            frequency: string;
            description: string;
            usualBehavior: string;
          };
          document: {
            documentType: string;
            documentNumber: string;
            issueDate: string;
            customerInfo: string;
            inconsistencies: string;
          };
          deepfake: {
            callerName: string;
            callerRole: string;
            urgency: string;
            requestedAction: string;
            transcript: string;
            suspiciousPhrases: string;
          };
          social: {
            actorIdentity: string;
            channel: string;
            requestedAction: string;
            pressureTactic: string;
            policyHint: string;
          };
          aml: {
            businessType: string;
            sourceOfFunds: string;
            transactionPattern: string;
            beneficialOwner: string;
            riskIndicators: string;
          };
        };
        redFlags: {
          eyebrow: string;
          validation: string;
          nextCta: string;
        };
        decision: {
          eyebrow: string;
          validation: string;
          submitCta: string;
        };
        result: {
          passedTitle: string;
          failedTitle: string;
          passedBody: string;
          failedBody: string;
          detectedTitle: string;
          missedTitle: string;
          wrongTitle: string;
          correctDecision: string;
          yourDecision: string;
          explanation: string;
          recommendation: string;
          retry: string;
          nextScenario: string;
          backToList: string;
          nothingDetected: string;
          dash: string;
          passedBadge: string;
          failedBadge: string;
        };
      };
      attempts: {
        scenario: string;
        type: string;
        score: string;
        result: string;
        detected: string;
        missed: string;
        action: string;
        viewResult: string;
        retry: string;
        attemptedAt: string;
      };
      attemptDetail: {
        title: string;
        passedLabel: string;
        failedLabel: string;
        scoreLabel: string;
        detectedLabel: string;
        missedLabel: string;
        dateLabel: string;
        retry: string;
        close: string;
      };
      empty: {
        noResults: { title: string; body: string; action: string };
        noAttempts: { title: string; body: string; action: string };
        noFavorites: { title: string; body: string; action: string };
      };
    };
    admin: {
      dashboard: string;
      users: string;
      org: string;
      knowledge: string;
      aiAssistant: string;
      plans: string;
      modules: string;
      quizzes: string;
      mockScenarios: string;
      fraudScenarios: string;
      assignments: string;
      progress: string;
      skills: string;
      reports: string;
      integration: string;
      notifications: string;
      audit: string;
      settings: string;
      peopleTitle: string;
      contentTitle: string;
      simulatorsTitle: string;
      insightsTitle: string;
      systemTitle: string;
    };
  };
  auth: {
    loginLink: string;
    meta: {
      title: string;
      description: string;
    };
    back: string;
    signIn: {
      title: string;
      subtitle: string;
      google: string;
      sso: string;
      ssoTitle: string;
      ssoSubtitle: string;
      ssoPlaceholder: string;
      ssoContinue: string;
      ssoCancel: string;
      divider: string;
      fields: {
        email: { label: string; placeholder: string };
        password: { label: string; placeholder: string };
      };
      showPassword: string;
      hidePassword: string;
      forgotPassword: string;
      submit: string;
      submitting: string;
      noAccount: string;
      signupCta: string;
      successTitle: string;
      successBody: string;
      successCta: string;
      demoAccountsTitle: string;
      demoAccountsHint: string;
      errors: {
        required: string;
        email: string;
        password: string;
        invalidCredentials: string;
        submit: string;
        timeout: string;
      };
    };
    brand: {
      eyebrow: string;
      title: string;
      body: string;
      stickyNotes: ReadonlyArray<{
        tone: "yellow" | "coral" | "teal" | "rose" | "orange";
        lines: ReadonlyArray<string>;
      }>;
    };
  };
  forbidden: {
    meta: { title: string };
    eyebrow: string;
    title: string;
    body: string;
    attempted: string;
    goHome: string;
    signIn: string;
    signOut: string;
  };
};
