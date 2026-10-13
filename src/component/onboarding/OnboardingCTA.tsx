import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingCTAProps {
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary';
  icon?: 'arrow' | 'sparkles';
  disabled?: boolean;
}

export default function OnboardingCTA({ 
  onClick, 
  label, 
  variant = 'primary',
  icon = 'arrow',
  disabled = false 
}: OnboardingCTAProps) {
  const IconComponent = icon === 'sparkles' ? Sparkles : ArrowRight;

  const baseStyles = `
    group relative flex items-center justify-center gap-2
    px-6 py-3 md:px-8 md:py-4
    rounded-xl font-semibold text-base md:text-lg
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:scale-100
  `;

  const variantStyles = variant === 'primary'
    ? 'bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-teal-500/50 hover:scale-105 active:scale-95'
    : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/30';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles}`}
    >
      <span>{label}</span>
      <IconComponent className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </motion.button>
  );
}

