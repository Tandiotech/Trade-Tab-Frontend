import { useState } from 'react';
// import CellsCalendar from './CellsCalendar';
// import GlobalModal from '../../modal/GlobalModal';
// // import FeedBackTracker from '../FeedBackTracker';
// import ConfirmWithdrawalModal from '../ConfirmWithdrawalModal';
import { addBusinessDays } from './addBusinessDays';
import CellsCalendarHome from './CellsCalendarHome';

export default function CellGeneratorHome({
  tradesData,
  currentMonth,
  currentYear,
  balance,
  stlPlan,
  pnlData,
  withdrawalDate,
  withdrawalMonth,
  withdrawalInformation,
  withdrawalPlanMode,
  currentAccount, // Ya no depende de un contexto
}: any) {
  const rows = 6;
  const cols = 7;

  const [modalWithdrawal, setModalWithdrawal] = useState(false);
  const [modalEmotional, setModalEmotional] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);

  // Función para generar celdas del mes anterior
  const generatePrevMonthCells = (startDay: number, prevMonthDaysCount: number) => {
    const cells = [];
    for (let i = prevMonthDaysCount - startDay + 1; i <= prevMonthDaysCount; i++) {
      cells.push(
        <div
          key={`prev-month-cell-${i}`}
          className='tt-calendar-cell tt-calendar-cell--muted relative flex h-24 w-full items-center justify-center rounded-lg p-2'
        >
          <p className='absolute left-0 top-0 px-2 text-xs text-[var(--tt-fg-3)]'>{i}</p>
        </div>
      );
    }
    return cells;
  };

  // Función para obtener el número de días en un mes determinado
  const daysInMonth = (month: number, year: number): number => {
    return new Date(year, month, 0).getDate();
  };

  // Función para generar celdas del mes actual
  const generateCurrentMonthCells = (
    daysCount: number,
    currentMonth: number,
    currentYear: number,
    today: Date,
    withdrawalDate: number,
    withdrawalMonth: number,
    stlPlan: any,
    setModalWithdrawal: any,
    setModalEmotional: any,
    setCurrentPosition: any,
    tradesData: any,
    balance: any,
    pnlData: any,
    withdrawalPlanMode: any,
    withdrawalInformation: any,
    currentAccount: any
  ) => {
    const cells = [];

    const stlPlanCreatedDate = new Date(stlPlan?.createdAt);
    const sltPlanEndDate = addBusinessDays(stlPlanCreatedDate, 30); // Cálculo de 30 días hábiles

    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(currentYear, currentMonth - 1, i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isFutureDate = date > today;
      const isWithdrawalDate = withdrawalDate === i && withdrawalMonth === currentMonth;

      const isStartingSLTPlan =
        stlPlanCreatedDate.getUTCFullYear() === date.getFullYear() &&
        stlPlanCreatedDate.getUTCMonth() === date.getMonth() &&
        stlPlanCreatedDate.getUTCDate() === date.getDate();

      const isInSLTPlanPeriod = !isWeekend && date >= stlPlanCreatedDate && date <= sltPlanEndDate;

      const withdrawalData = isWithdrawalDate ? withdrawalInformation : {};

      cells.push(
        <CellsCalendarHome
          tradesData={tradesData}
          key={`cell-${i}`}
          i={i}
          balance={balance}
          currentMonth={currentMonth}
          currentYear={currentYear}
          pnlData={pnlData}
          today={today}
          isWeekend={isWeekend}
          isFutureDate={isFutureDate}
          stlPlan={stlPlan}
          withdrawalPlanMode={withdrawalPlanMode}
          isWithdrawalDate={isWithdrawalDate}
          withdrawalData={withdrawalData}
          setModalWithdrawal={setModalWithdrawal}
          setModalEmotional={setModalEmotional}
          setCurrentPosition={setCurrentPosition}
          isStartingSLTPlan={isStartingSLTPlan}
          isInSLTPlanPeriod={isInSLTPlanPeriod}
          currentAccount={currentAccount}
        />
      );
    }

    return cells;
  };

  // Función para generar celdas del mes siguiente
  const generateNextMonthCells = (remainingCells: number) => {
    const cells = [];
    for (let i = 1; i <= remainingCells; i++) {
      cells.push(
        <div
          key={`next-month-cell-${i}`}
          className='tt-calendar-cell tt-calendar-cell--muted relative flex h-24 w-full items-center justify-center rounded-lg p-2'
        >
          <p className='absolute left-0 top-0 px-2 text-xs text-[var(--tt-fg-3)]'>{i}</p>
        </div>
      );
    }
    return cells;
  };

  const generateCells = () => {
    const daysCount = daysInMonth(currentMonth, currentYear);
    const startDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const today = new Date();
    const prevMonthDaysCount = daysInMonth(
      currentMonth - 1 < 1 ? 12 : currentMonth - 1,
      currentMonth - 1 < 1 ? currentYear - 1 : currentYear
    );

    const prevMonthCells = generatePrevMonthCells(startDay, prevMonthDaysCount);
    const currentMonthCells = generateCurrentMonthCells(
      daysCount,
      currentMonth,
      currentYear,
      today,
      withdrawalDate,
      withdrawalMonth,
      stlPlan,
      setModalWithdrawal,
      setModalEmotional,
      setCurrentPosition,
      tradesData,
      balance,
      pnlData,
      withdrawalPlanMode,
      withdrawalInformation,
      currentAccount
    );
    const remainingCells = rows * cols - (prevMonthCells.length + currentMonthCells.length);
    const nextMonthCells = generateNextMonthCells(remainingCells);

    return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
  };

  return <>{generateCells()}</>;
}
