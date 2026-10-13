import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingCTA from '../OnboardingCTA';
import { FaArrowLeft, FaChartLine } from 'react-icons/fa6';
import { FaCalendarAlt } from 'react-icons/fa';

export default function PreviewStep() {
  const { nextStep, previousStep } = useOnboarding();

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
          A quick preview
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Here's a lightweight preview of what your dashboard will look like once connected.
        </p>
      </motion.div>

      {/* Preview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
        {/* Metrics Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-2xl border border-white/10 backdrop-blur-sm bg-white/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400">
              <FaChartLine className="text-white text-xl" />
            </div>
            <h3 className="font-bold text-white text-lg">Performance Metrics</h3>
          </div>
          <div className="space-y-3 text-left">
            <div className="h-3 bg-white/10 rounded-full animate-pulse" />
            <div className="h-3 bg-white/10 rounded-full animate-pulse w-3/4" />
            <div className="h-3 bg-white/10 rounded-full animate-pulse w-2/3" />
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Balance</span>
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Journal Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-2xl border border-white/10 backdrop-blur-sm bg-white/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-400 to-yellow-400">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <h3 className="font-bold text-white text-lg">Trading Journal</h3>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded ${
                  i % 3 === 0
                    ? 'bg-gradient-to-br from-teal-400/30 to-cyan-400/30'
                    : 'bg-white/5'
                }`}
              />
            ))}
          </div>
          <div className="text-left">
            <div className="h-3 bg-white/10 rounded-full animate-pulse w-2/3 mb-2" />
            <div className="h-3 bg-white/10 rounded-full animate-pulse w-1/2" />
          </div>
        </motion.div>
      </div>

      {/* Info message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-400/20 max-w-2xl mx-auto"
      >
        <p className="text-sm md:text-base text-blue-300">
          💡 <strong>Note:</strong> This is just a preview. Your real data will appear once you connect your account.
        </p>
      </motion.div>

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
          label="Ready to connect"
        />
      </motion.div>
    </div>
  );
}

