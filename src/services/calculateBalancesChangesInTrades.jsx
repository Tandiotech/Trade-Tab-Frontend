export function calculateBalancesChangesInTrades(trades) {
    if (!trades || trades.length === 0) return [];
    
    // Filter trades that have type 'DEAL_TYPE_BALANCE'
    const balanceTrades = trades.filter(trade => trade.type === 'DEAL_TYPE_BALANCE');
    
    return balanceTrades;
  }
  