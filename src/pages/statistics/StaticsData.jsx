import { SeparadorDecimal } from '../../utils/SeparadorDecimal';

function generateTradingStats(accountMetadata, showData) {
  const defaultValues = {
    total_trades: '100',
    win_percentage: '55.00',
    loss_percentage: '45.00',
    total_lots: '50',
    total_commission: '$100.00',
    total_swap: '$25.00',
    longs_won: '60',
    shorts_won: '40',
    best_trade: '$500.00',
    worst_trade: '$-300.00',
    average_win: '$50.00',
    average_loss: '$30.00',
    best_trade_date: '2023-01-01',
    worst_trade_date: '2023-01-15',
  };

  return [
    {
      name: 'Broker',
      value: showData ? (
        accountMetadata.broker
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>
          {defaultValues.total_trades}
        </span>
      ),
    },
    {
      name: 'Currency',
      value: showData ? (
        accountMetadata.currency
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>
          {defaultValues.total_swap}
        </span>
      ),
      color: 'bg-blue-400',
    },
    {
      name: 'Credit',
      value: showData ? (
        accountMetadata.credit
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>
          {defaultValues.total_lots}
        </span>
      ),
      color: 'bg-blue-400',
    },
    {
      name: 'Margin',
      value: showData ? (
        accountMetadata.margin
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>
          {defaultValues.win_percentage}
        </span>
      ),
    },
    {
      name: 'Free margin',
      value: showData ? (
        SeparadorDecimal(accountMetadata.freeMargin)
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>
          {defaultValues.win_percentage}
        </span>
      ),
    },
    {
      name: 'Platform',
      value: showData ? (
        accountMetadata.platform
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>
          {defaultValues.win_percentage}
        </span>
      ),
    },
    {
      name: 'Type',
      value: showData ? (
        accountMetadata.type
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>
          {defaultValues.win_percentage}
        </span>
      ),
    },
  ];
}

function tradeData(accountStats, accountData) {
  const totalWins = accountStats.longs_won + accountStats.shorts_won;

  return [
    { name: 'Total Number of Trades', value: accountStats.total_trades },
    { name: 'Avg. Daily Profit', value: 0.15 },
    { name: 'Biggest Winner', value: accountStats.best_trade },
    { name: 'Biggest Loser', value: accountStats.worst_trade },
    { name: 'Followed Trade Plan', value: 67.39 },
    { name: 'Avg. Holding Time (in Minutes)', value: 2781.5 },
    { name: 'Max Drawdown', value: 3.92 },
    { name: 'Winning / Losing Days', value: `${totalWins} / ${accountStats.total_trades_lost}` },
    { name: 'Current Streak', value: 'WWLWL' },
    {
      name: 'Trades Per Day  / Week',
      value: `${accountData.daily_profit} / ${accountData.weekly_profit}`,
    },
  ];
}

export { generateTradingStats, tradeData };
