import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface ProgressContextType {
  accountIsFullySync: boolean;
  setAccountIsFullySync: (value: boolean) => void;
  accountIsBeenDeploying: boolean;
  setAccountIsBeenDeploying: (value: boolean) => void;
  newAccountID: string;
  setNewAccountID: (value: string) => void;
  showProgressBar: boolean;
  setShowProgressBar: (value: boolean) => void;
  notAccount: boolean;
  setNotAccount: (value: boolean) => void;
  isSyncing: boolean;
  setIsSyncing: (value: boolean) => void;
  progress: number;
  setProgress: (value: number) => void;
  progressMessage: string;
  setProgressMessage: (value: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const IDLE_CREEP_MAX = 10;
const IDLE_CREEP_RATE = 0.02;
const PRE_COMPLETE_CAP = 94;
const TICK_MS = 50;

export const useProgressBar = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressBar debe usarse dentro de ProgressBarProvider');
  }
  return context;
};

export const ProgressBarProvider = ({ children }: { children: ReactNode }) => {
  const [accountIsFullySync, setAccountIsFullySync] = useState<boolean>(false);
  const [accountIsBeenDeploying, setAccountIsBeenDeploying] = useState<boolean>(false);
  const [newAccountID, setNewAccountID] = useState<string>('');
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [notAccount, setNotAccount] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgressState] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('Initializing connection...');

  const milestoneRef = useRef(0);
  const idleBonusRef = useRef(0);

  const setProgress = useCallback((value: number) => {
    if (value <= 0) {
      milestoneRef.current = 0;
      idleBonusRef.current = 0;
      setProgressState(0);
      return;
    }

    if (value >= 100) {
      milestoneRef.current = 100;
      idleBonusRef.current = 0;
      return;
    }

    if (value > milestoneRef.current) {
      milestoneRef.current = value;
      idleBonusRef.current = Math.min(idleBonusRef.current, 1.5);
    }
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgressState(prev => {
        const milestone = milestoneRef.current;

        if (milestone >= 100) {
          if (prev >= 100) return 100;
          return Math.min(prev + 2.5, 100);
        }

        if (milestone > 0) {
          idleBonusRef.current = Math.min(
            idleBonusRef.current + IDLE_CREEP_RATE,
            IDLE_CREEP_MAX
          );
        }

        const goal = Math.min(milestone + idleBonusRef.current, PRE_COMPLETE_CAP);

        if (Math.abs(prev - goal) < 0.05) {
          return Math.round(goal * 10) / 10;
        }

        const diff = goal - prev;
        const step =
          Math.sign(diff) * Math.min(Math.abs(diff) * 0.07 + 0.08, diff > 0 ? 0.9 : 2);

        return Math.round(Math.min(Math.max(prev + step, 0), PRE_COMPLETE_CAP) * 10) / 10;
      });
    }, TICK_MS);

    return () => clearInterval(tick);
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        accountIsFullySync,
        setAccountIsFullySync,
        accountIsBeenDeploying,
        setAccountIsBeenDeploying,
        newAccountID,
        setNewAccountID,
        showProgressBar,
        setShowProgressBar,
        notAccount,
        setNotAccount,
        isSyncing,
        setIsSyncing,
        progress,
        setProgress,
        progressMessage,
        setProgressMessage,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
