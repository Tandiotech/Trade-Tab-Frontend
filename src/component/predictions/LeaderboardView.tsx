import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, FireIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useLeaderboard, useVisionScore } from '@/hook/usePredictionsDev';
import { LeaderboardPeriod, formatAccuracy } from '@/types/predictions';
import VisionScoreBadge from './VisionScoreBadge';

interface LeaderboardViewProps {
  className?: string;
}

const periodTabs: { value: LeaderboardPeriod; label: string; icon: React.ReactNode }[] = [
  { value: 'weekly', label: 'Weekly', icon: <ChartBarIcon className="w-4 h-4" /> },
  { value: 'monthly', label: 'Monthly', icon: <ChartBarIcon className="w-4 h-4" /> },
  { value: 'alltime', label: 'All-Time', icon: <TrophyIcon className="w-4 h-4" /> },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <TrophyIcon className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <TrophyIcon className="w-6 h-6 text-gray-400" />;
    case 3:
      return <TrophyIcon className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
    default:
      return 'bg-gray-800/50 border-gray-700';
  }
};

export default function LeaderboardView({ className = '' }: LeaderboardViewProps) {
  const [activePeriod, setActivePeriod] = useState<LeaderboardPeriod>('weekly');
  const { data: leaderboardData, isLoading, error } = useLeaderboard(activePeriod);
  const { data: userVisionScore } = useVisionScore();

  const currentUserId = userVisionScore?.user_id;

  const renderLeaderboardItem = (item: any, index: number) => {
    const isCurrentUser = item.user_id === currentUserId;
    
    return (
      <motion.div
        key={item.user_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`
          flex items-center gap-4 p-4 rounded-lg border transition-all duration-200
          ${getRankColor(item.rank)}
          ${isCurrentUser ? 'ring-2 ring-cyan-500/50' : ''}
        `}
      >
        {/* Rank */}
        <div className="flex-shrink-0 w-12 flex items-center justify-center">
          {getRankIcon(item.rank)}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className={`font-semibold truncate ${isCurrentUser ? 'text-cyan-400' : 'text-white'}`}>
              {item.username}
            </h3>
            <VisionScoreBadge score={item.vision_score} size="sm" />
            {isCurrentUser && (
              <span className="px-2 py-1 bg-cyan-600 text-white text-xs font-medium rounded-full">
                You
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-gray-400">Accuracy</div>
            <div className="font-semibold text-white">{formatAccuracy(item.accuracy)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Calls</div>
            <div className="font-semibold text-white">{item.calls}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-gray-400">
              <FireIcon className="w-4 h-4" />
              <span>Streak</span>
            </div>
            <div className="font-semibold text-white">{item.streak}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg border border-gray-700 p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p>Failed to load leaderboard</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
          <div className="text-sm text-gray-400">
            {leaderboardData?.period && (
              <span className="capitalize">{leaderboardData.period} Rankings</span>
            )}
          </div>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-700/50 p-1 rounded-lg">
          {periodTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActivePeriod(tab.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activePeriod === tab.value
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {leaderboardData?.items && leaderboardData.items.length > 0 ? (
              leaderboardData.items.map((item, index) => renderLeaderboardItem(item, index))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-400 py-12"
              >
                <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-lg mb-2">No rankings yet</p>
                <p className="text-sm">Start making predictions to appear on the leaderboard!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile
export function LeaderboardViewCompact({ className = '' }: LeaderboardViewProps) {
  const [activePeriod, setActivePeriod] = useState<LeaderboardPeriod>('weekly');
  const { data: leaderboardData, isLoading } = useLeaderboard(activePeriod);
  const { data: userVisionScore } = useVisionScore();

  const currentUserId = userVisionScore?.user_id;

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Top Traders</h3>
        
        {/* Period Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-700/50 p-1 rounded-lg">
          {periodTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActivePeriod(tab.value)}
              className={`
                flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                ${activePeriod === tab.value
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top 5 */}
        <div className="space-y-2">
          {leaderboardData?.items?.slice(0, 5).map((item, index) => {
            const isCurrentUser = item.user_id === currentUserId;
            
            return (
              <motion.div
                key={item.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                  ${getRankColor(item.rank)}
                  ${isCurrentUser ? 'ring-2 ring-cyan-500/50' : ''}
                `}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(item.rank)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate text-sm ${isCurrentUser ? 'text-cyan-400' : 'text-white'}`}>
                      {item.username}
                    </span>
                    <VisionScoreBadge score={item.vision_score} size="sm" showScore={false} />
                  </div>
                </div>
                
                <div className="text-right text-xs">
                  <div className="text-gray-400">Acc</div>
                  <div className="font-semibold text-white">{formatAccuracy(item.accuracy)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
