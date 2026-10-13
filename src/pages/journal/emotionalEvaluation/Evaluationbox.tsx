import { useMemo, useState, type ReactNode } from 'react';
import SLTForm from '../SLT/SLTForm';
import EmotionalEvaluationInfo from './EmotionalEvaluationInfo';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useJournalContext } from '@/context/JournalProvider';
import ResetEmotionalEvaluation from './ResetEmotionalEvaluation';
import { BsJournal } from 'react-icons/bs';
import JournalEntriesList from './JournalEntriesList';
import SentimentsResume from './SentimentsResume';
import { BiBarChartAlt2, BiBrain, BiCog, BiRefresh } from 'react-icons/bi';
import { CalendarIcon } from '@heroicons/react/24/outline';
import WithdrawalPlan from '../WithdrawalPlan';
import { calculateJournalData } from '../calculateJournalData';
import type { ITrade } from '@/pages/metrics/interface';

type PanelSection = 'insights' | 'slt' | 'psychology' | 'withdrawal';

type EvaluationboxProps = {
  expandedCalendar?: boolean;
  trades: ITrade[];
};

function Evaluationbox({ expandedCalendar, trades }: EvaluationboxProps) {
  const { currentAccount } = useMTAccounts();
  const {
    sentiments,
    expandedJournalEntries,
    setExpandedJournalEntries,
    highlightedDay,
    setHighlightedDay,
    stlPlan,
    currentMonth,
    currentYear,
  } = useJournalContext();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showJournalEntries, setShowJournalEntries] = useState(false);
  const [activeSection, setActiveSection] = useState<PanelSection>(
    stlPlan ? 'insights' : 'slt'
  );

  const { monthPnl, tradingDaysThisMonth } = useMemo(() => {
    const journalData = calculateJournalData(trades);
    let pnl = 0;
    let days = 0;
    journalData.forEach((entry: { date: string; totalProfit: number; totalTrades: number }) => {
      const [year, month] = entry.date.split(' ')[0].split('-').map(Number);
      if (month === currentMonth && year === currentYear) {
        pnl += entry.totalProfit;
        if (entry.totalTrades > 0) days += 1;
      }
    });
    return { monthPnl: pnl, tradingDaysThisMonth: days };
  }, [trades, currentMonth, currentYear]);

  const sections: { id: PanelSection; label: string; icon: ReactNode }[] = [
    { id: 'insights', label: 'Insights', icon: <BiBarChartAlt2 className='h-3.5 w-3.5' /> },
    { id: 'slt', label: 'SLT', icon: <BsJournal className='h-3.5 w-3.5' /> },
    { id: 'psychology', label: 'Psychology', icon: <BiBrain className='h-3.5 w-3.5' /> },
    {
      id: 'withdrawal',
      label: 'Withdrawal',
      icon: <CalendarIcon className='h-3.5 w-3.5' />,
    },
  ];

  return (
    <div
      className={`h-full ${expandedCalendar ? 'grid grid-cols-1 gap-4 sm:grid-cols-2' : ''}`}
    >
      <div
        className={`rounded-[var(--tt-radius-lg)] border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] shadow-sm ${
          expandedCalendar ? 'col-span-1' : ''
        } ${expandedJournalEntries ? 'h-auto sm:h-5/6' : 'h-fit'}`}
      >
        <div className='border-b border-[var(--tt-line-1)] px-4 py-3'>
          <h3 className='text-sm font-semibold text-[var(--tt-fg-0)] md:text-base'>
            Journal insights
          </h3>
          <p className='text-xs text-[var(--tt-fg-3)]'>
            Goals, psychology, and withdrawal planning
          </p>
        </div>

        <div className='p-2'>
          <div className='tt-journal-segment' role='tablist'>
            {sections.map(section => (
              <button
                key={section.id}
                type='button'
                role='tab'
                aria-selected={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
                className={`tt-journal-segment__btn flex items-center justify-center gap-1.5 ${
                  activeSection === section.id ? 'tt-journal-segment__btn--active' : ''
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'psychology' && sentiments && (
          <div className='flex justify-end gap-2 border-b border-[var(--tt-line-1)] px-4 pb-2'>
            <button
              type='button'
              onClick={() => setShowConfirmationModal(true)}
              className='rounded-lg border border-[var(--tt-line-1)] p-2 text-[var(--tt-fg-3)] hover:border-[var(--tt-line-2)] hover:text-[var(--tt-fg-0)]'
              title='Reset sentiments'
            >
              <BiRefresh className='h-4 w-4' />
            </button>
            <button
              type='button'
              onClick={() => {
                setShowJournalEntries(!showJournalEntries);
                if (expandedJournalEntries) setExpandedJournalEntries(false);
                if (highlightedDay) setHighlightedDay(null);
              }}
              className='rounded-lg border border-[var(--tt-line-1)] p-2 text-[var(--tt-fg-3)] hover:border-[var(--tt-line-2)] hover:text-[var(--tt-fg-0)]'
              title={showJournalEntries ? 'View sentiments' : 'View journal entries'}
            >
              {showJournalEntries ? (
                <BiCog className='h-4 w-4' />
              ) : (
                <BsJournal className='h-4 w-4' />
              )}
            </button>
          </div>
        )}

        <div className='max-h-[min(70vh,640px)] overflow-y-auto p-4'>
          {activeSection === 'insights' && (
            <div className='space-y-3 text-sm text-[var(--tt-fg-2)]'>
              {sentiments ? (
                <SentimentsResume sentiments={sentiments} reducedMotion />
              ) : (
                <p>
                  Complete your emotional evaluation to unlock trading psychology insights, or set
                  up SLT to see goal progress on the calendar.
                </p>
              )}
              {!stlPlan && tradingDaysThisMonth >= 5 && (
                <p className='rounded-lg border border-[var(--tt-brand-dim)] bg-[var(--tt-brand-dim)] px-3 py-2 text-[var(--tt-brand)]'>
                  You have traded {tradingDaysThisMonth} days this month — consider setting a
                  Straight Line Trading plan.
                </p>
              )}
            </div>
          )}

          {activeSection === 'slt' && (
            <SLTForm monthPnl={monthPnl} tradingDaysThisMonth={tradingDaysThisMonth} />
          )}

          {activeSection === 'psychology' && (
            <>
              {sentiments ? (
                <div className={showJournalEntries ? '' : ''}>
                  {!showJournalEntries ? (
                    <SentimentsResume sentiments={sentiments} reducedMotion />
                  ) : (
                    <JournalEntriesList />
                  )}
                </div>
              ) : (
                <EmotionalEvaluationInfo />
              )}
            </>
          )}

          {activeSection === 'withdrawal' && (
            <WithdrawalPlan currentAccount={currentAccount} />
          )}
        </div>
      </div>

      {showConfirmationModal && (
        <ResetEmotionalEvaluation
          currentAccount={currentAccount}
          showConfirmationModal={showConfirmationModal}
          setShowConfirmationModal={setShowConfirmationModal}
        />
      )}
    </div>
  );
}

export default Evaluationbox;
