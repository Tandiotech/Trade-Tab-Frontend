import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MiniCellFake from './MiniCellFake';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MiniPlCalendarProps {
  TRADES: any;
  balance: number;
  cellHeight: string;
  relative?: boolean;
  example?: boolean;
  displaySeeFullJournal?: boolean;
  displayTitle?: boolean;
}

export default function MiniJournalFake({
  TRADES,
  balance,
  cellHeight,
  example = false,
  relative = true,
  displaySeeFullJournal = false,
  displayTitle = true,
}: MiniPlCalendarProps) {
  const journalData = useMemo(() => {
    const journal = TRADES?.reduce((acc: any, trade: any) => {
      // if (trade.type === 'DEAL_TYPE_BALANCE') return acc;

      const date = trade.closeTime.split(' ')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          totalProfit: 0,
          totalTrades: 0,
          successfulTrades: 0,
          failedTrades: 0,
          type: trade.type,
        };
      }

      acc[date].totalProfit += trade.profit;
      acc[date].totalTrades += 1;
      if (trade.success === 'won') {
        acc[date].successfulTrades += 1;
      } else {
        acc[date].failedTrades += 1;
      }
      return acc;
    }, {});
    return Object.values(journal);
  }, [TRADES]);

  let currentMonth = 0;
  if (example) {
    currentMonth = 0;
  } else {
    currentMonth = new Date().getMonth() + 1;
    // currentMonth = new Date().getMonth();
  }

  const currentYear = new Date().getFullYear();
  const [highlightedDay, setHighlightedDay] = useState<number | null>(null);
  const [pnlData, setPnlData] = useState<Record<number, number>>({});
  const [tradesData, setTradesData] = useState<Record<number, number>>({});

  const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

  useEffect(() => {
    const pnl: Record<number, number> = {};
    const trades: Record<number, number> = {};

    journalData.forEach((entry: any) => {
      // Separar el string de fecha en componentes
      const [year, month, day] = entry.date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day); // Crear la fecha localmente

      // if (entryDate.getMonth() + 1 === currentMonth && entryDate.getFullYear() === currentYear) {
      const dayOfMonth = entryDate.getDate();
      pnl[dayOfMonth] = entry.totalProfit;
      trades[dayOfMonth] = entry.totalTrades;
      // }
    });

    setPnlData(pnl);
    setTradesData(trades);
  }, [journalData, currentMonth, currentYear]);

  const generateCells = () => {
    const cells = [];
    const daysCount = daysInMonth(currentMonth, currentYear);
    const startDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const today = new Date();

    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className='empty-cell' />);
    }

    for (let i = 1; i <= daysCount; i++) {
      const isWeekend =
        new Date(currentYear, currentMonth - 1, i).getDay() === 5 ||
        new Date(currentYear, currentMonth - 1, i).getDay() === 6;

      const isFutureDate = new Date(currentYear, currentMonth - 1, i) > today;

      cells.push(
        <MiniCellFake
          key={`cell-${i}`}
          cellHeight={cellHeight}
          i={i}
          balance={balance}
          currentMonth={currentMonth}
          currentYear={currentYear}
          highlightedDay={highlightedDay}
          pnlData={pnlData}
          tradesData={tradesData}
          setHighlightedDay={setHighlightedDay}
          today={today}
          isWeekend={isWeekend}
          isFutureDate={isFutureDate}
          relative={relative}
        />
      );
    }

    return cells;
  };

  return (
    <div className='h-full md:py-6 md:px-4 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 shadow-2xl shadow-slate-900/50 hover:shadow-2xl hover:shadow-slate-500/20'>
      {displayTitle && (
        <div className='flex justify-between items-center mb-6 px-2'>
          <div className='flex flex-col'>
            <span className='text-lg text-white font-bold tracking-wide'>
              {new Date(currentYear, currentMonth - 1, 1).toLocaleString('en-US', { month: 'long' })}{' '}
              {currentYear}
            </span>
            <span className='text-xs text-slate-400 font-medium'>Trading Performance</span>
          </div>
          {displaySeeFullJournal && (
            <Link 
              to={'/journal'} 
              className='group relative px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105'
            >
              <span className='text-sm text-cyan-300 font-semibold group-hover:text-cyan-200 transition-colors duration-300'>
                View Full Journal
              </span>
            </Link>
          )}
        </div>
      )}

      <div className='flex flex-col'>
        <div className='grid grid-cols-7 text-center mb-4 px-2'>
          {daysOfWeek.map((day, index) => (
            <span
              key={index}
              className={`text-xs font-semibold tracking-wide ${
                day === 'Sun' || day === 'Sat' 
                  ? 'text-red-400 font-bold' 
                  : 'text-slate-300'
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className='grid grid-cols-7 gap-1.5 rounded-2xl p-3 bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/20'>
          {generateCells()}
        </div>
      </div>
    </div>
  );
}
