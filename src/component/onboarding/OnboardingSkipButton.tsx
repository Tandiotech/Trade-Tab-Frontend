import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';
import { X } from 'lucide-react';

export default function OnboardingSkipButton() {
  const { skipOnboarding } = useOnboarding();

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      onClick={skipOnboarding}
      className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
    >
      <X className="w-4 h-4" />
      <span className="hidden sm:inline text-sm font-medium">Skip</span>
    </motion.button>
  );
}

