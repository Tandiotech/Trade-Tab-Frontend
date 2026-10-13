import { useCallback, useEffect, useState } from 'react';
import { http } from '@/utils/http_request';
import type { JournalEntryStatus } from '../journalCellState';

export type JournalEmotionEntry = {
  date: string;
  selectedFeeling?: string;
  energyLevel?: number;
  [key: string]: unknown;
};

export function useJournalEmotions(
  accountId: string | undefined,
  currentMonth: number,
  currentYear: number
) {
  const [byDay, setByDay] = useState<Record<number, JournalEmotionEntry>>({});
  const [loading, setLoading] = useState(false);

  const fetchMonth = useCallback(async () => {
    if (!accountId) {
      setByDay({});
      return;
    }
    setLoading(true);
    try {
      const res = await http.get(`emotional/account/${accountId}`, {
        params: { month: currentMonth, year: currentYear },
      });
      const organized: Record<number, JournalEmotionEntry> = {};
      const list = res.data?.emotions ?? res.data?.data ?? [];
      if (Array.isArray(list)) {
        list.forEach((entry: JournalEmotionEntry) => {
          const day = new Date(entry.date).getDate();
          organized[day] = entry;
        });
      }
      setByDay(organized);
    } catch (error) {
      console.error('Error fetching journal emotions:', error);
      setByDay({});
    } finally {
      setLoading(false);
    }
  }, [accountId, currentMonth, currentYear]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  const getJournalStatus = (day: number): JournalEntryStatus => {
    const dayData = byDay[day];
    if (!dayData) return 'none';
    if (dayData.selectedFeeling && dayData.energyLevel) return 'complete';
    return 'partial';
  };

  const updateDay = (day: number, data: JournalEmotionEntry) => {
    setByDay(prev => ({ ...prev, [day]: data }));
  };

  return {
    byDay,
    loading,
    refetch: fetchMonth,
    getJournalStatus,
    hasEntry: (day: number) => !!byDay[day],
    updateDay,
  };
}
