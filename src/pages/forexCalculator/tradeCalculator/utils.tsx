/**
 * Trade Calculator Utility Functions
 * Contains all calculation and helper functions for the forex/commodity trade calculator
 */

// Types
export type TradeDirection = 'buy' | 'sell';

export interface PriceFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface PlaceholderValues {
  entry: string;
  stopLoss: string;
  takeProfit: string;
}

export interface TradeMetricsResult {
  estimatedLoss: number | null;
  estimatedProfit: number | null;
  netLoss: number | null;
  netProfit: number | null;
  pipsAtRisk: string | null;
  pipsProfit: string | null;
  pipValueLoss: string | null;
  pipValueProfit: string | null;
  riskPercentage: string | null;
  profitPercentage: string | null;
  marginRequired: number | null;
  validation: {
    stopLossError: string | null;
    takeProfitError: string | null;
  };
}

export interface PipTerms {
  singular: string;
  plural: string;
}

/**
 * Format number with commas for thousands
 * @param num - Number to format
 * @returns Formatted number string with 2 decimal places
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0.00';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Calculate pip value based on currency pair
 * @param pair - Currency pair or commodity
 * @param lotSize - Size of the trade in lots
 * @param currentPrice - Current price of the instrument
 * @param leverage - Leverage ratio (default: 100)
 * @returns Calculated pip value
 */
export const calculatePipValue = (
  pair: string,
  lotSize: number,
  currentPrice: number,
  leverage: number = 100
): number => {
  if (!pair || isNaN(lotSize) || isNaN(currentPrice) || lotSize <= 0 || currentPrice <= 0) {
    return 0;
  }

  const standardLotSize = 100000;
  const leverageMultiplier = 1; // Leverage is already factored into effective position size

  try {
    // Indices
    if (pair === 'US30') {
      // US30 (Dow Jones): 1 point = $1 per contract
      return lotSize * 1 * leverageMultiplier;
    } else if (pair === 'DAXEUR') {
      // DAX: 1 point = 1 EUR per contract (approximately $1 USD)
      return lotSize * 1 * leverageMultiplier;
    }
    // Commodities
    else if (pair === 'XAU/USD') {
      // Gold: 1 lot = 100 oz, $1 move = $100 per lot
      return lotSize * 100 * leverageMultiplier;
    } else if (pair === 'XAG/USD') {
      // Silver: 1 lot = 5,000 oz, $1 move = $5,000 per lot
      return lotSize * 5000 * leverageMultiplier;
    } else if (pair === 'WTI/USD' || pair === 'BRENT/USD') {
      // Oil: 1 lot = 1,000 barrels, $1 move = $1,000 per lot
      return lotSize * 1000 * leverageMultiplier;
    }

    // JPY pairs
    else if (pair === 'USD/JPY') {
      // For USD/JPY, pip value = (lot size * standard lot size * 0.01) / current price
      return ((lotSize * standardLotSize * 0.01) / currentPrice) * leverageMultiplier;
    } else if (pair.endsWith('/JPY')) {
      // For XXX/JPY pairs like EUR/JPY, GBP/JPY, etc.
      return ((lotSize * standardLotSize * 0.01) / currentPrice) * leverageMultiplier;
    }

    // USD pairs
    else if (pair.startsWith('USD/')) {
      // For USD/XXX pairs, pip value = lot size * standard lot size * 0.0001 * current price
      return lotSize * standardLotSize * 0.0001 * currentPrice * leverageMultiplier;
    } else if (pair.endsWith('/USD')) {
      // For XXX/USD pairs, pip value = lot size * standard lot size * 0.0001
      return lotSize * standardLotSize * 0.0001 * leverageMultiplier;
    }

    // Cross currency pairs - improved handling with more specific approximations
    else {
      // Major currency crosses
      const majorCrosses: Record<string, number> = {
        'EUR/GBP': 12.5,
        'EUR/CHF': 10.8,
        'EUR/AUD': 7.5,
        'EUR/CAD': 7.8,
        'EUR/NZD': 6.9,
        'GBP/CHF': 12.7,
        'GBP/AUD': 8.5,
        'GBP/CAD': 8.2,
        'GBP/NZD': 7.3,
        'AUD/NZD': 9.2,
        'AUD/CAD': 10.0,
        'NZD/CAD': 8.5,
        'CHF/CAD': 7.9,
      };

      // Check if we have a specific value for this cross pair
      if (majorCrosses[pair]) {
        return lotSize * majorCrosses[pair] * leverageMultiplier;
      }

      // For other cross pairs, use a better approximation based on currency group
      if (pair.includes('EUR') || pair.includes('GBP')) {
        return lotSize * 11 * leverageMultiplier; // European currencies tend to have higher values
      } else if (pair.includes('AUD') || pair.includes('NZD') || pair.includes('CAD')) {
        return lotSize * 8 * leverageMultiplier; // Commonwealth currencies approximation
      }

      // Default fallback for any other cross
      return lotSize * 10 * leverageMultiplier;
    }
  } catch (error) {
    console.error('Error calculating pip value:', error);
    return 0;
  }
};

/**
 * Calculate margin required based on position size, leverage, and current price
 * @param pair - Currency pair or commodity
 * @param lotSize - Size of the trade in lots
 * @param currentPrice - Current price of the instrument
 * @param leverage - Leverage ratio
 * @returns Calculated margin required
 */
export const calculateMarginRequired = (
  pair: string,
  lotSize: number,
  currentPrice: number,
  leverage: number
): number => {
  if (
    !pair ||
    isNaN(lotSize) ||
    isNaN(currentPrice) ||
    isNaN(leverage) ||
    lotSize <= 0 ||
    currentPrice <= 0 ||
    leverage <= 0
  ) {
    return 0;
  }

  try {
    const standardLotSize = 100000;
    let notionalValue = 0;

    // Calculate notional value based on the instrument
    if (pair === 'US30') {
      // US30: 1 contract = 1 unit at current price
      notionalValue = lotSize * currentPrice;
    } else if (pair === 'DAXEUR') {
      // DAX: 1 contract = 1 unit at current price
      notionalValue = lotSize * currentPrice;
    } else if (pair === 'XAU/USD') {
      // Gold: 1 lot = 100 oz
      notionalValue = lotSize * 100 * currentPrice;
    } else if (pair === 'XAG/USD') {
      // Silver: 1 lot = 5,000 oz
      notionalValue = lotSize * 5000 * currentPrice;
    } else if (pair === 'WTI/USD' || pair === 'BRENT/USD') {
      // Oil: 1 lot = 1,000 barrels
      notionalValue = lotSize * 1000 * currentPrice;
    } else {
      // Forex pairs: 1 lot = 100,000 units of base currency
      notionalValue = lotSize * standardLotSize * (pair.endsWith('/USD') ? 1 : currentPrice);
    }

    // Calculate margin required
    return notionalValue / leverage;
  } catch (error) {
    console.error('Error calculating margin required:', error);
    return 0;
  }
};

/**
 * Determine pip size based on pair
 * @param pair - Currency pair or commodity
 * @returns The pip size for the instrument
 */
export const getPipSize = (pair: string): number => {
  if (!pair) return 0.0001; // Default to standard forex pip size

  if (pair === 'US30' || pair === 'DAXEUR') {
    return 1; // Indices use whole points
  } else if (pair === 'XAU/USD' || pair === 'XAG/USD' || pair === 'WTI/USD' || pair === 'BRENT/USD') {
    return 1; // For commodities, we use whole points
  } else if (pair.includes('JPY')) {
    return 0.01; // JPY pairs have 2 decimal places
  } else {
    return 0.0001; // Most other pairs have 4 decimal places
  }
};

/**
 * Update placeholder values based on pair and direction
 * @param pair - Currency pair or commodity
 * @param direction - Trade direction (buy/sell)
 * @returns Object with placeholder values for entry, stop loss, and take profit
 */
export const getPlaceholders = (pair: string, direction: TradeDirection): PlaceholderValues => {
  if (!pair) {
    return {
      entry: '',
      stopLoss: '',
      takeProfit: '',
    };
  }

  if (pair === 'US30') {
    return {
      entry: '35000.00',
      stopLoss: direction === 'buy' ? '34900.00' : '35100.00',
      takeProfit: direction === 'buy' ? '35200.00' : '34800.00',
    };
  } else if (pair === 'DAXEUR') {
    return {
      entry: '16000.00',
      stopLoss: direction === 'buy' ? '15900.00' : '16100.00',
      takeProfit: direction === 'buy' ? '16200.00' : '15800.00',
    };
  } else if (pair === 'XAU/USD') {
    return {
      entry: '2025.50',
      stopLoss: direction === 'buy' ? '2020.00' : '2031.00',
      takeProfit: direction === 'buy' ? '2035.00' : '2016.00',
    };
  } else if (pair === 'XAG/USD') {
    return {
      entry: '25.50',
      stopLoss: direction === 'buy' ? '25.00' : '26.00',
      takeProfit: direction === 'buy' ? '26.00' : '25.00',
    };
  } else if (pair === 'WTI/USD' || pair === 'BRENT/USD') {
    return {
      entry: '75.50',
      stopLoss: direction === 'buy' ? '74.50' : '76.50',
      takeProfit: direction === 'buy' ? '77.50' : '73.50',
    };
  } else if (pair.includes('JPY')) {
    return {
      entry: '160.50',
      stopLoss: direction === 'buy' ? '160.00' : '161.00',
      takeProfit: direction === 'buy' ? '161.50' : '159.50',
    };
  } else {
    return {
      entry: '1.0850',
      stopLoss: direction === 'buy' ? '1.0800' : '1.0900',
      takeProfit: direction === 'buy' ? '1.0950' : '1.0750',
    };
  }
};

/**
 * Get disclaimer text for lot size based on pair
 * @param pair - Currency pair or commodity
 * @returns Disclaimer text appropriate for the instrument
 */
export const getDisclaimerText = (pair: string): string => {
  if (!pair) return '* Values are approximate. May vary based on exchange rates.';

  if (pair === 'US30') {
    return '* 1.00 = $1 per point move, 0.10 = $0.10, 0.01 = $0.01';
  } else if (pair === 'DAXEUR') {
    return '* 1.00 = 1 EUR per point move, 0.10 = 0.10 EUR, 0.01 = 0.01 EUR';
  } else if (pair === 'XAU/USD') {
    return '* 1.00 = $100 per $1 move, 0.10 = $10, 0.01 = $1';
  } else if (pair === 'XAG/USD') {
    return '* 1.00 = $5,000 per $1 move, 0.10 = $500, 0.01 = $50';
  } else if (pair === 'WTI/USD' || pair === 'BRENT/USD') {
    return '* 1.00 = $1,000 per $1 move, 0.10 = $100, 0.01 = $10';
  } else if (pair.endsWith('/USD')) {
    return '* 1.00 = $10/pip, 0.10 = $1, 0.01 = $0.10';
  } else if (pair.includes('JPY')) {
    return '* Values are approximate. Actual pip value depends on current exchange rate.';
  } else if (!pair.includes('USD')) {
    return '* For cross currency pairs, values are approximate and may vary based on underlying exchange rates.';
  } else {
    return '* Values are approximate. May vary based on exchange rates.';
  }
};

/**
 * Get tooltip content for lot size based on pair
 * @param pair - Currency pair or commodity
 * @returns Tooltip content explaining lot sizes for the instrument
 */
export const getTooltipContent = (pair: string): string => {
  if (!pair)
    return 'A standard lot is 100,000 units (1.0), a mini lot is 10,000 units (0.1), and a micro lot is 1,000 units (0.01).';

  if (pair === 'US30') {
    return 'For US30 (Dow Jones), 1 contract = 1 unit. This means a 1 point movement equals $1 profit/loss per contract.';
  } else if (pair === 'DAXEUR') {
    return 'For DAX, 1 contract = 1 unit. This means a 1 point movement equals 1 EUR profit/loss per contract.';
  } else if (pair === 'XAU/USD') {
    return 'For Gold, 1 standard lot = 100 ounces. This means a $1 price movement equals $100 profit/loss per standard lot.';
  } else if (pair === 'XAG/USD') {
    return 'For Silver, 1 standard lot = 5,000 ounces. This means a $1 price movement equals $5,000 profit/loss per standard lot.';
  } else if (pair === 'WTI/USD' || pair === 'BRENT/USD') {
    return 'For Crude Oil, 1 standard lot = 1,000 barrels. This means a $1 price movement equals $1,000 profit/loss per standard lot.';
  } else {
    return 'A standard lot is 100,000 units (1.0), a mini lot is 10,000 units (0.1), and a micro lot is 1,000 units (0.01).';
  }
};

/**
 * Get leverage tooltip content
 * @returns Tooltip content explaining leverage
 */
export const getLeverageTooltipContent = (): string => {
  return 'Leverage allows you to control a larger position with less capital. For example, with 100:1 leverage, $1,000 can control a $100,000 position. Higher leverage means higher potential profits but also higher risks.';
};

/**
 * Calculate risk:reward ratio
 * @param riskPercentage - Risk percentage as string
 * @param profitPercentage - Profit percentage as string
 * @returns Risk to reward ratio as string
 */
export const calculateRRRatio = (
  riskPercentage: string | null,
  profitPercentage: string | null
): string => {
  if (!riskPercentage || !profitPercentage) return 'N/A';

  try {
    const riskValue = parseFloat(riskPercentage);
    const profitValue = parseFloat(profitPercentage);

    if (isNaN(riskValue) || isNaN(profitValue) || riskValue <= 0) return 'N/A'; // Prevent division by zero

    return (profitValue / riskValue).toFixed(1);
  } catch (error) {
    console.error('Error calculating R:R ratio:', error);
    return 'N/A';
  }
};

/**
 * Validate stop loss and take profit levels based on trade direction
 * @param direction - Trade direction (buy/sell)
 * @param entryPrice - Entry price
 * @param stopLoss - Stop loss price
 * @param takeProfit - Take profit price
 * @returns Object with validation errors (if any)
 */
export const validateTradeLevels = (
  direction: TradeDirection,
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): { stopLossError: string | null; takeProfitError: string | null } => {
  let stopLossError: string | null = null;
  let takeProfitError: string | null = null;

  // Skip validation if values are NaN
  if (isNaN(entryPrice) || isNaN(stopLoss) || isNaN(takeProfit)) {
    return { stopLossError, takeProfitError };
  }

  // Validate stop loss placement
  if (
    (direction === 'buy' && stopLoss >= entryPrice) ||
    (direction === 'sell' && stopLoss <= entryPrice)
  ) {
    stopLossError =
      direction === 'buy'
        ? 'For a BUY trade, Stop Loss must be below Entry Price'
        : 'For a SELL trade, Stop Loss must be above Entry Price';
  }

  // Validate take profit placement
  if (
    (direction === 'buy' && takeProfit <= entryPrice) ||
    (direction === 'sell' && takeProfit >= entryPrice)
  ) {
    takeProfitError =
      direction === 'buy'
        ? 'For a BUY trade, Take Profit must be above Entry Price'
        : 'For a SELL trade, Take Profit must be below Entry Price';
  }

  return { stopLossError, takeProfitError };
};

/**
 * Calculate pips or points difference between prices
 * @param direction - Trade direction (buy/sell)
 * @param entryPrice - Entry price
 * @param targetPrice - Target price (stop loss or take profit)
 * @param pipSize - Pip size for the instrument
 * @returns Number of pips/points difference
 */
export const calculatePipDifference = (
  direction: TradeDirection,
  entryPrice: number,
  targetPrice: number,
  pipSize: number
): number => {
  if (isNaN(entryPrice) || isNaN(targetPrice) || pipSize <= 0) return 0;

  try {
    const priceDiff = direction === 'buy' ? targetPrice - entryPrice : entryPrice - targetPrice;
    return Math.abs(priceDiff / pipSize);
  } catch (error) {
    console.error('Error calculating pip difference:', error);
    return 0;
  }
};

/**
 * Calculate trade metrics
 * @param direction - Trade direction (buy/sell)
 * @param entryPrice - Entry price
 * @param stopLoss - Stop loss price
 * @param takeProfit - Take profit price
 * @param lotSize - Size of the trade in lots
 * @param accountSize - Account size in account currency
 * @param pair - Currency pair or commodity
 * @param leverage - Leverage ratio (default: 100)
 * @param tradingFees - Trading fees in account currency (default: 0)
 * @returns Object with calculated trade metrics
 */
export const calculateTradeMetrics = (
  direction: TradeDirection,
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  lotSize: number,
  accountSize: number,
  pair: string,
  leverage: number = 100,
  tradingFees: number = 0
): TradeMetricsResult => {
  // Initialize response object
  const result: TradeMetricsResult = {
    estimatedLoss: null,
    estimatedProfit: null,
    netLoss: null,
    netProfit: null,
    pipsAtRisk: null,
    pipsProfit: null,
    pipValueLoss: null,
    pipValueProfit: null,
    riskPercentage: null,
    profitPercentage: null,
    marginRequired: null,
    validation: {
      stopLossError: null,
      takeProfitError: null,
    },
  };

  try {
    // Get basic calculation parameters
    const pipSize = getPipSize(pair);
    const pipValue = calculatePipValue(pair, lotSize, entryPrice, leverage);
    const marginRequired = calculateMarginRequired(pair, lotSize, entryPrice, leverage);

    // Store margin required
    result.marginRequired = marginRequired;

    // Validate trade levels
    result.validation = validateTradeLevels(direction, entryPrice, stopLoss, takeProfit);

    // Calculate Stop Loss metrics
    if (!isNaN(stopLoss)) {
      const pipDiffLoss = calculatePipDifference(direction, entryPrice, stopLoss, pipSize);
      const lossAmount = pipDiffLoss * pipValue;
      const netLossAmount = lossAmount + tradingFees; // Add trading fees to loss

      // Calculate loss percentage based on account size or margin if using leverage
      const effectiveCapital = accountSize > 0 ? accountSize : marginRequired;
      const lossPercentage = effectiveCapital > 0 ? (netLossAmount / effectiveCapital) * 100 : 0;

      result.estimatedLoss = lossAmount;
      result.netLoss = netLossAmount;
      result.pipsAtRisk = pipDiffLoss.toFixed(1);
      result.pipValueLoss = pipValue.toFixed(2);
      result.riskPercentage = lossPercentage.toFixed(1);
    }

    // Calculate Take Profit metrics
    if (!isNaN(takeProfit)) {
      const pipDiffProfit = calculatePipDifference(direction, entryPrice, takeProfit, pipSize);
      const profitAmount = pipDiffProfit * pipValue;
      const netProfitAmount = profitAmount - tradingFees; // Subtract trading fees from profit

      // Calculate profit percentage based on account size or margin if using leverage
      const effectiveCapital = accountSize > 0 ? accountSize : marginRequired;
      const profitPercentage =
        effectiveCapital > 0 ? (netProfitAmount / effectiveCapital) * 100 : 0;

      result.estimatedProfit = profitAmount;
      result.netProfit = netProfitAmount;
      result.pipsProfit = pipDiffProfit.toFixed(1);
      result.pipValueProfit = pipValue.toFixed(2);
      result.profitPercentage = profitPercentage.toFixed(1);
    }

    return result;
  } catch (error) {
    console.error('Error calculating trade metrics:', error);
    return result;
  }
};

/**
 * Get risk level description based on risk percentage
 * @param riskPercentage - Risk percentage as number
 * @returns Risk level description
 */
export const getRiskLevelDescription = (riskPercentage: number): string => {
  if (isNaN(riskPercentage)) return 'Unknown';

  if (riskPercentage < 2) {
    return 'Conservative';
  } else if (riskPercentage < 5) {
    return 'Moderate';
  } else {
    return 'Aggressive';
  }
};

/**
 * Check if pair is a commodity
 * @param pair - Currency pair or commodity
 * @returns Boolean indicating if the pair is a commodity
 */
export const isCommodity = (pair: string): boolean => {
  return ['XAU/USD', 'XAG/USD', 'WTI/USD', 'BRENT/USD'].includes(pair);
};

/**
 * Check if pair is an index
 * @param pair - Currency pair or commodity
 * @returns Boolean indicating if the pair is an index
 */
export const isIndex = (pair: string): boolean => {
  return ['US30', 'DAXEUR'].includes(pair);
};

/**
 * Get term for pip/point based on pair
 * @param pair - Currency pair or commodity
 * @returns Object with singular and plural terms
 */
export const getPipTerm = (pair: string): PipTerms => {
  if (isCommodity(pair) || isIndex(pair)) {
    return { singular: 'Point', plural: 'Points' };
  } else {
    return { singular: 'Pip', plural: 'Pips' };
  }
};
