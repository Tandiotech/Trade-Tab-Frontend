import React from 'react';
import { getVisionScoreTier, VISION_SCORE_TIERS, VisionScoreTier } from '@/types/predictions';
import { motion } from 'framer-motion';

interface VisionScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const tierIcons: Record<VisionScoreTier, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  diamond: '💎',
};

export default function VisionScoreBadge({ 
  score, 
  size = 'md', 
  showScore = true, 
  className = '' 
}: VisionScoreBadgeProps) {
  const tier = getVisionScoreTier(score);
  const tierInfo = VISION_SCORE_TIERS[tier];
  const icon = tierIcons[tier];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${tierInfo.color} ${tierInfo.bgColor}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span className={iconSizes[size]}>{icon}</span>
      {showScore && (
        <span className="font-semibold">
          {score.toLocaleString()}
        </span>
      )}
      <span className="capitalize">{tier}</span>
    </motion.div>
  );
}

// Compact version for tight spaces
export function VisionScoreBadgeCompact({ 
  score, 
  className = '' 
}: { 
  score: number; 
  className?: string; 
}) {
  const tier = getVisionScoreTier(score);
  const tierInfo = VISION_SCORE_TIERS[tier];
  const icon = tierIcons[tier];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium
        ${tierInfo.color} ${tierInfo.bgColor}
        ${className}
      `}
      title={`Vision Score: ${score} (${tier})`}
    >
      <span className="w-3 h-3">{icon}</span>
      <span>{score}</span>
    </motion.div>
  );
}

