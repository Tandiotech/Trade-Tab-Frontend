import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  BarChart3,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Target,
  FileText,
  PieChart,
  Activity,
  Clock,
} from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  delay: number;
  span?: 'col-span-1' | 'col-span-2' | 'row-span-2';
  isInView: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  gradient,
  delay,
  span = 'col-span-1',
  isInView,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1], type: 'spring', stiffness: 100 }}
      whileHover={{ y: -12, scale: 1.03 }}
      className={`group relative ${span} rounded-3xl overflow-hidden`}
    >
      {/* Glassmorphism background - Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/3 to-white/0 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-black/30" />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: gradient === 'from-emerald-500 to-teal-500' 
            ? 'linear-gradient(to bottom right, rgb(16, 185, 129), rgb(20, 184, 166))'
            : gradient === 'from-purple-500 to-pink-500'
            ? 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(236, 72, 153))'
            : gradient === 'from-cyan-500 to-blue-500'
            ? 'linear-gradient(to bottom right, rgb(6, 182, 212), rgb(59, 130, 246))'
            : gradient === 'from-teal-500 to-emerald-500'
            ? 'linear-gradient(to bottom right, rgb(20, 184, 166), rgb(16, 185, 129))'
            : gradient === 'from-orange-500 to-red-500'
            ? 'linear-gradient(to bottom right, rgb(249, 115, 22), rgb(239, 68, 68))'
            : gradient === 'from-indigo-500 to-purple-500'
            ? 'linear-gradient(to bottom right, rgb(99, 102, 241), rgb(168, 85, 247))'
            : gradient === 'from-blue-500 to-cyan-500'
            ? 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(6, 182, 212))'
            : gradient === 'from-yellow-500 to-orange-500'
            ? 'linear-gradient(to bottom right, rgb(234, 179, 8), rgb(249, 115, 22))'
            : 'linear-gradient(to bottom right, rgb(34, 197, 94), rgb(16, 185, 129))'
        }}
      />
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"
        style={{
          background: gradient === 'from-emerald-500 to-teal-500' 
            ? 'linear-gradient(to bottom right, rgb(16, 185, 129), rgb(20, 184, 166))'
            : gradient === 'from-purple-500 to-pink-500'
            ? 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(236, 72, 153))'
            : gradient === 'from-cyan-500 to-blue-500'
            ? 'linear-gradient(to bottom right, rgb(6, 182, 212), rgb(59, 130, 246))'
            : gradient === 'from-teal-500 to-emerald-500'
            ? 'linear-gradient(to bottom right, rgb(20, 184, 166), rgb(16, 185, 129))'
            : gradient === 'from-orange-500 to-red-500'
            ? 'linear-gradient(to bottom right, rgb(249, 115, 22), rgb(239, 68, 68))'
            : gradient === 'from-indigo-500 to-purple-500'
            ? 'linear-gradient(to bottom right, rgb(99, 102, 241), rgb(168, 85, 247))'
            : gradient === 'from-blue-500 to-cyan-500'
            ? 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(6, 182, 212))'
            : gradient === 'from-yellow-500 to-orange-500'
            ? 'linear-gradient(to bottom right, rgb(234, 179, 8), rgb(249, 115, 22))'
            : 'linear-gradient(to bottom right, rgb(34, 197, 94), rgb(16, 185, 129))'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Icon */}
        <div 
          className="inline-flex p-4 rounded-2xl mb-6 shadow-lg"
          style={{
            background: gradient === 'from-emerald-500 to-teal-500' 
              ? 'linear-gradient(135deg, rgb(16, 185, 129), rgb(20, 184, 166))'
              : gradient === 'from-purple-500 to-pink-500'
              ? 'linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153))'
              : gradient === 'from-cyan-500 to-blue-500'
              ? 'linear-gradient(135deg, rgb(6, 182, 212), rgb(59, 130, 246))'
              : gradient === 'from-teal-500 to-emerald-500'
              ? 'linear-gradient(135deg, rgb(20, 184, 166), rgb(16, 185, 129))'
              : gradient === 'from-orange-500 to-red-500'
              ? 'linear-gradient(135deg, rgb(249, 115, 22), rgb(239, 68, 68))'
              : gradient === 'from-indigo-500 to-purple-500'
              ? 'linear-gradient(135deg, rgb(99, 102, 241), rgb(168, 85, 247))'
              : gradient === 'from-blue-500 to-cyan-500'
              ? 'linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212))'
              : gradient === 'from-yellow-500 to-orange-500'
              ? 'linear-gradient(135deg, rgb(234, 179, 8), rgb(249, 115, 22))'
              : 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))'
          }}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-black text-white mb-3 leading-tight">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-400 text-base leading-relaxed flex-grow font-light">{description}</p>
        
        {/* Hover indicator */}
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-500 group-hover:text-emerald-400 transition-colors">
          <span>Learn more</span>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg"
          >
            →
          </motion.div>
        </div>
      </div>
      
      {/* Border glow - Enhanced */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-10"
        style={{ 
          background: gradient === 'from-emerald-500 to-teal-500' 
            ? 'linear-gradient(135deg, rgb(16, 185, 129), rgb(20, 184, 166))'
            : gradient === 'from-purple-500 to-pink-500'
            ? 'linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153))'
            : gradient === 'from-cyan-500 to-blue-500'
            ? 'linear-gradient(135deg, rgb(6, 182, 212), rgb(59, 130, 246))'
            : gradient === 'from-teal-500 to-emerald-500'
            ? 'linear-gradient(135deg, rgb(20, 184, 166), rgb(16, 185, 129))'
            : gradient === 'from-orange-500 to-red-500'
            ? 'linear-gradient(135deg, rgb(249, 115, 22), rgb(239, 68, 68))'
            : gradient === 'from-indigo-500 to-purple-500'
            ? 'linear-gradient(135deg, rgb(99, 102, 241), rgb(168, 85, 247))'
            : gradient === 'from-blue-500 to-cyan-500'
            ? 'linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212))'
            : gradient === 'from-yellow-500 to-orange-500'
            ? 'linear-gradient(135deg, rgb(234, 179, 8), rgb(249, 115, 22))'
            : 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))',
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  );
};

export default function NextGenFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#000000] overflow-hidden"
    >
      {/* Section Number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="absolute top-8 left-8 z-10 text-white/20 font-mono text-sm tracking-widest"
      >
        [ 02 / 09 ]
      </motion.div>

      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.05),transparent_60%)]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-emerald-500/10 mb-8">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 font-mono tracking-wider uppercase">Features</span>
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Master Trading
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Powerful tools designed for serious traders. Log, analyze, and optimize your trading
            performance with precision.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              {...feature}
              delay={idx * 0.1}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
    {
      title: 'Advanced Analytics',
      description:
        'Deep dive into your trading performance with comprehensive analytics. Track win rates, profit factors, and identify your most profitable setups.',
      icon: BarChart3,
      gradient: 'from-emerald-500 to-teal-500',
      span: 'col-span-1' as const,
    },
    {
      title: 'Psychology Logs',
      description:
        'Document your emotional state, mindset, and psychological patterns for each trade. Understand how emotions impact your decision-making and build mental resilience.',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
      span: 'col-span-1' as const,
    },
    {
      title: 'P&L Heatmaps',
      description:
        'Visualize your profit and loss distribution across different timeframes, pairs, and strategies. Spot patterns and optimize your trading schedule.',
      icon: TrendingUp,
      gradient: 'from-cyan-500 to-blue-500',
      span: 'col-span-2 row-span-2' as const,
    },
    {
      title: 'Risk Management',
      description:
        'Set and track risk parameters, position sizing rules, and drawdown limits. Automated alerts keep you disciplined.',
      icon: Shield,
      gradient: 'from-teal-500 to-emerald-500',
      span: 'col-span-1' as const,
    },
    {
      title: 'Trade Tags & Filters',
      description:
        'Organize trades with custom tags and filters. Quickly find specific setups, market conditions, or time periods.',
      icon: Target,
      gradient: 'from-orange-500 to-red-500',
      span: 'col-span-1' as const,
    },
    {
      title: 'Performance Metrics',
      description:
        'Track key metrics like Sharpe ratio, expectancy, maximum drawdown, and recovery factor. Compare performance across different periods.',
      icon: Activity,
      gradient: 'from-indigo-500 to-purple-500',
      span: 'col-span-1' as const,
    },
    {
      title: 'Trade Notes',
      description:
        'Rich text editor for detailed trade notes. Attach screenshots, mark key levels, and document your thought process.',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      span: 'col-span-1' as const,
    },
    {
      title: 'Session Analysis',
      description:
        'Analyze your trading sessions by time of day, day of week, and market conditions. Identify your peak performance windows.',
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      span: 'col-span-1' as const,
    },
    {
      title: 'Portfolio Insights',
      description:
        'Get a holistic view of your trading portfolio. Understand correlation between different strategies and optimize allocation.',
      icon: PieChart,
      gradient: 'from-green-500 to-emerald-500',
      span: 'col-span-1' as const,
    },
  ];
