import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useNavigate } from 'react-router-dom';
import OnboardingCTA from '../OnboardingCTA';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaCheckCircle, FaShieldAlt, FaRocket } from 'react-icons/fa';

export default function ConnectStep() {
  const { completeOnboarding, previousStep } = useOnboarding();
  const { accounts } = useMTAccounts();
  const navigate = useNavigate();

  const handleConnect = () => {
    completeOnboarding();
    navigate('/accounts');
  };

  const benefits = [
    {
      icon: FaShieldAlt,
      text: 'Secure & encrypted',
      color: 'text-emerald-400',
    },
    {
      icon: FaRocket,
      text: 'Takes less than 2 minutes',
      color: 'text-cyan-400',
    },
    {
      icon: FaCheckCircle,
      text: 'Free forever',
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="text-center">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Connect your account when you're ready
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Link your MetaTrader account to start tracking your performance and unlock all features.
        </p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 max-w-3xl mx-auto"
      >
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="flex flex-col items-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <IconComponent className={`text-3xl mb-3 ${benefit.color}`} />
              <span className="text-sm md:text-base text-gray-300 font-medium">
                {benefit.text}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mb-8"
      >
        <OnboardingCTA
          onClick={handleConnect}
          label="Connect my account"
          icon="sparkles"
        />
      </motion.div>

      {/* Secondary action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button
          onClick={previousStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          onClick={completeOnboarding}
          className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
        >
          I'll do this later
        </button>
      </motion.div>
    </div>
  );
}

