import { motion } from 'framer-motion';
import { Clock, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  gradient: string;
  borderColor: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

interface ResolutionStatsProps {
  pendingIssues?: number;
  averageResponseTime?: string;
  resolvedThisMonth?: number;
  totalResolved?: number;
  className?: string;
}

const ResolutionStats: React.FC<ResolutionStatsProps> = ({
  pendingIssues = null,
  averageResponseTime = null,
  resolvedThisMonth = null,
  totalResolved = null,
  className = '',
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    pending: 0,
    resolved: 0,
  });

  // Calculate or use default values
  const stats: StatItem[] = [
    // {
    //   id: 'pending',
    //   label: 'Issues Pending',
    //   value: pendingIssues ?? 0,
    //   icon: AlertCircle,
    //   iconColor: 'text-orange-400',
    //   gradient: 'from-orange-500/20 to-red-500/20',
    //   borderColor: 'border-orange-500/30',
    //   trend: 'neutral',
    //   subtitle: 'Awaiting resolution',
    // },
    {
      id: 'response',
      label: 'Avg Response Time',
      value: averageResponseTime ?? '24h',
      icon: Clock,
      iconColor: 'text-blue-400',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      trend: 'down',
      subtitle: 'Faster than industry avg',
    },
    ...(resolvedThisMonth !== null
      ? [
          {
            id: 'resolved-month',
            label: 'Resolved This Month',
            value: resolvedThisMonth,
            icon: CheckCircle2,
            iconColor: 'text-green-400',
            gradient: 'from-green-500/20 to-emerald-500/20',
            borderColor: 'border-green-500/30',
            trend: 'up' as const,
            subtitle: 'Successfully resolved',
          },
        ]
      : []),
    ...(totalResolved !== null
      ? [
          {
            id: 'total-resolved',
            label: 'Total Resolved',
            value: totalResolved,
            icon: TrendingUp,
            iconColor: 'text-purple-400',
            gradient: 'from-purple-500/20 to-pink-500/20',
            borderColor: 'border-purple-500/30',
            trend: 'up' as const,
            subtitle: 'All time',
          },
        ]
      : []),
  ];

  // Animate numbers if they're numeric
  useEffect(() => {
    if (pendingIssues !== null) {
      const duration = 1500;
      const steps = 30;
      const increment = (pendingIssues ?? 0) / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= (pendingIssues ?? 0)) {
          setAnimatedValues((prev) => ({ ...prev, pending: pendingIssues ?? 0 }));
          clearInterval(interval);
        } else {
          setAnimatedValues((prev) => ({ ...prev, pending: Math.floor(current) }));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }
  }, [pendingIssues]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
      }
      return value.toString();
    }
    return value;
  };

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const displayValue =
          stat.id === 'pending' && pendingIssues !== null
            ? animatedValues.pending
            : stat.value;

        return (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border ${stat.borderColor} p-4 sm:p-5 transition-all duration-300 hover:shadow-lg`}
          >
            {/* Animated background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className='relative z-10'>
              <div className='flex items-start justify-between gap-3 mb-2'>
                <div className='flex items-center gap-3 flex-1'>
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs sm:text-sm font-medium text-slate-300 group-hover:text-slate-200 transition-colors'>
                      {stat.label}
                    </p>
                    {stat.subtitle && (
                      <p className='text-xs text-slate-500 mt-0.5'>{stat.subtitle}</p>
                    )}
                  </div>
                </div>
                {stat.trend && stat.trend !== 'neutral' && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                      stat.trend === 'up'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <TrendingUp
                      className={`w-3 h-3 ${
                        stat.trend === 'down' ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                )}
              </div>

              <motion.div
                key={displayValue}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`text-2xl sm:text-3xl font-bold ${stat.iconColor} mb-1`}
              >
                {formatValue(displayValue)}
              </motion.div>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ResolutionStats;
