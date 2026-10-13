import { motion } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Rocket,
  Network,
  Database,
  CheckCircle,
  Loader2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import type { ConnectionJob, JobStep } from '@/types/connectionJob';

interface ConnectionProgressViewProps {
  job: ConnectionJob;
  socketStatus: 'connected' | 'disconnected' | 'reconnecting';
  onCancel: () => void;
}

const STEP_CONFIG: Record<JobStep, { label: string; icon: typeof Rocket }> = {
  lock: { label: 'Preparing', icon: Rocket },
  state: { label: 'Checking State', icon: Rocket },
  deploy: { label: 'Deploying', icon: Rocket },
  connect: { label: 'Connecting', icon: Network },
  metastats: { label: 'Loading Stats', icon: Database },
  sync: { label: 'Syncing Data', icon: Database },
  stream: { label: 'Streaming History', icon: Database },
};

const STEP_ORDER: JobStep[] = ['deploy', 'connect', 'sync', 'stream'];

export function ConnectionProgressView({
  job,
  socketStatus,
  onCancel,
}: ConnectionProgressViewProps) {
  const currentStepIndex = STEP_ORDER.indexOf(job.step);
  const isStalled = job.status === 'STALLED';

  return (

    <div className="p-4 sm:p-6 space-y-6">
      {/* Progress banner */}
      <div className="bg-darkblack-600 border border-teal-500/30 rounded-xl overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            {isStalled ? (
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            ) : job.progress >= 100 ? (
              <CheckCircle className="w-8 h-8 text-teal-400" />
            ) : (
              <div className="w-8 h-8 rounded-full border-[3px] border-gray-700 border-t-teal-400 animate-spin"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
              Connecting <em className="not-italic text-teal-400">{job.accountName}</em>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {!isStalled && job.progress < 100 && (
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div>
              )}
              <div className="text-[11px] text-teal-400">
                {isStalled ? 'Syncing in background...' : job.message ?? STEP_CONFIG[job.step]?.label ?? 'Processing...'}
              </div>
            </div>
          </div>
          <div className="font-mono text-[13px] font-semibold text-teal-400 flex-shrink-0">
            {job.progress}%
          </div>
          {isStalled && (
            <button onClick={onCancel} className="p-1 text-gray-400 hover:text-white transition-colors">
              ✕
            </button>
          )}
        </div>
        
        {/* Fill bar */}
        <div className="h-[3px] bg-gray-700">
          <div 
            className="h-full bg-teal-400 transition-all duration-700 ease-out" 
            style={{ width: `${job.progress}%` }}
          ></div>
        </div>
        
        {/* Stage dots */}
        <div className="px-4 py-3 flex justify-between gap-1">
          {STEP_ORDER.map((step, index) => {
            const stepConfig = STEP_CONFIG[step];
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-teal-500' : 
                  isCurrent && !isStalled ? 'bg-teal-400 ring-[3px] ring-teal-400/20 animate-pulse' : 
                  'bg-gray-700'
                }`}></div>
                <div className={`text-[9px] ${
                  isCompleted ? 'text-teal-500/80' : 
                  isCurrent ? 'text-teal-400' : 
                  'text-gray-500'
                }`}>
                  {stepConfig.label.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* Informative UI block for sync phase */}
      {(job.step === 'sync' || job.step === 'stream' || isStalled) && (
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 flex items-start gap-3">
          <div className="text-teal-400 mt-0.5 flex-shrink-0">
            {isStalled ? <Database className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
          </div>
          <div className="text-[11px] text-gray-300 leading-relaxed">
            <strong className="text-teal-400 font-medium">Downloading historical trades...</strong><br/>
            Depending on your broker's speed and account history size, this may take 1-3 minutes. Please wait...
            {isStalled && " The process is continuing in the background, you can close this window."}
          </div>
        </div>
      )}

      {/* Dashboard placeholders */}
      <div className="px-1">
        <div className="text-[12px] font-semibold text-gray-400 mb-3">Dashboard — available once connected</div>
        <div className="grid grid-cols-2 gap-2 opacity-50">
          <div className="bg-darkblack-600 border border-gray-700/50 rounded-lg p-3">
            <div className="text-[10px] text-gray-500 mb-1">Account Balance</div>
            <div className="text-[16px] font-semibold font-mono text-gray-400">—</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Waiting for sync</div>
          </div>
          <div className="bg-darkblack-600 border border-gray-700/50 rounded-lg p-3">
            <div className="text-[10px] text-gray-500 mb-1">Open Positions</div>
            <div className="text-[16px] font-semibold font-mono text-gray-400">—</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Waiting for sync</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1 text-[11px] text-gray-400">
        <div className="w-4 h-4 flex items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
          <span className="text-[10px]">ℹ</span>
        </div>
        You can use TradeTab freely while your account connects in the background.
      </div>
    </div>
  );
}
