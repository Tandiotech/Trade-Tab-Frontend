import React from 'react';
import { motion } from 'framer-motion';
import { useMode } from '@/context/ModeContext';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { FaChartLine, FaEye } from 'react-icons/fa6';

export default function ModeSwitcher() {
  const { mode, setMode, isExampleMode } = useMode();
  const { accounts, loadingAccounts } = useMTAccounts();

  // Only show switcher when no accounts are connected
  const hasAccounts = Array.isArray(accounts) && accounts.length > 0;
  if (hasAccounts || loadingAccounts) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-4 p-4 bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <FaEye className="w-4 h-4" />
        <span>Mode:</span>
      </div>

      <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-white/10">
        <button
          onClick={() => setMode('real')}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-md
            text-sm font-medium transition-all duration-200
            ${
              mode === 'real'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <FaChartLine className="w-4 h-4" />
          <span>Real Mode</span>
        </button>

        <button
          onClick={() => setMode('example')}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-md
            text-sm font-medium transition-all duration-200
            ${
              mode === 'example'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <FaEye className="w-4 h-4" />
          <span>Example Mode</span>
        </button>
      </div>

      {mode === 'real' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-xs text-gray-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5"
        >
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span>Connect account to access features</span>
        </motion.div>
      )}

      {mode === 'example' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-xs text-gray-400 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5"
        >
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span>Exploring with example data</span>
        </motion.div>
      )}
    </motion.div>
  );
}

