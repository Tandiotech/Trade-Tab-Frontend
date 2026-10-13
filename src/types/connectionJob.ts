// types/connectionJob.ts

export type JobStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'STALLED';

export type JobStep = 'lock' | 'state' | 'deploy' | 'connect' | 'metastats' | 'sync' | 'stream';

export interface JobStartPayload {
  jobId: string;
  accountId: string;
  accountName: string;
  accountNumber: string;
  step: JobStep;
  progress: number;
  timestamp: number;
}

export interface JobProgressPayload {
  jobId: string;
  accountId: string;
  step: JobStep;
  progress: number;
  message?: string;
  timestamp: number;
}

export interface JobDonePayload {
  jobId: string;
  accountId: string;
  accountName: string;
  accountNumber: string;
  step: JobStep;
  progress: number;
  result?: Record<string, unknown>;
  timestamp: number;
}

export interface JobErrorPayload {
  jobId: string;
  accountId: string;
  step: JobStep;
  error: string;
  retryable: boolean;
  timestamp: number;
}

export interface ConnectionJob {
  jobId: string;
  accountId: string;
  accountName: string;
  accountNumber: string;
  status: JobStatus;
  step: JobStep;
  progress: number;
  message?: string;
  error?: string;
  retryable?: boolean;
  createdAt: number;
  updatedAt: number;
}
