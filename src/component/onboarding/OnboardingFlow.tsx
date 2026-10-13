import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';
import WelcomeStep from './steps/WelcomeStep';
import FeaturesStep from './steps/FeaturesStep';
import PreviewStep from './steps/PreviewStep';
import ConnectStep from './steps/ConnectStep';
import OnboardingProgress from './OnboardingProgress';
import OnboardingSkipButton from './OnboardingSkipButton';

export default function OnboardingFlow() {
  const { currentStep, isOnboardingActive } = useOnboarding();

  if (!isOnboardingActive) return null;

  const stepComponents = {
    welcome: WelcomeStep,
    features: FeaturesStep,
    preview: PreviewStep,
    connect: ConnectStep,
  };

  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        {/* Floating gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Progress indicator */}
          <OnboardingProgress />

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {CurrentStepComponent && <CurrentStepComponent />}
            </motion.div>
          </AnimatePresence>

          {/* Skip button */}
          <OnboardingSkipButton />
        </div>
      </div>
    </div>
  );
}

