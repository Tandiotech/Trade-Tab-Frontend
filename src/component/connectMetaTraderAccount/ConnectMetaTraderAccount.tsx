import SelectMetaTraderVersion from './components/SelectMetaTraderVersion';
import BrokerServerSelector from './components/BrokerServerSelector';
import AddAccount_PasswordComp from './components/AddAccount_PasswordComp';
import GetAnAccount from '../listTab/GetAnAccount';
import { useAccountState } from '@/context/accounts/useAccountState';
import AccountNameInput from './components/AccountNameInput';
import AccountNumberInput from './components/AccountNumberInput';
import { ConnectionProgressView } from './components/ConnectionProgressView';
import { ConnectionSuccessView } from './components/ConnectionSuccessView';
import { ConnectionErrorView } from './components/ConnectionErrorView';
import {
  X,
  Shield,
  Key,
  User,
  Server,
  Loader2,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { http } from '@/utils/http_request';
import useCreateAccount from '@/hook/useCreateAccount';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useConnectionJobs } from '@/context/ConnectionJobContext';
import { useConnectionJob } from '@/hook/useConnectionJob';
import { useNavigate } from 'react-router-dom';

type ModalView = 'form' | 'progress' | 'success' | 'error';

const ConnectMetaTraderAccount = () => {
  const navigate = useNavigate();
  const {
    accountName,
    setAccountName,
    accountNumber,
    setAccountNumber,
    accountType,
    setAccountType,
    password,
    setPassword,
    viewPassword,
    setViewPassword,
    selectedServer,
    setSelectedServer,
    searchTerm,
    setSearchTerm,
    handleActive,
    closeModal,
    formErrors,
    isCompactMode,
  } = useAccountState();

  const { onSubmit } = useCreateAccount();
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshAccounts } = useMTAccounts();
  /** Only dismiss overlay on click if pointerdown started on the overlay (avoids ghost clicks after dropdown/list closes). */
  const overlayPointerStartedOnBackdropRef = useRef(false);

  // Connection job state
  const { jobs, socketStatus, clearJob } = useConnectionJobs();
  const { startConnectionJob, retryJob, isStarting } = useConnectionJob();
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [modalView, setModalView] = useState<ModalView>('form');
  const [currentStep, setCurrentStep] = useState(1);

  // Get current job from context
  const currentJob = currentJobId ? jobs.get(currentJobId) : undefined;

  // Update modal view based on job status
  useEffect(() => {
    if (!currentJob) {
      // If no job, stay on form view (unless modal just opened)
      if (modalView !== 'form') {
        setModalView('form');
      }
      return;
    }

    switch (currentJob.status) {
      case 'PENDING':
      case 'ACTIVE':
      case 'STALLED':
        setModalView('progress');
        break;
      case 'COMPLETED':
        setModalView('success');
        break;
      case 'FAILED':
        setModalView('error');
        break;
    }
  }, [currentJob?.status]);

  // Reset state when modal closes
  useEffect(() => {
    if (!handleActive) {
      setLoading(false);
      setCurrentJobId(null);
      setModalView('form');
      setCurrentStep(1);
    }
  }, [handleActive]);

  const validations = useMemo(
    () => ({
      type: ['4', '5'].includes(accountType),
      server: !!selectedServer,
      number: accountNumber.length >= 4,
      password: password.length >= 4,
      name: accountName.length >= 4,
    }),
    [accountType, selectedServer, accountNumber, password, accountName]
  );

  const steps = useMemo(
    () => [
      { key: 'type', label: 'Platform', icon: Shield, completed: validations.type },
      { key: 'server', label: 'Broker', icon: Server, completed: validations.server },
      { key: 'number', label: 'Account', icon: User, completed: validations.number },
      { key: 'password', label: 'Password', icon: Key, completed: validations.password },
      { key: 'name', label: 'Name', icon: User, completed: validations.name },
    ],
    [validations]
  );

  const completedSteps = steps.filter(s => s.completed).length;
  const isFormValid = completedSteps === steps.length;

  /**
   * Link an existing account
   */
  const linkAccount = async () => {
    setLoading(true);
    try {
      const payload = {
        account_number: accountNumber,
        broker_server: selectedServer,
        password,
        platform: accountType === '4' ? 'MT4' : 'MT5',
        accountName,
      };

      const res = await http.post('/account/link', payload);

      if (res.data.status === 200) {
        toast.success('Account linked successfully!');
        closeModal();
        refreshAccounts();
      } else {
        toast.error(res.data.message || 'Error linking account');
      }
    } catch (error: unknown) {
      console.error('Error linking account:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error linking account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission - creates account and starts connection job
   */
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading || isStarting) return;

    setLoading(true);

    try {
      if (accountExists) {
        await linkAccount();
        return;
      }

      const accountId = await onSubmit(e.nativeEvent || (e as unknown as Event), {
        deferModalClose: true,
      });

      if (accountId) {
        const result = await startConnectionJob({
          accountId,
          accountName: accountName,
          accountNumber: accountNumber,
        });

        if (result.success && result.jobId) {
          const isMobile = window.innerWidth < 640;
          toast.success(
            '🔄 Connection started! Monitor progress in the connection banner at the top.',
            {
              position: isMobile ? 'bottom-center' : 'bottom-right',
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: 'mobile-toast',
              style: {
                width: isMobile ? '90vw' : '320px',
                fontSize: isMobile ? '14px' : '16px',
              },
            }
          );
          setCurrentJobId(result.jobId);
          setModalView('progress');
        } else {
          toast.error(result.error || 'Failed to start connection');
        }
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } catch (err) {
      console.error('Account connection failed:', err);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle canceling a stalled job
   */
  const handleCancelJob = () => {
    if (currentJobId) {
      clearJob(currentJobId);
      setCurrentJobId(null);
      setModalView('form');
    }
  };

  /**
   * Handle retrying a failed job
   */
  const handleRetryJob = async () => {
    if (!currentJobId || !currentJob) return;

    const result = await retryJob(currentJobId);
    if (result.success) {
      setModalView('progress');
    } else {
      toast.error(result.error || 'Failed to retry connection');
    }
  };

  /**
   * Handle viewing the connected account
   */
  const handleViewAccount = () => {
    if (currentJobId) {
      clearJob(currentJobId);
    }
    closeModal();
    refreshAccounts();
    navigate('/accounts');
  };

  /**
   * Handle closing the modal from error view
   */
  const handleCloseFromError = () => {
    if (currentJobId) {
      clearJob(currentJobId);
    }
    closeModal();
  };

  // Determine if we should block closing the modal
  const isJobActive = currentJob && (currentJob.status === 'ACTIVE' || currentJob.status === 'PENDING');

  return (
    <AnimatePresence>
      {handleActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4'
          style={{ zIndex: 9999 }}
          onPointerDown={e => {
            overlayPointerStartedOnBackdropRef.current = e.target === e.currentTarget;
          }}
          onClick={e => {
            if (e.target !== e.currentTarget || loading || isJobActive) return;
            if (!overlayPointerStartedOnBackdropRef.current) return;
            overlayPointerStartedOnBackdropRef.current = false;
            closeModal();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='relative w-full max-w-2xl bg-gradient-to-br from-darkblack-600 via-darkblack-700 to-black rounded-2xl shadow-2xl border border-teal-500/20 overflow-hidden max-h-[95vh] flex flex-col backdrop-blur-xl'
          >
            {/* Render different views based on modal state */}
            {modalView === 'form' && (

              <>
                {/* Header */}
                <div className='relative p-4 sm:p-6 border-b border-gray-700/50 flex-shrink-0'>
                  <button
                    onClick={closeModal}
                    className='absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 z-10'
                    aria-label='Close modal'
                  >
                    <X className='w-5 h-5 sm:w-6 sm:h-6' />
                  </button>

                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xl'>⚡</span>
                    <h2 className='text-lg font-bold text-white'>
                      Quick Connect
                    </h2>
                  </div>
                  <div className='flex items-center gap-3 text-xs text-gray-400 mb-4'>
                    <span className='flex items-center gap-1'><div className='w-1.5 h-1.5 bg-teal-400 rounded-full'></div> Real-time sync</span>
                    <span className='flex items-center gap-1'><div className='w-1.5 h-1.5 bg-cyan-400 rounded-full'></div> Background processing</span>
                  </div>

                  {/* Stepper */}
                  <div className='mb-2'>
                    <div className='flex items-center'>
                      <div className='flex flex-col items-center'>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all z-10 relative ${currentStep > 1 ? 'bg-teal-500 border-teal-500 text-black' : currentStep === 1 ? 'bg-darkblack-600 border-teal-500 text-teal-400 ring-4 ring-teal-500/10' : 'bg-darkblack-500 border-gray-600 text-gray-400'}`}>
                          {currentStep > 1 ? '✓' : '1'}
                        </div>
                      </div>
                      <div className={`flex-1 h-0.5 -mx-1 transition-all z-0 relative ${currentStep > 1 ? 'bg-teal-500' : 'bg-gray-600'}`}></div>
                      <div className='flex flex-col items-center'>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all z-10 relative ${currentStep > 2 ? 'bg-teal-500 border-teal-500 text-black' : currentStep === 2 ? 'bg-darkblack-600 border-teal-500 text-teal-400 ring-4 ring-teal-500/10' : 'bg-darkblack-500 border-gray-600 text-gray-400'}`}>
                          {currentStep > 2 ? '✓' : '2'}
                        </div>
                      </div>
                      <div className={`flex-1 h-0.5 -mx-1 transition-all z-0 relative ${currentStep > 2 ? 'bg-teal-500' : 'bg-gray-600'}`}></div>
                      <div className='flex flex-col items-center'>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all z-10 relative ${currentStep === 3 ? 'bg-darkblack-600 border-teal-500 text-teal-400 ring-4 ring-teal-500/10' : 'bg-darkblack-500 border-gray-600 text-gray-400'}`}>
                          3
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-between px-1 mt-1.5'>
                      <div className={`text-[10px] ${currentStep >= 1 ? 'text-teal-400' : 'text-gray-400'}`}>Platform</div>
                      <div className={`text-[10px] ${currentStep >= 2 ? 'text-teal-400' : 'text-gray-400'}`}>Credentials</div>
                      <div className={`text-[10px] ${currentStep === 3 ? 'text-teal-400' : 'text-gray-400'}`}>Confirm</div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <form
                  className='flex-1 overflow-y-auto'
                  onSubmit={handleFinalSubmit}
                  autoComplete='off'
                  data-form-type='other'
                >
                  <div className='p-4 sm:p-6 space-y-6'>
                    {currentStep === 1 && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                        <div className='flex items-center justify-between mb-4'>
                          <div className='text-xs text-gray-400'>Step <span className='text-teal-400 font-semibold'>1</span> of 3 · Select your trading platform</div>
                          <GetAnAccount className='text-teal-400 hover:text-teal-300 text-xs cursor-pointer transition-colors duration-200' />
                        </div>
                        
                        <SelectMetaTraderVersion accountType={accountType} setAccountType={setAccountType} />
                        
                        {accountType && (
                          <div className='mt-4'>
                            <BrokerServerSelector
                              mt_version={parseInt(accountType)}
                              setSelectedServer={setSelectedServer}
                              searchTerm={searchTerm}
                              setSearchTerm={setSearchTerm}
                            />
                          </div>
                        )}

                        <div className='mt-6'>
                          <button
                            type='button'
                            disabled={!validations.type || !validations.server}
                            onClick={() => setCurrentStep(2)}
                            className='w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:bg-gray-700 text-black disabled:text-gray-400 font-bold rounded-lg transition-all duration-200'
                          >
                            Continue →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                        <div className='text-xs text-gray-400 mb-4'>Step <span className='text-teal-400 font-semibold'>2</span> of 3 · Enter your credentials</div>
                        
                        <div className='bg-teal-500/5 border border-teal-500/15 rounded-lg p-3 flex items-start gap-3 mb-6'>
                          <Lock className='w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5' />
                          <div className='text-xs text-gray-300 leading-relaxed'>
                            <strong className='text-teal-400 font-medium'>Your password is never stored.</strong> We use it one-time to establish a secure read-only connection. Credentials are encrypted in transit using TLS 1.3.
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
                          <AccountNumberInput
                            setAccountNumber={setAccountNumber}
                            accountNumber={accountNumber}
                            formError={formErrors.accountNumber}
                            setAccountExists={setAccountExists}
                            isCompactMode={isCompactMode}
                          />

                          <AddAccount_PasswordComp
                            password={password}
                            viewPassword={viewPassword}
                            setPassword={setPassword}
                            setViewPassword={setViewPassword}
                            errorBorder={formErrors.password}
                            isValid={accountNumber.length >= 4}
                          />
                        </div>

                        <div className='h-px bg-gray-700/50 my-6'></div>

                        <AccountNameInput
                          accountName={accountName}
                          setAccountName={setAccountName}
                          formErrors={formErrors}
                          canBeUsed={accountNumber.length >= 4}
                        />

                        <div className='flex gap-2 mt-6'>
                          <button
                            type='button'
                            onClick={() => setCurrentStep(1)}
                            className='flex-1 py-3 bg-darkblack-500 border border-gray-600 hover:bg-darkblack-400 text-gray-300 font-medium rounded-lg transition-all duration-200'
                          >
                            ← Back
                          </button>
                          <button
                            type='button'
                            disabled={!validations.number || !validations.password || !validations.name}
                            onClick={() => setCurrentStep(3)}
                            className='flex-[2] py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:bg-gray-700 text-black disabled:text-gray-400 font-bold rounded-lg transition-all duration-200'
                          >
                            Review & Connect →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                        <div className='text-xs text-gray-400 mb-4'>Step <span className='text-teal-400 font-semibold'>3</span> of 3 · Review and connect</div>

                        <div className='bg-darkblack-500 border border-gray-700 rounded-xl p-4 mb-4'>
                          <div className='flex items-center gap-3 mb-3'>
                            <div className='w-8 h-8 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-center justify-center text-lg'>⚡</div>
                            <div>
                              <div className='text-sm font-semibold text-white'>{accountName || 'Trading Account'}</div>
                              <div className='text-xs text-gray-400'>MetaTrader {accountType} · {selectedServer}</div>
                            </div>
                          </div>
                          <div className='grid grid-cols-2 gap-2'>
                            <div className='bg-darkblack-600 rounded-lg p-2'>
                              <div className='text-[10px] text-gray-400 mb-1'>Account</div>
                              <div className='text-xs font-mono text-gray-200'>••••{accountNumber.slice(-4) || '****'}</div>
                            </div>
                            <div className='bg-darkblack-600 rounded-lg p-2'>
                              <div className='text-[10px] text-gray-400 mb-1'>Password</div>
                              <div className='text-xs font-mono text-gray-200'>••••••••</div>
                            </div>
                          </div>
                        </div>

                        <div className='bg-teal-500/5 border border-teal-500/15 rounded-lg p-3 flex items-start gap-3 mb-6'>
                          <ShieldCheck className='w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5' />
                          <div className='text-xs text-gray-300 leading-relaxed'>
                            <strong className='text-teal-400 font-medium'>Connects in the background.</strong> The modal will close and a progress banner appears at the top. You can keep using TradeTab while we connect.
                          </div>
                        </div>

                        <button
                          type='submit'
                          disabled={!isFormValid || loading || isStarting}
                          className='w-full py-3.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:bg-gray-700 text-black disabled:text-gray-400 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
                        >
                          {loading || isStarting ? (
                            <><Loader2 className='w-4 h-4 animate-spin' /> Starting...</>
                          ) : (
                            <>⚡ Connect in Background</>
                          )}
                        </button>
                        
                        <div className='text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1.5'>
                          <ShieldCheck className='w-3 h-3 text-teal-400' />
                          Password never stored · TLS 1.3 encrypted · Read-only access
                        </div>

                        <div className='mt-6'>
                          <button
                            type='button'
                            onClick={() => setCurrentStep(2)}
                            className='w-full py-2.5 bg-transparent text-gray-400 hover:text-gray-300 text-xs font-medium transition-colors'
                          >
                            ← Edit credentials
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </form>
              </>
            )}

            {modalView === 'progress' && currentJob && (
              <ConnectionProgressView
                job={currentJob}
                socketStatus={socketStatus}
                onCancel={handleCancelJob}
              />
            )}

            {modalView === 'success' && currentJob && (
              <ConnectionSuccessView
                job={currentJob}
                onViewAccount={handleViewAccount}
              />
            )}

            {modalView === 'error' && currentJob && (
              <ConnectionErrorView
                job={currentJob}
                onRetry={handleRetryJob}
                onClose={handleCloseFromError}
                isRetrying={isStarting}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectMetaTraderAccount;
