import { memo, useMemo } from 'react';
import { generateCardData } from './CardData';
import { useMetrics } from '@/context/accounts/MetricsProvider';
import { motion } from 'framer-motion';
import {
  BiTrendingUp,
  BiTrendingDown,
  BiDollar,
  BiBarChartAlt2,
  BiTargetLock,
} from 'react-icons/bi';

interface MetricsByDate {
  balance?: number | string;
  equity?: number | string;
  equityLabel?: string;
  riskReward?: number;
  growth?: any[];
}

interface AccountResumeProps {
  account_currency?: string;
  metricsByDate: MetricsByDate;
  averageWin?: number;
  highestBalance?: number;
  accountStats?: any;
  accountData?: any;
  showData?: boolean;
  averageBalance?: number;
  averageGrowth?: number;
  averageProfitLoss?: number;
  dateEndFilter?: string | null;
  dateStartFilter?: string | null;
  averageWinPips?: number;
  averageLossPips?: number;
  deposits?: number;
  averageLoss?: number;
  className?: string;
}

interface CardData {
  id: string;
  title: string;
  value: string | React.ReactNode;
  icon: React.ReactNode;
  chart?: boolean;
  info?: string;
  colorClass: string;
  iconBg: string;
}

const AccountResume = memo<AccountResumeProps>(function AccountResume({
  account_currency,
  metricsByDate,
  averageWin,
  highestBalance,
  accountStats,
  accountData,
  showData,
  averageBalance,
  averageGrowth,
  averageProfitLoss,
  dateEndFilter,
  dateStartFilter,
  averageWinPips,
  averageLossPips,
  deposits,
  averageLoss,
  className = '',
}) {
  const { balance, equity, equityLabel, riskReward } = metricsByDate;
  const { loadingMetrics } = useMetrics();
  const floatingPnL = null;

  // Memoize cardData generation
  const cardData = useMemo((): CardData[] => {
    return generateCardData(
      balance,
      averageWin,
      account_currency,
      averageGrowth,
      floatingPnL,
      equity,
      equityLabel,
      averageProfitLoss,
      averageBalance,
      accountData,
      accountStats,
      highestBalance,
      showData,
      averageWinPips,
      averageLossPips,
      riskReward
    ) as CardData[];
  }, [
    balance,
    averageWin,
    account_currency,
    averageGrowth,
    floatingPnL,
    equity,
    equityLabel,
    averageProfitLoss,
    averageBalance,
    accountData,
    accountStats,
    highestBalance,
    showData,
    averageWinPips,
    averageLossPips,
    riskReward,
  ]);

  // Get icon component based on card title
  const getIconComponent = (title: string) => {
    const t = title?.toLowerCase();
    if (t.includes('balance')) return <BiBarChartAlt2 className='w-5 h-5' />;
    if (t.includes('risk')) return <BiTargetLock className='w-5 h-5' />;
    if (t.includes('currency')) return <BiDollar className='w-5 h-5' />;
    if (t.includes('win')) return <BiTrendingUp className='w-5 h-5' />;
    if (t.includes('loss')) return <BiTrendingDown className='w-5 h-5' />;
    return <BiDollar className='w-5 h-5' />;
  };

  if (loadingMetrics) {
    return (
      <div className='w-full'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className='rounded-xl border border-white/5 bg-gradient-to-br from-darkblack-700/60 to-darkblack-800/60 p-4'
            >
              <div className='animate-pulse space-y-2'>
                <div className='h-3 bg-gray-600/40 rounded w-2/3'></div>
                <div className='h-6 bg-gray-600/40 rounded w-full'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Compact Grid Layout - 4 cards in a row on large screens, 2 on mobile */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
        {cardData.map((card, index) => (
          <motion.div
            key={`${card.id}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`
              group relative overflow-hidden rounded-xl border border-white/5
              bg-gradient-to-br from-darkblack-700/40 to-darkblack-800/40
              backdrop-blur-sm p-3 sm:p-4
              hover:border-white/10 hover:shadow-lg hover:shadow-blue-500/5
              transition-all duration-300
            `}
          >
            {/* Subtle gradient overlay */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${card.iconBg}`}
            />

            {/* Content */}
            <div className='relative z-10'>
              {/* Header with Icon and Title */}
              <div className='flex items-center justify-between mb-2'>
                <div
                  className={`p-2 rounded-lg ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <div className={card.colorClass}>{getIconComponent(card.title)}</div>
                </div>
              </div>

              {/* Title */}
              <h3 className='text-xs sm:text-sm font-medium text-gray-400 mb-1 truncate'>
                {card.title}
              </h3>

              {/* Value */}
              <div
                className={`text-lg sm:text-xl md:text-2xl font-bold ${card.colorClass} truncate`}
              >
                {typeof card.value === 'string' ? <span>{card.value}</span> : card.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default AccountResume;
