import { Fragment, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { RUTE_CREATE_SLT_PLAN } from '@/utils/Rutes';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import Loading2 from '@/component/loader/Loading2/Loading2';
import { http } from '@/utils/http_request';
import { useJournalContext } from '@/context/JournalProvider';
import type { ProjectionForm } from './SLTForm';

export default function SLTSetupWizard() {
  const { setStlPlan } = useJournalContext();
  const { currentAccount } = useMTAccounts();
  const [targetType, setTargetType] = useState<'percentage' | 'dollar'>('dollar');
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [lifeTime, setLifeTime] = useState(includeWeekends ? 28 : 20);

  const {
    formState: { isSubmitting, errors },
    register,
    handleSubmit,
    watch,
    clearErrors,
  } = useForm<ProjectionForm>();

  const targetValue = watch('target');
  const tradesPerDayValue = watch('tradesPerDay');
  const isFormValid = targetValue && tradesPerDayValue && targetValue > 0 && tradesPerDayValue > 0;

  const onInvalid = (_errors: FieldErrors<ProjectionForm>) => {
    setTimeout(() => clearErrors(), 2000);
  };

  const onValid = async (data: ProjectionForm) => {
    try {
      const payload = {
        account: currentAccount?.external_id,
        tradesPerDay: data.tradesPerDay,
        lifeTime,
        includeWeekends,
        monthlyProfitGoal: {
          target: data.target,
          isPercentage: targetType === 'percentage',
        },
      };

      const response = await http.post(RUTE_CREATE_SLT_PLAN, payload);
      if (response.status === 200) {
        setStlPlan(response.data.data);
        toast.success(response.data.message);
      } else {
        toast.error('Failed to create plan');
      }
    } catch (error) {
      toast.error('Contact Support');
      console.error('Error creating SLT plan:', error);
    }
  };

  const handleWeekendToggle = () => {
    const newIncludeWeekends = !includeWeekends;
    setIncludeWeekends(newIncludeWeekends);
    if (lifeTime === (includeWeekends ? 7 : 5)) {
      setLifeTime(newIncludeWeekends ? 7 : 5);
    } else if (lifeTime === (includeWeekends ? 14 : 10)) {
      setLifeTime(newIncludeWeekends ? 14 : 10);
    } else {
      setLifeTime(newIncludeWeekends ? 28 : 20);
    }
  };

  const periodOptions = [
    { days: includeWeekends ? 7 : 5, label: '1 Week' },
    { days: includeWeekends ? 14 : 10, label: '2 Weeks' },
    { days: includeWeekends ? 28 : 20, label: '1 Month' },
  ];

  return (
    <Fragment>
      <p className='mb-4 text-sm text-[var(--tt-fg-2)]'>
        Set a Straight Line Trading plan and daily targets will appear on your calendar.
      </p>
      <form className='space-y-4' onSubmit={handleSubmit(onValid, onInvalid)}>
        <div className='space-y-2'>
          <label className='text-xs font-medium text-[var(--tt-fg-2)]'>Target profit type</label>
          <div className='grid grid-cols-2 gap-2'>
            <button
              type='button'
              onClick={() => setTargetType('dollar')}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                targetType === 'dollar'
                  ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'
                  : 'border-[var(--tt-line-1)] text-[var(--tt-fg-3)] hover:border-[var(--tt-line-2)]'
              }`}
            >
              <CurrencyDollarIcon className='h-4 w-4' />
              {currentAccount?.currency || 'USD'}
            </button>
            <button
              type='button'
              onClick={() => setTargetType('percentage')}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                targetType === 'percentage'
                  ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'
                  : 'border-[var(--tt-line-1)] text-[var(--tt-fg-3)] hover:border-[var(--tt-line-2)]'
              }`}
            >
              <ChartBarIcon className='h-4 w-4' />
              Percentage
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='space-y-1'>
            <label className='text-xs font-medium text-[var(--tt-fg-2)]'>
              {targetType === 'dollar' ? 'Monthly profit goal' : 'Monthly % goal'}
            </label>
            <input
              type='number'
              className='w-full rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] px-3 py-2 text-sm text-[var(--tt-fg-0)] focus:border-[var(--tt-brand)] focus:outline-none'
              placeholder={targetType === 'dollar' ? 'Amount' : 'Percent'}
              {...register('target', { required: true, min: 0, valueAsNumber: true })}
            />
            {errors.target && (
              <span className='text-xs text-[var(--tt-loss)]'>Required</span>
            )}
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-medium text-[var(--tt-fg-2)]'>Trades per day</label>
            <input
              type='number'
              className='w-full rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] px-3 py-2 text-sm text-[var(--tt-fg-0)] focus:border-[var(--tt-brand)] focus:outline-none'
              {...register('tradesPerDay', { required: true, min: 1, valueAsNumber: true })}
            />
          </div>
        </div>

        <div className='flex items-center justify-between rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] px-3 py-2'>
          <div className='flex items-center gap-2'>
            <ClockIcon className='h-4 w-4 text-[var(--tt-fg-3)]' />
            <span className='text-xs text-[var(--tt-fg-2)]'>Include weekends</span>
          </div>
          <button
            type='button'
            onClick={handleWeekendToggle}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              includeWeekends ? 'bg-[var(--tt-brand)]' : 'bg-[var(--tt-line-2)]'
            }`}
            aria-pressed={includeWeekends}
          >
            <span
              className={`absolute top-1 inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                includeWeekends ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className='space-y-2'>
          <label className='text-xs font-medium text-[var(--tt-fg-2)]'>Trading period</label>
          <div className='grid grid-cols-3 gap-2'>
            {periodOptions.map(option => (
              <button
                key={option.days}
                type='button'
                onClick={() => setLifeTime(option.days)}
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs transition-colors ${
                  lifeTime === option.days
                    ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'
                    : 'border-[var(--tt-line-1)] text-[var(--tt-fg-3)]'
                }`}
              >
                <CalendarIcon className='h-4 w-4' />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type='submit'
          disabled={isSubmitting || !isFormValid}
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--tt-brand)] py-3 text-sm font-semibold text-[var(--tt-bg-0)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? <Loading2 /> : (
            <>
              <PlayIcon className='h-4 w-4' />
              Start trading plan
            </>
          )}
        </button>
      </form>
    </Fragment>
  );
}
