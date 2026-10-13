import { describe, expect, it } from 'vitest';
import {
  computeDailySltTarget,
  getLastActivityFromJournalEntries,
  monthHasTradingActivity,
  resolveJournalCell,
} from '../journalCellState';

const today = new Date(2026, 4, 15); // May 15, 2026

describe('resolveJournalCell', () => {
  it('returns adjacentMonth when flagged', () => {
    const r = resolveJournalCell({
      day: 10,
      month: 5,
      year: 2026,
      today,
      pnl: 0,
      tradeCount: 0,
      balance: 10000,
      stlPlan: null,
      isWithdrawalDate: false,
      isAdjacentMonth: true,
    });
    expect(r.kind).toBe('adjacentMonth');
    expect(r.isClickable).toBe(false);
  });

  it('returns futureIdle for future days without SLT', () => {
    const r = resolveJournalCell({
      day: 20,
      month: 5,
      year: 2026,
      today,
      pnl: 0,
      tradeCount: 0,
      balance: 10000,
      stlPlan: null,
      isWithdrawalDate: false,
    });
    expect(r.kind).toBe('futureIdle');
    expect(r.isFuture).toBe(true);
  });

  it('returns pastNoTrades for past days with no activity', () => {
    const r = resolveJournalCell({
      day: 5,
      month: 5,
      year: 2026,
      today,
      pnl: 0,
      tradeCount: 0,
      balance: 10000,
      stlPlan: null,
      isWithdrawalDate: false,
    });
    expect(r.kind).toBe('pastNoTrades');
    expect(r.isPast).toBe(true);
  });

  it('returns pastWin when PnL is positive', () => {
    const r = resolveJournalCell({
      day: 5,
      month: 3,
      year: 2026,
      today,
      pnl: 120,
      tradeCount: 3,
      balance: 10000,
      stlPlan: null,
      isWithdrawalDate: false,
    });
    expect(r.kind).toBe('pastWin');
  });

  it('returns sltStart on plan creation day', () => {
    const r = resolveJournalCell({
      day: 1,
      month: 5,
      year: 2026,
      today,
      pnl: 0,
      tradeCount: 0,
      balance: 10000,
      stlPlan: {
        createdAt: '2026-05-01T12:00:00.000Z',
        lifeTime: 20,
        includeWeekends: false,
        monthlyProfitGoal: { target: 2000, isPercentage: false },
      },
      isWithdrawalDate: false,
    });
    expect(r.kind).toBe('sltStart');
  });
});

describe('getLastActivityFromJournalEntries', () => {
  it('returns latest trade date', () => {
    const last = getLastActivityFromJournalEntries([
      { date: '2026-03-10' },
      { date: '2026-03-22' },
      { date: '2026-02-01' },
    ]);
    expect(last).toEqual({ year: 2026, month: 3, day: 22 });
  });
});

describe('monthHasTradingActivity', () => {
  it('is false when all zeros', () => {
    expect(monthHasTradingActivity({ 1: 0, 2: 0 }, { 1: 0, 2: 0 })).toBe(false);
  });

  it('is true when trades exist', () => {
    expect(monthHasTradingActivity({ 1: 0 }, { 2: 2 })).toBe(true);
  });
});

describe('computeDailySltTarget', () => {
  it('computes per-day dollar target', () => {
    const t = computeDailySltTarget(
      {
        lifeTime: 20,
        monthlyProfitGoal: { target: 2000, isPercentage: false },
      },
      10000,
      false
    );
    expect(t?.raw).toBe(100);
    expect(t?.display).toBe('100.00');
  });
});
