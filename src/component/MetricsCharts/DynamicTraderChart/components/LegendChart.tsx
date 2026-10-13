import { motion } from 'framer-motion';

// Enhanced Legend Component (responsive fix)
export const LegendChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className='flex flex-wrap justify-center md:justify-end items-center gap-2.5 sm:gap-3 w-full z-10 max-w-full overflow-hidden'
    >
      {/* Deposit */}
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className='flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md rounded-xl border border-green-500/20 flex-shrink-0 shadow-lg shadow-green-500/10 hover:border-green-500/40 hover:shadow-green-500/20 transition-all duration-300'
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className='w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-full shadow-lg shadow-green-500/50 flex-shrink-0 ring-2 ring-green-400/30'
        />
        <span className='text-gray-200 font-semibold text-xs sm:text-sm whitespace-nowrap'>Deposit</span>
      </motion.div>

      {/* Withdrawal */}
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className='flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md rounded-xl border border-red-500/20 flex-shrink-0 shadow-lg shadow-red-500/10 hover:border-red-500/40 hover:shadow-red-500/20 transition-all duration-300'
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className='w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-red-400 via-pink-500 to-red-500 rounded-full shadow-lg shadow-red-500/50 flex-shrink-0 ring-2 ring-red-400/30'
        />
        <span className='text-gray-200 font-semibold text-xs sm:text-sm whitespace-nowrap'>Withdrawal</span>
      </motion.div>
    </motion.div>
  );
};
