import { useState, useEffect, useCallback, useRef } from 'react';
import InputSection from './InputSection';
import ResultsSection from './ResultsSection';
import SummarySection from './SummarySection';
import { TradeDirection, calculateTradeMetrics } from './utils';

// Custom debounce function to replace lodash dependency
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<number | null>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}

const ComprehensiveTradeCalculator = () => {
  // State management with stronger typing
  const [accountSize, setAccountSize] = useState<string>('');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [lotSize, setLotSize] = useState<string>('');
  const [direction, setDirection] = useState<TradeDirection>('buy');
  const [pair, setPair] = useState<string>('EUR/USD');
  const [leverage, setLeverage] = useState<string>('100');
  const [tradingFees, setTradingFees] = useState<string>('0');

  // Validation states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Calculated values
  const [calculatedValues, setCalculatedValues] = useState<{
    estimatedLoss: number | null;
    estimatedProfit: number | null;
    pipValueLoss: string | null;
    pipValueProfit: string | null;
    pipsAtRisk: string | null;
    pipsProfit: string | null;
    riskPercentage: string | null;
    profitPercentage: string | null;
    netLoss: number | null;
    netProfit: number | null;
  }>({
    estimatedLoss: null,
    estimatedProfit: null,
    pipValueLoss: null,
    pipValueProfit: null,
    pipsAtRisk: null,
    pipsProfit: null,
    riskPercentage: null,
    profitPercentage: null,
    netLoss: null,
    netProfit: null,
  });

  // Calculate function
  const calculate = useCallback(() => {
    // Reset validation error when inputs change
    setValidationError(null);
    setIsCalculating(true);

    try {
      const entryNum = parseFloat(entryPrice);
      const stopLossNum = parseFloat(stopLoss);
      const takeProfitNum = parseFloat(takeProfit);
      const lot = parseFloat(lotSize);
      const account = parseFloat(accountSize) || 0;
      const leverageNum = parseFloat(leverage) || 100;
      const feesNum = parseFloat(tradingFees) || 0;

      if (!isNaN(entryNum) && !isNaN(lot) && lot > 0) {
        // Calculate trade metrics
        const metrics = calculateTradeMetrics(
          direction,
          entryNum,
          stopLossNum,
          takeProfitNum,
          lot,
          account,
          pair,
          leverageNum,
          feesNum
        );

        // Set validation errors
        if (metrics.validation.stopLossError || metrics.validation.takeProfitError) {
          setValidationError(
            metrics.validation.stopLossError || metrics.validation.takeProfitError
          );
        }

        // Update state with calculated values
        setCalculatedValues({
          estimatedLoss: metrics.estimatedLoss,
          estimatedProfit: metrics.estimatedProfit,
          pipsAtRisk: metrics.pipsAtRisk,
          pipsProfit: metrics.pipsProfit,
          pipValueLoss: metrics.pipValueLoss,
          pipValueProfit: metrics.pipValueProfit,
          riskPercentage: metrics.riskPercentage,
          profitPercentage: metrics.profitPercentage,
          netLoss: metrics.netLoss,
          netProfit: metrics.netProfit,
        });
      } else {
        // Reset all calculated values if inputs are invalid
        setCalculatedValues({
          estimatedLoss: null,
          estimatedProfit: null,
          pipsAtRisk: null,
          pipsProfit: null,
          pipValueLoss: null,
          pipValueProfit: null,
          riskPercentage: null,
          profitPercentage: null,
          netLoss: null,
          netProfit: null,
        });
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setValidationError('An error occurred during calculation. Please check your inputs.');
    } finally {
      setIsCalculating(false);
    }
  }, [
    entryPrice,
    stopLoss,
    takeProfit,
    lotSize,
    accountSize,
    direction,
    pair,
    leverage,
    tradingFees,
  ]);

  // Create a debounced version of the calculate function
  const debouncedCalculate = useDebounce(calculate, 300);

  // Trigger calculations when inputs change
  useEffect(() => {
    debouncedCalculate();
  }, [
    entryPrice,
    stopLoss,
    takeProfit,
    lotSize,
    accountSize,
    direction,
    pair,
    leverage,
    tradingFees,
    debouncedCalculate,
  ]);

  const hasResults =
    calculatedValues.estimatedLoss !== null || calculatedValues.estimatedProfit !== null;
  const hasSummary = calculatedValues.riskPercentage !== null && calculatedValues.profitPercentage !== null;

  return (
    <section
      className='relative isolate rounded-3xl border border-white/10 bg-darkblack-800/80 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10'
      role='region'
      aria-label='Trade Calculator'
    >
      <div
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-tradetab-lime/15 via-transparent to-transparent blur-3xl'
        aria-hidden='true'
      />

      <div className='space-y-10'>
        <header className='space-y-6 text-center lg:text-left'>
          <div className='inline-flex items-center gap-2 self-start rounded-full border border-tradetab-lime/40 bg-tradetab-lime/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-tradetab-lime'>
            Comprehensive Planner
          </div>
          <div className='space-y-3'>
            <h1 className='text-3xl font-semibold text-white sm:text-4xl lg:text-5xl'>
              Bring every trade detail into one cockpit
            </h1>
            <p className='mx-auto max-w-3xl text-sm text-gray-300 sm:text-base lg:mx-0'>
              Size your position, simulate profit and loss, and understand margin impact in a single
              workflow. Adjust direction, leverage, fees, and price targets to see how each tweak
              affects risk before you execute.
            </p>
          </div>
          <div className='grid gap-4 sm:grid-cols-3'>
            {[
              {
                title: 'Inputs stay in sync',
                description: 'Change any parameter and the calculator updates instantly.'
              },
              {
                title: 'Margin aware',
                description: 'See how leverage and lot size impact exposure and account risk.'
              },
              {
                title: 'Fee conscious',
                description: 'Incorporate commissions and swaps so projections stay realistic.'
              }
            ].map(card => (
              <div
                key={card.title}
                className='rounded-3xl border border-white/10 bg-white/5 p-4 text-left text-sm text-gray-300 transition hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10 hover:text-gray-100'
              >
                <p className='text-xs uppercase tracking-[0.2em] text-tradetab-lime'>{card.title}</p>
                <p className='mt-2 text-sm text-gray-300'>{card.description}</p>
              </div>
            ))}
          </div>
        </header>

        <div className='grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start'>
          <InputSection
            accountSize={accountSize}
            setAccountSize={setAccountSize}
            entryPrice={entryPrice}
            setEntryPrice={setEntryPrice}
            stopLoss={stopLoss}
            setStopLoss={setStopLoss}
            takeProfit={takeProfit}
            setTakeProfit={setTakeProfit}
            lotSize={lotSize}
            setLotSize={setLotSize}
            direction={direction}
            setDirection={setDirection}
            pair={pair}
            setPair={setPair}
            leverage={leverage}
            setLeverage={setLeverage}
            tradingFees={tradingFees}
            setTradingFees={setTradingFees}
            validationError={validationError}
            isCalculating={isCalculating}
          />

          <div className='space-y-6'>
            {hasResults && (
              <ResultsSection
                estimatedLoss={calculatedValues.estimatedLoss}
                estimatedProfit={calculatedValues.estimatedProfit}
                netLoss={calculatedValues.netLoss}
                netProfit={calculatedValues.netProfit}
                pipValueLoss={calculatedValues.pipValueLoss}
                pipValueProfit={calculatedValues.pipValueProfit}
                pipsAtRisk={calculatedValues.pipsAtRisk}
                pipsProfit={calculatedValues.pipsProfit}
                pair={pair}
                tradingFees={tradingFees}
              />
            )}

            {hasSummary && (
              <SummarySection
                riskPercentage={calculatedValues.riskPercentage}
                profitPercentage={calculatedValues.profitPercentage}
                estimatedLoss={calculatedValues.estimatedLoss}
                estimatedProfit={calculatedValues.estimatedProfit}
                netLoss={calculatedValues.netLoss}
                netProfit={calculatedValues.netProfit}
                pipsAtRisk={calculatedValues.pipsAtRisk}
                pipsProfit={calculatedValues.pipsProfit}
                pipValueLoss={calculatedValues.pipValueLoss}
                accountSize={accountSize}
                entryPrice={entryPrice}
                stopLoss={stopLoss}
                takeProfit={takeProfit}
                direction={direction}
                pair={pair}
                leverage={leverage}
                tradingFees={tradingFees}
              />
            )}

            {!hasResults && (
              <div className='rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300'>
                <p className='font-semibold text-white'>Waiting for trade parameters</p>
                <p className='mt-2 text-gray-300'>
                  Set entry, stop loss, take profit, and lot size to preview potential outcomes, margin
                  usage, and risk percentages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveTradeCalculator;
