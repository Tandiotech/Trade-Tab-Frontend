import { useState, type CSSProperties } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { Brain } from 'lucide-react';
import EmotionalEvaluationInfo from '../journal/emotionalEvaluation/EmotionalEvaluationInfo';
import GlobalModal from '../../component/modal/GlobalModal';

function riskLabel(value: number) {
  if (value > 15) return { label: 'Critical', className: 'tt-journal-risk tt-journal-risk--critical' };
  if (value > 10) return { label: 'High', className: 'tt-journal-risk tt-journal-risk--high' };
  if (value > 5) return { label: 'Medium', className: 'tt-journal-risk tt-journal-risk--medium' };
  return { label: 'Low', className: 'tt-journal-risk tt-journal-risk--low' };
}

function EvaluationboxExample() {
  const [sentiments, setSentiments] = useState({
    enterTooEarly: 10,
    overtrading: 5,
    revengeTrading: 7,
    lackOfDiscipline: 12,
    ignoringStrategy: 8,
    other: 4,
  });
  const [withdrawalPlanMode, setWithdrawalPlanMode] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleConfirmReset = () => {
    setSentiments({
      enterTooEarly: 0,
      overtrading: 0,
      revengeTrading: 0,
      lackOfDiscipline: 0,
      ignoringStrategy: 0,
      other: 0,
    });
    setShowConfirmationModal(false);
    alert('Sentiments reset successfully');
  };

  return (
    <div>
      <div className='mb-4 flex flex-col gap-3 border-b border-[var(--tt-line-1)] pb-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
            <Brain className='h-5 w-5' aria-hidden />
          </div>
          <div>
            <h4 className='tt-title text-base font-bold sm:text-lg'>Emotional evaluation</h4>
            <span className='text-xs text-[var(--tt-fg-3)]'>Sample data</span>
          </div>
        </div>

        {sentiments && (
          <button
            type='button'
            onClick={() => setShowConfirmationModal(true)}
            className='tt-btn tt-btn-ghost inline-flex items-center gap-2 self-start px-4 py-2 text-sm sm:self-auto'
            title='Reset Sentiments'
          >
            <BiRefresh className='h-4 w-4' />
            Reset
          </button>
        )}
      </div>

      <div className='tt-panel mb-4 rounded-xl p-4'>
        <h5 className='mb-1 text-sm font-semibold text-[var(--tt-fg-0)]'>Why this matters</h5>
        <p className='text-xs leading-relaxed text-[var(--tt-fg-2)] sm:text-sm'>
          Emotional trading accounts for 80% of trading losses. By tracking your psychological
          state, you can identify patterns and develop strategies to overcome them.
        </p>
      </div>

      {sentiments ? (
        <div className='max-h-48 space-y-3 overflow-auto'>
          {Object.entries(sentiments).map(([name, value]) => {
            const risk = riskLabel(value);
            return (
              <div
                key={name}
                className='rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-3'
              >
                <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                  <span className='text-sm font-medium capitalize text-[var(--tt-fg-0)]'>
                    {name.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <div className='flex flex-1 items-center gap-3'>
                    <input
                      type='range'
                      readOnly
                      min='0'
                      max='20'
                      value={value}
                      className='tt-journal-range w-full'
                      style={{ '--tt-range-fill': `${(value / 20) * 100}%` } as CSSProperties}
                    />
                    <span className='min-w-[3rem] text-right text-sm font-bold text-[var(--tt-fg-0)]'>
                      {value}/20
                    </span>
                  </div>
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <span className='text-xs text-[var(--tt-fg-3)]'>Risk level</span>
                  <span className={risk.className}>{risk.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmotionalEvaluationInfo />
      )}

      <div className='mt-4'>
        <button
          type='button'
          onClick={() => setWithdrawalPlanMode(!withdrawalPlanMode)}
          className='tt-btn tt-btn-ghost w-full justify-center py-3 text-xs uppercase tracking-wide sm:text-sm'
        >
          {!withdrawalPlanMode ? 'Withdrawal planner' : 'Select withdrawal date'}
        </button>
      </div>

      <GlobalModal
        isActive={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        bg_color='bg-[var(--tt-bg-1)]'
        width='w-11/12 sm:w-4/5 md:w-2/3 lg:w-1/3'
        height='h-fit'
      >
        <div className='p-4 text-center sm:p-6'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tt-brand-dim)] text-[var(--tt-brand)] sm:h-16 sm:w-16'>
            <Brain className='h-6 w-6 sm:h-8 sm:w-8' aria-hidden />
          </div>
          <h2 className='tt-title mb-4 text-lg font-bold sm:text-xl'>Reset emotional data?</h2>
          <p className='mb-6 text-sm leading-relaxed text-[var(--tt-fg-2)] sm:text-base'>
            This will clear all your emotional evaluation data. This action cannot be undone.
          </p>
          <div className='flex flex-col justify-center gap-3 sm:flex-row sm:gap-4'>
            <button
              type='button'
              onClick={handleConfirmReset}
              className='tt-btn tt-btn-primary px-6 py-3 text-sm sm:text-base'
            >
              Yes, reset
            </button>
            <button
              type='button'
              onClick={() => setShowConfirmationModal(false)}
              className='tt-btn tt-btn-ghost px-6 py-3 text-sm sm:text-base'
            >
              Cancel
            </button>
          </div>
        </div>
      </GlobalModal>
    </div>
  );
}

export default EvaluationboxExample;
