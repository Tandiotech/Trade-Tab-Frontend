import { useEffect, useState } from 'react';
import { RUTE_GET_WITHDRAWAL_PLAN } from '@/utils/Rutes';
import { PlCalendarProps } from './InterfacesJournal';
import HeaderJournalCalendar from './HeaderJournalCalendar';
import { useJournalContext } from '@/context/JournalProvider';
import { http } from '@/utils/http_request';
import JournalCalendarGrid from './grid/JournalCalendarGrid';
import { useJournalMonth } from '../hooks/useJournalMonth';

/** Matches `Date#getDay()`: 0 = Sunday … 6 = Saturday */
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function JournalCalendar({
  journalData,
  balance = 0,
  withdrawalPlanMode,
  stlPlan,
  currentAccount,
  economicCalendarData = [],
}: PlCalendarProps) {
  const [withdrawalMonth, setWithdrawalMonth] = useState(0);
  const [withdrawalInformation, setWithdrawalInformation] = useState<Record<string, unknown> | null>(
    null
  );

  const {
    setWithdrawalDate,
    withdrawalDate,
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
  } = useJournalContext();

  const monthData = useJournalMonth(journalData, currentMonth, currentYear);

  useEffect(() => {
    const fetchWithdrawalPlan = async () => {
      try {
        const responseW = await http.post(RUTE_GET_WITHDRAWAL_PLAN, {
          account: currentAccount?.external_id,
        });

        const date = new Date(responseW.data.data?.withdrawalDate).getUTCDate();
        const month = new Date(responseW.data.data?.withdrawalDate).getUTCMonth() + 1;

        setWithdrawalDate(date);
        setWithdrawalMonth(month);
        setWithdrawalInformation(responseW.data.data);
      } catch (error) {
        console.error('Error fetching SLT withdrawal plan:', error);
      }
    };

    if (currentAccount) {
      fetchWithdrawalPlan();
    }
  }, [currentAccount, withdrawalDate, setWithdrawalDate]);

  return (
    <section className='tt-panel relative flex w-full flex-col rounded-[var(--tt-radius-lg)] border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] p-3 md:p-4'>
      <HeaderJournalCalendar
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
        totalPnl={monthData.totalPnl}
        monthData={monthData}
      />

      <div id='pl-calendar' className='flex flex-col'>
        <div className='mb-1 grid w-full grid-cols-7 text-center'>
          {daysOfWeek.map(day => (
            <span
              key={day}
              className={`py-1 text-xs font-medium ${
                day === 'Sun' || day === 'Sat'
                  ? 'text-[var(--tt-loss)]'
                  : 'text-[var(--tt-fg-3)]'
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className='grid grid-cols-7 grid-rows-6 gap-1.5 md:gap-2 [&>*]:h-full [&>*]:min-h-0'>
          <JournalCalendarGrid
            tradesData={monthData.tradesByDay}
            tradesHistory={monthData.tradesHistoryByDay}
            currentMonth={currentMonth}
            currentYear={currentYear}
            balance={balance}
            pnlData={monthData.pnlByDay}
            stlPlan={stlPlan}
            withdrawalDate={withdrawalDate}
            withdrawalMonth={withdrawalMonth}
            withdrawalPlanMode={withdrawalPlanMode}
            withdrawalInformation={withdrawalInformation}
            economicCalendar={economicCalendarData}
          />
        </div>
      </div>
    </section>
  );
}

export default JournalCalendar;
