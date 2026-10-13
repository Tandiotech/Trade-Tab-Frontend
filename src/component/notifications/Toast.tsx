// component/notifications/Toast.tsx
import { CheckCircle, XCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = () => {
  const { notifications, clearNotification } = useNotifications();

  // Only show toasts that have autoClose enabled
  const activeToasts = notifications.filter(n => n.autoClose).slice(0, 3);

  return (
    <div className='fixed top-20 right-4 z-50 space-y-3 pointer-events-none'>
      <AnimatePresence>
        {activeToasts.map((notification, index) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onClose={() => clearNotification(notification.id)}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ notification, onClose, index }: any) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-green-400' />;
      case 'error':
        return <XCircle className='w-5 h-5 text-red-400' />;
      case 'warning':
        return <AlertCircle className='w-5 h-5 text-yellow-400' />;
      default:
        return <AlertCircle className='w-5 h-5 text-blue-400' />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500/20 via-emerald-500/15 to-green-500/20',
          border: 'border-green-500/40',
          glow: 'shadow-lg shadow-green-500/30',
          iconBg: 'bg-green-500/20'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500/20 via-rose-500/15 to-red-500/20',
          border: 'border-red-500/40',
          glow: 'shadow-lg shadow-red-500/30',
          iconBg: 'bg-red-500/20'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500/20 via-amber-500/15 to-yellow-500/20',
          border: 'border-yellow-500/40',
          glow: 'shadow-lg shadow-yellow-500/30',
          iconBg: 'bg-yellow-500/20'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-blue-500/20',
          border: 'border-blue-500/40',
          glow: 'shadow-lg shadow-blue-500/30',
          iconBg: 'bg-blue-500/20'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 400, scale: 0.9 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        delay: index * 0.1 
      }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md max-w-sm ${styles.bg} ${styles.border} ${styles.glow}`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
        className={`flex-shrink-0 p-2 rounded-lg ${styles.iconBg}`}
      >
        {getIcon()}
      </motion.div>
      <div className='flex-1 min-w-0'>
        <h4 className={`text-sm font-semibold ${
          notification.type === 'success' ? 'text-green-300' :
          notification.type === 'error' ? 'text-red-300' :
          notification.type === 'warning' ? 'text-yellow-300' :
          'text-blue-300'
        }`}>
          {notification.title}
        </h4>
        <p className='text-xs text-gray-200 mt-1 leading-relaxed'>{notification.message}</p>
        {notification.type === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='flex items-center gap-1 mt-2 text-xs text-green-400'
          >
            <Sparkles className='w-3 h-3' />
            <span>Account is ready!</span>
          </motion.div>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className='flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10'
      >
        <X className='w-4 h-4' />
      </motion.button>
    </motion.div>
  );
};

export default Toast;
