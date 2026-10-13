import { motion } from 'framer-motion';
import AnimatedText from '../AnimateText';
import PastelChart from '../chart/PastelChart';

function PieContainer({
  data = [],
  title = `Long/${'\n'}Short`,
  title1 = 'Win',
  title2 = 'Lost',
  backgroundColor = ['#165BA9', '#00C686', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#FF6384'],
  symbolData,
  symbolName,
}) {
  // Normalize data - replace negative values with 0
  const normalizedSymbolData =
    symbolData && symbolData.length === 2
      ? symbolData.map(value => (value <= 0 ? 0 : value))
      : null;

  const hasOnlyWins =
    normalizedSymbolData && normalizedSymbolData[0] > 0 && normalizedSymbolData[1] === 0;
  const hasOnlyLosses =
    normalizedSymbolData && normalizedSymbolData[1] > 0 && normalizedSymbolData[0] === 0;

  // Adjust colors based on data
  const adjustedColors = hasOnlyWins
    ? ['#00C686', '#374151'] // Green + Gray
    : hasOnlyLosses
      ? ['#374151', '#FF6384'] // Gray + Red
      : backgroundColor;

  const hasData = normalizedSymbolData && (symbolData[0] > 0 || symbolData[1] > 0);
  const total = normalizedSymbolData ? normalizedSymbolData[0] + normalizedSymbolData[1] : 0;

  // Calculate percentages for display
  const percentage1 = total > 0 ? ((normalizedSymbolData[0] / total) * 100).toFixed(1) : '0';
  const percentage2 = total > 0 ? ((normalizedSymbolData[1] / total) * 100).toFixed(1) : '0';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.section
      className='h-full min-h-[280px] sm:min-h-[320px]'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='group relative rounded-2xl bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border border-slate-700/40 hover:border-cyan-500/60 transition-all duration-500 ease-out h-full flex flex-col overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10'>
        {/* Animated gradient background */}
        <div className='absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

        {/* Header */}
        <div className='relative z-10 flex items-center justify-between h-16 sm:h-20 border-b border-slate-700/50 px-4 sm:px-6 backdrop-blur-sm'>
          {/* Title with gradient effect */}
          <motion.h3
            className='font-poppins font-semibold text-lg sm:text-xl bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent'
            variants={itemVariants}
          >
            {title}
          </motion.h3>

          {/* Legend with modern styling */}
          {symbolData && normalizedSymbolData && (
            <motion.div
              className='flex flex-col gap-2 sm:gap-2.5'
              variants={itemVariants}
            >
              {/* Item 2 (Loss/Second) */}
              <motion.div
                className='flex items-center gap-2 group/item'
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{ backgroundColor: adjustedColors[1] }}
                  className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-lg transition-transform duration-300 group-hover/item:scale-125'
                />
                <div className='flex items-baseline gap-1.5'>
                  <span className='text-white/90 text-[12px] sm:text-sm font-bold whitespace-nowrap'>
                    {title2}
                  </span>
                  <span className='text-white/70 text-[14px] sm:text-sm font-bold'>
                    {normalizedSymbolData[1]?.toFixed(0)}
                  </span>
                  <span className='text-cyan-300/60 text-[12px] sm:text-sm font-bold'>
                    ({percentage2}%)
                  </span>
                </div>
              </motion.div>

              {/* Item 1 (Win/First) */}
              <motion.div
                className='flex items-center gap-2 group/item'
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{ backgroundColor: adjustedColors[0] }}
                  className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-lg transition-transform duration-300 group-hover/item:scale-125'
                />
                <div className='flex items-baseline gap-1.5'>
                  <span className='text-white/90 text-[12px] sm:text-sm font-bold whitespace-nowrap'>
                    {title1}
                  </span>
                  <span className='text-white/70 text-[14px] font-bold sm:text-xs'>
                    {normalizedSymbolData[0]?.toFixed(0)}
                  </span>
                  <span className='text-cyan-300/60 text-[12px] sm:text-sm font-bold'>
                    ({percentage1}%)
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Chart Container */}
        <div className='relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6'>
          {hasData ? (
            <motion.div
              className='w-full h-full flex items-center justify-center'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <div className='w-full max-w-[280px] sm:max-w-[320px]'>
                <PastelChart
                  centerText={title}
                  backgroundColor={adjustedColors}
                  symbolName={symbolName}
                  symbolData={normalizedSymbolData}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              className='text-center space-y-3 sm:space-y-4 px-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Animated icon */}
              <motion.div
                className='mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center'
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg
                  className='w-8 h-8 sm:w-10 sm:h-10 text-slate-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </motion.div>

              <div>
                <AnimatedText value={'No data available'} />
                <p className='text-xs sm:text-sm text-gray-400/80 mt-2 leading-relaxed max-w-xs mx-auto'>
                  Please check back later or ensure the account has sufficient trading history.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Decorative elements */}
        <div className='absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse' />
        <div className='absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse delay-150' />
      </div>
    </motion.section>
  );
}

export default PieContainer;
