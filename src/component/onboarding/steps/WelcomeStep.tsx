import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingCTA from '../OnboardingCTA';
import { Sparkles } from 'lucide-react';

export default function WelcomeStep() {
  const { nextStep } = useOnboarding();

  return (
    <div className="text-center">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="mb-8"
      >
        <img
          className="h-16 md:h-20 lg:h-24 mx-auto drop-shadow-2xl"
          src="/logo_light.png"
          alt="TradeTab"
        />
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 mb-6"
      >
        Let's get your workspace ready
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
      >
        We'll walk you through connecting your trading account and show you what's possible with TradeTab.
      </motion.p>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 max-w-3xl mx-auto"
      >
        {[
          { icon: '📊', text: 'Track performance' },
          { icon: '📈', text: 'Analyze trades' },
          { icon: '🧠', text: 'Improve mindset' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <span className="text-3xl mb-2">{item.icon}</span>
            <span className="text-sm md:text-base text-gray-300">{item.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="flex justify-center"
      >
        <OnboardingCTA
          onClick={nextStep}
          label="Get started"
          icon="sparkles"
        />
      </motion.div>
    </div>
  );
}

