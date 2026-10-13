import { useMemo, useState } from 'react';
import { ArrowPathIcon, ChartBarIcon, TagIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { RUTE_DELETE_SLT_PLAN } from '@/utils/Rutes';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import Loading2 from '@/component/loader/Loading2/Loading2';
import { http } from '@/utils/http_request';
import { useJournalContext } from '@/context/JournalProvider';
import { getSltPlanBounds } from '../journalCellState';
import type { StlPlanLike } from '../journalCellState';

type SLTProgressCardProps = {
  stlPlan: StlPlanLike;
  monthPnl?: number;
  tradingDaysThisMonth?: number;
};

export default function SLTProgressCard({
  stlPlan,
  monthPnl = 0,
  tradingDaysThisMonth = 0,
}: SLTProgressCardProps) {
  const { setStlPlan } = useJournalContext();
  const { currentAccount } = useMTAccounts();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const stats = useMemo(() => {
    if (!stlPlan?.monthlyProfitGoal?.target || !stlPlan.lifeTime) {
      return { dailyTarget: 0, progressPct: 0, daysRemaining: 0, status: 'on-track' as const };
    }
    const dailyTarget = stlPlan.monthlyProfitGoal.target / stlPlan.lifeTime;
    const monthlyTarget = stlPlan.monthlyProfitGoal.target;
    const progressPct = monthlyTarget
      ? Math.min(100, Math.round((monthPnl / monthlyTarget) * 100))
      : 0;

    const { end } = getSltPlanBounds(stlPlan);
    const daysRemaining = end
      ? Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0;

    const expectedByNow = (stlPlan.lifeTime - daysRemaining) * dailyTarget;
    const status = monthPnl >= expectedByNow * 0.9 ? 'on-track' : 'behind';

    return { dailyTarget, progressPct, daysRemaining, status };
  }, [stlPlan, monthPnl]);

  const deletePlan = async () => {
    setLoadingDelete(true);
    try {
      const response = await http.delete(`${RUTE_DELETE_SLT_PLAN}/${currentAccount?.external_id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setStlPlan(null);
      } else {
        toast.error('Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Could not delete plan');
    } finally {
      setLoadingDelete(false);
    }
  };

  const currency = currentAccount?.currency || 'USD';
  const isPct = stlPlan?.monthlyProfitGoal?.isPercentage;

  return (
    <div className='space-y-4'>
      <p className='text-sm text-[var(--tt-fg-2)]'>
        Daily targets are shown on your calendar. Track progress here.
      </p>

      <div className='grid grid-cols-2 gap-2'>
        <div className='rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-3'>
          <div className='mb-1 flex items-center gap-1.5 text-xs text-[var(--tt-fg-3)]'>
            <ChartBarIcon className='h-4 w-4' />
            Max trades/day
          </div>
          <p className='tt-mono text-lg font-semibold text-[var(--tt-fg-0)]'>
            {stlPlan?.tradesPerDay ?? '—'}
          </p>
        </div>
        <div className='rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-3'>
          <div className='mb-1 flex items-center gap-1.5 text-xs text-[var(--tt-fg-3)]'>
            <TagIcon className='h-4 w-4' />
            Daily target
          </div>
          <p className='tt-mono text-lg font-semibold text-[var(--tt-fg-0)]'>
            {stats.dailyTarget.toFixed(2)}
            {isPct ? '%' : ` ${currency}`}
          </p>
        </div>
      </div>

      <div className='rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-3'>
        <div className='mb-2 flex items-center justify-between text-xs'>
          <span className='text-[var(--tt-fg-3)]'>Month progress</span>
          <span
            className={
              stats.status === 'on-track'
                ? 'text-[var(--tt-profit)]'
                : 'text-[var(--tt-loss)]'
            }
          >
            {stats.status === 'on-track' ? 'On track' : 'Behind'}
          </span>
        </div>
        <div className='h-2 overflow-hidden rounded-full bg-[var(--tt-bg-2)]'>
          <div
            className='h-full rounded-full bg-[var(--tt-brand)] transition-all'
            style={{ width: `${stats.progressPct}%` }}
          />
        </div>
        <p className='mt-1 text-xs text-[var(--tt-fg-3)]'>
          {stats.progressPct}% of monthly target · {stats.daysRemaining} days left
          {tradingDaysThisMonth > 0 && ` · ${tradingDaysThisMonth} trading days this month`}
        </p>
      </div>

      <button
        type='button'
        onClick={deletePlan}
        disabled={loadingDelete}
        className='flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--tt-loss)]/40 bg-[var(--tt-loss-dim)] py-2.5 text-sm font-medium text-[var(--tt-loss)] transition-colors hover:border-[var(--tt-loss)]'
      >
        {loadingDelete ? (
          <Loading2 />
        ) : (
          <>
            <ArrowPathIcon className='h-4 w-4' />
            Restart plan
          </>
        )}
      </button>
    </div>
  );
}
