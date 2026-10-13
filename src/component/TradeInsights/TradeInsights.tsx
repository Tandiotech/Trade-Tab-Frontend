import React, { useMemo, memo, useCallback } from 'react';
import { ITrade } from '@/pages/metrics/interface';

interface TradeInsightsProps {
  trades: ITrade[];
  loading?: boolean;
  className?: string;
}

interface TradingPattern {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface RiskAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  factors: {
    factor: string;
    score: number;
    description: string;
  }[];
}

interface PerformanceInsight {
  category: string;
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

const TradeInsights: React.FC<TradeInsightsProps> = memo(({ 
  trades, 
  loading = false, 
  className = '' 
}) => {
  const insights = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        patterns: [],
        riskAnalysis: null,
        performanceInsights: [],
        overallScore: 0
      };
    }

    const validTrades = trades.filter(trade => 
      trade && 
      typeof trade.profit === 'number' && 
      !isNaN(trade.profit)
    );

    if (validTrades.length === 0) {
      return {
        patterns: [],
        riskAnalysis: null,
        performanceInsights: [],
        overallScore: 0
      };
    }

    // Calculate basic metrics
    const totalTrades = validTrades.length;
    const winningTrades = validTrades.filter(trade => trade.profit > 0);
    const losingTrades = validTrades.filter(trade => trade.profit < 0);
    const winRate = (winningTrades.length / totalTrades) * 100;
    
    const totalProfit = winningTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0));
    const netProfit = totalProfit - totalLoss;
    
    const averageWin = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

    // Calculate durations
    const durations = validTrades
      .filter(trade => trade.openTime && trade.closeTime)
      .map(trade => {
        try {
          const open = new Date(trade.openTime);
          const close = new Date(trade.closeTime);
          return (close.getTime() - open.getTime()) / (1000 * 60 * 60); // hours
        } catch {
          return 0;
        }
      })
      .filter(d => d > 0);

    const averageDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

    // Calculate volumes
    const volumes = validTrades.map(trade => trade.volume || 0).filter(v => v > 0);
    const averageVolume = volumes.length > 0 ? volumes.reduce((a, b) => a + b, 0) / volumes.length : 0;

    // Symbol analysis
    const symbolCounts = validTrades.reduce((acc, trade) => {
      const symbol = trade.symbol || 'Unknown';
      acc[symbol] = (acc[symbol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const symbolProfits = validTrades.reduce((acc, trade) => {
      const symbol = trade.symbol || 'Unknown';
      acc[symbol] = (acc[symbol] || 0) + trade.profit;
      return acc;
    }, {} as Record<string, number>);

    const mostTradedSymbol = Object.entries(symbolCounts).reduce((a, b) => 
      symbolCounts[a[0]] > symbolCounts[b[0]] ? a : b, ['', 0]
    )[0];

    const mostProfitableSymbol = Object.entries(symbolProfits).reduce((a, b) => 
      symbolProfits[a[0]] > symbolProfits[b[0]] ? a : b, ['', -Infinity]
    )[0];

    // Time analysis
    const hourCounts = validTrades.reduce((acc, trade) => {
      if (trade.openTime) {
        try {
          const hour = new Date(trade.openTime).getHours();
          acc[hour] = (acc[hour] || 0) + 1;
        } catch {}
      }
      return acc;
    }, {} as Record<number, number>);

    const bestTradingHour = Object.entries(hourCounts).reduce((a, b) => 
      hourCounts[parseInt(a[0])] > hourCounts[parseInt(b[0])] ? a : b, ['0', 0]
    )[0];

    // Generate trading patterns
    const patterns: TradingPattern[] = [];

    // Win rate pattern
    if (winRate >= 70) {
      patterns.push({
        type: 'positive',
        title: 'Excellent Win Rate',
        description: `Your win rate of ${winRate.toFixed(1)}% is exceptional and shows strong trading discipline.`,
        impact: 'high',
        recommendation: 'Continue your current strategy while maintaining risk management.'
      });
    } else if (winRate >= 50) {
      patterns.push({
        type: 'neutral',
        title: 'Moderate Win Rate',
        description: `Your win rate of ${winRate.toFixed(1)}% is average. Focus on improving trade selection.`,
        impact: 'medium',
        recommendation: 'Analyze your losing trades to identify common patterns and improve entry criteria.'
      });
    } else {
      patterns.push({
        type: 'negative',
        title: 'Low Win Rate',
        description: `Your win rate of ${winRate.toFixed(1)}% needs improvement.`,
        impact: 'high',
        recommendation: 'Review your trading strategy, improve risk management, and consider reducing position sizes.'
      });
    }

    // Profit factor pattern
    if (profitFactor >= 2.0) {
      patterns.push({
        type: 'positive',
        title: 'Strong Profit Factor',
        description: `Your profit factor of ${profitFactor.toFixed(2)} indicates excellent risk-reward management.`,
        impact: 'high',
        recommendation: 'Your risk management is working well. Consider scaling up gradually.'
      });
    } else if (profitFactor >= 1.2) {
      patterns.push({
        type: 'neutral',
        title: 'Moderate Profit Factor',
        description: `Your profit factor of ${profitFactor.toFixed(2)} shows room for improvement.`,
        impact: 'medium',
        recommendation: 'Focus on improving your risk-reward ratio by cutting losses faster and letting profits run.'
      });
    } else {
      patterns.push({
        type: 'negative',
        title: 'Poor Profit Factor',
        description: `Your profit factor of ${profitFactor.toFixed(2)} indicates significant risk management issues.`,
        impact: 'high',
        recommendation: 'Immediately review your stop-loss and take-profit strategies. Consider reducing position sizes.'
      });
    }

    // Volume concentration pattern
    const symbolConcentration = (symbolCounts[mostTradedSymbol] / totalTrades) * 100;
    if (symbolConcentration > 50) {
      patterns.push({
        type: 'negative',
        title: 'High Symbol Concentration',
        description: `${symbolConcentration.toFixed(1)}% of your trades are in ${mostTradedSymbol}.`,
        impact: 'medium',
        recommendation: 'Consider diversifying across more currency pairs to reduce concentration risk.'
      });
    } else if (symbolConcentration > 30) {
      patterns.push({
        type: 'neutral',
        title: 'Moderate Symbol Concentration',
        description: `You trade ${mostTradedSymbol} frequently (${symbolConcentration.toFixed(1)}% of trades).`,
        impact: 'low',
        recommendation: 'This is acceptable but consider adding more diversity to your trading portfolio.'
      });
    }

    // Duration pattern
    if (averageDuration < 1) {
      patterns.push({
        type: 'neutral',
        title: 'Scalping Style',
        description: `Average trade duration of ${averageDuration.toFixed(1)} hours indicates scalping approach.`,
        impact: 'medium',
        recommendation: 'Ensure you have tight spreads and low latency for scalping success.'
      });
    } else if (averageDuration > 24) {
      patterns.push({
        type: 'neutral',
        title: 'Swing Trading Style',
        description: `Average trade duration of ${(averageDuration / 24).toFixed(1)} days indicates swing trading.`,
        impact: 'medium',
        recommendation: 'Focus on fundamental analysis and longer-term market trends.'
      });
    }

    // Risk Analysis
    let riskScore = 0;
    const riskFactors = [];

    // Win rate risk
    if (winRate < 40) {
      riskScore += 30;
      riskFactors.push({
        factor: 'Low Win Rate',
        score: 30,
        description: 'Win rate below 40% indicates high risk'
      });
    } else if (winRate < 50) {
      riskScore += 15;
      riskFactors.push({
        factor: 'Below Average Win Rate',
        score: 15,
        description: 'Win rate below 50% increases risk'
      });
    }

    // Profit factor risk
    if (profitFactor < 1.0) {
      riskScore += 25;
      riskFactors.push({
        factor: 'Negative Profit Factor',
        score: 25,
        description: 'Losing more than winning indicates high risk'
      });
    } else if (profitFactor < 1.2) {
      riskScore += 10;
      riskFactors.push({
        factor: 'Low Profit Factor',
        score: 10,
        description: 'Profit factor below 1.2 indicates moderate risk'
      });
    }

    // Volume risk
    if (averageVolume > 1.0) {
      riskScore += 20;
      riskFactors.push({
        factor: 'High Volume Trading',
        score: 20,
        description: 'Large position sizes increase risk'
      });
    }

    // Concentration risk
    if (symbolConcentration > 60) {
      riskScore += 15;
      riskFactors.push({
        factor: 'High Symbol Concentration',
        score: 15,
        description: 'Over-concentration in one symbol increases risk'
      });
    }

    const riskAnalysis: RiskAnalysis = {
      riskLevel: riskScore >= 50 ? 'high' : riskScore >= 25 ? 'medium' : 'low',
      riskScore: Math.min(riskScore, 100),
      factors: riskFactors
    };

    // Performance Insights
    const performanceInsights: PerformanceInsight[] = [
      {
        category: 'Trading Performance',
        metric: 'Net Profit',
        value: `$${netProfit.toFixed(2)}`,
        trend: netProfit > 0 ? 'up' : 'down',
        recommendation: netProfit > 0 
          ? 'Continue your profitable strategy while maintaining discipline.'
          : 'Focus on improving trade selection and risk management.'
      },
      {
        category: 'Risk Management',
        metric: 'Average Win/Loss Ratio',
        value: `${(averageWin / Math.max(averageLoss, 1)).toFixed(2)}:1`,
        trend: (averageWin / Math.max(averageLoss, 1)) > 1.5 ? 'up' : 'down',
        recommendation: (averageWin / Math.max(averageLoss, 1)) > 1.5
          ? 'Good risk-reward ratio. Consider scaling up gradually.'
          : 'Improve your risk-reward ratio by cutting losses faster.'
      },
      {
        category: 'Trading Style',
        metric: 'Average Duration',
        value: `${averageDuration.toFixed(1)} hours`,
        trend: 'stable',
        recommendation: averageDuration < 4 
          ? 'Day trading style. Ensure you have good execution and tight spreads.'
          : 'Swing trading style. Focus on fundamental analysis and longer trends.'
      },
      {
        category: 'Portfolio',
        metric: 'Most Profitable Symbol',
        value: mostProfitableSymbol || 'N/A',
        trend: 'up',
        recommendation: mostProfitableSymbol 
          ? `Consider allocating more trades to ${mostProfitableSymbol} if conditions remain favorable.`
          : 'Diversify your trading across multiple symbols.'
      }
    ];

    // Overall Score (0-100)
    let overallScore = 0;
    if (winRate >= 60) overallScore += 30;
    else if (winRate >= 50) overallScore += 20;
    else if (winRate >= 40) overallScore += 10;

    if (profitFactor >= 2.0) overallScore += 30;
    else if (profitFactor >= 1.5) overallScore += 25;
    else if (profitFactor >= 1.2) overallScore += 15;
    else if (profitFactor >= 1.0) overallScore += 5;

    if (netProfit > 0) overallScore += 20;
    else if (netProfit > -100) overallScore += 10;

    if (riskScore < 25) overallScore += 20;
    else if (riskScore < 50) overallScore += 10;

    return {
      patterns,
      riskAnalysis,
      performanceInsights,
      overallScore: Math.min(overallScore, 100)
    };
  }, [trades]);

  const getRiskColor = useMemo(() => (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'high': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  }, []);

  const getPatternIcon = useMemo(() => (type: string) => {
    switch (type) {
      case 'positive': return '✅';
      case 'negative': return '⚠️';
      case 'neutral': return 'ℹ️';
      default: return '📊';
    }
  }, []);

  const getTrendIcon = useMemo(() => (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  }, []);

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!insights.patterns.length && !insights.riskAnalysis && !insights.performanceInsights.length) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Trading Insights</h3>
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No insights available</div>
            <p className="text-gray-500 text-sm">Start trading to get personalized insights and recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Trading Insights</h3>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-slate-400">Overall Score</div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              insights.overallScore >= 80 ? 'bg-green-900/30 text-green-400' :
              insights.overallScore >= 60 ? 'bg-yellow-900/30 text-yellow-400' :
              insights.overallScore >= 40 ? 'bg-orange-900/30 text-orange-400' :
              'bg-red-900/30 text-red-400'
            }`}>
              {insights.overallScore}/100
            </div>
          </div>
        </div>

        {/* Trading Patterns */}
        {insights.patterns.length > 0 && (
          <div className="mb-8">
            <h4 className="text-md font-semibold text-white mb-4">Trading Patterns</h4>
            <div className="space-y-3">
              {insights.patterns.map((pattern, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    pattern.type === 'positive' ? 'border-green-500/30 bg-green-900/10' :
                    pattern.type === 'negative' ? 'border-red-500/30 bg-red-900/10' :
                    'border-blue-500/30 bg-blue-900/10'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getPatternIcon(pattern.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="font-semibold text-white">{pattern.title}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          pattern.impact === 'high' ? 'bg-red-900/30 text-red-400' :
                          pattern.impact === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-green-900/30 text-green-400'
                        }`}>
                          {pattern.impact} impact
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{pattern.description}</p>
                      <p className="text-blue-400 text-sm font-medium">💡 {pattern.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Analysis */}
        {insights.riskAnalysis && (
          <div className="mb-8">
            <h4 className="text-md font-semibold text-white mb-4">Risk Analysis</h4>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {insights.riskAnalysis.riskLevel === 'low' ? '🟢' :
                     insights.riskAnalysis.riskLevel === 'medium' ? '🟡' : '🔴'}
                  </span>
                  <span className="text-white font-semibold">
                    {insights.riskAnalysis.riskLevel.toUpperCase()} Risk
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(insights.riskAnalysis.riskLevel)}`}>
                  Risk Score: {insights.riskAnalysis.riskScore}/100
                </div>
              </div>
              
              {insights.riskAnalysis.factors.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-slate-400 mb-2">Risk Factors:</div>
                  {insights.riskAnalysis.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{factor.factor}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-400">+{factor.score}</span>
                        <span className="text-slate-400 text-xs">({factor.description})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        {insights.performanceInsights.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-white mb-4">Performance Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.performanceInsights.map((insight, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">{insight.category}</span>
                    <span className="text-2xl">{getTrendIcon(insight.trend)}</span>
                  </div>
                  <div className="text-white font-semibold mb-1">{insight.metric}</div>
                  <div className="text-lg font-bold text-blue-400 mb-2">{insight.value}</div>
                  <div className="text-xs text-slate-300">💡 {insight.recommendation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

TradeInsights.displayName = 'TradeInsights';

export default TradeInsights;
