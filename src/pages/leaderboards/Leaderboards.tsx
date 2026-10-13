import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type PeriodKey = 'daily' | 'weekly' | 'monthly' | 'all';
type BoardType = 'risk' | 'volume' | 'consistency' | 'hot' | 'improved';

type LeaderboardEntry = {
  rank: number;
  handle: string;
  displayName: string;
  country?: string;
  returnPct: number;
  maxDrawdownPct: number;
  winRatePct: number;
  volumeLots: number;
  trades: number;
  score: number;
  rankDelta?: number;
};

const mockEntries: LeaderboardEntry[] = [
  { rank: 1, handle: 'alpha', displayName: 'Alpha Trader', returnPct: 18.4, maxDrawdownPct: 4.2, winRatePct: 62, volumeLots: 212, trades: 143, score: 92, rankDelta: +2 },
  { rank: 2, handle: 'vega', displayName: 'Vega FX', returnPct: 15.1, maxDrawdownPct: 3.9, winRatePct: 58, volumeLots: 180, trades: 120, score: 88, rankDelta: -1 },
  { rank: 3, handle: 'nova', displayName: 'Nova', returnPct: 12.8, maxDrawdownPct: 3.5, winRatePct: 65, volumeLots: 155, trades: 101, score: 84, rankDelta: +4 },
  { rank: 4, handle: 'zen', displayName: 'Zen Trader', returnPct: 10.6, maxDrawdownPct: 5.1, winRatePct: 57, volumeLots: 170, trades: 130, score: 79, rankDelta: 0 },
  { rank: 5, handle: 'orca', displayName: 'Orca', returnPct: 9.9, maxDrawdownPct: 6.2, winRatePct: 54, volumeLots: 120, trades: 98, score: 73, rankDelta: -2 },
  { rank: 6, handle: 'pulsar', displayName: 'Pulsar', returnPct: 8.4, maxDrawdownPct: 4.8, winRatePct: 56, volumeLots: 105, trades: 87, score: 71 },
  { rank: 7, handle: 'atlas', displayName: 'Atlas', returnPct: 7.3, maxDrawdownPct: 4.0, winRatePct: 59, volumeLots: 99, trades: 80, score: 69 },
  { rank: 8, handle: 'luna', displayName: 'Luna', returnPct: 6.5, maxDrawdownPct: 5.5, winRatePct: 53, volumeLots: 92, trades: 76, score: 66 },
  { rank: 9, handle: 'echo', displayName: 'Echo', returnPct: 5.2, maxDrawdownPct: 6.8, winRatePct: 51, volumeLots: 85, trades: 70, score: 62 },
  { rank: 10, handle: 'delta', displayName: 'Delta', returnPct: 4.6, maxDrawdownPct: 7.1, winRatePct: 49, volumeLots: 77, trades: 63, score: 58 },
];

const pill = 'px-3 py-1 rounded-full text-sm border border-white/20';

export default function Leaderboards() {
  const [period, setPeriod] = useState<PeriodKey>('weekly');
  const [type, setType] = useState<BoardType>('risk');

  const entries = useMemo(() => {
    // In a future iteration, fetch from API with period and type
    return mockEntries;
  }, [period, type]);

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/leaderboards?period=${period}&type=${type}`);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className='px-4 sm:px-6 md:px-8 pt-4 md:pt-6 text-white max-w-[1400px] mx-auto w-full'>
      <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>Leaderboards</h1>
          <p className='text-white/70 mt-1'>Compete on risk-adjusted returns, volume, and consistency.</p>
        </div>
        <div className='flex items-center gap-2'>
          <button onClick={copyShare} className='px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 transition'>Share</button>
        </div>
      </div>

      <div className='mt-5 flex flex-wrap gap-2'>
        {(['daily','weekly','monthly','all'] as PeriodKey[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`${pill} ${period===p ? 'bg-white/10' : 'bg-transparent'}`}
          >
            {p === 'all' ? 'All-time' : p.charAt(0).toUpperCase()+p.slice(1)}
          </button>
        ))}
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        {([
          ['risk','Pro (risk-adjusted)'],
          ['volume','Volume'],
          ['consistency','Consistency'],
          ['hot','Hot streak'],
          ['improved','Most improved'],
        ] as [BoardType,string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setType(k)}
            className={`${pill} ${type===k ? 'bg-white/10' : 'bg-transparent'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className='mt-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {entries.map((e) => (
            <LeaderCard key={e.rank} entry={e} />
          ))}
        </div>
      </div>

      <div className='mt-8 text-white/60 text-xs'>Stats are illustrative. Public, risk-adjusted leaderboards coming soon.</div>
    </div>
  );
}



function LeaderCard({ entry }: { entry: LeaderboardEntry }) {
  const crown = entry.rank <= 3;
  const crownColors = entry.rank === 1 ? 'from-yellow-400/80 to-yellow-200/30' : entry.rank === 2 ? 'from-slate-200/80 to-slate-100/20' : 'from-amber-500/80 to-amber-200/30';
  const returnIsPositive = entry.returnPct >= 0;

  // Simple interactive tilt
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const onMove: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const px = (ev.clientX - rect.left) / rect.width; // 0..1
    const py = (ev.clientY - rect.top) / rect.height; // 0..1
    const rotY = (px - 0.5) * 14; // left-right
    const rotX = (0.5 - py) * 14; // top-bottom
    setRotation({ x: rotX, y: rotY });
  };

  const onLeave = () => setRotation({ x: 0, y: 0 });

  return (
    <div className='group relative' style={{ perspective: '1200px' }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        className='relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.04] p-5 md:p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transform-gpu transition-transform duration-200 will-change-transform'
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        <div className='absolute -inset-px rounded-2xl pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-300 bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0deg,#a78bfa_120deg,#f472b6_240deg,#22d3ee_360deg)]' />

        <div className='relative z-[1] flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full grid place-items-center bg-gradient-to-br ${crown ? crownColors : 'from-teal-500/30 to-cyan-400/20'} border border-white/20`}>#{entry.rank}</div>
            <div>
              <div className='text-sm text-white/60'>@{entry.handle}</div>
              <div className='font-semibold'>{entry.displayName}</div>
            </div>
          </div>
          <div className='text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10'>Score {entry.score}</div>
        </div>

        {typeof entry.rankDelta === 'number' && (
          <div className={`absolute right-4 top-4 z-[1] text-xs ${entry.rankDelta>0 ? 'text-green-400' : entry.rankDelta<0 ? 'text-red-400' : 'text-white/50'}`}>
            {entry.rankDelta>0 ? `▲${entry.rankDelta}` : entry.rankDelta<0 ? `▼${Math.abs(entry.rankDelta)}` : '—'}
          </div>
        )}

        <div className='relative z-[1] mt-5'>
          <div className='flex items-end justify-between gap-3'>
            <div>
              <div className={`text-4xl md:text-5xl font-extrabold tracking-tight ${returnIsPositive ? 'text-emerald-400' : 'text-rose-400'}`}>{entry.returnPct.toFixed(1)}%</div>
              <div className='text-xs text-white/60 mt-1'>Return ({entry.volumeLots} lots, {entry.trades} trades)</div>
            </div>
            {crown && (
              <div className='text-2xl md:text-3xl'>
                {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : '🥉'}
              </div>
            )}
          </div>

          <div className='mt-5 grid grid-cols-2 gap-3 text-sm'>
            <Stat label='Win rate' value={`${entry.winRatePct}%`} icon='🎯' />
            <Stat label='Max DD' value={`${entry.maxDrawdownPct.toFixed(1)}%`} icon='📉' />
            <Stat label='Volume' value={`${entry.volumeLots} lots`} icon='🔊' />
            <Stat label='Trades' value={`${entry.trades}`} icon='🧮' />
          </div>

          <div className='mt-5 flex items-center justify-between'>
            <Link to={`/u/${entry.handle}`} className='text-teal-300 hover:text-teal-200 underline underline-offset-4'>View profile</Link>
            <Link to={`/compare/${entry.handle}/alpha`} className='px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 transition text-sm'>Compare</Link>
          </div>
        </div>

        <div className='pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ background: 'radial-gradient(800px 200px at 0% -10%, rgba(255,255,255,0.10), transparent 60%)' }} />
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className='rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 flex items-center justify-between'>
      <div className='flex items-center gap-2 text-white/70'>
        <span className='text-base'>{icon}</span>
        <span className='text-xs'>{label}</span>
      </div>
      <div className='font-semibold'>{value}</div>
    </div>
  );
}
