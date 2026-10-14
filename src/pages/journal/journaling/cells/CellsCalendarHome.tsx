import React, { useState, useEffect } from 'react';
import { SeparadorDecimal } from '../../../../utils/SeparadorDecimal';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { CellsCalendarProps } from './InterfaceCellsCalendar';
import { IoIosFlag } from 'react-icons/io';

/** @deprecated Used by PlCalendarFake landing preview only */
const CellsCalendarHome: React.FC<CellsCalendarProps> = ({
  tradesData,
  currentMonth,
  balance,
  currentYear,
  pnlData,
  i,
  today,
  isFutureDate,
  withdrawalPlanMode,
  stlPlan,
  withdrawalData,
  isWithdrawalDate,
  setModalWithdrawal,
  setModalEmotional,
  setCurrentPosition,
  isStartingSLTPlan,
  isInSLTPlanPeriod,
  currentAccount,
}) => {
  const pnlValue = pnlData?.[i] ?? 0;
  const tradesOfTheDay = tradesData?.[i] ?? 0;
  const [highlightedDay, setHighlightedDay] = useState<number | null>(null);
  const relativeValues: any = [];

  const [localSTL, setLocalSTL] = useState<any>({});
  const relativeTarget = (
    (balance * (localSTL?.monthlyProfitGoal?.target ?? 0)) /
    30 /
    100
  ).toFixed(2);

  useEffect(() => {
    if (stlPlan) setLocalSTL(stlPlan);
  }, [stlPlan]);

  const isPastDate = new Date(currentYear, currentMonth - 1, i) < today && !isFutureDate;

  const cellClassDictionary = {
    isStartingSLTPlan: 'tt-calendar-cell tt-calendar-cell--slt',
    isWithdrawalDate: 'tt-calendar-cell tt-calendar-cell--withdrawal',
    isFutureDate: isInSLTPlanPeriod
      ? 'tt-calendar-cell tt-calendar-cell--future-slt'
      : 'tt-calendar-cell tt-calendar-cell--future',
    pastNoTrades: 'tt-calendar-cell tt-calendar-cell--empty',
    pnlPositive: 'tt-calendar-cell tt-calendar-cell--profit',
    pnlNegative: 'tt-calendar-cell tt-calendar-cell--loss',
    tradesExist: 'tt-calendar-cell tt-calendar-cell--trades',
  };

  const getCellClass = () => {
    if (isStartingSLTPlan) return cellClassDictionary.isStartingSLTPlan;
    if (isWithdrawalDate) return cellClassDictionary.isWithdrawalDate;
    if (isFutureDate) return cellClassDictionary.isFutureDate;
    if (isPastDate && tradesOfTheDay === 0) return cellClassDictionary.pastNoTrades;
    if (pnlValue > 0) return cellClassDictionary.pnlPositive;
    if (pnlValue < 0) return cellClassDictionary.pnlNegative;
    if (tradesOfTheDay > 0) return cellClassDictionary.tradesExist;
    return cellClassDictionary.pastNoTrades;
  };

  const contentDictionary = {
    showLogo: (
      <div className='w-full'>
        <img className='mx-auto w-10 opacity-60' src='/logo.png' alt='logo' />
      </div>
    ),
    showTarget: (
      <div className='w-full text-center'>
        <p className='text-[0.6rem] font-semibold text-[var(--tt-fg-3)]'>Target</p>
        {isInSLTPlanPeriod && localSTL?.monthlyProfitGoal?.isPercentage ? (
          <p className='text-sm font-bold text-[var(--tt-fg-0)]'>
            {SeparadorDecimal(relativeTarget)}
          </p>
        ) : (
          <p className='text-sm font-bold text-[var(--tt-fg-0)]'>
            {SeparadorDecimal((localSTL?.monthlyProfitGoal?.target / 30).toFixed(2))}
          </p>
        )}
        <p className='text-xs font-bold text-[var(--tt-fg-2)]'>{currentAccount?.currency}</p>
      </div>
    ),
    showPnlValue: (
      <>
        <p className='text-center text-sm font-bold text-[var(--tt-fg-0)]'>
          {isWithdrawalDate
            ? SeparadorDecimal(withdrawalData?.amount?.toFixed(2))
            : relativeValues
              ? `${((pnlValue * 100) / balance).toFixed(2)}%`
              : SeparadorDecimal(pnlValue.toFixed(2))}
        </p>
        <p className='text-center text-xs font-bold text-[var(--tt-fg-2)]'>
          {currentAccount?.currency}
        </p>
        <p className='text-center text-xs font-semibold text-[var(--tt-fg-3)]'>
          {isWithdrawalDate ? 'Withdraw day' : pnlValue !== 0 && `Trades: ${tradesOfTheDay}`}
        </p>
      </>
    ),
  };

  const getContent = () => {
    if (stlPlan == null && isFutureDate && !isWithdrawalDate && !isInSLTPlanPeriod) {
      return contentDictionary.showLogo;
    } else if (stlPlan !== null && isFutureDate && !isWithdrawalDate && isInSLTPlanPeriod) {
      return contentDictionary.showTarget;
    } else if (isFutureDate && !isInSLTPlanPeriod) {
      return contentDictionary.showLogo;
    } else {
      return contentDictionary.showPnlValue;
    }
  };

  return (
    <div
      onClick={
        withdrawalPlanMode && isFutureDate
          ? () => {
              setModalWithdrawal(true);
              setCurrentPosition(i);
            }
          : pnlValue < 0 && isPastDate
            ? () => {
                setCurrentPosition(i);
                setModalEmotional(true);
              }
            : () => {}
      }
      className={`relative flex h-24 w-full items-center justify-center rounded-lg ${getCellClass()} ${
        highlightedDay === i ? 'tt-calendar-cell--hover' : ''
      }`}
      key={`current-month-cell-${i}`}
      onMouseOver={() => setHighlightedDay(i)}
      onMouseOut={() => setHighlightedDay(null)}
    >
      {isPastDate && !isFutureDate ? (
        pnlValue > 0 ? (
          <div className='absolute right-0 top-0 rounded-full bg-[var(--tt-bg-0)]/80 p-0.5 text-[var(--tt-profit)]'>
            <FaCheck />
          </div>
        ) : pnlValue < 1 && tradesOfTheDay !== 0 ? (
          <div className='absolute right-0 top-0 rounded-full bg-[var(--tt-bg-0)]/80 p-0.5 text-[var(--tt-loss)]'>
            <FaXmark />
          </div>
        ) : null
      ) : null}

      <p className='absolute left-0 top-0 px-2 text-xs text-[var(--tt-fg-2)]'>{i}</p>

      <div className='flex flex-col whitespace-nowrap'>
        {isStartingSLTPlan && (
          <p className='flex items-center justify-center gap-1 text-center text-sm font-bold text-[var(--tt-brand)]'>
            SLT
            <IoIosFlag size={16} />
          </p>
        )}

        {getContent()}
      </div>
    </div>
  );
};

export default CellsCalendarHome;
