import { useState, useEffect } from 'react';
import { PlCalendarProps } from './InterfacesJournal';
import CellGeneratorHome from './cells/CellGeneratorHome';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** @deprecated Landing preview only — main journal uses JournalCalendar + JournalCalendarCell */
function PlCalendarFake({
  journalData,
  balance,
  withdrawalPlanMode,
  stlPlan,
  currentAccount,
}: PlCalendarProps) {
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());
  const [pnlData, setPnlData] = useState<Record<number, number>>({});
  const [tradesData, setTradesData] = useState<Record<number, number>>({});
  const [, setTotalPnl] = useState(0);

  const [withdrawalMonth] = useState<number | null>(null);
  const [withdrawalInformation] = useState<{} | null>();

  const updatePnlAndTradesData = () => {
    const pnl: Record<number, number> = {};
    const trades: Record<number, number> = {};

    journalData.forEach(entry => {
      const entryDate = entry.date.split(' ')[0];
      const [year, month, day] = entryDate.split('-').map(Number);

      if (month === currentMonth && year === currentYear) {
        pnl[day] = entry.totalProfit;
        trades[day] = entry.totalTrades;
      }
    });

    setPnlData(pnl);
    setTradesData(trades);
  };

  useEffect(() => {
    updatePnlAndTradesData();
  }, [currentMonth, currentYear, journalData]);

  useEffect(() => {
    let total = 0;
    for (const key in pnlData) {
      total += pnlData[key];
    }
    setTotalPnl(total);
  }, [pnlData]);

  return (
    <div className='relative flex w-full flex-col justify-between'>
      <div className='flex flex-col'>
        <div className='my-4 grid w-full grid-cols-7 text-center'>
          {daysOfWeek.map((day, index) => (
            <span
              key={index}
              className={`text-xs font-semibold uppercase tracking-wide ${
                day === 'Sun' || day === 'Sat'
                  ? 'text-[var(--tt-loss)]'
                  : 'text-[var(--tt-fg-2)]'
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className='relative grid grid-cols-7 grid-rows-6 gap-2'>
          <CellGeneratorHome
            tradesData={tradesData}
            currentMonth={currentMonth}
            currentYear={currentYear}
            balance={balance}
            pnlData={pnlData}
            stlPlan={stlPlan}
            withdrawalMonth={withdrawalMonth}
            withdrawalPlanMode={withdrawalPlanMode}
            withdrawalInformation={withdrawalInformation}
            currentAccount={currentAccount}
          />
        </div>
      </div>
    </div>
  );
}

export default PlCalendarFake;
