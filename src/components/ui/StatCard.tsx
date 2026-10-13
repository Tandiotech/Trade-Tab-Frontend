import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
  pulse?: boolean;
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  variant = 'secondary',
  size = 'md',
  className = '',
  glow = false,
  pulse = false,
  children,
}) => {
  const [previousValue, setPreviousValue] = useState(value);
  const [isValueChanging, setIsValueChanging] = useState(false);

  // Track value changes for tick animation
  useEffect(() => {
    if (previousValue !== value) {
      setIsValueChanging(true);
      setPreviousValue(value);
      
      // Reset tick animation after a short delay
      const timer = setTimeout(() => {
        setIsValueChanging(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700',
          title: 'text-slate-300',
          value: 'text-white',
          subtitle: 'text-slate-400',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        };
      case 'success':
        return {
          container: 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700',
          title: 'text-slate-300',
          value: 'text-green-400',
          subtitle: 'text-slate-400',
          glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
        };
      case 'warning':
        return {
          container: 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700',
          title: 'text-slate-300',
          value: 'text-yellow-400',
          subtitle: 'text-slate-400',
          glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
        };
      case 'error':
        return {
          container: 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700',
          title: 'text-slate-300',
          value: 'text-red-400',
          subtitle: 'text-slate-400',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        };
      default:
        return {
          container: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50',
          title: 'text-slate-400',
          value: 'text-slate-200',
          subtitle: 'text-slate-500',
          glow: '',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          title: 'text-xs',
          value: 'text-lg font-semibold',
          subtitle: 'text-xs',
        };
      case 'lg':
        return {
          container: 'p-6',
          title: 'text-sm',
          value: 'text-3xl font-bold',
          subtitle: 'text-sm',
        };
      default:
        return {
          container: 'p-4',
          title: 'text-sm',
          value: 'text-xl font-semibold',
          subtitle: 'text-sm',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const containerClasses = `
    relative rounded-xl border backdrop-blur-sm
    ${variantStyles.container}
    ${sizeStyles.container}
    ${glow ? variantStyles.glow : ''}
    ${className}
  `.trim();

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {pulse && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-green-500/20"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.01, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      <div className="relative z-10">
        <div className={`${variantStyles.title} ${sizeStyles.title} font-medium mb-1`}>
          {title}
        </div>
        <motion.div 
          className={`${variantStyles.value} ${sizeStyles.value} mb-1`}
          animate={isValueChanging ? {
            scale: [1, 1.05, 1],
            color: ['inherit', '#22C55E', 'inherit']
          } : {}}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        >
          {value}
        </motion.div>
        {subtitle && (
          <div className={`${variantStyles.subtitle} ${sizeStyles.subtitle}`}>
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
};

export default StatCard;
