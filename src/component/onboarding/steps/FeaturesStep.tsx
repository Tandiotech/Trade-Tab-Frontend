import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingCTA from '../OnboardingCTA';
import { 
  FaChartLine, 
  FaBrain, 
  FaBookOpen, 
  FaUsers,
  FaArrowLeft 
} from 'react-icons/fa6';

const features = [
  {
    icon: FaChartLine,
    title: 'Advanced Analytics',
    description: 'Deep insights into your trading performance with comprehensive metrics and visualizations.',
    color: 'from-emerald-400 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: FaBrain,
    title: 'Mindset Mastery',
    description: 'Psychological training and emotional evaluation to improve your trading discipline.',
    color: 'from-cyan-400 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: FaBookOpen,
    title: 'Smart Journaling',
    description: 'AI-powered journaling with calendar integration to track your trading journey.',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
  },
  {
    icon: FaUsers,
    title: 'Community Wisdom',
    description: 'Learn from peers, share experiences, and get feedback from the trading community.',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
  },
];

export default function FeaturesStep() {
  const { nextStep, previousStep } = useOnboarding();

  return (
    <div className="text-center">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Here's what you can do
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Once your account is connected, you'll have access to powerful tools designed to elevate your trading.
        </p>
      </motion.div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl border border-white/10 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-start text-left">
                <motion.div
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}
                >
                  <IconComponent className="text-white text-2xl" />
                </motion.div>
                <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button
          onClick={previousStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <OnboardingCTA
          onClick={nextStep}
          label="Continue"
        />
      </motion.div>
    </div>
  );
}

