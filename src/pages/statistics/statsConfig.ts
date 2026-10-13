export const tradingStatsConfig = (
  metrics: any,
  account_currency: string,
  dataMode: number,
  informationAboutComponents: Record<string, string>
) => {
  // Helper function to safely format numbers
  const safeFormat = (value: any, decimals: number = 2, suffix: string = '') => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${Number(value).toFixed(decimals)}${suffix}`;
  };

  // Helper function to safely format currency
  const safeFormatCurrency = (value: any, currency: string = account_currency) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${Number(value).toFixed(2)} ${currency}`;
  };

  const commonStats = [
    {
      key: 'averageWin',
      name: 'Average Win',
      value: safeFormatCurrency(metrics?.averageWin),
      color: 'bg-green-400',
      info: informationAboutComponents.averageWin,
    },
    {
      key: 'averageLoss',
      name: 'Average Loss',
      value: safeFormatCurrency(metrics?.averageLoss),
      color: 'bg-red-400',
      info: informationAboutComponents.averageLoss,
    },
    {
      key: 'trades',
      name: 'Total Trades',
      value: metrics?.trades || 0,
      color: 'bg-blue-400',
      info: informationAboutComponents.totalTrades,
    },
    {
      key: 'wonTrades',
      name: 'Winning Trades',
      value: metrics?.wonTrades || 0,
      color: 'bg-green-400',
      info: informationAboutComponents.totalWinningTrades,
    },
    {
      key: 'lostTrades',
      name: 'Losing Trades',
      value: metrics?.lostTrades || 0,
      color: 'bg-red-400',
      info: informationAboutComponents.totalLosingTrades,
    },
    {
      key: 'lots',
      name: 'Total Lots',
      value: safeFormat(metrics?.lots),
      color: 'bg-cyan-400',
      info: informationAboutComponents.totalLots,
    },
  ];

  if (dataMode === 1) {
    return [
      ...commonStats,
      {
        key: 'winRate',
        name: 'Win Rate',
        value: safeFormat(metrics?.wonTradesPercent, 2, '%'),
        color: 'bg-green-400',
        info: informationAboutComponents.winRate,
      },
      {
        key: 'lossRate',
        name: 'Loss Rate',
        value: safeFormat(metrics?.lostTradesPercent, 2, '%'),
        color: 'bg-red-400',
        info: informationAboutComponents.lossRate,
      },
      {
        key: 'totalPips',
        name: 'Total Pips',
        value: safeFormat(metrics?.pips, 1),
        color: 'bg-yellow-400',
        info: informationAboutComponents.totalPips,
      },
      {
        key: 'bestTradePips',
        name: 'Best Trade (Pips)',
        value: safeFormat(metrics?.bestTradePips, 1),
        color: 'bg-emerald-400',
        info: informationAboutComponents.bestTradePips,
      },
      {
        key: 'worstTradePips',
        name: 'Worst Trade (Pips)',
        value: safeFormat(metrics?.worstTradePips, 1),
        color: 'bg-orange-400',
        info: informationAboutComponents.worstTradePips,
      },
      {
        key: 'profitFactor',
        name: 'Profit Factor',
        value: safeFormat(metrics?.profitFactor, 2),
        color: 'bg-purple-400',
        info: 'Ratio of gross profit to gross loss. A value above 1.0 indicates profitable trading.',
      },
    ];
  }

  // dataMode !== 1 (Default mode with financial metrics)
  return [
    {
      key: 'gain',
      name: 'Total Gain',
      value: safeFormat(metrics?.gain, 2, '%'),
      color: 'bg-green-400',
      info: informationAboutComponents.gain,
    },
    {
      key: 'absoluteGain',
      name: 'Absolute Gain',
      value: safeFormat(metrics?.absoluteGain, 2, '%'),
      color: 'bg-blue-400',
      info: informationAboutComponents.absGain,
    },
    {
      key: 'dailyGain',
      name: 'Daily Gain',
      value: safeFormat(metrics?.dailyGain, 2, '%'),
      color: 'bg-cyan-400',
      info: informationAboutComponents.daily,
    },
    {
      key: 'monthlyGain',
      name: 'Monthly Gain',
      value: safeFormat(metrics?.monthlyGain, 2, '%'),
      color: 'bg-indigo-400',
      info: informationAboutComponents.monthlyGain,
    },
    {
      key: 'deposits',
      name: 'Total Deposits',
      value: safeFormatCurrency(metrics?.deposits),
      color: 'bg-emerald-400',
      info: informationAboutComponents.deposits,
    },
    {
      key: 'withdrawals',
      name: 'Total Withdrawals',
      value: safeFormatCurrency(metrics?.withdrawals),
      color: 'bg-orange-400',
      info: informationAboutComponents.withdrawals,
    },
    {
      key: 'profitFactor',
      name: 'Profit Factor',
      value: safeFormat(metrics?.profitFactor, 2),
      color: 'bg-purple-400',
      info: 'Ratio of gross profit to gross loss. A value above 1.0 indicates profitable trading.',
    },
    {
      key: 'maxDrawdown',
      name: 'Max Drawdown',
      value: safeFormat(metrics?.maxDrawdown, 2, '%'),
      color: 'bg-red-400',
      info: 'Maximum peak-to-trough decline in account value. Lower values indicate better risk management.',
    },
    ...commonStats,
  ];
};
