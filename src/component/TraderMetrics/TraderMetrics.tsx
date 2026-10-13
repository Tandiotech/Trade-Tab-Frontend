import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BiBarChartAlt2,
  BiTrendingUp,

  BiTime,
  BiDollar,
  BiShield,
  BiStar,
  BiTrophy,
  BiBulb,
  BiError,
  BiCheckCircle,
  BiXCircle,

  BiBrain
} from 'react-icons/bi';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext.tsx';
import { http } from '../../utils/http_request.tsx';
import { determineTraderDNA } from '../../utils/DetermineDNA.js';
// import { analyzeInstitutionalTrading } from '../../services/analyzeTraderDNA.ts';
import { SeparadorDecimal } from '../../utils/SeparadorDecimal';
import TraderDNA from '../3d/TraderDNA.jsx';

interface TraderMetricsProps {
  className?: string;
  trades: any;
}

interface MetricsData {
  equity: number;
  balance: number;
  trades: number;
  wonTrades: number;
  lostTrades: number;
  wonTradesPercent: number;
  lostTradesPercent: number;
  averageWin: number;
  averageLoss: number;
  bestTrade: number;
  worstTrade: number;
  pips: number;
  averageWinPips: number;
  averageLossPips: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  expectancy: number;
  expectancyPips: number;
  cagr: number;
  dailyGain: number;
  monthlyGain: number;
  daysSinceTradingStarted: number;
  longTrades: number;
  shortTrades: number;
  longWonTradesPercent: number;
  shortWonTradesPercent: number;
  averageTradeLengthInMilliseconds: number;
  standardDeviationProfit: number;
  zScore: number;
  probability: number;
  mar: number;
  deposits: number;
  withdrawals: number;
  gain: number;
  absoluteGain: number;
}

const TraderMetrics: React.FC<TraderMetricsProps> = ({ className = '' ,
  // trades
}) => {
  const { currentAccount } = useMTAccounts();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'analysis' | 'insights'>('overview');

  useEffect(() => {
    if (currentAccount?._id) {
      fetchMetrics();
      
      // fetchTrades();
      setLoading(false);
    }
  }, [currentAccount]);

  const fetchMetrics = async () => {
    try {
      const response = await http.get(`/api/metrics/${currentAccount._id}`);
      if (response.data) {
        setMetrics(response.data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // const fetchTrades = async () => {
  //   try {
  //     const response = await http.get(`/api/trades/${currentAccount._id}`);
  //     if (response.data) {
  //       setTrades(response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching trades:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getTraderDNA = () => {
    if (!metrics) return [];
    return determineTraderDNA(metrics);
  };

  // const getInstitutionalAnalysis = () => {
  //   if (!trades.length) return null;
  //   return analyzeInstitutionalTrading(trades);
  // };

  const getPerformanceGrade = (winRate: number) => {
    if (winRate >= 80) return { grade: 'A+', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (winRate >= 70) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (winRate >= 60) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (winRate >= 50) return { grade: 'C', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { grade: 'D', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const getRiskLevel = (maxDrawdown: number) => {
    if (maxDrawdown <= 10) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (maxDrawdown <= 25) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 ${className}`}>
        <div className="text-center text-gray-400">
          <BiBarChartAlt2 className="h-12 w-12 mx-auto mb-4" />
          <p>No metrics available</p>
        </div>
      </div>
    );
  }

  const performanceGrade = getPerformanceGrade(metrics.wonTradesPercent);
  const riskLevel = getRiskLevel(metrics.maxDrawdown);
  const traderDNA = getTraderDNA();
  // const institutionalAnalysis = getInstitutionalAnalysis()||0;
  const institutionalAnalysis:any = 100;

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
     

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: BiBarChartAlt2 },
          { id: 'performance', label: 'Performance', icon: BiTrendingUp },
          { id: 'analysis', label: 'AI Analysis', icon: BiBulb },
          { id: 'insights', label: 'Insights', icon: BiStar }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-green-400 border-b-2 border-green-500 bg-green-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <BiDollar className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Total Profit</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {SeparadorDecimal(metrics?.absoluteGain?.toFixed(2))}
                </div>
                <div className="text-xs text-gray-400">
                  {metrics.gain > 0 ? '+' : ''}{metrics?.gain?.toFixed(2)}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <BiTrophy className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Win Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {metrics.wonTradesPercent?.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  {metrics.wonTrades}/{metrics.trades} trades
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <BiShield className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">Risk Level</span>
                </div>
                <div className={`text-2xl font-bold ${riskLevel.color}`}>
                  {riskLevel.level}
                </div>
                <div className="text-xs text-gray-400">
                  {metrics.maxDrawdown?.toFixed(1)}% max drawdown
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <BiTime className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Avg Duration</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatDuration(metrics?.averageTradeLengthInMilliseconds)}
                </div>
                <div className="text-xs text-gray-400">
                  per trade
                </div>
              </div>
            </div>

            {/* Trader DNA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DNA Tags */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <BiBrain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Trading DNA</h4>
                        <p className="text-xs text-gray-400">Your unique trading signature</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{traderDNA.length}</div>
                      <div className="text-xs text-gray-400">Traits</div>
                    </div>
                  </div>

                  {/* DNA Strand Visualization */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center space-x-1 mb-3">
                      {traderDNA.slice(0, 6).map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"
                          style={{
                            animationDelay: `${index * 0.2}s`,
                            animation: 'dnaPulse 2s ease-in-out infinite'
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-center text-xs text-gray-400">
                      DNA Strand Pattern
                    </div>
                  </div>

                  {/* Enhanced DNA Tags */}
                  <div className="space-y-3">
                    {traderDNA.map((dna, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15, duration: 0.4 }}
                        className="group"
                      >
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 hover:scale-105">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                          <span className="font-medium text-blue-300 group-hover:text-white transition-colors">
                            {dna}
                          </span>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-1 h-1 bg-blue-400 rounded-full" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* DNA Strength Indicator */}
                  <div className="mt-6 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">DNA Strength</span>
                      <span className="text-sm font-bold text-blue-400">
                        {Math.min(traderDNA.length * 20, 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(traderDNA.length * 20, 100)}%` }}
                        transition={{ delay: 1, duration: 1 }}
                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* CSS Animation */}
                <style jsx>{`
                  @keyframes dnaPulse {
                    0%, 100% { transform: scaleY(1); opacity: 0.7; }
                    50% { transform: scaleY(1.3); opacity: 1; }
                  }
                `}</style>
              </div>

              {/* 3D DNA Visualization */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <BiStar className="h-5 w-5 text-green-400" />
                  <h4 className="font-semibold text-white">DNA Visualization</h4>
                </div>
                <div className="h-64 rounded-lg overflow-hidden">
                  <TraderDNA />
                </div>
                <div className="mt-3 text-xs text-gray-400 text-center">
                  Interactive 3D representation of your trading DNA
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Profitability</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Profit Factor</span>
                    <span className="font-bold text-white">{metrics?.profitFactor?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Expectancy</span>
                    <span className="font-bold text-white">{SeparadorDecimal(metrics?.expectancy?.toFixed(2))}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">CAGR</span>
                    <span className="font-bold text-white">{metrics?.cagr?.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Risk Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Sharpe Ratio</span>
                    <span className="font-bold text-white">{metrics?.sharpeRatio?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Sortino Ratio</span>
                    <span className="font-bold text-white">{metrics?.sortinoRatio?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">MAR Ratio</span>
                    <span className="font-bold text-white">{metrics?.mar?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Best/Worst Trades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <BiCheckCircle className="h-5 w-5 text-green-400" />
                  <h4 className="font-semibold text-white">Best Trade</h4>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {SeparadorDecimal(metrics?.bestTrade?.toFixed(2))}
                </div>
                <div className="text-sm text-gray-400">
                  {metrics?.averageWinPips?.toFixed(1)} pips average win
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <BiXCircle className="h-5 w-5 text-red-400" />
                  <h4 className="font-semibold text-white">Worst Trade</h4>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {SeparadorDecimal(metrics?.worstTrade?.toFixed(2))}
                </div>
                <div className="text-sm text-gray-400">
                  {metrics?.averageLossPips?.toFixed(1)} pips average loss
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* AI Analysis */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-4">
                <BiBulb className="h-6 w-6 text-purple-400" />
                <h4 className="text-lg font-semibold text-white">AI Trading Analysis</h4>
              </div>
              
              {institutionalAnalysis && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Institutional Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          style={{ width: `${institutionalAnalysis.institutionalScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-white">{institutionalAnalysis.institutionalScore}/100</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-white">{institutionalAnalysis?.summary?.metrics?.highVolumeTrades}</div>
                      <div className="text-sm text-gray-400">High Volume Trades</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-white">{institutionalAnalysis?.summary?.metrics?.differentMarkets}</div>
                      <div className="text-sm text-gray-400">Markets Traded</div>
                    </div>
                  </div>
                  
                  {institutionalAnalysis.isEligibleForCPA && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <BiStar className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-medium">Eligible for CPA Partnership</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trading Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Directional Bias</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Long Trades</span>
                    <div className="text-right">
                      <div className="font-bold text-white">{metrics?.longTrades}</div>
                      <div className="text-sm text-gray-400">{metrics?.longWonTradesPercent?.toFixed(1)}% win rate</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Short Trades</span>
                    <div className="text-right">
                      <div className="font-bold text-white">{metrics?.shortTrades}</div>
                      <div className="text-sm text-gray-400">{metrics?.shortWonTradesPercent?.toFixed(1)}% win rate</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Statistical Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Z-Score</span>
                    <span className="font-bold text-white">{metrics?.zScore?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Probability</span>
                    <span className="font-bold text-white">{(metrics?.probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Volatility</span>
                    <span className="font-bold text-white">{SeparadorDecimal(metrics?.standardDeviationProfit?.toFixed(2))}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* AI Insights */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BiStar className="h-6 w-6 text-yellow-400" />
                <h4 className="text-lg font-semibold text-white">AI Insights</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.profitFactor > 2 && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BiCheckCircle className="h-5 w-5 text-green-400" />
                      <span className="font-medium text-white">Strong Profitability</span>
                    </div>
                    <p className="text-sm text-gray-300">Your profit factor of {metrics?.profitFactor?.toFixed(2)} indicates excellent risk management.</p>
                  </div>
                )}

                {metrics.wonTradesPercent > 70 && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BiTrophy className="h-5 w-5 text-blue-400" />
                      <span className="font-medium text-white">High Win Rate</span>
                    </div>
                    <p className="text-sm text-gray-300">Your {metrics?.wonTradesPercent?.toFixed(1)}% win rate shows consistent performance.</p>
                  </div>
                )}

                {metrics.maxDrawdown > 25 && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BiError className="h-5 w-5 text-red-400" />
                      <span className="font-medium text-white">High Risk</span>
                    </div>
                    <p className="text-sm text-gray-300">Consider reducing position sizes to lower your {metrics.maxDrawdown.toFixed(1)}% max drawdown.</p>
                  </div>
                )}

                {metrics.sharpeRatio > 1 && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BiStar className="h-5 w-5 text-purple-400" />
                      <span className="font-medium text-white">Good Risk-Adjusted Returns</span>
                    </div>
                    <p className="text-sm text-gray-300">Your Sharpe ratio of {metrics.sharpeRatio.toFixed(2)} shows efficient risk management.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-3">
                <BiBulb className="h-5 w-5 text-yellow-400" />
                <h4 className="font-semibold text-white">Recommendations</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                {metrics.wonTradesPercent < 50 && (
                  <p>• Focus on improving your entry timing and risk management</p>
                )}
                {metrics.maxDrawdown > 20 && (
                  <p>• Consider reducing position sizes to manage risk better</p>
                )}
                {metrics.profitFactor < 1.5 && (
                  <p>• Work on your risk-reward ratio to improve profitability</p>
                )}
                {metrics.trades < 100 && (
                  <p>• More trading data needed for accurate analysis</p>
                )}
                {metrics.trades > 1000 && metrics.profitFactor > 2 && (
                  <p>• Excellent performance! Consider scaling up your strategy</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TraderMetrics; 