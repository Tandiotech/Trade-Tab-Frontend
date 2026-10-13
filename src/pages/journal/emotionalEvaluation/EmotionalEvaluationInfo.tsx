import {
  CpuChipIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const EmotionalEvaluationInfo = () => {
  const benefits = [
    {
      icon: CpuChipIcon,
      title: 'Master Your Mindset',
      description: 'Track emotions to identify patterns and improve decision-making',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ChartBarIcon,
      title: 'Boost Performance',
      description: 'Analyze your trading psychology to increase win rates',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Accelerate Growth',
      description: 'Learn from every trade to become a better trader',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Risk Management',
      description: 'Track discipline and risk control',
      emoji: '🛡️',
    },
    {
      icon: ClockIcon,
      title: 'Timing Analysis',
      description: 'Monitor entry and exit timing',
      emoji: '⏰',
    },
    {
      icon: LightBulbIcon,
      title: 'Strategy Insights',
      description: 'Evaluate strategy effectiveness',
      emoji: '💡',
    },
  ];

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-900'>
      {/* Hero Section */}
      <motion.div
        className='text-center mb-12'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='flex items-center justify-center gap-3 mb-4 flex-col sm:flex-row'>
          <div className='p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full'>
            <SparklesIcon className='h-8 w-8 text-white' />
          </div>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'>
            Trading Psychology Mastery
          </h1>
        </div>

        <p className='text-base sm:text-lg lg:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed'>
          Transform your trading journey with intelligent emotional tracking.
          <span className='text-green-400 font-semibold'>87% of successful traders</span> use
          journaling to improve their performance.
        </p>

        {/* CTA Button */}
        <motion.button
          className='inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TrophyIcon className='h-5 w-5' />
          {/* Start Your Trading Journal */}
          Coming Soon
        </motion.button>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className='bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-700 mb-12'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className='text-center mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold text-white mb-2'>
            Join Thousands of Successful Traders
          </h2>
          <p className='text-gray-400 text-sm sm:text-base'>
            See the difference journaling makes in your trading performance
          </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6'>
          <div className='text-center'>
            <div className='text-2xl sm:text-3xl font-bold text-green-400 mb-2'>94%</div>
            <div className='text-gray-300 text-xs sm:text-sm'>Improved Discipline</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl sm:text-3xl font-bold text-blue-400 mb-2'>67%</div>
            <div className='text-gray-300 text-xs sm:text-sm'>Better Win Rate</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl sm:text-3xl font-bold text-purple-400 mb-2'>89%</div>
            <div className='text-gray-300 text-xs sm:text-sm'>Reduced Losses</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl sm:text-3xl font-bold text-yellow-400 mb-2'>12.5k+</div>
            <div className='text-gray-300 text-xs sm:text-sm'>Active Journalers</div>
          </div>
        </div>
      </motion.div>

      {/* Benefits Grid */}
      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <motion.div
              key={index}
              className='p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl'
              whileHover={{ y: -5 }}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-r ${benefit.color} w-fit mb-4`}>
                <IconComponent className='h-6 w-6 text-white' />
              </div>
              <h3 className='text-lg sm:text-xl font-bold text-white mb-2'>{benefit.title}</h3>
              <p className='text-gray-300 text-sm sm:text-base leading-relaxed'>
                {benefit.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Features Section */}
      <motion.div
        className='mb-12'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className='text-center mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white mb-4'>What You'll Track</h2>
          <p className='text-gray-400 text-sm sm:text-base max-w-2xl mx-auto'>
            Comprehensive emotional and trading analysis to help you become a more disciplined
            trader
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className='p-4 sm:p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:bg-gray-700/50'
                whileHover={{ scale: 1.02 }}
              >
                <div className='flex items-center gap-3 mb-3'>
                  <IconComponent className='h-5 w-5 text-green-400' />
                  <span className='text-xl sm:text-2xl'>{feature.emoji}</span>
                </div>
                <h3 className='font-semibold text-white text-base sm:text-lg mb-1'>
                  {feature.title}
                </h3>
                <p className='text-gray-400 text-sm'>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        className='text-center mt-12'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className='bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-6 sm:p-8 border border-green-500/20'>
          <ArrowTrendingUpIcon className='h-10 w-10 sm:h-12 sm:w-12 text-green-400 mx-auto mb-4' />
          <h3 className='text-xl sm:text-2xl font-bold text-white mb-4'>
            Ready to Transform Your Trading?
          </h3>
          <p className='text-gray-300 text-sm sm:text-base mb-6 max-w-2xl mx-auto'>
            Start your journey to becoming a more disciplined and successful trader. Your first
            journal entry is just a click away.
          </p>
          <motion.button
            className='inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SparklesIcon className='h-5 w-5' />
            {/* Begin Your Trading Journal */}
            Coming soon...
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmotionalEvaluationInfo;
