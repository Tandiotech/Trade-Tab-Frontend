import { safeGet, SafeSection } from "@/lib/utils";
import { AdvancedAnalyticsSectionProps } from "../interface";
import { SeparadorDecimal } from "@/utils/SeparadorDecimal";

// Advanced Analytics Section Component with safety measures
export const AdvancedAnalyticsSection: React.FC<AdvancedAnalyticsSectionProps> = ({ metrics }) => {
    // Safety checks
    if (!metrics || typeof metrics !== 'object') {
      return (
        <div className='mb-2'>
          <div className='tt-card p-8 text-center'>
            <div className='text-gray-400 text-lg mb-2'>Analytics data unavailable</div>
            <p className='text-gray-500 text-sm'>Please wait while data loads...</p>
          </div>
        </div>
      );
    }
  
    const dailyGain = safeGet(metrics, 'dailyGain', 0);
    const monthlyGain = safeGet(metrics, 'monthlyGain', 0);
    const daysSinceTradingStarted = safeGet(metrics, 'daysSinceTradingStarted', 0);
    const equityPercent = safeGet(metrics, 'equityPercent', 0);
    const probability = safeGet(metrics, 'probability', 0);
    const zScore = safeGet(metrics, 'zScore', 0);
    const totalTradeMarketValue = safeGet(metrics, 'totalTradeMarketValue', 0);
    const averageTradeLengthInMilliseconds = safeGet(metrics, 'averageTradeLengthInMilliseconds', 0);
  
    const formatDuration = (milliseconds: number): string => {
      try {
        if (typeof milliseconds !== 'number' || isNaN(milliseconds)) return '0h 0m';
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
      } catch (error) {
        console.error('Error formatting duration:', error);
        return '0h 0m';
      }
    };
  
    return (
      <SafeSection sectionName="AdvancedAnalyticsSection">
        <div className='mb-2'>
          <div className='mb-4'>
            <h2 className='text-xl font-semibold text-white mb-2'>Advanced Analytics</h2>
            <p className='text-sm text-gray-400'>Detailed performance metrics and risk analysis</p>
          </div>
  
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='tt-card p-4 border border-gray-700/50'>
              <div className='text-sm text-gray-400 mb-1'>Daily Gain</div>
              <div className='text-xl font-semibold text-green-400 text-center'>
                {typeof dailyGain === 'number' ? dailyGain.toFixed(2) : '0.00'}%
              </div>
            </div>
  
            <div className='tt-card p-4 border border-gray-700/50'>
              <div className='text-sm text-gray-400 mb-1'>Monthly Gain</div>
              <div className='text-xl font-semibold text-blue-400 text-center'>
                {typeof monthlyGain === 'number' ? monthlyGain.toFixed(2) : '0.00'}%
              </div>
            </div>
  
            <div className='tt-card p-4 border border-gray-700/50'>
              <div className='text-sm text-gray-400 mb-1'>Trading Days</div>
              <div className='text-xl font-semibold text-white text-center'>
                {typeof daysSinceTradingStarted === 'number' ? (daysSinceTradingStarted.toFixed(0)) : 0}
              </div>
            </div>
  
            <div className='tt-card p-4 border border-gray-700/50'>
              <div className='text-sm text-gray-400 mb-1'>Equity %</div>
              <div className='text-xl font-semibold text-teal-400 text-center'>
                {typeof equityPercent === 'number' ? equityPercent.toFixed(1) : '0.0'}%
              </div>
            </div>
          </div>
  
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
            <div className='tt-card p-4 border border-gray-700/50'>
              <div className='text-sm text-gray-400 mb-1'>Success Probability</div>
              <div className='text-xl font-semibold text-green-400 text-center'>
                {typeof probability === 'number' ? probability.toFixed(1) : '0.0'}%
              </div>
            </div>
  
            <div className='tt-card p-4 border border-gray-700/50'>
              <div className='text-sm text-gray-400 mb-1'>Z-Score</div>
              <div className='text-xl font-semibold text-orange-400 text-center'>
                {typeof zScore === 'number' ? zScore.toFixed(2) : '0.00'}
              </div>
            </div>
  
            <div className='tt-card p-4 border border-gray-700/50'>
              <div className='text-sm text-gray-400 mb-1'>Market Value</div>
              <div className='text-xl font-semibold text-blue-400 text-center'>
                {typeof totalTradeMarketValue === 'number' ? `$${SeparadorDecimal(totalTradeMarketValue.toFixed(0))}` : '0'}
              </div>
            </div>
  
            <div className='tt-card p-4 border border-gray-700/50'>
              <div className='text-sm text-gray-400 mb-1'>Avg Trade Duration</div>
              <div className='text-xl font-semibold text-white text-center'>
                {formatDuration(averageTradeLengthInMilliseconds)}
              </div>
            </div>
          </div>
        </div>
      </SafeSection>
    );
  };