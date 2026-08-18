export interface Translations {
  common: { comingSoon: string };
  nav: {
    groups: { trading: string; data: string };
    items: {
      dashboard: string;
      journal: string;
      calendar: string;
      analytics: string;
      strategies: string;
      growth: string;
      import: string;
      tradingAccounts: string;
      settings: string;
      profile: string;
      logout: string;
    };
  };
  filters: {
    from: string;
    to: string;
    account: string;
    allAccounts: string;
    symbol: string;
    side: string;
    longShort: string;
    long: string;
    short: string;
    strategy: string;
    allStrategies: string;
    setup: string;
    allSetups: string;
    tags: string;
    clearFilters: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    breakdown: string;
    equityCurve: string;
    loading: string;
    emptyTitle: string;
    emptyDescription: string;
    stats: {
      netPnl: string;
      winRate: string;
      profitFactor: string;
      totalTrades: string;
      openSuffix: string;
      winningTrades: string;
      losingTrades: string;
      averageWinner: string;
      averageLoser: string;
      averageTrade: string;
      averageRiskReward: string;
      bestTrade: string;
      worstTrade: string;
      bestTradingDay: string;
      worstTradingDay: string;
      avgHoldingTime: string;
      maxDrawdown: string;
      maxConsecutiveWins: string;
      maxConsecutiveLosses: string;
    };
    greeting: {
      morning: string;
      afternoon: string;
      evening: string;
    };
    motivation: {
      positive: { male: string[]; female: string[]; neutral: string[] };
      negative: { male: string[]; female: string[]; neutral: string[] };
    };
    recentTrades: string;
    noRecentTrades: string;
  };
  growth: {
    title: string;
    subtitle: string;
    quotesHeading: string;
    notesHeading: string;
    notesEmpty: string;
    notesPlaceholder: string;
    save: string;
    saved: string;
    nextQuote: string;
  };
  trade: {
    newTitle: string;
    editTitle: string;
    description: string;
    symbol: string;
    side: string;
    long: string;
    short: string;
    entryDateTime: string;
    exitDateTime: string;
    now: string;
    entryPrice: string;
    exitPrice: string;
    quantity: string;
    fees: string;
    grossPnl: string;
    netPnl: string;
    returnLabel: string;
    holdingTime: string;
    open: string;
    account: string;
    noAccount: string;
    strategy: string;
    setup: string;
    addNew: string;
    cancelAdd: string;
    none: string;
    tags: string;
    noTags: string;
    notes: string;
    cancel: string;
    save: string;
    saving: string;
    add: string;
    strategyPlaceholder: string;
    setupPlaceholder: string;
    tagPlaceholder: string;
    saveFailed: string;
  };
  datetime: {
    day: string;
    month: string;
    year: string;
    hour: string;
    minute: string;
    months: string[];
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    loginFailed: string;
    noAccount: string;
    registerLink: string;
    registerTitle: string;
    registerSubtitle: string;
    name: string;
    genderLabel: string;
    genderHint: string;
    female: string;
    male: string;
    createAccount: string;
    creatingAccount: string;
    registerFailed: string;
    haveAccount: string;
    signInLink: string;
  };
  journal: {
    title: string;
    subtitle: string;
    newTrade: string;
    searchSymbol: string;
    loading: string;
    loadFailed: string;
    deleteConfirm: string;
    deleteFailed: string;
    emptyTitle: string;
    emptyDescription: string;
    logFirstTrade: string;
    openClosed: string;
    open: string;
    closed: string;
    review: string;
    columns: {
      symbol: string;
      side: string;
      entry: string;
      exit: string;
      qty: string;
      netPnl: string;
      returnPct: string;
      status: string;
    };
    pageOf: string;
    tradesCount: string;
    prev: string;
    next: string;
  };
  tradeReview: {
    backToJournal: string;
    review: string;
    strategy: string;
    setup: string;
    none: string;
    tags: string;
    noTagsYet: string;
    whyEnter: string;
    tradingPlan: string;
    followedPlan: string;
    notSpecified: string;
    yes: string;
    no: string;
    whatWentWell: string;
    mistakes: string;
    noMistakesYet: string;
    mistakesNotesPlaceholder: string;
    lessonsLearned: string;
    emotionalState: string;
    emotionalStatePlaceholder: string;
    notes: string;
    saveReview: string;
    saving: string;
    saveFailed: string;
    screenshots: string;
    noScreenshots: string;
    screenshotUrl: string;
    type: string;
    before: string;
    after: string;
    caption: string;
    add: string;
    removeConfirm: string;
    addFailed: string;
    loading: string;
    notFound: string;
  };
  calendar: {
    title: string;
    subtitle: string;
    loading: string;
    loadFailed: string;
    monthlyPnl: string;
    trades: string;
    noTradesMonth: string;
    weekdays: string[];
    tradeCountSuffix: string;
    tradeCountSuffixPlural: string;
    loadingTrades: string;
  };
  strategiesPage: {
    title: string;
    subtitle: string;
    tabs: { strategies: string; setups: string; tags: string; mistakes: string };
    strategySingular: string;
    setupSingular: string;
    tagSingular: string;
    mistakeSingular: string;
    mistakesTitle: string;
  };
  taxonomy: {
    manage: string;
    newItem: string;
    loading: string;
    loadFailed: string;
    emptyTitle: string;
    createFirst: string;
    deleteConfirm: string;
    deleteFailed: string;
    name: string;
    description: string;
    color: string;
    save: string;
    saveFailed: string;
    cancel: string;
    editItem: string;
  };
  tradingAccountsPage: {
    title: string;
    subtitle: string;
    newAccount: string;
    loading: string;
    loadFailed: string;
    emptyTitle: string;
    emptyDescription: string;
    createFirst: string;
    inactive: string;
    startingBalance: string;
    edit: string;
    delete: string;
    deleteConfirm: string;
    deleteFailed: string;
  };
  settingsPage: { title: string; description: string };
  profilePage: { title: string; accountDetails: string; name: string; email: string };
  importPage: { title: string; description: string };
  performanceTable: {
    name: string;
    trades: string;
    netPnl: string;
    winRate: string;
    avgTrade: string;
    profitFactor: string;
    emptyDefault: string;
  };
  winLoss: {
    heading: string;
    empty: string;
    winners: string;
    losers: string;
    breakeven: string;
  };
  accountForm: {
    newTitle: string;
    editTitle: string;
    newDescription: string;
    editDescription: string;
    name: string;
    broker: string;
    currency: string;
    startingBalance: string;
    cancel: string;
    save: string;
    saving: string;
  };
  analyticsPage: {
    title: string;
    subtitle: string;
    loading: string;
    loadFailed: string;
    dailyPnl: string;
    weeklyPnl: string;
    monthlyPnl: string;
    longVsShort: string;
    bySymbol: string;
    byStrategy: string;
    byStrategyEmpty: string;
    bySetup: string;
    bySetupEmpty: string;
    byHour: string;
    byHourCaveat: string;
    byDayOfWeek: string;
  };
}

export const en: Translations = {
  common: { comingSoon: "Coming in a later phase" },
  nav: {
    groups: { trading: "Trading", data: "Data" },
    items: {
      dashboard: "Dashboard",
      journal: "Journal",
      calendar: "Calendar",
      analytics: "Analytics",
      strategies: "Strategies",
      growth: "Growth",
      import: "Import",
      tradingAccounts: "Trading Accounts",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
    },
  },
  filters: {
    from: "From",
    to: "To",
    account: "Account",
    allAccounts: "All accounts",
    symbol: "Symbol",
    side: "Side",
    longShort: "Long & Short",
    long: "Long",
    short: "Short",
    strategy: "Strategy",
    allStrategies: "All strategies",
    setup: "Setup",
    allSetups: "All setups",
    tags: "Tags",
    clearFilters: "Clear filters",
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "A quick snapshot of your trading performance.",
    breakdown: "Breakdown",
    equityCurve: "Equity curve",
    loading: "Loading metrics…",
    emptyTitle: "No performance data yet",
    emptyDescription: "Log your first trade in the Journal and your metrics will show up here.",
    stats: {
      netPnl: "Net P&L",
      winRate: "Win rate",
      profitFactor: "Profit factor",
      totalTrades: "Total trades",
      openSuffix: "{{count}} open",
      winningTrades: "Winning trades",
      losingTrades: "Losing trades",
      averageWinner: "Average winner",
      averageLoser: "Average loser",
      averageTrade: "Average trade",
      averageRiskReward: "Average risk/reward",
      bestTrade: "Best trade",
      worstTrade: "Worst trade",
      bestTradingDay: "Best trading day",
      worstTradingDay: "Worst trading day",
      avgHoldingTime: "Avg holding time",
      maxDrawdown: "Max drawdown",
      maxConsecutiveWins: "Max consecutive wins",
      maxConsecutiveLosses: "Max consecutive losses",
    },
    greeting: {
      morning: "Good morning",
      afternoon: "Cheerful afternoon",
      evening: "Serene evening",
    },
    motivation: {
      positive: {
        male: [
          "{{name}}, Warren Buffett is calling — he wants tips from you.",
          "Elon just saw your P&L and postponed his next tweet.",
          "{{name}}, Ray Dalio sent a like. Seriously.",
          "Looks like you're actually getting good at stop-losses, {{name}}.",
          "{{name}} Stocks is proud of you.",
          "Wall Street is talking about you this morning, {{name}}.",
          "Even Jordan Belfort would tip his hat, {{name}} — minus the felonies, obviously.",
          "Good morning to {{name}}'s winning portfolio.",
          "Jeff Bezos is considering asking you for investment advice, {{name}}.",
          "{{name}}, you're not a trader — you're a force of nature.",
          "Mark Cuban would be proud, {{name}}. He'd actually call you.",
          "Nice one, {{name}}! Even Buffett doesn't nail it like that every time.",
        ],
        female: [
          "{{name}}, Warren Buffett is calling — he wants tips from you.",
          "Elon just saw your P&L and postponed his next tweet.",
          "{{name}}, Ray Dalio sent a like. Seriously.",
          "Looks like you're actually getting good at stop-losses, {{name}}.",
          "{{name}} Stocks is proud of you.",
          "Wall Street is talking about you this morning, {{name}}.",
          "Even Jordan Belfort would tip his hat, {{name}} — minus the felonies, obviously.",
          "Good morning to {{name}}'s winning portfolio.",
          "Jeff Bezos is considering asking you for investment advice, {{name}}.",
          "{{name}}, you're not a trader — you're a force of nature.",
          "Mark Cuban would be proud, {{name}}. She'd actually call you.",
          "Nice one, {{name}}! Even Buffett doesn't nail it like that every time.",
        ],
        neutral: [
          "{{name}}, Warren Buffett is calling — wants tips from whoever's running this portfolio.",
          "Elon just saw this P&L and postponed his next tweet.",
          "{{name}}, Ray Dalio sent a like. Seriously.",
          "Real improvement on those stop-losses lately, {{name}}.",
          "{{name}} Stocks is proud of this.",
          "Wall Street is talking about {{name}} this morning.",
          "Even Jordan Belfort would tip his hat at this, {{name}} — minus the felonies, obviously.",
          "Good morning to {{name}}'s winning portfolio.",
          "Jeff Bezos is considering asking for investment advice, {{name}}.",
          "{{name}}, this isn't just a trade — it's a force of nature.",
          "Mark Cuban would be proud, {{name}}. Might actually call.",
          "Nice one, {{name}}! Even Buffett doesn't nail it like that every time.",
        ],
      },
      negative: {
        male: [
          "{{name}}, even Warren Buffett lost money before he learned to win. Keep going.",
          "Every great trader has days like this, {{name}}. It's part of the process.",
          "{{name}}, even Elon flopped a few times before SpaceX landed. Don't quit.",
          "A loss is just a lesson you haven't finished learning yet, {{name}}.",
          "{{name}}, Ray Dalio wrote a whole book about his failures. You're on the right track.",
          "Tomorrow's a new day in the market, {{name}}. Onward.",
          "Statistically speaking, {{name}}, this is exactly where comebacks start.",
          "It'll be alright, {{name}}. Even Jesse Livermore fell and got back up more than once.",
        ],
        female: [
          "{{name}}, even Warren Buffett lost money before he learned to win. Keep going.",
          "Every great trader has days like this, {{name}}. It's part of the process.",
          "{{name}}, even Elon flopped a few times before SpaceX landed. Don't quit.",
          "A loss is just a lesson you haven't finished learning yet, {{name}}.",
          "{{name}}, Ray Dalio wrote a whole book about his failures. You're on the right track.",
          "Tomorrow's a new day in the market, {{name}}. Onward.",
          "Statistically speaking, {{name}}, this is exactly where comebacks start.",
          "It'll be alright, {{name}}. Even Jesse Livermore fell and got back up more than once.",
        ],
        neutral: [
          "{{name}}, even Warren Buffett lost money before he learned to win. Worth continuing.",
          "Every great trader has days like this, {{name}}. It's part of the process.",
          "{{name}}, even Elon flopped a few times before SpaceX landed. Not the time to quit.",
          "A loss is just a lesson not yet finished, {{name}}.",
          "{{name}}, Ray Dalio wrote a whole book about his failures. This is the right track.",
          "Tomorrow's a new day in the market, {{name}}. Onward.",
          "Statistically speaking, {{name}}, this is exactly where comebacks start.",
          "It'll be alright, {{name}}. Even Jesse Livermore fell and got back up more than once.",
        ],
      },
    },
    recentTrades: "Recent trades",
    noRecentTrades: "No trades yet.",
  },
  growth: {
    title: "Growth",
    subtitle: "Notes to keep, lessons to remember — and a little motivation along the way.",
    quotesHeading: "Words from the greats",
    notesHeading: "Trade notes",
    notesEmpty: "No trades yet — once you log some, you can jot improvement notes here.",
    notesPlaceholder: "What would you keep doing? What would you change next time?",
    save: "Save",
    saved: "Saved",
    nextQuote: "Another one",
  },
  trade: {
    newTitle: "New trade",
    editTitle: "Edit trade",
    description: "Only symbol, side, entry time, entry price and quantity are required — everything else is optional.",
    symbol: "Symbol",
    side: "Side",
    long: "Long",
    short: "Short",
    entryDateTime: "Entry date & time",
    exitDateTime: "Exit date & time",
    now: "Now",
    entryPrice: "Entry price",
    exitPrice: "Exit price",
    quantity: "Quantity",
    fees: "Commission / fees",
    grossPnl: "Gross P&L",
    netPnl: "Net P&L",
    returnLabel: "Return",
    holdingTime: "Holding time",
    open: "Open",
    account: "Trading account (optional)",
    noAccount: "No account",
    strategy: "Strategy",
    setup: "Setup",
    addNew: "+ New",
    cancelAdd: "Cancel",
    none: "None",
    tags: "Tags",
    noTags: "No tags yet.",
    notes: "Notes",
    cancel: "Cancel",
    save: "Save trade",
    saving: "Saving…",
    add: "Add",
    strategyPlaceholder: "e.g. Breakout",
    setupPlaceholder: "e.g. Pullback to VWAP",
    tagPlaceholder: "New tag",
    saveFailed: "Failed to save trade",
  },
  datetime: {
    day: "Day",
    month: "Mon",
    year: "Year",
    hour: "HH",
    minute: "MM",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  auth: {
    loginTitle: "Sign in to RS Flow",
    loginSubtitle: "Track and analyze your trading performance.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    loginFailed: "Login failed",
    noAccount: "Don't have an account?",
    registerLink: "Register",
    registerTitle: "Create your RS Flow account",
    registerSubtitle: "Start journaling your trades in minutes.",
    name: "Name",
    genderLabel: "Gender",
    genderHint: "So we can address you correctly around the app.",
    female: "Female",
    male: "Male",
    createAccount: "Create account",
    creatingAccount: "Creating account…",
    registerFailed: "Registration failed",
    haveAccount: "Already have an account?",
    signInLink: "Sign in",
  },
  journal: {
    title: "Journal",
    subtitle: "Search, filter and manage every trade.",
    newTrade: "New trade",
    searchSymbol: "Search symbol…",
    loading: "Loading trades…",
    loadFailed: "Failed to load trades",
    deleteConfirm: "Delete the {{symbol}} trade?",
    deleteFailed: "Failed to delete trade",
    emptyTitle: "No trades match these filters",
    emptyDescription: "Try clearing a filter, or log a new trade to get started.",
    logFirstTrade: "Log your first trade",
    openClosed: "Open & Closed",
    open: "Open",
    closed: "Closed",
    review: "Review",
    columns: {
      symbol: "Symbol",
      side: "Side",
      entry: "Entry",
      exit: "Exit",
      qty: "Qty",
      netPnl: "Net P&L",
      returnPct: "Return %",
      status: "Status",
    },
    pageOf: "Page {{page}} of {{totalPages}}",
    tradesCount: "{{count}} trades",
    prev: "Prev",
    next: "Next",
  },
  tradeReview: {
    backToJournal: "Back to Journal",
    review: "Review",
    strategy: "Strategy",
    setup: "Setup",
    none: "None",
    tags: "Tags",
    noTagsYet: "No tags yet — create some in Strategies → Tags.",
    whyEnter: "Why did I enter this trade?",
    tradingPlan: "Trading plan",
    followedPlan: "Did I follow the plan?",
    notSpecified: "Not specified",
    yes: "Yes",
    no: "No",
    whatWentWell: "What did I do right?",
    mistakes: "Mistakes",
    noMistakesYet: "No mistake categories yet — create some in Strategies → Mistakes.",
    mistakesNotesPlaceholder: "Additional notes about mistakes made…",
    lessonsLearned: "Lessons learned",
    emotionalState: "Emotional state",
    emotionalStatePlaceholder: "e.g. Calm, FOMO, Confident…",
    notes: "Notes",
    saveReview: "Save review",
    saving: "Saving…",
    saveFailed: "Failed to save review",
    screenshots: "Screenshots",
    noScreenshots: "No screenshots added yet.",
    screenshotUrl: "Screenshot URL",
    type: "Type",
    before: "Before",
    after: "After",
    caption: "Caption",
    add: "Add",
    removeConfirm: "Remove this screenshot?",
    addFailed: "Failed to add attachment",
    loading: "Loading trade…",
    notFound: "Trade not found",
  },
  calendar: {
    title: "Calendar",
    subtitle: "Daily P&L at a glance.",
    loading: "Loading calendar…",
    loadFailed: "Failed to load calendar",
    monthlyPnl: "Monthly P&L",
    trades: "Trades",
    noTradesMonth: "No trades recorded this month.",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    tradeCountSuffix: "trade",
    tradeCountSuffixPlural: "trades",
    loadingTrades: "Loading trades…",
  },
  strategiesPage: {
    title: "Strategies",
    subtitle: "Manage the Strategies, Setups, Tags and Mistake Categories you use to tag trades.",
    tabs: { strategies: "Strategies", setups: "Setups", tags: "Tags", mistakes: "Mistakes" },
    strategySingular: "strategy",
    setupSingular: "setup",
    tagSingular: "tag",
    mistakeSingular: "mistake category",
    mistakesTitle: "Mistake categories",
  },
  taxonomy: {
    manage: "Manage your {{title}}.",
    newItem: "New {{label}}",
    loading: "Loading…",
    loadFailed: "Failed to load {{title}}",
    emptyTitle: "No {{title}} yet",
    createFirst: "Create your first {{label}}",
    deleteConfirm: 'Delete "{{name}}"?',
    deleteFailed: "Failed to delete {{label}}",
    name: "Name",
    description: "Description",
    color: "Color",
    save: "Save",
    saveFailed: "Failed to save",
    cancel: "Cancel",
    editItem: "Edit {{label}}",
  },
  tradingAccountsPage: {
    title: "Trading Accounts",
    subtitle: "Manage the accounts you trade with — personal, prop, or broker-specific.",
    newAccount: "New account",
    loading: "Loading accounts…",
    loadFailed: "Failed to load trading accounts",
    emptyTitle: "No trading accounts yet",
    emptyDescription: "Accounts are optional — you can log trades without one and attach an account later.",
    createFirst: "Create your first account",
    inactive: "Inactive",
    startingBalance: "Starting balance",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: 'Delete trading account "{{name}}"?',
    deleteFailed: "Failed to delete account",
  },
  settingsPage: { title: "Settings", description: "Application preferences will live here." },
  profilePage: { title: "Profile", accountDetails: "Account details", name: "Name:", email: "Email:" },
  importPage: { title: "Import", description: "CSV import with column mapping will be available here." },
  performanceTable: {
    name: "Name",
    trades: "Trades",
    netPnl: "Net P&L",
    winRate: "Win rate",
    avgTrade: "Avg trade",
    profitFactor: "Profit factor",
    emptyDefault: "No data for the selected filters",
  },
  winLoss: {
    heading: "Win / loss distribution",
    empty: "No closed trades for the selected filters.",
    winners: "Winners",
    losers: "Losers",
    breakeven: "Breakeven",
  },
  accountForm: {
    newTitle: "New trading account",
    editTitle: "Edit trading account",
    newDescription: "Add an account to track trades against.",
    editDescription: "Update the details of this account.",
    name: "Name",
    broker: "Broker",
    currency: "Currency",
    startingBalance: "Starting balance",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving…",
  },
  analyticsPage: {
    title: "Analytics",
    subtitle: "Understand where your edge comes from — and where it doesn't.",
    loading: "Loading analytics…",
    loadFailed: "Failed to load analytics",
    dailyPnl: "Daily P&L",
    weeklyPnl: "Weekly P&L",
    monthlyPnl: "Monthly P&L",
    longVsShort: "Long vs short",
    bySymbol: "Performance by symbol",
    byStrategy: "Performance by strategy",
    byStrategyEmpty: "No closed trades yet — tag trades with a strategy in their Review page.",
    bySetup: "Performance by setup",
    bySetupEmpty: "No closed trades yet — tag trades with a setup in their Review page.",
    byHour: "Performance by hour",
    byHourCaveat: "Hours are in UTC — per-user timezone support hasn't been decided yet.",
    byDayOfWeek: "Performance by day of week",
  },
};
