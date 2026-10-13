import { useMemo, useContext } from 'react';
import { TradesContext } from '@/context/accounts/TradesProvider';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { FaChartLine, FaTrophy, FaClock, FaBalanceScale } from 'react-icons/fa';

const TopStatsBar = () => {
  const { currentAccount } = useMTAccounts();

  const tradesContextData = useContext(TradesContext) || {};
  const { tradesCache = {} } = tradesContextData;
  const trades = currentAccount?.external_id ? tradesCache[currentAccount.external_id] || [] : [];

  const getTradeDurationInMinutes = (open: string, close: string) => {
    const openDate = new Date(open);
    const closeDate = new Date(close);
    return (closeDate.getTime() - openDate.getTime()) / 60000;
  };

  const stats = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        totalPL: 0,
        winRate: 0,
        avgTradeTime: { hours: 0, minutes: 0 },
        profitFactor: 0,
      };
    }

    const actualTrades = trades.filter((trade: any) => trade.type !== 'DEAL_TYPE_BALANCE');

    const totalPL = actualTrades.reduce((sum: number, trade: any) => sum + (trade.profit || 0), 0);

    const winningTrades = actualTrades.filter((trade: any) => (trade.profit || 0) > 0);
    const losingTrades = actualTrades.filter((trade: any) => (trade.profit || 0) < 0);

    const winRate =
      actualTrades.length > 0 ? (winningTrades.length / actualTrades.length) * 100 : 0;

    const totalMinutes = actualTrades.reduce(
      (sum: number, trade: any) => sum + getTradeDurationInMinutes(trade.openTime, trade.closeTime),
      0
    );

    const avgMinutes = actualTrades.length > 0 ? totalMinutes / actualTrades.length : 0;
    const avgTradeTime = {
      hours: Math.floor(avgMinutes / 60),
      minutes: Math.round(avgMinutes % 60),
    };

    const totalWinning = winningTrades.reduce(
      (sum: number, trade: any) => sum + (trade.profit || 0),
      0
    );
    const totalLosing = losingTrades.reduce(
      (sum: number, trade: any) => sum + Math.abs(trade.profit || 0),
      0
    );

    const profitFactor = totalLosing === 0 ? totalWinning : totalWinning / totalLosing;

    return {
      totalPL,
      winRate,
      avgTradeTime,
      profitFactor,
    };
  }, [trades]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      label: 'Total P&L',
      value: `${stats.totalPL >= 0 ? '+' : ''}${formatCurrency(stats.totalPL)}`,
      valueClass: stats.totalPL >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]',
      icon: FaChartLine,
      iconClass: stats.totalPL >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]',
    },
    {
      label: 'Win rate',
      value: `${Math.round(stats.winRate)}%`,
      valueClass: 'text-[var(--tt-fg-0)]',
      icon: FaTrophy,
      iconClass: 'text-[var(--tt-brand)]',
    },
    {
      label: 'Avg trade',
      value: `${stats.avgTradeTime.hours}h ${stats.avgTradeTime.minutes}m`,
      valueClass: 'text-[var(--tt-fg-0)]',
      icon: FaClock,
      iconClass: 'text-[var(--tt-fg-2)]',
    },
    {
      label: 'Profit factor',
      value: stats.profitFactor.toFixed(2),
      valueClass: 'text-[var(--tt-fg-0)]',
      icon: FaBalanceScale,
      iconClass: 'text-[var(--tt-fg-2)]',
    },
  ];

  return (
    <div className='mb-4 rounded-[var(--tt-radius-lg)] border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] p-4 md:mb-6 md:p-5'>
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'>
        {statCards.map(stat => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className='min-w-0 rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-3 transition-colors duration-200 hover:border-[var(--tt-line-2)] md:p-4'
            >
              <div className='mb-2 flex items-center gap-2'>
                <IconComponent className={`h-4 w-4 shrink-0 ${stat.iconClass}`} aria-hidden />
                <span className='truncate text-[10px] font-medium uppercase tracking-wide text-[var(--tt-fg-3)] md:text-xs'>
                  {stat.label}
                </span>
              </div>
              <span
                className={`tt-mono block truncate text-lg font-semibold tabular-nums md:text-2xl ${stat.valueClass}`}
              >
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopStatsBar;
