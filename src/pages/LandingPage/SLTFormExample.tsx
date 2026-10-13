import { useState, Fragment } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { TrendingUp } from 'lucide-react';
import { IoRefresh } from 'react-icons/io5';
import Loading2 from '../../component/loader/Loading2/Loading2';

export interface ProjectionForm {
  target: number;
  tradesPerDay: number;
  targetType: 'percentage' | 'dollar';
}

const SLTFormExample = () => {
  const [stlPlan, setStlPlan] = useState<any>(null);
  const [targetType, setTargetType] = useState<'percentage' | 'dollar'>('dollar');
  const [loadingDeleteSTLPlan, setLoadingDeleteSTLPlan] = useState(false);

  const currency = 'USD';
  const fakeStlPlan = {
    tradesPerDay: 5,
    monthlyProfitGoal: {
      target: 1500,
      isPercentage: false,
    },
  };

  const deleteSTLPlan = () => {
    setLoadingDeleteSTLPlan(true);
    setTimeout(() => {
      setStlPlan(null);
      setLoadingDeleteSTLPlan(false);
      alert('Plan deleted');
    }, 1000);
  };

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
    setTimeout(() => {
      clearErrors();
    }, 2000);
  };

  const onValid = (data: ProjectionForm) => {
    const newPlan = {
      ...data,
      monthlyProfitGoal: {
        target: data.target,
        isPercentage: targetType === 'percentage',
      },
    };
    setStlPlan(newPlan);
    alert('Plan created');
  };

  const onSubmitHandler = handleSubmit(onValid, onInvalid);

  const toggleClass = (active: boolean) =>
    active
      ? 'tt-btn tt-btn-primary flex-1 justify-center py-3 text-sm'
      : 'tt-btn tt-btn-ghost flex-1 justify-center py-3 text-sm';

  return (
    <Fragment>
      <div className='mb-6 flex items-center justify-between border-b border-[var(--tt-line-1)] pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
            <TrendingUp className='h-5 w-5' aria-hidden />
          </div>
          <h3 className='tt-title text-xl font-bold'>SLT Strategy</h3>
        </div>
        <span className='rounded-full border border-[var(--tt-line-2)] bg-[oklch(1_0_0_/0.04)] px-3 py-1 text-xs font-medium text-[var(--tt-fg-1)]'>
          Demo
        </span>
      </div>

      {!stlPlan ? (
        <form className='grid gap-6 px-1 py-2' onSubmit={onSubmitHandler}>
          <div className='space-y-3'>
            <p className='text-sm font-medium text-[var(--tt-fg-1)]'>Target profit in</p>
            <div className='flex gap-3'>
              <button
                type='button'
                onClick={() => setTargetType('dollar')}
                className={toggleClass(targetType === 'dollar')}
              >
                {currency}
              </button>
              <button
                type='button'
                onClick={() => setTargetType('percentage')}
                className={toggleClass(targetType === 'percentage')}
              >
                %
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-[var(--tt-fg-1)]'>
                {targetType === 'dollar' ? 'Monthly profit goal' : 'Monthly percentage goal'}
              </label>
              <input
                type='number'
                className='tt-careers-input w-full rounded-xl border border-[var(--tt-line-2)] bg-[var(--tt-bg-2)] py-3 text-[var(--tt-fg-0)] placeholder:text-[var(--tt-fg-3)] focus:border-[var(--tt-brand)] focus:outline-none'
                placeholder={targetType === 'dollar' ? '1500' : '15'}
                {...register('target', {
                  required: 'This field is required',
                  min: 0,
                  valueAsNumber: true,
                })}
              />
              {errors.target && (
                <span className='text-xs text-[var(--tt-loss)]'>{errors.target.message}</span>
              )}
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-[var(--tt-fg-1)]'>Trades per day</label>
              <input
                type='number'
                className='tt-careers-input w-full rounded-xl border border-[var(--tt-line-2)] bg-[var(--tt-bg-2)] py-3 text-[var(--tt-fg-0)] placeholder:text-[var(--tt-fg-3)] focus:border-[var(--tt-brand)] focus:outline-none'
                placeholder='5'
                {...register('tradesPerDay', {
                  required: 'This field is required',
                  min: 1,
                  valueAsNumber: true,
                })}
              />
              {errors.tradesPerDay && (
                <span className='text-xs text-[var(--tt-loss)]'>{errors.tradesPerDay.message}</span>
              )}
            </div>
          </div>

          <div className='pt-2'>
            {!isSubmitting ? (
              <button
                disabled={!isFormValid}
                className='tt-btn tt-btn-primary w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-50'
                type='submit'
              >
                {isFormValid ? 'Create strategy' : 'Complete form'}
              </button>
            ) : (
              <div className='tt-btn tt-btn-primary flex w-full items-center justify-center py-3'>
                <Loading2 />
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className='tt-panel rounded-xl p-5'>
          <div className='space-y-6'>
            <div className='border-b border-[var(--tt-line-1)] pb-4 text-center'>
              <h4 className='tt-title text-lg font-bold text-[var(--tt-brand)]'>Strategy active</h4>
              <p className='text-sm text-[var(--tt-fg-2)]'>Your SLT plan is now running</p>
            </div>

            <ul className='space-y-3'>
              <li className='flex items-center justify-between rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-3'>
                <span className='text-sm text-[var(--tt-fg-2)]'>Max trades per day</span>
                <span className='font-bold text-[var(--tt-fg-0)]'>
                  {stlPlan.tradesPerDay || fakeStlPlan.tradesPerDay}
                </span>
              </li>
              <li className='flex items-center justify-between rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-3'>
                <span className='text-sm text-[var(--tt-fg-2)]'>Target per day</span>
                <span className='font-bold text-[var(--tt-fg-0)]'>
                  {(stlPlan.monthlyProfitGoal.target / 30).toFixed(2)}
                  {stlPlan.monthlyProfitGoal.isPercentage ? '%' : ` ${currency}`}
                </span>
              </li>
            </ul>

            <div className='flex justify-center pt-2'>
              <button
                type='button'
                onClick={deleteSTLPlan}
                className='tt-btn tt-btn-ghost inline-flex items-center gap-2 px-6 py-3'
              >
                {!loadingDeleteSTLPlan ? (
                  <>
                    <IoRefresh className='h-4 w-4' />
                    Restart strategy
                  </>
                ) : (
                  <Loading2 />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default SLTFormExample;
