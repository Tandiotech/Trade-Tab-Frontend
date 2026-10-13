import { useState } from 'react';
import { SeparadorDecimal } from '../../../utils/SeparadorDecimal';

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

const MiniCell: React.FC<CellsCalendarProps> = ({
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
  relative = true,
}) => {
  const pnlValue = pnlData[i] !== undefined ? pnlData[i] : 0;
  const trades = tradesData[i] !== undefined ? tradesData[i] : 0;

  const [displayOptionsModal, setDisplayOptionsModal] = useState(false);

  // Determine if the current date is in the past
  const isPastDate = new Date(currentYear, currentMonth - 1, i) < today && !isFutureDate;

  // Define cell class based on date and data
  const cellClass = isFutureDate
    ? 'bg-slate-800' // Style for future dates
    : isPastDate && trades === 0
      ? 'bg-darkblack-400 border border-darkblack-700' // Style for past dates with zero trades
      : pnlValue === 0
        ? trades > 0
          ? 'bg-blue-500 border border-darkblack-700' // Style for past dates with zero trades
          : 'bg-gray-300 border border-darkblack-700' // Style for past dates with zero trades
        : pnlValue < 0
          ? 'bg-red-300 border border-red-400 text-black' // Style for days with negative P&L
          : 'bg-green-300 border border-green-400 text-black font-bold'; // Style for days with positive P&L

  return (
    <div
      className={`relative w-full ${cellHeight} flex items-center justify-center rounded-lg ${cellClass} ${
        highlightedDay === i ? 'cursor-pointer' : ''
      }`}
      key={`current-month-cell-${i}`}
      onMouseOver={() => setHighlightedDay(i)}
      onMouseOut={() => setHighlightedDay(null)}
    >
      <p className='absolute top-0 left-0 px-1  font-bold  text-[0.7rem]'>{i}</p>
      <div
        onClick={() => setDisplayOptionsModal(!displayOptionsModal)}
        // className='whitespace-nowrap text-black items-end bg-red-400'
        className='md:whitespace-nowrap text-sm text-black items-end '
      >
        {isFutureDate && (
          <div className='w-full'>
            <img className='w-6 opacity-90' src='/logo_1.png' alt='logo' />
          </div>
        )}

        {isPastDate && (
          <>
            <p className='text-[0.6rem] font-bold text-center'>
              {relative
                ? ((pnlValue * 100) / balance).toFixed(2) + '%'
                : SeparadorDecimal(pnlValue.toFixed(2))}
            </p>

            <p className='text-[0.5rem] md:text-[0.55rem] text-center whitespace-nowrap'>
              {trades} trades
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MiniCell;
