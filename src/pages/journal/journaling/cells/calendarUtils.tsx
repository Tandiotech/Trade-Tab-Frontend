export const generateCalendarCells = (
  currentMonth: number,
  currentYear: number,
  today: Date,
  withdrawalDate: number | null,
  withdrawalMonth: number | null,
  stlPlanCreatedAt: string | undefined // Si STL plan tiene una fecha de creación
) => {
  const cells = [];
  const rows = 6;
  const cols = 7;
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const startDay = new Date(currentYear, currentMonth - 1, 1).getDay();

  // Información del plan STL
  const stlPlanCreatedDate = stlPlanCreatedAt ? new Date(stlPlanCreatedAt) : undefined;
  const sltPlanEndDate = stlPlanCreatedDate
    ? new Date(stlPlanCreatedDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    : undefined; // Suma de 30 días

  const isWithinSTLPlanPeriod = (date: Date) => {
    return (
      stlPlanCreatedDate && sltPlanEndDate && date >= stlPlanCreatedDate && date <= sltPlanEndDate
    );
  };

  // Celdas del mes anterior
  const prevMonthDaysCount = new Date(currentYear, currentMonth - 1, 0).getDate();
  for (let i = prevMonthDaysCount - startDay + 1; i <= prevMonthDaysCount; i++) {
    cells.push({
      day: i,
      isWeekend: false,
      isFutureDate: false,
      isWithdrawalDate: false,
      isStartingSTLPlan: false,
      isInSTLPlanPeriod: false,
    });
  }

  // Celdas del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth - 1, i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isFutureDate = date > today;
    const isWithdrawalDate = withdrawalDate === i && withdrawalMonth === currentMonth;
    const isStartingSTLPlan =
      stlPlanCreatedDate &&
      stlPlanCreatedDate.getUTCFullYear() === date.getFullYear() &&
      stlPlanCreatedDate.getUTCMonth() === date.getMonth() &&
      stlPlanCreatedDate.getUTCDate() === date.getDate();
    const isInSTLPlanPeriod = isWithinSTLPlanPeriod(date);

    cells.push({
      day: i,
      isWeekend,
      isFutureDate,
      isWithdrawalDate,
      isStartingSTLPlan,
      isInSTLPlanPeriod,
    });
  }

  // Celdas del mes siguiente
  const remainingCells = rows * cols - cells.length;
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({
      day: i,
      isWeekend: false,
      isFutureDate: false,
      isWithdrawalDate: false,
      isStartingSTLPlan: false,
      isInSTLPlanPeriod: false,
    });
  }

  return cells;
};
