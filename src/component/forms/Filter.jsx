import { motion } from 'framer-motion';

function Filter({ options, currentFilter, setcurrentFilter, dailyGrowth=[] }) {
  // Check if there are at least 2 valid drawdown entries
  const hasEnoughDrawdown = dailyGrowth?.filter(item => item.drawdownPercentage !== undefined).length > 1;

  // Filter options dynamically
  const filteredOptions = options.filter(option => option !== "Drawdown" || hasEnoughDrawdown);

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      {/* Mobile: Scrollable horizontal layout */}
      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0 scroll-smooth">
        {filteredOptions.map((item, key) => (
          <button
            key={key}
            onClick={() => setcurrentFilter(item)}
            className={`
              relative py-2 px-3.5 sm:px-4 sm:py-2.5 
              flex cursor-pointer items-center justify-center
              rounded-lg sm:rounded-xl
              transition-all duration-300 ease-out
              whitespace-nowrap 
              text-xs sm:text-sm font-semibold
              flex-shrink-0 min-w-fit
              transform active:scale-95
              ${currentFilter === item 
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-400/20" 
                : "bg-slate-700/60 text-gray-300 hover:bg-slate-600/70 hover:text-white hover:shadow-md border border-slate-600/30"
              }
            `}
          >
            <span className="relative z-10">{item}</span>
            {currentFilter === item && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Scroll indicator for mobile */}
      <div className="sm:hidden flex justify-center mt-2">
        <div className="w-10 h-1 bg-gradient-to-r from-transparent via-slate-600/50 to-transparent rounded-full"></div>
      </div>
    </div>
  );
}

export default Filter;
