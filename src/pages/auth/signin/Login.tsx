import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaChartLine,
  FaBookOpen,
  FaBrain,
} from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { RUTE_USER_LOGIN } from '../../../utils/Rutes';
import { http } from '../../../utils/http_request';
import GoogleLoginButton from './GoogleLoginButton';
import WelcomeSplashScreen from './WelcomeSplashScreen';
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthUser from '@/hook/useAuthUser';
import '@/pages/shared/TradeTabDesign.css';
import ErrorBoundary from '@/component/ErrorBoundary';
import LandingNavbar from '@/pages/welcome/sections/LandingNavbar';

const inputClass =
  'w-full h-10 rounded-[10px] border border-[var(--tt-line-2)] bg-[var(--tt-bg-2)] pl-10 pr-3 text-sm text-[var(--tt-fg-0)] placeholder:text-[var(--tt-fg-3)] outline-none transition-[box-shadow,border-color] duration-200 ring-1 ring-transparent focus:border-teal-500/45 focus:ring-2 focus:ring-teal-400/40';

interface LoginForm {
  emailOrPhone: string;
  password: string;
  stay_logged: boolean;
  country?: string;
  countryCode?: string;
}

function pickWelcomeDisplayName(user: unknown): string {
  if (!user || typeof user !== 'object') return '';
  const u = user as Record<string, unknown>;
  const raw =
    (typeof u.firstName === 'string' && u.firstName) ||
    (typeof u.first_name === 'string' && u.first_name) ||
    (typeof u.userName === 'string' && u.userName) ||
    (typeof u.username === 'string' && u.username) ||
    (typeof u.name === 'string' && u.name) ||
    '';
  return String(raw).trim();
}

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const { setToken } = useAuthUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeDisplayName, setWelcomeDisplayName] = useState('');
  const [isPhoneInput, setIsPhoneInput] = useState(false);
  const [phoneValue, setPhoneValue] = useState<string | undefined>('');
  const [isLoading, setIsLoading] = useState(false);

  const countryCode = watch('countryCode') || 'US';

  const handlePostLoginDone = useCallback(() => {
    setShowWelcome(false);
    setIsLoading(false);
    navigate('/', { replace: true });
  }, [navigate]);

  const onValid = useCallback(
    async (data: LoginForm) => {
      setIsLoading(true);

      const emailOrPhoneToSend = isPhoneInput ? phoneValue || '' : data.emailOrPhone || '';

      if (isPhoneInput) {
        if (!phoneValue || phoneValue.trim().length < 2) {
          setError('emailOrPhone', { type: 'manual', message: 'Phone number is required' });
          setIsLoading(false);
          return;
        }
        clearErrors('emailOrPhone');
      } else {
        if (!data.emailOrPhone || data.emailOrPhone.trim() === '') {
          setError('emailOrPhone', { type: 'manual', message: 'Email is required' });
          setIsLoading(false);
          return;
        }
        clearErrors('emailOrPhone');
      }

      try {
        const response = await http.post(RUTE_USER_LOGIN, {
          emailOrPhone: emailOrPhoneToSend,
          password: data.password,
        });

        if (response.status !== 200) {
          throw new Error('Login failed');
        }

        setWelcomeDisplayName(pickWelcomeDisplayName(response.data.user));
        setToken(response.data.user, response.data.token);
        setShowWelcome(true);
      } catch (error: any) {
        setIsLoading(false);
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          toast.error(
            'Lack of information to proceed. Please verify your details. ' +
              error.response.data.message
          );
          return;
        }

        toast.error('There was an error in the request. Please try again.');
      }
    },
    [isPhoneInput, phoneValue, setError, clearErrors, setToken]
  );

  const onEnterKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSubmit(onValid)();
      }
    },
    [handleSubmit, onValid]
  );

  const toggleInputType = useCallback(
    (type: 'email' | 'phone') => {
      if (type === 'email' && isPhoneInput) {
        setIsPhoneInput(false);
        setPhoneValue('');
        setValue('emailOrPhone', '');
        clearErrors('emailOrPhone');
      } else if (type === 'phone' && !isPhoneInput) {
        setIsPhoneInput(true);
        const dial = '+' + getCountryCallingCode((countryCode as any) || 'US');
        setPhoneValue(prev => (prev && prev.trim().length > 0 ? prev : dial));
        setValue('emailOrPhone', '');
        clearErrors('emailOrPhone');
      }
    },
    [isPhoneInput, countryCode, setValue, clearErrors]
  );

  if (showWelcome) {
    return (
      <WelcomeSplashScreen
        variant='quick'
        autoDismissTime={1100}
        welcomeDisplayName={welcomeDisplayName}
        onComplete={handlePostLoginDone}
      />
    );
  }

  return (
    <div className='relative min-h-screen overflow-x-hidden tt-theme'>
      <ErrorBoundary fallback={<div className='h-16 bg-[var(--tt-bg-1)]' />}>
        <LandingNavbar />
      </ErrorBoundary>

      <div className='pointer-events-none absolute inset-0 overflow-hidden tt-landing' aria-hidden>
        <div className='tt-glow-bg tt-hero-glow-1' />
        <div className='tt-glow-bg tt-hero-glow-2' />
      </div>

      <main className='relative z-10 tt-shell pb-16 pt-24 md:pt-28'>
        <div className='grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12'>
          <motion.div
            className='tt-card relative p-6 shadow-2xl md:p-8'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <p className='tt-kicker mb-1'>Welcome back</p>
                <h2 className='tt-title text-xl font-bold tracking-tight md:text-2xl'>
                  Sign in to TradeTab
                </h2>
              </div>
              <div className='flex shrink-0 items-center rounded-full border border-[var(--tt-line-2)] bg-[oklch(1_0_0_/0.03)] p-1'>
                <button
                  type='button'
                  onClick={() => toggleInputType('email')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    !isPhoneInput
                      ? 'bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
                      : 'text-[var(--tt-fg-2)] hover:text-[var(--tt-fg-0)]'
                  }`}
                  aria-pressed={!isPhoneInput}
                >
                  <FaEnvelope className='shrink-0' /> Email
                </button>
                <button
                  type='button'
                  onClick={() => toggleInputType('phone')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    isPhoneInput
                      ? 'bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
                      : 'text-[var(--tt-fg-2)] hover:text-[var(--tt-fg-0)]'
                  }`}
                  aria-pressed={isPhoneInput}
                >
                  <FaPhone className='shrink-0' /> Phone
                </button>
              </div>
            </div>

            <form
              className='space-y-4'
              onSubmit={e => {
                e.preventDefault();
                handleSubmit(onValid)();
              }}
            >
              <div>
                <label className='mb-1.5 block text-xs font-medium text-[var(--tt-fg-2)]'>
                  {isPhoneInput ? 'Phone number' : 'Email'}
                </label>
                {isPhoneInput ? (
                  <div
                    className='[&_.PhoneInputCountry]:mr-2 [&_.PhoneInputCountryIconBox]:border-[var(--tt-line-2)] [&_.PhoneInputCountrySelect]:bg-[var(--tt-bg-2)] [&_.PhoneInputCountrySelect]:text-[var(--tt-fg-0)] [&_.PhoneInputInput]:h-10 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-[10px] [&_.PhoneInputInput]:border [&_.PhoneInputInput]:border-[var(--tt-line-2)] [&_.PhoneInputInput]:bg-[var(--tt-bg-2)] [&_.PhoneInputInput]:pl-3 [&_.PhoneInputInput]:pr-3 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:text-[var(--tt-fg-0)] [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:placeholder:text-[var(--tt-fg-3)] [&_.PhoneInputInput]:ring-1 [&_.PhoneInputInput]:ring-transparent [&_.PhoneInputInput]:transition-[box-shadow,border-color] [&_.PhoneInputInput]:duration-200 focus-within:[&_.PhoneInputInput]:border-teal-500/45 focus-within:[&_.PhoneInputInput]:ring-2 focus-within:[&_.PhoneInputInput]:ring-teal-400/40'
                  >
                    <PhoneInput
                      international
                      defaultCountry={countryCode as any}
                      value={phoneValue}
                      onChange={setPhoneValue}
                      placeholder='Enter your phone number'
                      className='PhoneInput'
                    />
                  </div>
                ) : (
                  <div className='relative flex items-center'>
                    <FaEnvelope className='pointer-events-none absolute left-3 text-lg text-[var(--tt-fg-3)]' />
                    <input
                      type='text'
                      autoComplete='email'
                      placeholder='you@example.com'
                      className={inputClass}
                      onKeyDown={onEnterKeyPress}
                      {...register('emailOrPhone', {
                        validate: v =>
                          isPhoneInput ? true : (v && v.trim().length > 0) || 'Email is required',
                      })}
                    />
                  </div>
                )}
                {errors?.emailOrPhone && (
                  <p className='mt-1.5 text-sm text-[var(--tt-loss)]'>{errors.emailOrPhone.message}</p>
                )}
              </div>

              <div>
                <label className='mb-1.5 block text-xs font-medium text-[var(--tt-fg-2)]'>
                  Password
                </label>
                <div className='relative flex items-center'>
                  <FaLock className='pointer-events-none absolute left-3 text-lg text-[var(--tt-fg-3)]' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    placeholder='Enter your password'
                    className={`${inputClass} pr-10`}
                    onKeyDown={onEnterKeyPress}
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-[var(--tt-fg-2)] hover:text-[var(--tt-fg-0)]'
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors?.password && (
                  <p className='mt-1.5 text-sm text-[var(--tt-loss)]'>{errors.password.message}</p>
                )}
              </div>

              <div className='flex items-center justify-between gap-2 text-xs'>
                <label className='inline-flex cursor-pointer items-center gap-2 text-[var(--tt-fg-2)]'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded border-[var(--tt-line-2)] bg-[var(--tt-bg-2)] accent-[var(--tt-brand)]'
                    {...register('stay_logged')}
                  />
                  Stay signed in
                </label>
                <Link
                  to='/forgot-password'
                  className='whitespace-nowrap font-medium text-[var(--tt-brand)] hover:underline'
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type='submit'
                className='tt-btn tt-btn-primary relative mt-2 min-h-[48px] w-full cursor-pointer justify-center py-3 disabled:cursor-not-allowed disabled:opacity-60'
                disabled={isSubmitting || isLoading}
                aria-busy={isSubmitting || isLoading}
              >
                <AnimatePresence initial={false} mode='wait'>
                  {isSubmitting || isLoading ? (
                    <motion.span
                      key='loading'
                      initial={{ opacity: 0, y: 4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className='flex items-center justify-center gap-2.5'
                    >
                      <svg
                        className='h-5 w-5 shrink-0 animate-spin text-[#082019]/90'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden
                      >
                        <circle
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='3'
                          className='opacity-25'
                          fill='none'
                        />
                        <path
                          d='M12 2a10 10 0 0 1 9.8 8'
                          stroke='currentColor'
                          strokeWidth='3'
                          strokeLinecap='round'
                          fill='none'
                        />
                      </svg>
                      <span>Signing in…</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key='login'
                      initial={{ opacity: 0, y: 4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Sign in
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>

            <div className='mt-6 flex items-center gap-3'>
              <div className='h-px flex-1 bg-[var(--tt-line-1)]' />
              <span className='text-xs text-[var(--tt-fg-3)]'>or</span>
              <div className='h-px flex-1 bg-[var(--tt-line-1)]' />
            </div>

            <div className='mt-4'>
              <GoogleLoginButton
                openWelcome={user => {
                  setWelcomeDisplayName(pickWelcomeDisplayName(user));
                  setShowWelcome(true);
                }}
              />
            </div>

            <p className='mt-6 text-center text-sm text-[var(--tt-fg-2)]'>
              Don&apos;t have an account?{' '}
              <Link to='/signup' className='font-semibold text-[var(--tt-brand)] hover:underline'>
                Create account
              </Link>
            </p>
          </motion.div>

          <motion.div
            className='px-0 md:px-2'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className='tt-kicker mb-3'>Why TradeTab</p>
            <h1 className='mb-4 text-3xl font-extrabold leading-tight tracking-tight text-[var(--tt-fg-0)] md:text-5xl'>
              Master your{' '}
              <span className='bg-gradient-to-r from-[var(--tt-brand)] to-[var(--tt-brand-2)] bg-clip-text text-transparent'>
                trading journey
              </span>
            </h1>
            <p className='tt-subtitle mb-8 max-w-lg text-base leading-relaxed md:text-lg'>
              Elevate performance with analytics, psychology-aware journaling, and broker-connected
              metrics—built for traders who want clarity, not clutter.
            </p>

            <div className='mb-8 space-y-3'>
              <motion.div
                className='tt-card flex items-center gap-4 p-4 transition-colors hover:border-[var(--tt-line-3)]'
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className='rounded-lg bg-[var(--tt-profit-dim)] p-3'>
                  <FaChartLine className='text-xl text-[var(--tt-profit)]' />
                </div>
                <div>
                  <h3 className='mb-0.5 text-sm font-semibold text-[var(--tt-fg-0)]'>
                    Advanced analytics
                  </h3>
                  <p className='text-xs text-[var(--tt-fg-3)]'>Performance metrics and risk context</p>
                </div>
              </motion.div>

              <motion.div
                className='tt-card flex items-center gap-4 p-4 transition-colors hover:border-[var(--tt-line-3)]'
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className='rounded-lg bg-[var(--tt-brand-dim)] p-3'>
                  <FaBrain className='text-xl text-[var(--tt-brand)]' />
                </div>
                <div>
                  <h3 className='mb-0.5 text-sm font-semibold text-[var(--tt-fg-0)]'>Mindset mastery</h3>
                  <p className='text-xs text-[var(--tt-fg-3)]'>Psychological insights and training</p>
                </div>
              </motion.div>

              <motion.div
                className='tt-card flex items-center gap-4 p-4 transition-colors hover:border-[var(--tt-line-3)]'
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className='rounded-lg bg-[oklch(0.72_0.15_305_/_0.15)] p-3'>
                  <FaBookOpen className='text-xl text-[oklch(0.78_0.12_305)]' />
                </div>
                <div>
                  <h3 className='mb-0.5 text-sm font-semibold text-[var(--tt-fg-0)]'>Smart journaling</h3>
                  <p className='text-xs text-[var(--tt-fg-3)]'>Structured trade review and notes</p>
                </div>
              </motion.div>
            </div>

            <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--tt-fg-3)]'>
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 shrink-0 rounded-full bg-[var(--tt-profit)]' />
                Bank-level security
              </div>
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 shrink-0 rounded-full bg-[var(--tt-brand)]' />
                Built for MT4 &amp; MT5
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Login;
