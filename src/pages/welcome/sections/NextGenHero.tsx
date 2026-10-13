import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, BarChart3, Brain, Shield } from 'lucide-react';
import TradingHero3D from './TradingHero3D';

// Lazy load 3D component for performance
const LazyTradingHero3D = lazy(() => Promise.resolve({ default: TradingHero3D }));

// Text reveal animation component
const TextReveal = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
};

// Magnetic button component - Enhanced
const MagneticButton = ({ children, href, variant = 'primary' }: { children: React.ReactNode; href: string; variant?: 'primary' | 'secondary' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: variant === 'primary' 
            ? 'linear-gradient(135deg, #10b981, #14b8a6)' 
            : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
        }}
      />
      <Link
        to={href}
        className={`relative z-10 inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-emerald-400/20'
            : 'bg-white/5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-xl shadow-black/20'
        }`}
      >
        {children}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
      </Link>
    </motion.div>
  );
};

export default function NextGenHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000000]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#050510] to-[#000000]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* 3D Background */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-40">
        <Suspense fallback={null}>
          <LazyTradingHero3D />
        </Suspense>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-black to-transparent z-10" />

      {/* Section Number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-8 left-8 z-30 text-white/20 font-mono text-sm tracking-widest"
      >
        [ 01 / 09 ]
      </motion.div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-12"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-emerald-500/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-xs font-semibold text-emerald-400 font-mono tracking-wider uppercase">
                AI-POWERED TRADING JOURNAL
              </span>
            </div>
          </motion.div>

          {/* Main Heading - Reduced Size */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight"
          >
            <div className="space-y-3">
              <div className="font-light">
                <TextReveal delay={0.3}>Master Your</TextReveal>
              </div>
              <div className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-black">
                <TextReveal delay={0.5}>Trading Edge</TextReveal>
              </div>
            </div>
          </motion.h1>

          {/* Description - Reduced Size */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
          >
            Transform your trading performance with intelligent journaling, real-time analytics, and
            psychological insights. Log every trade, analyze patterns, and build consistency like never before.
          </motion.p>

          {/* CTA Buttons - Enhanced */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 pt-8"
          >
            <MagneticButton href="/signup" variant="primary">
              Start Journaling Free
            </MagneticButton>
            <MagneticButton href="#features" variant="secondary">
              Explore Features
            </MagneticButton>
          </motion.div>

          {/* Feature Pills - Enhanced */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-12"
          >
            {[
              { icon: BarChart3, text: 'Advanced Analytics', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', hoverBg: 'hover:bg-emerald-500/20', iconColor: 'text-emerald-400' },
              { icon: Brain, text: 'Psychology Logs', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', hoverBg: 'hover:bg-purple-500/20', iconColor: 'text-purple-400' },
              { icon: TrendingUp, text: 'P&L Heatmaps', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', hoverBg: 'hover:bg-cyan-500/20', iconColor: 'text-cyan-400' },
              { icon: Shield, text: 'Risk Management', bgColor: 'bg-teal-500/10', borderColor: 'border-teal-500/30', hoverBg: 'hover:bg-teal-500/20', iconColor: 'text-teal-400' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + idx * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-3 px-5 py-3 rounded-full ${feature.bgColor} border ${feature.borderColor} backdrop-blur-xl ${feature.hoverBg} transition-all shadow-lg shadow-black/20`}
              >
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                <span className="text-sm font-semibold text-gray-200">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Preview - Enhanced */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-5xl mx-auto"
          >
            {[
              { value: '10K+', label: 'Active Traders', textColor: 'text-emerald-400' },
              { value: '2M+', label: 'Trades Logged', textColor: 'text-cyan-400' },
              { value: '98%', label: 'Satisfaction', textColor: 'text-teal-400' },
              { value: '24/7', label: 'Sync Support', textColor: 'text-purple-400' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + idx * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-xl shadow-black/20"
              >
                <div className={`text-4xl font-black font-mono ${stat.textColor} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
