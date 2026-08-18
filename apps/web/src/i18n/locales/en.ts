export interface Translations {
  nav: {
    groups: { trading: string; data: string };
    items: {
      dashboard: string;
      journal: string;
      calendar: string;
      analytics: string;
      strategies: string;
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
