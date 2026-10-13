import { motion } from 'framer-motion';
import { XCircle, RefreshCw, X, AlertTriangle } from 'lucide-react';
import type { ConnectionJob } from '@/types/connectionJob';

interface ConnectionErrorViewProps {
  job: ConnectionJob;
  onRetry: () => void;
  onClose: () => void;
  isRetrying: boolean;
}

export function ConnectionErrorView({
  job,
  onRetry,
  onClose,
  isRetrying,
}: ConnectionErrorViewProps) {
  return (
    <div className="p-6 space-y-6 text-center">
      {/* Error Icon Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex justify-center"
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-red-400/20 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
            <XCircle className="w-10 h-10 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3 className="text-xl font-bold text-white">Connection Failed</h3>
        <p className="text-gray-400">
          We couldn't connect your account{' '}
          <span className="text-red-400 font-semibold">{job.accountName}</span>.
        </p>
      </motion.div>

      {/* Error Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-medium text-red-400">Error Details</p>
            <p className="text-xs text-gray-400 mt-1">
              {job.error ?? 'An unexpected error occurred. Please try again.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>

        {/* Retry Button (if retryable) */}
        {job.retryable && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            disabled={isRetrying}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 hover:from-teal-400 hover:via-cyan-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
          >
            {isRetrying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                <span>Retrying...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </>
            )}
          </motion.button>
        )}
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-gray-500"
      >
        {job.retryable ? (
          <p>You can try connecting again or contact support if the problem persists.</p>
        ) : (
          <p>Please check your credentials and try again, or contact support for help.</p>
        )}
      </motion.div>
    </div>
  );
}
