import React from 'react';
import { motion } from 'framer-motion';
import { IoTrendingUp, IoTrendingDown, IoAlertCircle, IoCheckmarkCircle } from 'react-icons/io5';

interface MarketInsightsProps {
  economicData: any[];
  stats: {
    totalEvents: number;
    highImpact: number;
    mediumImpact: number;
    lowImpact: number;
  };
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ economicData, stats }) => {
  // Calculate market sentiment based on actual vs forecast
  const calculateMarketSentiment = () => {
    if (economicData.length === 0) return { sentiment: 'neutral', color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
    
    const positiveDeviations = economicData.filter(item => item.actual > item.prevision).length;
    const negativeDeviations = economicData.filter(item => item.actual < item.prevision).length;
    const total = economicData.length;
    
    const positiveRatio = positiveDeviations / total;
    
    if (positiveRatio > 0.6) {
      return { sentiment: 'bullish', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    } else if (positiveRatio < 0.4) {
      return { sentiment: 'bearish', color: 'text-red-400', bgColor: 'bg-red-500/20' };
    } else {
      return { sentiment: 'neutral', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    }
  };

  const sentiment = calculateMarketSentiment();
  
  // Get high impact events for today
  const highImpactEvents = economicData.filter(item => item.impact === 'red');
  
  // Calculate average deviation
  const averageDeviation = economicData.length > 0 
    ? economicData.reduce((sum, item) => {
        const deviation = item.prevision !== 0 ? ((item.actual - item.prevision) / item.prevision) * 100 : 0;
        return sum + deviation;
      }, 0) / economicData.length
    : 0;

  const insights = [
    {
      title: 'Market Sentiment',
      value: sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1),
      color: sentiment.color,
      bgColor: sentiment.bgColor,
      icon: sentiment.sentiment === 'bullish' ? IoTrendingUp : sentiment.sentiment === 'bearish' ? IoTrendingDown : IoAlertCircle
    },
    {
      title: 'High Impact Events',
      value: `${stats.highImpact} today`,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      icon: IoAlertCircle
    },
    {
      title: 'Avg. Deviation',
      value: `${averageDeviation > 0 ? '+' : ''}${averageDeviation.toFixed(1)}%`,
      color: averageDeviation > 0 ? 'text-green-400' : averageDeviation < 0 ? 'text-red-400' : 'text-yellow-400',
      bgColor: averageDeviation > 0 ? 'bg-green-500/20' : averageDeviation < 0 ? 'bg-red-500/20' : 'bg-yellow-500/20',
      icon: averageDeviation > 0 ? IoTrendingUp : averageDeviation < 0 ? IoTrendingDown : IoAlertCircle
    },
    {
      title: 'Data Quality',
      value: economicData.length > 0 ? 'Complete' : 'No Data',
      color: economicData.length > 0 ? 'text-green-400' : 'text-gray-400',
      bgColor: economicData.length > 0 ? 'bg-green-500/20' : 'bg-gray-500/20',
      icon: economicData.length > 0 ? IoCheckmarkCircle : IoAlertCircle
    }
  ];

  return (
    <div className='bg-gradient-to-br from-darkblack-700 to-darkblack-800 rounded-xl border border-gray-700/50 p-5 sm:p-6 shadow-xl backdrop-blur-sm'>
      <div className='flex items-center gap-3 mb-5 sm:mb-6'>
        <div className='p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg'>
          <IoAlertCircle className='text-white text-xl sm:text-2xl' />
        </div>
        <div>
          <h3 className='text-white font-bold text-xl sm:text-2xl'>Market Insights</h3>
          <p className='text-gray-400 text-sm sm:text-base mt-0.5'>Real-time market analysis</p>
        </div>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 sm:p-5 rounded-xl border-2 ${insight.bgColor} border-gray-700/30 hover:shadow-lg transition-all flex flex-col justify-between`}
            >
              <div className='flex items-center gap-2 mb-3'>
                <IconComponent className={`text-base sm:text-lg ${insight.color}`} />
                <h4 className='text-white font-semibold text-xs sm:text-sm'>{insight.title}</h4>
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${insight.color}`}>
                {insight.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* High Impact Events Alert - Enhanced */}
      {highImpactEvents.length > 0 && (
        <div className='mt-5 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-red-500/10 to-red-600/10 border-2 border-red-500/30 rounded-xl'>
          <div className='flex items-center gap-2.5 mb-2'>
            <IoAlertCircle className='text-red-400 text-lg sm:text-xl' />
            <span className='text-red-400 text-sm sm:text-base font-semibold'>
              {highImpactEvents.length} high impact event{highImpactEvents.length > 1 ? 's' : ''} today
            </span>
          </div>
          <p className='text-gray-300 text-xs sm:text-sm leading-relaxed'>
            Monitor these events closely as they may cause significant market volatility.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketInsights;
