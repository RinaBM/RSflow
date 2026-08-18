export interface Translations {
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
}

export const en: Translations = {
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
};
