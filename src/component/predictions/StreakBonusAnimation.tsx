import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FireIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/solid';

interface StreakBonusAnimationProps {
  streak: number;
  isVisible: boolean;
  onComplete?: () => void;
}

const getStreakMessage = (streak: number) => {
  if (streak >= 10) return { message: 'LEGENDARY STREAK!', icon: TrophyIcon, color: 'text-yellow-400' };
  if (streak >= 7) return { message: 'AMAZING STREAK!', icon: StarIcon, color: 'text-purple-400' };
  if (streak >= 5) return { message: 'GREAT STREAK!', icon: FireIcon, color: 'text-orange-400' };
  if (streak >= 3) return { message: 'GOOD STREAK!', icon: FireIcon, color: 'text-red-400' };
  return { message: 'STREAK!', icon: FireIcon, color: 'text-red-400' };
};

export default function StreakBonusAnimation({ streak, isVisible, onComplete }: StreakBonusAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const streakInfo = getStreakMessage(streak);
  const IconComponent = streakInfo.icon;

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: -10,
                    rotate: 0,
                    scale: 1
                  }}
                  animate={{ 
                    y: window.innerHeight + 10,
                    rotate: 360,
                    scale: 0
                  }}
                  transition={{ 
                    duration: 3,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                  style={{
                    left: Math.random() * window.innerWidth,
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Streak Message */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              duration: 0.6
            }}
            className="bg-gray-900/95 backdrop-blur-md border-2 border-cyan-500 rounded-2xl p-8 text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <IconComponent className={`w-16 h-16 mx-auto ${streakInfo.color}`} />
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-3xl font-bold ${streakInfo.color} mb-2`}
            >
              {streakInfo.message}
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white text-lg"
            >
              {streak} predictions in a row!
            </motion.p>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              className="mt-4 text-cyan-400 font-semibold"
            >
              +{Math.min(streak * 10, 100)} Vision Score Bonus!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compact version for smaller notifications
export function StreakBonusCompact({ streak, isVisible, onComplete }: StreakBonusAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const streakInfo = getStreakMessage(streak);
  const IconComponent = streakInfo.icon;

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 bg-gray-900/95 backdrop-blur-md border border-cyan-500 rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <IconComponent className={`w-6 h-6 ${streakInfo.color}`} />
            </motion.div>
            <div>
              <div className={`font-bold ${streakInfo.color}`}>
                {streak} Streak!
              </div>
              <div className="text-xs text-gray-400">
                +{Math.min(streak * 10, 100)} Vision Score
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
