import { useState, useCallback } from 'react';
import { http } from '@/utils/http_request';
import { useConnectionJobs } from '@/context/ConnectionJobContext';
import type { ConnectionJob } from '@/types/connectionJob';

interface StartConnectionJobParams {
  accountId: string;
  accountName: string;
  accountNumber: string;
}

interface StartConnectionJobResponse {
  jobId: string;
  status: string;
  message: string;
}

export function useConnectionJob() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createJob } = useConnectionJobs();

  const startConnectionJob = useCallback(
    async ({ accountId, accountName, accountNumber }: StartConnectionJobParams) => {
      setIsStarting(true);
      setError(null);

      try {
        const response = await http.post<StartConnectionJobResponse>('/account/connect-job', {
          accountId,
        });

        const { jobId } = response.data;

        // Create the job in context with PENDING status
        // The socket will update it to ACTIVE when JOB_START is received
        const job: Omit<ConnectionJob, 'createdAt' | 'updatedAt'> = {
          jobId,
          accountId,
          accountName,
          accountNumber,
          status: 'PENDING',
          step: 'lock',
          progress: 0,
        };

        createJob(job);

        return { success: true, jobId };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              'Failed to start connection job';

        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsStarting(false);
      }
    },
    [createJob]
  );

  const retryJob = useCallback(
    async (jobId: string) => {
      setIsStarting(true);
      setError(null);

      try {
        const response = await http.post<StartConnectionJobResponse>('/account/retry-job', {
          jobId,
        });

        return { success: true, jobId: response.data.jobId };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              'Failed to retry connection job';

        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsStarting(false);
      }
    },
    []
  );

  return {
    startConnectionJob,
    retryJob,
    isStarting,
    error,
  };
}
