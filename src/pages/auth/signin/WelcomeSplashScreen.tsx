import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaBrain, FaUsers, FaBookOpen } from 'react-icons/fa6';
import { BiCheck } from 'react-icons/bi';

interface Sponsor {
  id: string | number;
  name?: string;
  logoUrl: string;
}

export type WelcomeSplashVariant = 'full' | 'quick';

interface WelcomeSplashScreenProps {
  variant?: WelcomeSplashVariant;
  autoDismissTime?: number;
  sponsors?: Sponsor[];
  /** Called once when the splash finishes (timer) or user skips. Prefer this over onClose. */
  onComplete?: () => void;
  /** @deprecated use onComplete */
  onClose?: () => void;
  /** Shown in quick variant, e.g. first name */
  welcomeDisplayName?: string;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export default function WelcomeSplashScreen({
  variant = 'full',
  autoDismissTime,
  onComplete,
  onClose,
  welcomeDisplayName,
}: WelcomeSplashScreenProps) {
  const reducedMotion = usePrefersReducedMotion();
  const defaultDismiss = variant === 'quick' ? 1100 : 4000;
  const dismissMs =
    autoDismissTime !== undefined ? autoDismissTime : defaultDismiss;
  const effectiveDismissMs =
    variant === 'quick' && reducedMotion ? Math.min(dismissMs, 550) : dismissMs;

  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const finishedRef = useRef(false);

  const runComplete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsVisible(false);
    (onComplete ?? onClose)?.();
  }, [onComplete, onClose]);

  useEffect(() => {
    if (effectiveDismissMs <= 0) return;
    const timer = setTimeout(runComplete, effectiveDismissMs);
    return () => clearTimeout(timer);
  }, [effectiveDismissMs, runComplete]);

  useEffect(() => {
    if (variant !== 'full') return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 800);
    return () => clearInterval(interval);
  }, [variant]);

  if (!isVisible) return null;

  if (variant === 'quick') {
    const t = reducedMotion ? { duration: 0.12 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };
    const line = welcomeDisplayName?.trim()
      ? `You're in, ${welcomeDisplayName.trim()}`
      : "You're in";

    return (
      <AnimatePresence>
        <motion.div
          role='status'
          aria-busy='true'
          aria-label='Signing you in'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.22 }}
          className='fixed inset-0 z-[99999] overflow-hidden'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black'>
            {!reducedMotion && (
              <>
                <motion.div
                  animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                  className='absolute top-24 left-[12%] h-40 w-40 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/20 blur-3xl'
                />
                <motion.div
                  animate={{ x: [0, -36, 0], y: [0, 28, 0] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                  className='absolute bottom-24 right-[10%] h-48 w-48 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/15 blur-3xl'
                />
              </>
            )}
          </div>

          <div className='relative z-10 flex min-h-screen flex-col items-center justify-center px-6'>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={t}
              className='flex max-w-md flex-col items-center text-center'
            >
              <div className='relative mb-6'>
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={reducedMotion ? { duration: 0.1 } : { duration: 0.4, delay: 0.05, type: 'spring', bounce: 0.25 }}
                  className='mx-auto h-14 drop-shadow-2xl md:h-16'
                  src='/logo-lockup.png'
                  alt='TradeTab'
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={
                    reducedMotion
                      ? { duration: 0.1 }
                      : { duration: 0.35, delay: 0.18, type: 'spring', bounce: 0.35 }
                  }
                  className='absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400'
                >
                  <BiCheck className='text-sm text-white' />
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reducedMotion ? { duration: 0.1 } : { duration: 0.3, delay: 0.12 }}
                className='mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl'
              >
                {line}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={reducedMotion ? { duration: 0.1 } : { duration: 0.28, delay: 0.2 }}
                className='mb-8 text-sm text-slate-400 md:text-base'
              >
                Opening your dashboard…
              </motion.p>

              <div className='h-1 w-56 overflow-hidden rounded-full bg-white/10 md:w-72'>
                <motion.div
                  className='h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400'
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: reducedMotion ? 0.2 : Math.max(0.55, effectiveDismissMs / 1000 - 0.35),
                    delay: reducedMotion ? 0 : 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            </motion.div>

            <motion.button
              type='button'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: reducedMotion ? 0 : 0.15 }}
              onClick={runComplete}
              className='absolute bottom-6 right-6 z-20 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white'
            >
              Skip
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const features = [
    {
      icon: FaChartLine,
      title: 'Advanced Analytics',
      description: 'Deep performance insights',
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      icon: FaBrain,
      title: 'Mindset Mastery',
      description: 'Psychological training and mindset development',
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
    },
    {
      icon: FaUsers,
      title: 'Community Wisdom',
      description: 'Learn from peers and get feedback',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    {
      icon: FaBookOpen,
      title: 'Smart Journaling',
      description: 'AI-powered insights and journaling',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className='fixed inset-0 z-[99999] overflow-hidden'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black'>
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='absolute left-20 top-20 h-32 w-32 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 blur-3xl'
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='absolute bottom-20 right-20 h-40 w-40 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl'
          />
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -80, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='absolute left-1/3 top-1/2 h-24 w-24 rounded-full bg-gradient-to-r from-orange-400/20 to-yellow-400/20 blur-2xl'
          />
        </div>

        <div className='relative z-10 flex min-h-screen items-center justify-center p-4'>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='mb-8'
            >
              <h1 className='mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-4xl font-black text-transparent md:text-6xl lg:text-7xl'>
                Welcome to
              </h1>
              <div className='relative'>
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5, type: 'spring', bounce: 0.3 }}
                  className='mx-auto h-16 drop-shadow-2xl md:h-20 lg:h-24'
                  src='/logo-lockup.png'
                  alt='TradeTab'
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2, type: 'spring', bounce: 0.4 }}
                  className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400'
                >
                  <BiCheck className='text-sm text-white' />
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className='mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl lg:text-2xl'
            >
              Your journey to trading excellence begins now
            </motion.p>

            <div className='mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6'>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className={`group relative cursor-pointer`}
                >
                  <div
                    className={`
                    relative h-full rounded-2xl border border-white/10 p-4 backdrop-blur-sm transition-all duration-300 md:p-6
                    ${feature.bgColor}
                    group-hover:scale-105 group-hover:border-white/20
                    ${currentStep === index ? 'scale-105 ring-2 ring-white/30' : ''}
                  `}
                  >
                    <div className='flex flex-col items-center text-center'>
                      <motion.div
                        animate={currentStep === index ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.6 }}
                        className={`mb-3 rounded-xl bg-gradient-to-r p-3 ${feature.color}`}
                      >
                        <feature.icon className='text-xl text-white md:text-2xl' />
                      </motion.div>
                      <h3 className='mb-1 text-sm font-bold text-white md:text-base'>
                        {feature.title}
                      </h3>
                      <p className='text-xs text-gray-400 md:text-sm'>{feature.description}</p>
                    </div>

                    <div
                      className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} 
                      opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-10
                    `}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className='mb-8'
            >
              <div className='mx-auto h-1 w-64 overflow-hidden rounded-full bg-white/10 md:w-80'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, delay: 2 }}
                  className='h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400'
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.5 }}
              className='text-sm text-gray-400 md:text-base'
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Preparing your dashboard...
              </motion.span>
            </motion.div>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3 }}
          type='button'
          onClick={runComplete}
          className='absolute bottom-6 right-6 z-20 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white'
        >
          Skip
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
