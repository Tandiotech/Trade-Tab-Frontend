import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiTrendingUp, BiTrendingDown, BiDollar, BiBarChartAlt2, BiTime, BiTargetLock } from 'react-icons/bi';
import { useMetrics } from '@/context/accounts/MetricsProvider';
import { SeparadorDecimal } from '../../utils/SeparadorDecimal';
import Loading2 from '../loader/Loading2/Loading2';
import ModalInfo from '../tooltips/ModalInfo';

/** Types for each data item. Adjust fields to match your actual structure. */
interface StatsItem {
  name: string;
  value: string | number;
  info?: string;
  key?: string;
  color?: string;
}

/** Props for the PerformanceStatsGrid component. */
interface PerformanceStatsGridProps {
  data?: StatsItem[];
}

/**
 * Displays a series of trading stats (e.g., risk/reward, balance, equity).
 * On narrow screens, it shows every other stat to reduce clutter (adjust logic if needed).
 * Shows a skeleton/pulse placeholder while data is loading.
 */
const PerformanceStatsGrid: React.FC<PerformanceStatsGridProps> = ({ data = [] }) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 768);
  const { loadingMetrics } = useMetrics();

  useEffect(() => {
    /** Update isDesktop on window resize. */
    function handleResize() {
      setIsDesktop(window.innerWidth > 768);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get appropriate icon for each stat type
  const getStatIcon = (key: string) => {
    switch (key) {
      case 'gain':
      case 'absoluteGain':
      case 'dailyGain':
      case 'monthlyGain':
        return <BiTrendingUp className='text-[var(--tt-profit)]' />;
      case 'averageWin':
      case 'wonTrades':
      case 'winRate':
        return <BiTrendingUp className='text-[var(--tt-profit)]' />;
      case 'averageLoss':
      case 'lostTrades':
      case 'lossRate':
        return <BiTrendingDown className='text-[var(--tt-loss)]' />;
      case 'deposits':
      case 'withdrawals':
      case 'lots':
        return <BiDollar className='text-[var(--tt-brand)]' />;
      case 'trades':
      case 'totalPips':
        return <BiBarChartAlt2 className='text-[var(--tt-brand)]' />;
      case 'bestTradePips':
        return <BiTargetLock className='text-[var(--tt-profit)]' />;
      case 'worstTradePips':
        return <BiTime className='text-[var(--tt-fg-2)]' />;
      default:
        return <BiBarChartAlt2 className='text-[var(--tt-fg-3)]' />;
    }
  };

  // Get color class for value based on stat type and value
  const getValueColor = (key: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
    
    switch (key) {
      case 'gain':
      case 'absoluteGain':
      case 'dailyGain':
      case 'monthlyGain':
      case 'winRate':
        return numValue >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]';
      case 'averageWin':
        return 'text-[var(--tt-profit)]';
      case 'averageLoss':
        return 'text-[var(--tt-loss)]';
      case 'wonTrades':
        return 'text-[var(--tt-profit)]';
      case 'lostTrades':
        return 'text-[var(--tt-loss)]';
      case 'lossRate':
        return 'text-[var(--tt-loss)]';
      case 'bestTradePips':
        return 'text-[var(--tt-profit)]';
      case 'worstTradePips':
        return 'text-[var(--tt-fg-2)]';
      case 'deposits':
        return 'text-[var(--tt-profit)]';
      case 'withdrawals':
        return 'text-[var(--tt-fg-2)]';
      case 'profitFactor':
        return numValue >= 1.0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]';
      case 'maxDrawdown':
        return 'text-[var(--tt-loss)]';
      case 'trades':
        return 'text-[var(--tt-brand)]';
      case 'lots':
        return 'text-[var(--tt-brand)]';
      default:
        return 'text-[var(--tt-fg-0)]';
    }
  };

  /**
   * If loading, we can show a skeleton for each item
   * or a single skeleton area. Here we do a placeholder row for each stat.
   */
  if (loadingMetrics) {
    return (
      <div className='space-y-3 pb-2'>
        {data.map((_, index) => (
          <motion.div
            key={`stats-skel-${index}`}
            className='tt-card w-full animate-pulse border border-[var(--tt-line-1)] p-4'
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-lg bg-[var(--tt-bg-3)]' />
                <div className='h-4 w-24 rounded bg-[var(--tt-bg-3)]' />
              </div>
              <div className='h-4 w-16 rounded bg-[var(--tt-bg-3)]' />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-3 pb-2'>
      <AnimatePresence>
        {data.map((item, index) => {
          // Decide if this item should display based on screen size
          const shouldDisplayItem = isDesktop ? true : index % 2 === 0;
          if (!shouldDisplayItem) return null;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className='tt-card w-full border border-[var(--tt-line-1)] p-4 transition-all duration-300 hover:border-[var(--tt-line-2)]'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-[var(--tt-bg-2)] p-2 ring-1 ring-[var(--tt-line-1)]'>
                    {getStatIcon(item.key || 'gain')}
                  </div>
                  <div className='flex items-center gap-2'>
                    <ModalInfo
                      content={item.info}
                      infoIconPosition='top-0 left-0'
                      infoIconSize='text-xs'
                      modalPosition='top-8 left-0 z-[9999]'
                    >
                      <span className='text-sm font-medium text-[var(--tt-fg-2)] transition-colors duration-200 hover:text-[var(--tt-fg-0)]'>
                        {item.name}
                      </span>
                    </ModalInfo>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <span className={`text-sm font-bold ${getValueColor(item.key || '', item.value)}`}>
                    {item.value !== undefined ? SeparadorDecimal(item.value) : <Loading2 />}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default PerformanceStatsGrid;
