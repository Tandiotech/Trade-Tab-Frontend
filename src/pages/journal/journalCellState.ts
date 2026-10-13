import { addBusinessDays } from './journaling/cells/addBusinessDays';

export type JournalCellKind =
  | 'adjacentMonth'
  | 'futureIdle'
  | 'futureSltTarget'
  | 'pastNoTrades'
  | 'pastWin'
  | 'pastLoss'
  | 'pastBreakeven'
  | 'todayNoTrades'
  | 'todayWin'
  | 'todayLoss'
  | 'todayBreakeven'
  | 'sltStart'
  | 'withdrawal';

export type JournalEntryStatus = 'none' | 'partial' | 'complete';

export type StlPlanLike = {
  createdAt?: string;
  lifeTime?: number;
  includeWeekends?: boolean;
  monthlyProfitGoal?: {
    target?: number;
    isPercentage?: boolean;
  };
} | null;

export type ResolveJournalCellInput = {
  day: number;
  month: number;
  year: number;
  today: Date;
  pnl: number;
  tradeCount: number;
  balance: number;
  stlPlan: StlPlanLike;
  isWithdrawalDate: boolean;
  isAdjacentMonth?: boolean;
  journalStatus?: JournalEntryStatus;
  journalPriority?: 'low' | 'medium' | 'high';
  hasJournalEntry?: boolean;
  useRelativeValues?: boolean;
};

export type ResolvedJournalCell = {
  kind: JournalCellKind;
  isFuture: boolean;
  isPast: boolean;
  isToday: boolean;
  isClickable: boolean;
  isInSltWindow: boolean;
  isStartingSlt: boolean;
  dailySltTargetDisplay: string | null;
  dailySltTargetRaw: number | null;
  currency: string;
};

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getSltPlanBounds(stlPlan: StlPlanLike): {
  start: Date | null;
  end: Date | null;
} {
  if (!stlPlan?.createdAt || !stlPlan.lifeTime) {
    return { start: null, end: null };
  }
  const start = new Date(stlPlan.createdAt);
  const end = addBusinessDays(start, stlPlan.lifeTime, !!stlPlan.includeWeekends);
  return { start, end };
}

export function isDateInSltWindow(
  date: Date,
  stlPlan: StlPlanLike,
  includeWeekends?: boolean
): boolean {
  const { start, end } = getSltPlanBounds(stlPlan);
  if (!start || !end) return false;
  const weekendsExcluded = includeWeekends ?? stlPlan?.includeWeekends ?? false;
  if (!weekendsExcluded && (date.getDay() === 0 || date.getDay() === 6)) {
    return false;
  }
  return date >= start && date <= end;
}

export function computeDailySltTarget(
  stlPlan: StlPlanLike,
  balance: number,
  useRelativeValues: boolean
): { display: string; raw: number } | null {
  if (!stlPlan?.monthlyProfitGoal?.target || !stlPlan.lifeTime) return null;
  const target = stlPlan.monthlyProfitGoal.target;
  const perDay = target / stlPlan.lifeTime;
  if (stlPlan.monthlyProfitGoal.isPercentage && balance > 0) {
    const pct = (perDay * 100) / balance;
    return {
      raw: pct,
      display: useRelativeValues ? `${pct.toFixed(2)}%` : `${perDay.toFixed(2)}`,
    };
  }
  return { raw: perDay, display: perDay.toFixed(2) };
}

export function resolveJournalCell(input: ResolveJournalCellInput): ResolvedJournalCell {
  const {
    day,
    month,
    year,
    today,
    pnl,
    tradeCount,
    balance,
    stlPlan,
    isWithdrawalDate,
    isAdjacentMonth = false,
  } = input;

  const cellDate = new Date(year, month - 1, day);
  const todayStart = startOfDay(today);
  const isFuture = cellDate > todayStart;
  const isPast = cellDate < todayStart;
  const isToday = isSameCalendarDay(cellDate, todayStart);
  const isInSltWindow = isDateInSltWindow(cellDate, stlPlan);
  const isStartingSlt =
    !!stlPlan?.createdAt &&
    isSameCalendarDay(cellDate, new Date(stlPlan.createdAt));

  const currency = 'USD';

  if (isAdjacentMonth) {
    return {
      kind: 'adjacentMonth',
      isFuture,
      isPast,
      isToday,
      isClickable: false,
      isInSltWindow: false,
      isStartingSlt: false,
      dailySltTargetDisplay: null,
      dailySltTargetRaw: null,
      currency,
    };
  }

  if (isWithdrawalDate) {
    return {
      kind: 'withdrawal',
      isFuture,
      isPast,
      isToday,
      isClickable: isFuture,
      isInSltWindow,
      isStartingSlt: false,
      dailySltTargetDisplay: null,
      dailySltTargetRaw: null,
      currency,
    };
  }

  if (isStartingSlt) {
    return {
      kind: 'sltStart',
      isFuture,
      isPast,
      isToday,
      isClickable: true,
      isInSltWindow: true,
      isStartingSlt: true,
      dailySltTargetDisplay: null,
      dailySltTargetRaw: null,
      currency,
    };
  }

  const sltTarget = isInSltWindow
    ? computeDailySltTarget(stlPlan, balance, !!input.useRelativeValues)
    : null;

  if (isFuture) {
    return {
      kind: isInSltWindow ? 'futureSltTarget' : 'futureIdle',
      isFuture: true,
      isPast: false,
      isToday: false,
      isClickable: isInSltWindow,
      isInSltWindow,
      isStartingSlt: false,
      dailySltTargetDisplay: sltTarget?.display ?? null,
      dailySltTargetRaw: sltTarget?.raw ?? null,
      currency,
    };
  }

  const hasTrades = tradeCount > 0;
  const isWin = pnl > 0;
  const isLoss = pnl < 0;

  let kind: JournalCellKind = 'pastNoTrades';
  if (hasTrades) {
    if (isWin) kind = isToday ? 'todayWin' : 'pastWin';
    else if (isLoss) kind = isToday ? 'todayLoss' : 'pastLoss';
    else kind = isToday ? 'todayBreakeven' : 'pastBreakeven';
  } else {
    kind = isToday ? 'todayNoTrades' : 'pastNoTrades';
  }

  return {
    kind,
    isFuture: false,
    isPast,
    isToday,
    isClickable: isPast || !!input.hasJournalEntry,
    isInSltWindow,
    isStartingSlt: false,
    dailySltTargetDisplay: isInSltWindow ? sltTarget?.display ?? null : null,
    dailySltTargetRaw: isInSltWindow ? sltTarget?.raw ?? null : null,
    currency,
  };
}

export function getLastActivityFromJournalEntries(
  journalEntries: Array<{ date: string }>
): { year: number; month: number; day: number } | null {
  if (!journalEntries?.length) return null;
  let max: Date | null = null;
  for (const entry of journalEntries) {
    const d = new Date(entry.date.split(' ')[0]);
    if (Number.isNaN(d.getTime())) continue;
    if (!max || d > max) max = d;
  }
  if (!max) return null;
  return { year: max.getFullYear(), month: max.getMonth() + 1, day: max.getDate() };
}

export function monthHasTradingActivity(
  pnlByDay: Record<number, number>,
  tradesByDay: Record<number, number>
): boolean {
  const days = new Set([...Object.keys(pnlByDay), ...Object.keys(tradesByDay)]);
  for (const key of days) {
    const d = Number(key);
    if ((pnlByDay[d] ?? 0) !== 0 || (tradesByDay[d] ?? 0) > 0) return true;
  }
  return false;
}
