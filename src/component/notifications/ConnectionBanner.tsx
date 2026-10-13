import { useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Rocket,
  Network,
  Database,
  WifiOff,
  AlertTriangle,
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useAccountState } from '@/context/accounts/useAccountState';
import { useConnectionJobs } from '@/context/ConnectionJobContext';
import { useConnectionJob } from '@/hook/useConnectionJob';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConnectionJob, JobStep } from '@/types/connectionJob';

const STEP_CONFIG: Record<JobStep, { label: string; icon: typeof Rocket }> = {
  lock: { label: 'Preparing', icon: Rocket },
  state: { label: 'Checking', icon: Rocket },
  deploy: { label: 'Deploying', icon: Rocket },
  connect: { label: 'Connecting', icon: Network },
  metastats: { label: 'Loading Stats', icon: Database },
  sync: { label: 'Syncing', icon: Database },
  stream: { label: 'Streaming', icon: Network },
};

// Job Progress Card Component
function JobProgressCard({
  job,
  onDismiss,
}: {
  job: ConnectionJob;
  onDismiss: () => void;
}) {
  const stepConfig = STEP_CONFIG[job.step];
  const StepIcon = stepConfig?.icon ?? Rocket;
  const isStalled = job.status === 'STALLED';

  return (
    <motion.div
      initial={{ x: 400, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ pointerEvents: 'auto' }}
      className={`rounded-xl shadow-2xl border backdrop-blur-xl overflow-hidden ${
        isStalled
          ? 'bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-600 border-yellow-400/30'
          : 'bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-600 border-teal-400/30'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {isStalled ? (
              <AlertTriangle className="w-5 h-5 text-white" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">
                {isStalled ? 'Connection Stalled' : 'Connecting Account'}
              </h3>
              <button
                onClick={onDismiss}
                className="text-white/60 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10 flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/90 mb-1">{job.accountName}</p>
            <p className="text-xs text-white/70 mb-2">
              {isStalled
                ? 'This is taking longer than expected...'
                : job.message ?? stepConfig?.label ?? 'Processing...'}
            </p>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <StepIcon className="w-3 h-3 text-white/80" />
                  <span className="text-xs font-medium text-white/90">
                    {stepConfig?.label ?? 'Processing'}
                  </span>
                </div>
                <span className="text-xs font-bold text-white">{job.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${job.progress}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/50"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Job Success Card Component
function JobSuccessCard({
  job,
  onViewAccount,
  onDismiss,
}: {
  job: ConnectionJob;
  onViewAccount: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ pointerEvents: 'auto' }}
      className="rounded-xl shadow-2xl border backdrop-blur-xl overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-green-600 border-green-400/30"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">Account Connected!</h3>
              <button
                onClick={onDismiss}
                className="text-white/60 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10 flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/90 mb-2">{job.accountName} is now ready to use.</p>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewAccount}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg border border-white/30 transition-all"
            >
              <Sparkles className="w-3 h-3" />
              View Account
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Job Error Card Component
function JobErrorCard({
  job,
  onRetry,
  onDismiss,
  isRetrying,
}: {
  job: ConnectionJob;
  onRetry: () => void;
  onDismiss: () => void;
  isRetrying: boolean;
}) {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ pointerEvents: 'auto' }}
      className="rounded-xl shadow-2xl border backdrop-blur-xl overflow-hidden bg-gradient-to-br from-red-600 via-rose-600 to-red-600 border-red-400/30"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <XCircle className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">Connection Failed</h3>
              <button
                onClick={onDismiss}
                className="text-white/60 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10 flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/90 mb-1">{job.accountName}</p>
            <p className="text-xs text-white/70 mb-2">
              {job.error ?? 'An unexpected error occurred.'}
            </p>

            {/* Action Button */}
            {job.retryable && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                disabled={isRetrying}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white font-semibold rounded-lg border border-white/30 transition-all"
              >
                {isRetrying ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </motion.div>
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3" />
                    Retry
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Socket Disconnection Warning Component
function SocketDisconnectionWarning() {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ pointerEvents: 'auto' }}
      className="rounded-xl shadow-2xl border backdrop-blur-xl overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-orange-600 border-orange-400/30"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-white" />
          <div>
            <h3 className="text-sm font-semibold text-white">Connection Lost</h3>
            <p className="text-xs text-white/80">
              Real-time updates paused. Reconnecting...
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const ConnectionBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, markAsRead, clearNotification } = useNotifications();

  const { setAccountName, setAccountNumber, setAccountType, setSelectedServer, setHandleActive } =
    useAccountState();

  // Connection jobs context
  const { jobs, socketStatus, clearJob, clearCompletedJobs } = useConnectionJobs();
  const { retryJob, isStarting: isRetrying } = useConnectionJob();

  // Convert jobs Map to array for rendering
  const jobsArray = useMemo(() => Array.from(jobs.values()), [jobs]);

  // Separate jobs by status
  const activeJobs = useMemo(
    () => jobsArray.filter(j => j.status === 'PENDING' || j.status === 'ACTIVE' || j.status === 'STALLED'),
    [jobsArray]
  );
  const completedJobs = useMemo(
    () => jobsArray.filter(j => j.status === 'COMPLETED'),
    [jobsArray]
  );
  const failedJobs = useMemo(
    () => jobsArray.filter(j => j.status === 'FAILED'),
    [jobsArray]
  );

  // Legacy notifications (for backwards compatibility)
  const legacyActiveNotifs = notifications.filter(
    n => n.status === 'connecting' || n.status === 'pending'
  );
  const legacyCompletedNotifs = notifications.filter(
    n => (n.status === 'success' || n.status === 'error') && !n.read
  );

  // Auto-dismiss completed jobs after 5 seconds
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    completedJobs.forEach(job => {
      const timer = setTimeout(() => {
        clearJob(job.jobId);
      }, 5000);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [completedJobs, clearJob]);

  // Auto-dismiss legacy success notifications after 5 seconds
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    legacyCompletedNotifs.forEach(notif => {
      if (notif.type === 'success' && !notif.read) {
        const timer = setTimeout(() => {
          markAsRead(notif.id);
        }, 5000);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [legacyCompletedNotifs, markAsRead]);

  const handleRetry = (notif: { accountName?: string; accountNumber?: string; accountType?: string; server?: string; id: string }) => {
    if (!notif.accountName) return;
    setAccountName(notif.accountName);
    setAccountNumber(notif.accountNumber ?? '');
    setAccountType(notif.accountType ?? '');
    setSelectedServer(notif.server ?? '');
    setHandleActive(true);
    markAsRead(notif.id);
  };

  const handleViewAccount = (jobId?: string) => {
    if (jobId) {
      clearJob(jobId);
    }
    navigate('/accounts');
  };

  const handleDismissJob = (jobId: string) => {
    clearJob(jobId);
  };

  const handleRetryJob = async (jobId: string) => {
    await retryJob(jobId);
  };

  const handleDismissNotif = (notifId: string) => {
    markAsRead(notifId);
    clearNotification(notifId);
  };

  // Determine connection stage based on progress (for legacy notifications)
  const getConnectionStage = (progress?: number) => {
    if (!progress) return { stage: 'Starting', icon: Rocket, color: 'text-teal-200' };

    if (progress < 20) return { stage: 'Creating', icon: Rocket, color: 'text-teal-200' };
    if (progress < 40) return { stage: 'Deploying', icon: Rocket, color: 'text-teal-200' };
    if (progress < 60) return { stage: 'Connecting', icon: Network, color: 'text-cyan-200' };
    if (progress < 100) return { stage: 'Syncing', icon: Database, color: 'text-cyan-200' };

    return { stage: 'Completing', icon: CheckCircle, color: 'text-green-200' };
  };

  // Determine if we should show the banner
  const hasActiveJobs = activeJobs.length > 0;
  const hasCompletedJobs = completedJobs.length > 0;
  const hasFailedJobs = failedJobs.length > 0;
  const hasLegacyNotifs = legacyActiveNotifs.length > 0 || legacyCompletedNotifs.length > 0;
  const isSocketDisconnected = socketStatus === 'disconnected' && hasActiveJobs;

  const shouldShow = hasActiveJobs || hasCompletedJobs || hasFailedJobs || hasLegacyNotifs || isSocketDisconnected;

  // Hide banner when on accounts page or when there's nothing to show
  if (location.pathname === '/accounts' || !shouldShow) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-md w-full sm:w-96 pointer-events-none">
      <AnimatePresence>
        {/* Socket disconnection warning */}
        {isSocketDisconnected && <SocketDisconnectionWarning key="socket-warning" />}

        {/* Active connection jobs */}
        {activeJobs.map(job => (
          <JobProgressCard
            key={job.jobId}
            job={job}
            onDismiss={() => handleDismissJob(job.jobId)}
          />
        ))}

        {/* Completed jobs */}
        {completedJobs.map(job => (
          <JobSuccessCard
            key={job.jobId}
            job={job}
            onViewAccount={() => handleViewAccount(job.jobId)}
            onDismiss={() => handleDismissJob(job.jobId)}
          />
        ))}

        {/* Failed jobs */}
        {failedJobs.map(job => (
          <JobErrorCard
            key={job.jobId}
            job={job}
            onRetry={() => handleRetryJob(job.jobId)}
            onDismiss={() => handleDismissJob(job.jobId)}
            isRetrying={isRetrying}
          />
        ))}

        {/* Legacy notifications (for backwards compatibility) */}
        {[...legacyActiveNotifs, ...legacyCompletedNotifs].map((notif, index) => {
          const isActive = notif.status === 'connecting' || notif.status === 'pending';
          const isSuccess = notif.type === 'success';
          const isError = notif.type === 'error';

          return (
            <motion.div
              key={notif.id}
              initial={{ x: 400, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 400, opacity: 0, scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: index * 0.1,
              }}
              style={{ pointerEvents: 'auto' }}
              className={`rounded-xl shadow-2xl border backdrop-blur-xl overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-600 border-teal-400/30'
                  : isSuccess
                    ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-green-600 border-green-400/30'
                    : 'bg-gradient-to-br from-red-600 via-rose-600 to-red-600 border-red-400/30'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="w-5 h-5 text-white" />
                      </motion.div>
                    ) : isSuccess ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{notif.title}</h3>
                      <button
                        onClick={() => handleDismissNotif(notif.id)}
                        className="text-white/60 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10 flex-shrink-0"
                        aria-label="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-white/90 mb-2">{notif.message}</p>

                    {notif.accountName && (
                      <p className="text-xs text-white/80 mb-2">{notif.accountName}</p>
                    )}

                    {/* Progress Bar for Active Jobs */}
                    {isActive && notif.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-white/90">
                            {getConnectionStage(notif.progress).stage}
                          </span>
                          <span className="text-xs font-bold text-white">{notif.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-white rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${notif.progress}%` }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white/50"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-2">
                      {isSuccess && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            markAsRead(notif.id);
                            navigate('/accounts');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg border border-white/30 transition-all"
                        >
                          <Sparkles className="w-3 h-3" />
                          View Account
                          <ArrowRight className="w-3 h-3" />
                        </motion.button>
                      )}

                      {isError && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRetry(notif)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg border border-white/30 transition-all"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry
                          <ArrowRight className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ConnectionBanner;
