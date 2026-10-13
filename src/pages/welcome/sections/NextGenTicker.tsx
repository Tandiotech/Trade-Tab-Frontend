import { motion } from 'framer-motion';
import { useRef } from 'react';

interface TickerItemProps {
  text: string;
  value: string;
  isPositive?: boolean;
}

const TickerItem = ({ text, value, isPositive = true }: TickerItemProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg shadow-black/20 whitespace-nowrap"
    >
      <span className="text-sm text-gray-300 font-mono font-medium">{text}</span>
      <span
        className={`text-xl font-black font-mono ${
          isPositive ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {value}
      </span>
      <div
        className={`w-2.5 h-2.5 rounded-full shadow-lg ${
          isPositive ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-400 shadow-red-400/50'
        } animate-pulse`}
      />
    </motion.div>
  );
};

// Infinite scroll marquee component
const InfiniteMarquee = ({ children, direction = 'left' }: { children: React.ReactNode; direction?: 'left' | 'right' }) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

export default function NextGenTicker() {
  // Mock live trade data
  const liveTrades = [
    { pair: 'EUR/USD', action: 'BUY', price: '1.0845', pnl: '+$125.50', isPositive: true },
    { pair: 'GBP/USD', action: 'SELL', price: '1.2650', pnl: '-$45.20', isPositive: false },
    { pair: 'BTC/USD', action: 'BUY', price: '42,350', pnl: '+$1,250', isPositive: true },
    { pair: 'ETH/USD', action: 'BUY', price: '2,450', pnl: '+$320.75', isPositive: true },
    { pair: 'USD/JPY', action: 'SELL', price: '149.25', pnl: '+$89.30', isPositive: true },
    { pair: 'AUD/USD', action: 'BUY', price: '0.6520', pnl: '-$12.50', isPositive: false },
    { pair: 'XAU/USD', action: 'BUY', price: '2,045', pnl: '+$450.00', isPositive: true },
    { pair: 'USD/CAD', action: 'SELL', price: '1.3520', pnl: '+$67.80', isPositive: true },
  ];

  // Supported brokers
  const brokers = [
    'MetaTrader 4',
    'MetaTrader 5',
    'cTrader',
    'TradingView',
    'Interactive Brokers',
    'OANDA',
    'FXCM',
    'IG Markets',
    'eToro',
    'Plus500',
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#000000] overflow-hidden">
      {/* Section Number */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute top-8 left-8 z-10 text-white/20 font-mono text-sm tracking-widest"
      >
        [ 03 / 09 ]
      </motion.div>

      {/* Background gradient - Enhanced */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)]" />
      <div className="absolute top-1/2 left-0 w-1/3 h-full bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 right-0 w-1/3 h-full bg-gradient-to-l from-cyan-500/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* Live Trades Ticker */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            <h3 className="text-xl font-black text-white font-mono tracking-wider uppercase">LIVE TRADES</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/60 via-emerald-500/30 to-transparent" />
          </div>
          
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            
            <InfiniteMarquee direction="left">
              {liveTrades.map((trade, idx) => (
                <TickerItem
                  key={idx}
                  text={`${trade.pair} ${trade.action} @ ${trade.price}`}
                  value={trade.pnl}
                  isPositive={trade.isPositive}
                />
              ))}
            </InfiniteMarquee>
          </div>
        </div>

        {/* Supported Brokers Ticker */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
            <h3 className="text-xl font-black text-white font-mono tracking-wider uppercase">SUPPORTED BROKERS</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/60 via-cyan-500/30 to-transparent" />
          </div>
          
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            
            <InfiniteMarquee direction="right">
              {brokers.map((broker, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg shadow-black/20 whitespace-nowrap"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                  <span className="text-sm text-gray-200 font-semibold">{broker}</span>
                </motion.div>
              ))}
            </InfiniteMarquee>
          </div>
        </div>

        {/* Stats Bar - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          {[
            { label: 'Trades Today', value: '1,247', textColor: 'text-emerald-400' },
            { label: 'Active Users', value: '10,523', textColor: 'text-cyan-400' },
            { label: 'Avg Win Rate', value: '64.2%', textColor: 'text-teal-400' },
            { label: 'Total Volume', value: '$2.4M', textColor: 'text-purple-400' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-xl shadow-black/20"
            >
              <div className={`text-3xl font-black font-mono ${stat.textColor} mb-2`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
