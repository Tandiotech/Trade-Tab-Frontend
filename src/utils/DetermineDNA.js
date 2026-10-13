export const determineTraderDNA = (data) => {
  let dna = [];

  // Risk Taker
  if ((data.standardDeviationProfit || 0) > 5000 && (data.profitFactor || 0) > 3) {
    dna.push('Risk Taker');
  }

  // Consistent Trader
  if ((data.wonTradesPercent || 0) > 70 && (data.standardDeviationProfit || 0) < 3000 && (data.profitFactor || 0) > 2) {
    dna.push('Consistent Trader');
  }

  // Scalper
  if ((data.averageTradeLengthInMilliseconds || 0) < 600000 && (data.trades || 0) > 1000 && (data.averageWin || 0) < 1000 && (data.averageLoss || 0) > -1000) {
    dna.push('Scalper');
  }

  // Swing Trader
  if ((data.averageTradeLengthInMilliseconds || 0) > 3600000 && (data.averageWin || 0) > 2000 && (data.averageLoss || 0) < -2000) {
    dna.push('Swing Trader');
  }

  // Breakout Trader
  if ((data.bestTrade || 0) > 30000 && (data.averageWinPips || 0) > 1000) {
    dna.push('Breakout Trader');
  }

  // Mean Reversion Trader
  if ((data.zScore || 0) > 1.5 && (data.averageTradeLengthInMilliseconds || 0) > 600000) {
    dna.push('Mean Reversion Trader');
  }

  // Day Trader
  if ((data.averageTradeLengthInMilliseconds || 0) < 14400000 && (data.trades || 0) > 200 && (data.averageWin || 0) < 500 && (data.averageLoss || 0) > -500) {
    dna.push('Day Trader');
  }

  // Position Trader
  if ((data.averageTradeLengthInMilliseconds || 0) > 86400000 && (data.trades || 0) < 100 && (data.averageWin || 0) > 5000 && (data.averageLoss || 0) < -5000) {
    dna.push('Position Trader');
  }

  // High Frequency Trader
  if ((data.trades || 0) > 10000 && (data.averageTradeLengthInMilliseconds || 0) < 60000 && (data.averageWin || 0) < 50 && (data.averageLoss || 0) > -50) {
    dna.push('High Frequency Trader');
  }

  // Trend Follower
  if ((data.longWonTradesPercent || 0) > 70 && (data.shortWonTradesPercent || 0) > 70 && (data.bestTrade || 0) > 10000 && (data.worstTrade || 0) > -10000) {
    dna.push('Trend Follower');
  }

  // Value Trader
  if ((data.deposit || 0) > 1000000 && (data.cagr || 0) > 10 && (data.maxDrawdown || 0) < 20) {
    dna.push('Value Trader');
  }

  // Default option if no specific DNA type is found
  if (dna.length === 0) {
    dna.push('Diverse Trader');
  }

  return dna;
};
