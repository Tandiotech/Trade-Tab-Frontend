import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion } from 'framer-motion';

const STEPS = ['welcome', 'features', 'preview', 'connect'] as const;

export default function OnboardingProgress() {
  const { currentStep, goToStep } = useOnboarding();
  const currentIndex = STEPS.indexOf(currentStep as typeof STEPS[number]);

  return (
    <div className="mb-8 md:mb-12">
      {/* Progress bar */}
      <div className="w-full max-w-md mx-auto mb-4">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full"
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center items-center gap-2 md:gap-4">
        {STEPS.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isClickable = index <= currentIndex;

          return (
            <button
              key={step}
              onClick={() => isClickable && goToStep(step)}
              disabled={!isClickable}
              className={`
                relative flex items-center justify-center
                w-8 h-8 md:w-10 md:h-10 rounded-full
                transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 scale-110 shadow-lg shadow-teal-400/50' 
                  : isCompleted
                  ? 'bg-teal-500/30 border-2 border-teal-400'
                  : 'bg-white/10 border-2 border-white/20'
                }
                ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
              `}
            >
              {isCompleted ? (
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className={`text-xs md:text-sm font-semibold ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {index + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

