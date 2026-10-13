import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressBar } from '../context/ProgressBarContext';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import {
  CheckCircle2,
  Loader2,
  Server,
  Wifi,
  Database,
  LineChart,
  Zap,
  Shield,
} from 'lucide-react';

function ProgressBarAccount({
  accountIsFullySync,
  newAccountID,
  onCloseModal,
  accountIsBeenDeploying,
}) {
  const { accounts } = useMTAccounts();
  const {
    showProgressBar,
    setShowProgressBar,
    progress: contextProgress,
    progressMessage: contextMessage,
    accountIsBeenDeploying: contextDeploying,
    setProgress,
  } = useProgressBar();

  // Use context progress (smoothly animated in ProgressBarContext)
  const progress = contextProgress;
  const progressMessage = contextMessage || 'Initializing connection...';

  const [currentStep, setCurrentStep] = useState(0);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  const steps = [
    { icon: Wifi, label: 'Connecting to market...', color: 'text-blue-400' },
    { icon: Shield, label: 'Securing connection...', color: 'text-purple-400' },
    { icon: Server, label: 'Deploying account...', color: 'text-cyan-400' },
    { icon: Database, label: 'Loading trades...', color: 'text-emerald-400' },
    { icon: LineChart, label: 'Fetching historical data...', color: 'text-teal-400' },
    { icon: Zap, label: 'Finalizing setup...', color: 'text-yellow-400' },
    { icon: CheckCircle2, label: 'Account ready!', color: 'text-green-400' },
  ];

  // Update step based on progress
  useEffect(() => {
    const stepIndex = Math.min(Math.floor((progress / 100) * (steps.length - 1)), steps.length - 1);
    setCurrentStep(stepIndex);
  }, [progress]);

  // Handle completion when synced
  useEffect(() => {
    if (accountIsFullySync || progress >= 100) {
      setCurrentStep(steps.length - 1);
      setPulseAnimation(false);

      const cleanup = setTimeout(() => {
        setShowProgressBar(false);
        if (onCloseModal) onCloseModal();
      }, 2000);

      return () => clearTimeout(cleanup);
    }
  }, [accountIsFullySync, progress, setShowProgressBar, onCloseModal]);

  // Fallback progress animation only when context milestones are not set yet
  useEffect(() => {
    if (!contextDeploying && !accountIsBeenDeploying) return;
    if (contextProgress > 0) return;

    if (accountIsBeenDeploying || newAccountID) {
      let value = 0;
      const timer = setInterval(() => {
        value = Math.min(value + 0.2, 45);
        setProgress(value);
      }, 400);

      return () => clearInterval(timer);
    }
  }, [newAccountID, accountIsBeenDeploying, contextDeploying, contextProgress, setProgress]);

  if (!showProgressBar && !accountIsBeenDeploying && !contextDeploying) return null;

  const CurrentIcon = steps[currentStep]?.icon || Loader2;
  const currentStepData = steps[currentStep] || steps[0];
  const isComplete = progress >= 100 || accountIsFullySync;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className='w-full mb-6'
      >
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-slate-700/50 backdrop-blur-xl p-6 shadow-2xl'>
          {/* Animated Background Glow */}
          <motion.div
            className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0'
            animate={
              pulseAnimation
                ? {
                    opacity: [0.5, 1, 0.5],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Progress Glow Effect */}
          <motion.div
            className='absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500/20 via-emerald-500/30 to-teal-500/20'
            style={{ width: `${progress}%` }}
            animate={
              pulseAnimation
                ? {
                    opacity: [0.3, 0.6, 0.3],
                  }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className='flex flex-col gap-4 relative z-10'>
            {/* Header Info */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <motion.div
                  className='p-2.5 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 shadow-lg'
                  animate={
                    !isComplete
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }
                      : {
                          scale: [1, 1.2, 1],
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: isComplete ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <motion.div
                    animate={!isComplete ? { rotate: 360 } : { rotate: 0 }}
                    transition={{
                      duration: 2,
                      repeat: isComplete ? 0 : Infinity,
                      ease: 'linear',
                    }}
                  >
                    {isComplete ? (
                      <CheckCircle2 className={`w-6 h-6 ${currentStepData.color}`} />
                    ) : (
                      <CurrentIcon className={`w-6 h-6 ${currentStepData.color}`} />
                    )}
                  </motion.div>
                </motion.div>
                <div className='flex-1'>
                  <motion.h3
                    className='text-lg font-semibold text-white mb-1'
                    key={progressMessage}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isComplete ? 'Account Connected!' : 'Connecting Account'}
                  </motion.h3>
                  <motion.p
                    className='text-sm text-slate-300 font-medium'
                    key={`${progressMessage}-${currentStep}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    {progressMessage || currentStepData.label}
                  </motion.p>
                </div>
              </div>
              <motion.div
                className='text-right'
                animate={
                  !isComplete
                    ? {
                        scale: [1, 1.05, 1],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className='text-3xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent'>
                  {Math.round(progress)}%
                </span>
              </motion.div>
            </div>

            {/* Enhanced Progress Bar Track */}
            <div className='relative h-3.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner'>
              {/* Background pattern */}
              <div className='absolute inset-0 bg-gradient-to-r from-slate-700/50 via-slate-600/30 to-slate-700/50' />

              {/* Progress Fill */}
              <motion.div
                className='absolute top-0 left-0 h-full bg-gradient-to-r from-teal-600 via-teal-400 to-emerald-400 shadow-lg'
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  type: 'spring',
                  stiffness: 60,
                  damping: 20,
                  duration: 0.5,
                }}
              >
                {/* Animated Shimmer Effect */}
                {!isComplete && (
                  <motion.div
                    className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent'
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                )}

                {/* Glow effect at the end */}
                <motion.div
                  className='absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white/50 to-transparent blur-sm'
                  animate={
                    !isComplete
                      ? {
                          opacity: [0.3, 0.7, 0.3],
                        }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* Progress indicator dots */}
              {steps.slice(0, -1).map((_, index) => {
                const stepProgress = ((index + 1) / steps.length) * 100;
                const isActive = progress >= stepProgress;
                return (
                  <motion.div
                    key={index}
                    className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                      isActive ? 'bg-teal-400 shadow-lg shadow-teal-400/50' : 'bg-slate-600'
                    }`}
                    style={{ left: `${stepProgress}%` }}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.3, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  />
                );
              })}
            </div>

            {/* Step indicators */}
            <div className='flex items-center justify-between text-xs text-slate-400 mt-1'>
              {steps.slice(0, -1).map((step, index) => {
                const stepProgress = ((index + 1) / steps.length) * 100;
                const isActive = progress >= stepProgress;
                return (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-1 ${isActive ? 'text-teal-400' : ''}`}
                    animate={
                      isActive
                        ? {
                            opacity: [0.5, 1, 0.5],
                          }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {isActive && <div className='w-1 h-1 rounded-full bg-teal-400' />}
                    <span className='hidden sm:inline'>{step.label.split(' ')[0]}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProgressBarAccount;
