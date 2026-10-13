import { useState } from 'react';

interface CellsCalendarProps {
  cellHeight: string;
  currentMonth: number;
  currentYear: number;
  highlightedDay: number | null;
  pnlData: Record<number, number>;
  tradesData: Record<number, number>;
  i: number;
  today: Date;
  setHighlightedDay: React.Dispatch<React.SetStateAction<number | null>>;
  isWeekend: boolean;
  isFutureDate: boolean;
  balance: number;
  relative?: boolean;
}

const MiniCellFake: React.FC<CellsCalendarProps> = ({
  cellHeight = 'h-16',
  currentMonth,
  currentYear,
  highlightedDay,
  pnlData,
  tradesData,
  i,
  today,
  setHighlightedDay,
  isFutureDate,
  balance,
  isWeekend,
}) => {
  const pnlValue = pnlData[i] !== undefined ? pnlData[i] : 0;
  const trades = tradesData[i] !== undefined ? tradesData[i] : 0;

  const [displayOptionsModal, setDisplayOptionsModal] = useState(false);

  // Determine if the current date is in the past
  const isPastDate = new Date(currentYear, currentMonth - 1, i) < today && !isFutureDate;

  // Define cell class based on date and data
  const cellClass = isFutureDate
    ? 'bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-slate-600/30' // Style for future dates
    : (isPastDate && trades === 0) || isWeekend
      ? 'bg-gradient-to-br from-slate-700/50 to-slate-600/30 border border-slate-500/40' // Style for past dates with zero trades
      : pnlValue === 0
        ? trades > 0
          ? 'bg-gradient-to-br from-blue-500/60 to-blue-400/40 border border-blue-400/50' // Style for past dates with trades but zero P&L
          : 'bg-gradient-to-br from-slate-600/50 to-slate-500/30 border border-slate-500/40' // Style for past dates with zero trades
        : pnlValue < 0
          ? 'bg-gradient-to-br from-red-500/60 to-red-400/40 border border-red-400/50 shadow-lg shadow-red-500/20' // Style for days with negative P&L
          : 'bg-gradient-to-br from-emerald-500/60 to-emerald-400/40 border border-emerald-400/50 shadow-lg shadow-emerald-500/20'; // Style for days with positive P&L

  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 5))
  
  return (
    <div
      className={`relative w-full ${cellHeight} flex items-center justify-center rounded-xl ${cellClass} transition-all duration-300 transform hover:scale-105 ${
        highlightedDay === i ? 'cursor-pointer ring-2 ring-cyan-400/50 ring-offset-1 ring-offset-slate-800' : ''
      }`}
      key={`current-month-cell-${i}`}
      onMouseOver={() => setHighlightedDay(i)}
      onMouseOut={() => setHighlightedDay(null)}
    >
      <p
        className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-xs font-bold ${
          isWeekend 
            ? 'text-red-300 bg-red-900/30' 
            : 'text-slate-300 bg-slate-800/50'
        } backdrop-blur-sm`}
      >
        {i}
      </p>
      <div
        onClick={() => setDisplayOptionsModal(!displayOptionsModal)}
        className='md:whitespace-nowrap text-sm items-end'
      >
        {(isFutureDate || isWeekend) && (
          <div className='w-full flex justify-center'>
            <div className='w-6 h-6 bg-gradient-to-br from-slate-600/40 to-slate-500/30 rounded-lg border border-slate-500/30 flex items-center justify-center'>
              <span className='text-slate-400 text-xs'>⋯</span>
            </div>
          </div>
        )}

        {isPastDate && !isWeekend && (
          <>
            <p className={`text-sm font-bold text-center ${
              pnlValue >= 0 ? 'text-emerald-100' : 'text-red-100'
            } drop-shadow-sm`}>
              {((pnlValue * 100) / balance).toFixed(2)}%
            </p>

            <p className={`text-xs text-center whitespace-nowrap ${
              pnlValue >= 0 ? 'text-emerald-200' : 'text-red-200'
            } font-medium`}>
              <strong className='pr-1'>
                {randomNumber+1} 
              </strong>
              trade{randomNumber+1>1?"s":''}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MiniCellFake;
