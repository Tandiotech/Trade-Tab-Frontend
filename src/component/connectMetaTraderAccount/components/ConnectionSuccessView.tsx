import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import type { ConnectionJob } from '@/types/connectionJob';

interface ConnectionSuccessViewProps {
  job: ConnectionJob;
  onViewAccount: () => void;
}

export function ConnectionSuccessView({ job, onViewAccount }: ConnectionSuccessViewProps) {
  return (
    <div className="p-6 space-y-6 text-center">
      {/* Success Icon Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex justify-center"
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3 className="text-xl font-bold text-white">Connected Successfully!</h3>
        <p className="text-gray-400">
          Your account <span className="text-teal-400 font-semibold">{job.accountName}</span> is
          now connected and ready to use.
        </p>
      </motion.div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-5 h-5 text-green-400" />
          <div className="text-left">
            <p className="text-sm font-medium text-white">{job.accountName}</p>
            <p className="text-xs text-gray-400">Account #{job.accountNumber}</p>
          </div>
        </div>
      </motion.div>

      {/* View Account Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onViewAccount}
        className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 hover:from-teal-400 hover:via-cyan-400 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group"
      >
        <span>View Account</span>
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      {/* Additional Info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-gray-500"
      >
        Your trading data is being synchronized in the background.
      </motion.p>
    </div>
  );
}
