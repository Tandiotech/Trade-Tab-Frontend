import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiBrain, 
  BiTrendingUp, 
  BiTrendingDown, 
  BiTargetLock, 
  BiTime, 
  BiRefresh,
  BiBarChartAlt2,
  BiCalendar,
  BiStats
} from 'react-icons/bi';
import { formaterCamelCase } from '@/utils/formaterCamelCase';

interface SentimentsResumeProps {
  sentiments: Record<string, number>;
  hideZeros?: boolean;
  asChecklist?: boolean;
  /** Skip framer-motion entry animations and hover scale */
  reducedMotion?: boolean;
}

interface EnhancedSentimentData {
  name: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
}

export default function SentimentsResume({
  sentiments,
  hideZeros = false,
  asChecklist = false,
  reducedMotion = false,
}: SentimentsResumeProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [isExpanded, setIsExpanded] = useState(false);

  // Enhanced sentiment mapping with modern icons and descriptions
  const sentimentConfig: Record<string, Omit<EnhancedSentimentData, 'name' | 'value'>> = {
    enterTooEarly: {
      icon: <BiTime className="h-5 w-5" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      description: 'Premature entries affecting performance',
      trend: 'down'
    },
    overtrading: {
      icon: <BiTrendingUp className="h-5 w-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      description: 'Excessive trading frequency',
      trend: 'down'
    },
    revengeTrading: {
      icon: <BiRefresh className="h-5 w-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      description: 'Emotional trading decisions',
      trend: 'down'
    },
    lackOfDiscipline: {
      icon: <BiTargetLock className="h-5 w-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      description: 'Inconsistent strategy adherence',
      trend: 'down'
    },
    ignoringStrategy: {
      icon: <BiBrain className="h-5 w-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      description: 'Strategy deviation patterns',
      trend: 'down'
    },
    other: {
      icon: <BiBarChartAlt2 className="h-5 w-5" />,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      description: 'Additional behavioral patterns',
      trend: 'neutral'
    }
  };

  const filteredSentiments = Object.entries(sentiments)
    .filter(([name, value]) => 
      Object.keys(sentimentConfig).includes(name) &&
      (!hideZeros || Number(value) !== 0)
    )
    .map(([name, value]) => ({
      name,
      value: Number(value),
      ...sentimentConfig[name]
    }))
    .sort((a, b) => b.value - a.value);

  const totalIssues = filteredSentiments.reduce((sum, item) => sum + item.value, 0);
  const averageIssues = totalIssues / filteredSentiments.length || 0;

  // Performance grade calculation
  const getPerformanceGrade = () => {
    if (averageIssues === 0) return { grade: 'A+', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (averageIssues <= 2) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (averageIssues <= 4) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (averageIssues <= 6) return { grade: 'C', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (averageIssues <= 8) return { grade: 'D', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { grade: 'F', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const performanceGrade = getPerformanceGrade();

  if (filteredSentiments.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-full mb-4">
          <BiStats className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No Data Available</h3>
        <p className="text-gray-500 text-sm">Start journaling to see your trading psychology insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Performance Overview */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <BiBrain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Trading Psychology</h3>
              <p className="text-sm text-gray-400">Behavioral pattern analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full ${performanceGrade.bg} border border-gray-600`}>
              <span className={`text-sm font-bold ${performanceGrade.color}`}>
                Grade {performanceGrade.grade}
              </span>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <BiBarChartAlt2 className="h-4 w-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalIssues}</div>
            <div className="text-xs text-gray-400">Total Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{filteredSentiments.length}</div>
            <div className="text-xs text-gray-400">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{averageIssues.toFixed(1)}</div>
            <div className="text-xs text-gray-400">Avg per Category</div>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg">
        {(['week', 'month', 'all'] as const).map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              selectedTimeframe === timeframe
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </button>
        ))}
      </div>

      {/* Enhanced Sentiment Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredSentiments.map((sentiment, index) => (
            <motion.div
              key={sentiment.name}
              {...(reducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 },
                    transition: { delay: index * 0.1, duration: 0.3 },
                  })}
              className={`rounded-xl border p-4 transition-colors duration-200 ${
                reducedMotion ? '' : 'hover:scale-[1.01]'
              } ${sentiment.bgColor} border-[var(--tt-line-1)] hover:border-[var(--tt-line-2)]`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sentiment.bgColor}`}>
                    <div className={sentiment.color}>{sentiment.icon}</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">
                        {formaterCamelCase(sentiment.name)}
                      </h4>
                      {sentiment.trend === 'down' && (
                        <BiTrendingDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{sentiment.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {asChecklist ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-300">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            {...(reducedMotion
                              ? { style: { width: `${(sentiment.value / 20) * 100}%` } }
                              : {
                                  initial: { width: 0 },
                                  animate: { width: `${(sentiment.value / 20) * 100}%` },
                                  transition: { delay: index * 0.1 + 0.5, duration: 0.8 },
                                })}
                            className={`h-full rounded-full ${
                              sentiment.value <= 5 ? 'bg-green-500' :
                              sentiment.value <= 10 ? 'bg-yellow-500' :
                              sentiment.value <= 15 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <span className="text-sm font-bold text-white min-w-[2rem] text-right">
                          {sentiment.value}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-700/50"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Frequency:</span>
                      <span className="ml-2 text-white">{sentiment.value} occurrences</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Impact:</span>
                      <span className="ml-2 text-white">
                        {sentiment.value <= 5 ? 'Low' :
                         sentiment.value <= 10 ? 'Medium' :
                         sentiment.value <= 15 ? 'High' : 'Critical'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Insights Section */}
      {totalIssues > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <BiBrain className="h-4 w-4 text-blue-400" />
            <h4 className="font-semibold text-white">Key Insights</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            {averageIssues > 8 && (
              <p className="text-red-300">⚠️ High behavioral issues detected. Consider taking a trading break.</p>
            )}
            {filteredSentiments.some(s => s.name === 'revengeTrading' && s.value > 5) && (
              <p className="text-orange-300">😤 Revenge trading detected. Focus on emotional control.</p>
            )}
            {filteredSentiments.some(s => s.name === 'overtrading' && s.value > 8) && (
              <p className="text-yellow-300">📈 Overtrading pattern. Reduce position frequency.</p>
            )}
            {averageIssues <= 3 && (
              <p className="text-green-300">✅ Excellent psychological discipline. Keep it up!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
