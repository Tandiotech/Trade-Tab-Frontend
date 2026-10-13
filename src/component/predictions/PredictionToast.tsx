import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface PredictionToastProps {
  type: ToastType;
  title: string;
  message?: string;
  isVisible: boolean;
  duration?: number;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-500',
    textColor: 'text-green-100',
    borderColor: 'border-green-400',
  },
  error: {
    icon: XCircleIcon,
    bgColor: 'bg-red-500',
    textColor: 'text-red-100',
    borderColor: 'border-red-400',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-100',
    borderColor: 'border-yellow-400',
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-100',
    borderColor: 'border-blue-400',
  },
};

function PredictionToast({
  type,
  title,
  message,
  isVisible,
  duration = 5000,
  onClose,
}: PredictionToastProps) {
  const config = toastConfig[type];
  const IconComponent = config.icon;

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`
            fixed top-4 right-4 z-50 max-w-sm w-full
            ${config.bgColor} ${config.textColor} ${config.borderColor}
            border rounded-lg shadow-lg backdrop-blur-sm
          `}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <IconComponent className="w-6 h-6 flex-shrink-0" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.h4
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-semibold text-sm"
                >
                  {title}
                </motion.h4>
                
                {message && (
                  <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm opacity-90 mt-1"
                  >
                    {message}
                  </motion.p>
                )}
              </div>
              
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black/20 transition-colors"
              >
                <XCircleIcon className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          {/* Progress bar */}
          {duration > 0 && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="h-1 bg-black/20 origin-left"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast Manager Hook
export function usePredictionToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>>([]);

  const addToast = React.useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = React.useCallback((title: string, message?: string) => {
    addToast('success', title, message);
  }, [addToast]);

  const showError = React.useCallback((title: string, message?: string) => {
    addToast('error', title, message);
  }, [addToast]);

  const showWarning = React.useCallback((title: string, message?: string) => {
    addToast('warning', title, message);
  }, [addToast]);

  const showInfo = React.useCallback((title: string, message?: string) => {
    addToast('info', title, message);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

// Toast Container Component
function PredictionToastContainer() {
  const { toasts, removeToast } = usePredictionToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ delay: index * 0.1 }}
          style={{ transform: `translateY(${index * 10}px)` }}
        >
          <PredictionToast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            isVisible={true}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
