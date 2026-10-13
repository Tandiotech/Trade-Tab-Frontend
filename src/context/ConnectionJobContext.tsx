import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import MetricSocket from '@/pages/metrics/socket/metricSocket';
import {
  JOB_START,
  JOB_PROGRESS,
  JOB_DONE,
  JOB_ERROR,
} from '@/pages/metrics/socket/socketsMessages';
import type {
  ConnectionJob,
  JobStartPayload,
  JobProgressPayload,
  JobDonePayload,
  JobErrorPayload,
} from '@/types/connectionJob';
import { useMTAccounts } from './accounts/MTAccountsContext';

type SocketStatus = 'connected' | 'disconnected' | 'reconnecting';

interface ConnectionJobContextProps {
  jobs: Map<string, ConnectionJob>;
  socketStatus: SocketStatus;
  createJob: (job: Omit<ConnectionJob, 'createdAt' | 'updatedAt'>) => void;
  getJob: (jobId: string) => ConnectionJob | undefined;
  getJobByAccountId: (accountId: string) => ConnectionJob | undefined;
  clearJob: (jobId: string) => void;
  clearCompletedJobs: () => void;
}

const ConnectionJobContext = createContext<ConnectionJobContextProps | undefined>(undefined);

const JOB_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

export function ConnectionJobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Map<string, ConnectionJob>>(new Map());
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('disconnected');
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const listenersRegisteredRef = useRef(false);
  const { refreshAccounts } = useMTAccounts();

  // Create or update a job
  const createJob = useCallback((job: Omit<ConnectionJob, 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newJob: ConnectionJob = {
      ...job,
      createdAt: now,
      updatedAt: now,
    };

    setJobs(prev => {
      const updated = new Map(prev);
      updated.set(job.jobId, newJob);
      return updated;
    });

    // Set timeout for stall detection
    startTimeout(job.jobId);
  }, []);

  // Get job by ID
  const getJob = useCallback((jobId: string) => {
    return jobs.get(jobId);
  }, [jobs]);

  // Get job by account ID
  const getJobByAccountId = useCallback((accountId: string) => {
    for (const job of jobs.values()) {
      if (job.accountId === accountId) {
        return job;
      }
    }
    return undefined;
  }, [jobs]);

  // Clear a specific job
  const clearJob = useCallback((jobId: string) => {
    clearTimeout(timeoutsRef.current.get(jobId));
    timeoutsRef.current.delete(jobId);

    setJobs(prev => {
      const updated = new Map(prev);
      updated.delete(jobId);
      return updated;
    });
  }, []);

  // Clear all completed/failed jobs
  const clearCompletedJobs = useCallback(() => {
    setJobs(prev => {
      const updated = new Map(prev);
      for (const [jobId, job] of updated) {
        if (job.status === 'COMPLETED' || job.status === 'FAILED') {
          clearTimeout(timeoutsRef.current.get(jobId));
          timeoutsRef.current.delete(jobId);
          updated.delete(jobId);
        }
      }
      return updated;
    });
  }, []);

  // Start or restart timeout for a job
  const startTimeout = useCallback((jobId: string) => {
    // Clear existing timeout
    const existingTimeout = timeoutsRef.current.get(jobId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setJobs(prev => {
        const job = prev.get(jobId);
        if (job && job.status === 'ACTIVE') {
          const updated = new Map(prev);
          updated.set(jobId, {
            ...job,
            status: 'STALLED',
            message: 'Connection timed out. You may cancel or wait.',
            updatedAt: Date.now(),
          });
          return updated;
        }
        return prev;
      });
    }, JOB_TIMEOUT_MS);

    timeoutsRef.current.set(jobId, timeout);
  }, []);

  // Handle job start event
  const handleJobStart = useCallback((payload: JobStartPayload) => {
    const now = Date.now();
    setJobs(prev => {
      const updated = new Map(prev);
      updated.set(payload.jobId, {
        jobId: payload.jobId,
        accountId: payload.accountId,
        accountName: payload.accountName,
        accountNumber: payload.accountNumber,
        status: 'ACTIVE',
        step: payload.step,
        progress: payload.progress,
        createdAt: now,
        updatedAt: now,
      });
      return updated;
    });
    startTimeout(payload.jobId);
  }, [startTimeout]);

  // Handle job progress event
  const handleJobProgress = useCallback((payload: JobProgressPayload) => {
    setJobs(prev => {
      const job = prev.get(payload.jobId);
      if (!job) return prev;

      const updated = new Map(prev);
      updated.set(payload.jobId, {
        ...job,
        status: 'ACTIVE',
        step: payload.step,
        progress: payload.progress,
        message: payload.message,
        updatedAt: Date.now(),
      });
      return updated;
    });
    // Reset timeout on progress
    startTimeout(payload.jobId);
  }, [startTimeout]);

  // Handle job done event
  const handleJobDone = useCallback((payload: JobDonePayload) => {
    // Clear timeout
    clearTimeout(timeoutsRef.current.get(payload.jobId));
    timeoutsRef.current.delete(payload.jobId);

    setJobs(prev => {
      const job = prev.get(payload.jobId);
      if (!job) return prev;

      const updated = new Map(prev);
      updated.set(payload.jobId, {
        ...job,
        status: 'COMPLETED',
        step: payload.step,
        progress: 100,
        message: 'Connection successful!',
        updatedAt: Date.now(),
      });
      return updated;
    });
    // FIX B5: Invalidate accounts cache when job completes
    void refreshAccounts();
  }, [refreshAccounts]);

  // Handle job error event
  const handleJobError = useCallback((payload: JobErrorPayload) => {
    // Clear timeout
    clearTimeout(timeoutsRef.current.get(payload.jobId));
    timeoutsRef.current.delete(payload.jobId);

    setJobs(prev => {
      const job = prev.get(payload.jobId);
      if (!job) return prev;

      const updated = new Map(prev);
      updated.set(payload.jobId, {
        ...job,
        status: 'FAILED',
        step: payload.step,
        error: payload.error,
        retryable: payload.retryable,
        updatedAt: Date.now(),
      });
      return updated;
    });
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (listenersRegisteredRef.current) return;

    const socket = MetricSocket.getInstance();

    // Check initial connection status
    if (socket.isConnected()) {
      setSocketStatus('connected');
    }

    // Register job event listeners
    socket.on(JOB_START, handleJobStart);
    socket.on(JOB_PROGRESS, handleJobProgress);
    socket.on(JOB_DONE, handleJobDone);
    socket.on(JOB_ERROR, handleJobError);

    listenersRegisteredRef.current = true;

    // Cleanup on unmount
    return () => {
      socket.off(JOB_START);
      socket.off(JOB_PROGRESS);
      socket.off(JOB_DONE);
      socket.off(JOB_ERROR);

      // Clear all timeouts
      for (const timeout of timeoutsRef.current.values()) {
        clearTimeout(timeout);
      }
      timeoutsRef.current.clear();

      listenersRegisteredRef.current = false;
    };
  }, [handleJobStart, handleJobProgress, handleJobDone, handleJobError]);

  // Update socket status based on connection
  useEffect(() => {
    const socket = MetricSocket.getInstance();

    const checkStatus = () => {
      setSocketStatus(socket.isConnected() ? 'connected' : 'disconnected');
    };

    // Check status periodically
    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectionJobContext.Provider
      value={{
        jobs,
        socketStatus,
        createJob,
        getJob,
        getJobByAccountId,
        clearJob,
        clearCompletedJobs,
      }}
    >
      {children}
    </ConnectionJobContext.Provider>
  );
}

export function useConnectionJobs() {
  const context = useContext(ConnectionJobContext);
  if (!context) {
    throw new Error('useConnectionJobs must be used within ConnectionJobProvider');
  }
  return context;
}
