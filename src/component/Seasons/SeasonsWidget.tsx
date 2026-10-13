import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type SeasonWeekKey = 'week1' | 'week2' | 'week3' | 'week4' | 'week5';

type SeasonEntry = {
  rank: number;
  handle: string;
  returnPct: number;
};

type SeasonsWidgetProps = {
  title?: string;
  compact?: boolean;
};

const mockWeekData: Record<SeasonWeekKey, SeasonEntry[]> = {
  week1: [
    { rank: 1, handle: 'alpha', returnPct: 5.2 },
    { rank: 2, handle: 'vega', returnPct: 4.6 },
    { rank: 3, handle: 'nova', returnPct: 4.1 },
    { rank: 4, handle: 'zen', returnPct: 3.9 },
    { rank: 5, handle: 'orca', returnPct: 3.7 },
    { rank: 6, handle: 'pulsar', returnPct: 3.3 },
    { rank: 7, handle: 'atlas', returnPct: 3.1 },
    { rank: 8, handle: 'luna', returnPct: 2.8 },
    { rank: 9, handle: 'echo', returnPct: 2.5 },
    { rank: 10, handle: 'delta', returnPct: 2.2 },
  ],
  week2: [
    { rank: 1, handle: 'nova', returnPct: 6.1 },
    { rank: 2, handle: 'alpha', returnPct: 5.5 },
    { rank: 3, handle: 'vega', returnPct: 5.2 },
    { rank: 4, handle: 'zen', returnPct: 4.9 },
    { rank: 5, handle: 'atlas', returnPct: 4.2 },
    { rank: 6, handle: 'pulsar', returnPct: 3.9 },
    { rank: 7, handle: 'luna', returnPct: 3.7 },
    { rank: 8, handle: 'orca', returnPct: 3.5 },
    { rank: 9, handle: 'echo', returnPct: 2.9 },
    { rank: 10, handle: 'delta', returnPct: 2.4 },
  ],
  week3: [
    { rank: 1, handle: 'zen', returnPct: 5.4 },
    { rank: 2, handle: 'alpha', returnPct: 5.1 },
    { rank: 3, handle: 'nova', returnPct: 4.8 },
    { rank: 4, handle: 'vega', returnPct: 4.4 },
    { rank: 5, handle: 'pulsar', returnPct: 4.0 },
    { rank: 6, handle: 'atlas', returnPct: 3.8 },
    { rank: 7, handle: 'luna', returnPct: 3.4 },
    { rank: 8, handle: 'orca', returnPct: 3.0 },
    { rank: 9, handle: 'echo', returnPct: 2.6 },
    { rank: 10, handle: 'delta', returnPct: 2.1 },
  ],
  week4: [
    { rank: 1, handle: 'alpha', returnPct: 6.3 },
    { rank: 2, handle: 'zen', returnPct: 5.8 },
    { rank: 3, handle: 'nova', returnPct: 5.0 },
    { rank: 4, handle: 'vega', returnPct: 4.7 },
    { rank: 5, handle: 'atlas', returnPct: 4.2 },
    { rank: 6, handle: 'pulsar', returnPct: 4.0 },
    { rank: 7, handle: 'luna', returnPct: 3.6 },
    { rank: 8, handle: 'orca', returnPct: 3.1 },
    { rank: 9, handle: 'echo', returnPct: 2.7 },
    { rank: 10, handle: 'delta', returnPct: 2.2 },
  ],
  week5: [
    { rank: 1, handle: 'alpha', returnPct: 3.1 },
    { rank: 2, handle: 'vega', returnPct: 2.9 },
    { rank: 3, handle: 'nova', returnPct: 2.5 },
    { rank: 4, handle: 'zen', returnPct: 2.2 },
    { rank: 5, handle: 'atlas', returnPct: 2.0 },
    { rank: 6, handle: 'pulsar', returnPct: 1.7 },
    { rank: 7, handle: 'luna', returnPct: 1.5 },
    { rank: 8, handle: 'orca', returnPct: 1.3 },
    { rank: 9, handle: 'echo', returnPct: 1.2 },
    { rank: 10, handle: 'delta', returnPct: 1.0 },
  ],
};

const pill = 'px-3 py-1 rounded-full text-xs border border-white/20';

export default function SeasonsWidget({ title = 'Trading Seasons', compact = false }: SeasonsWidgetProps) {
  const currentWeekKey = useMemo<SeasonWeekKey>(() => {
    const today = new Date();
    const day = today.getDate();
    const weekIndex = Math.ceil(day / 7); // 1..5
    return (`week${Math.min(5, Math.max(1, weekIndex))}`) as SeasonWeekKey;
  }, []);

  const [week, setWeek] = useState<SeasonWeekKey>(currentWeekKey);
  const data = mockWeekData[week] || [];

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/leaderboards?period=weekly&type=risk`);
    } catch {}
  };

  return (
    <div className={`rounded-xl border border-white/10 ${compact ? 'p-3' : 'p-4'} bg-white/5 text-white`}>
      <div className='flex items-center justify-between'>
        <div>
          <div className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>{title}</div>
          <div className='text-white/60 text-xs'>Top 10 weekly by return %</div>
        </div>
        <div className='flex items-center gap-2'>
          <button onClick={copyShare} className='px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 transition text-xs'>Compartir</button>
          <Link to='/leaderboards' className='px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs'>Ver todo</Link>
        </div>
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        {(['week1','week2','week3','week4','week5'] as SeasonWeekKey[]).map((w, i) => (
          <button key={w} onClick={() => setWeek(w)} className={`${pill} ${week===w ? 'bg-white/10' : 'bg-transparent'}`}>
            {`Week ${i+1}`}
          </button>
        ))}
      </div>

      <div className='mt-3 overflow-x-auto'>
        <table className='min-w-full text-xs'>
          <thead className='bg-white/5'>
            <tr>
              <th className='text-left px-3 py-2'>#</th>
              <th className='text-left px-3 py-2'>Trader</th>
              <th className='text-right px-3 py-2'>Retorno</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.rank} className='border-t border-white/5 hover:bg-white/5 transition'>
                <td className='px-3 py-2 font-semibold'>#{e.rank}</td>
                <td className='px-3 py-2'>
                  <Link to={`/u/${e.handle}`} className='hover:underline'>@{e.handle}</Link>
                </td>
                <td className='px-3 py-2 text-right'>{e.returnPct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


