import { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCircle, XCircle, AlertCircle, Loader2, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useAccountState } from '@/context/accounts/useAccountState';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    shouldHighlightBell,
  } = useNotifications();

  // Auto-open and highlight when triggered
  useEffect(() => {
    if (shouldHighlightBell) {
      setIsOpen(true);
      // Scroll to bell smoothly
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 100);
    }
  }, [shouldHighlightBell]);

  const { setAccountName, setAccountNumber, setAccountType, setSelectedServer, setHandleActive } =
    useAccountState();

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    if (notif.type === 'success') {
      setIsOpen(false);
      navigate('/accounts');
    }
  };

  const getNotificationIcon = (type: string, status?: string) => {
    if (status === 'connecting' || status === 'pending')
      return <Loader2 className='w-5 h-5 text-blue-500 animate-spin' />;

    switch (type) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-green-500' />;
      case 'error':
        return <XCircle className='w-5 h-5 text-red-500' />;
      case 'warning':
        return <AlertCircle className='w-5 h-5 text-yellow-500' />;
      default:
        return <AlertCircle className='w-5 h-5 text-blue-500' />;
    }
  };

  const handleRetry = (notif: any) => {
    if (!notif.accountName) return;
    setAccountName(notif.accountName);
    setAccountNumber(notif.accountNumber);
    setAccountType(notif.accountType);
    setSelectedServer(notif.server);
    setHandleActive(true);
    setIsOpen(false);
  };

  const activeJobs = notifications.filter(n => n.status === 'connecting' || n.status === 'pending');

  return (
    <>
      {/* Backdrop blur overlay when highlighting - creates spotlight effect */}
      {shouldHighlightBell && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='fixed inset-0 z-[9998] pointer-events-none'
          style={{ 
            zIndex: 9998,
            background: 'radial-gradient(circle 200px at calc(100% - 80px) 80px, transparent 0%, rgba(0, 0, 0, 0.95) 70%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />
      )}
      
      <div className={`relative ${shouldHighlightBell ? 'z-[9999]' : ''}`} ref={dropdownRef} style={shouldHighlightBell ? { zIndex: 9999, position: 'relative' } : {}}>
      {/* 🔔 Botón de campana */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={shouldHighlightBell ? {
          scale: [1, 1.4, 1.2],
          rotate: [0, 20, -20, 0],
        } : {}}
        transition={shouldHighlightBell ? {
          duration: 1,
          ease: 'easeInOut'
        } : {}}
        className={`relative p-2.5 text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-teal-500/20 hover:to-cyan-500/20 rounded-lg transition-all duration-200 border ${
          shouldHighlightBell 
            ? 'border-teal-300 bg-gradient-to-br from-teal-400 to-cyan-400 text-white shadow-2xl shadow-teal-400/80 ring-4 ring-teal-300/80 brightness-110' 
            : 'border-transparent hover:border-teal-500/30'
        }`}
        aria-label='Notifications'
      >
        <Bell className='w-6 h-6 relative z-10' />
        
        {/* Elegant badge for unread notifications */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className='absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-teal-500 rounded-full shadow-md shadow-teal-500/50 ring-2 ring-darkblack-600'
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
        
        {/* Subtle pulse indicator for active jobs */}
        {activeJobs.length > 0 && unreadCount === 0 && (
          <motion.div
            className='absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-400 rounded-full ring-2 ring-darkblack-600'
            animate={{ 
              scale: [1, 1.4, 1], 
              opacity: [1, 0.6, 1] 
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>

      {/* 📬 Dropdown Panel */}
      <AnimatePresence>
      {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-[calc(100vw-2rem)] bg-gradient-to-br from-darkblack-600 via-darkblack-700 to-darkblack-600 border rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-[calc(100vh-120px)] sm:max-h-[500px] ${
              shouldHighlightBell 
                ? 'border-teal-300 shadow-2xl shadow-teal-400/60 ring-4 ring-teal-300/70 brightness-105 z-[10000]' 
                : 'border-teal-500/30 z-50'
            }`}
            style={shouldHighlightBell ? { zIndex: 10000 } : {}}
          >
          {/* Encabezado */}
          <div className='p-4 border-b border-teal-500/20 bg-gradient-to-r from-teal-500/5 to-transparent'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <Bell className='w-5 h-5 text-teal-400' />
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className='absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full ring-2 ring-darkblack-700'
                    />
                  )}
                </div>
                <h3 className='text-lg font-bold text-white'>
                  <span className='bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent'>
              Notifications
                  </span>
                </h3>
              {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='text-xs px-2 py-1 bg-teal-500/20 text-teal-400 rounded-md font-semibold border border-teal-500/30'
                  >
                    {unreadCount} new
                  </motion.span>
                )}
              </div>
            </div>
            {activeJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center gap-2 text-xs text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20'
              >
                <Loader2 className='w-3 h-3 animate-spin' />
                <span className='font-medium'>{activeJobs.length} connection{activeJobs.length > 1 ? 's' : ''} in progress</span>
              </motion.div>
            )}
              {notifications.length > 0 && (
              <div className='flex items-center gap-3 mt-2'>
                  <button
                    onClick={markAllAsRead}
                  className='text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium'
                  >
                    Mark all read
                  </button>
                <span className='text-gray-600'>•</span>
                  <button
                    onClick={clearAllNotifications}
                    className='text-xs text-gray-400 hover:text-white transition-colors'
                  >
                    Clear all
                  </button>
              </div>
              )}
          </div>

          {/* Lista de notificaciones */}
          <div className='max-h-[500px] overflow-y-auto'>
            {notifications.length > 0 ? (
              <div className='divide-y divide-teal-500/10'>
                <AnimatePresence>
                  {notifications.map((notif, index) => (
                    <motion.div
                    key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-cyan-500/5 transition-all cursor-pointer border-l-2 ${
                        !notif.read
                          ? 'bg-gradient-to-r from-teal-500/5 to-transparent border-l-teal-500'
                          : 'border-l-transparent'
                    }`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className='flex items-start gap-3'>
                      <motion.div
                        className='flex-shrink-0 mt-0.5'
                        animate={notif.status === 'connecting' ? { rotate: 360 } : {}}
                        transition={notif.status === 'connecting' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
                      >
                        {getNotificationIcon(notif.type, notif.status)}
                      </motion.div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2'>
                          <h4 className={`text-sm font-semibold ${
                            notif.type === 'success' ? 'text-green-400' :
                            notif.type === 'error' ? 'text-red-400' :
                            notif.type === 'warning' ? 'text-yellow-400' :
                            'text-white'
                          }`}>
                            {notif.title}
                          </h4>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              clearNotification(notif.id);
                            }}
                            className='text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700/50'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </div>
                        <p className='text-xs text-gray-300 mt-1.5 leading-relaxed'>{notif.message}</p>
                        <div className='flex items-center gap-2 mt-2'>
                          <p className='text-xs text-gray-500'>
                          {new Date(notif.createdAt).toLocaleTimeString()}
                        </p>
                          {notif.accountName && (
                            <>
                              <span className='text-gray-600'>•</span>
                              <span className='text-xs text-teal-400 font-medium'>{notif.accountName}</span>
                            </>
                          )}
                        </div>

                        {/* 🔵 Barra de progreso opcional */}
                        {notif.progress !== undefined && notif.progress < 100 && (
                          <div className='mt-3 w-full bg-gray-800/60 rounded-full h-2 overflow-hidden shadow-inner'>
                            <motion.div
                              className='h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 rounded-full relative'
                              initial={{ width: 0 }}
                              animate={{ width: `${notif.progress}%` }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.div
                                className='absolute inset-0 bg-white/30'
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                              />
                            </motion.div>
                            <span className='text-xs text-gray-400 mt-1 block'>{notif.progress}%</span>
                          </div>
                        )}

                        {/* Botones de acción según tipo */}
                        {notif.type === 'error' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={e => {
                              e.stopPropagation();
                              handleRetry(notif);
                            }}
                            className='mt-3 flex items-center gap-2 px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-400 hover:text-blue-300 font-semibold rounded-lg border border-blue-500/30 transition-all'
                          >
                            <RefreshCw className='w-3 h-3' />
                            Retry Connection
                            <ArrowRight className='w-3 h-3' />
                          </motion.button>
                        )}

                        {notif.type === 'success' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={e => {
                              e.stopPropagation();
                              navigate('/accounts');
                              setIsOpen(false);
                            }}
                            className='mt-3 flex items-center gap-2 px-3 py-1.5 text-xs bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-teal-400 hover:text-teal-300 font-semibold rounded-lg border border-teal-500/30 transition-all'
                          >
                            <Sparkles className='w-3 h-3' />
                            View Account
                            <ArrowRight className='w-3 h-3' />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='p-12 text-center'
              >
                <Bell className='w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50' />
                <p className='text-gray-400 text-sm font-medium'>No notifications yet</p>
                <p className='text-gray-500 text-xs mt-1'>We'll notify you when something happens</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationBell;
