import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function ComparePage() {
  const { a, b } = useParams();
  type TraderCompare = {
    handle: string;
    returnPct30d: number;
    maxDrawdown30d: number;
    winRate30d: number;
    volumeLots30d: number;
    returnsHistory: number[];
    sharpe30d: number;
    consistencyScore: number; // 0..100
    avgTradePnL: number; // USD
  };

  const { left, right } = useMemo(() => {
    const leftData: TraderCompare = {
      handle: a || 'alpha',
      returnPct30d: 12.3,
      maxDrawdown30d: 3.4,
      winRate30d: 61,
      volumeLots30d: 210,
      returnsHistory: [0.3, 0.6, -0.2, 0.4, 0.9, 0.7, 0.5, 0.8, 1.1, -0.1, 0.2, 0.6, 0.4, 0.9],
      sharpe30d: 1.8,
      consistencyScore: 78,
      avgTradePnL: 14,
    };
    const rightData: TraderCompare = {
      handle: b || 'vega',
      returnPct30d: 10.1,
      maxDrawdown30d: 3.9,
      winRate30d: 58,
      volumeLots30d: 180,
      returnsHistory: [0.2, 0.4, -0.3, 0.2, 0.7, 0.4, 0.6, 0.5, 0.8, -0.2, 0.1, 0.5, 0.3, 0.7],
      sharpe30d: 1.5,
      consistencyScore: 72,
      avgTradePnL: 12,
    };
    return { left: leftData, right: rightData };
  }, [a, b]);

  const statRows = [
    { label: '30d Return', l: left.returnPct30d, r: right.returnPct30d, formatter: (v: number) => `${v.toFixed(1)}%`, higherIsBetter: true },
    { label: '30d Max DD', l: left.maxDrawdown30d, r: right.maxDrawdown30d, formatter: (v: number) => `${v.toFixed(1)}%`, higherIsBetter: false },
    { label: '30d Win rate', l: left.winRate30d, r: right.winRate30d, formatter: (v: number) => `${v}%`, higherIsBetter: true },
    { label: '30d Volume', l: left.volumeLots30d, r: right.volumeLots30d, formatter: (v: number) => `${v} lots`, higherIsBetter: true },
    { label: '30d Sharpe', l: left.sharpe30d, r: right.sharpe30d, formatter: (v: number) => v.toFixed(2), higherIsBetter: true },
    { label: 'Consistency', l: left.consistencyScore, r: right.consistencyScore, formatter: (v: number) => `${v}`, higherIsBetter: true },
    { label: 'Avg trade PnL', l: left.avgTradePnL, r: right.avgTradePnL, formatter: (v: number) => `$${v}`, higherIsBetter: true },
  ];

  return (
    <div className='px-4 sm:px-6 md:px-8 pt-4 md:pt-6 text-white max-w-6xl mx-auto w-full'>
      <div className='flex items-end justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold'>Head-to-Head</h1>
        <Link to='/leaderboards' className='px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition'>Leaderboards</Link>
      </div>

      <div className='mt-4 rounded-2xl border border-white/10 bg-gradient-to-r from-teal-500/10 via-violet-500/10 to-rose-500/10 px-5 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-teal-400/20 border border-white/20 grid place-items-center text-sm'>@</div>
            <div>
              <div className='text-white/60 text-xs'>Trader A</div>
              <div className='font-semibold text-lg'>@{left.handle}</div>
            </div>
          </div>
          <div className='px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs tracking-wider'>VS</div>
          <div className='flex items-center gap-3'>
            <div className='text-right'>
              <div className='text-white/60 text-xs'>Top Trader</div>
              <div className='font-semibold text-lg'>@{right.handle}</div>
            </div>
            <div className='w-10 h-10 rounded-full bg-pink-400/20 border border-white/20 grid place-items-center text-sm'>★</div>
          </div>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
        <CompareCard title={`@${left.handle}`} accent='teal' returnPct={left.returnPct30d} winRate={left.winRate30d} maxDD={left.maxDrawdown30d} volumeLots={left.volumeLots30d} series={left.returnsHistory} />
        <CompareCard title={`@${right.handle}`} accent='rose' returnPct={right.returnPct30d} winRate={right.winRate30d} maxDD={right.maxDrawdown30d} volumeLots={right.volumeLots30d} series={right.returnsHistory} />
      </div>

      <div className='mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5'>
        <div className='flex items-end justify-between'>
          <div>
            <div className='text-white/60 text-xs'>Key metrics</div>
            <div className='font-semibold'>Last 30 days</div>
          </div>
        </div>
        <div className='mt-4 space-y-4'>
          {statRows.map((row) => (
            <CompareStatRow key={row.label} label={row.label} leftValue={row.l} rightValue={row.r} higherIsBetter={row.higherIsBetter} format={row.formatter} />
          ))}
        </div>
      </div>
    </div>
  );
}



function CompareCard({ title, accent, returnPct, winRate, maxDD, volumeLots, series }: { title: string; accent: 'teal' | 'rose'; returnPct: number; winRate: number; maxDD: number; volumeLots: number; series: number[] }) {
  const accentColor = accent === 'teal' ? 'text-emerald-400' : 'text-rose-400';
  const bgAccent = accent === 'teal' ? 'from-emerald-500/20 to-cyan-500/10' : 'from-rose-500/20 to-fuchsia-500/10';
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-gradient-to-br ${bgAccent} p-4 md:p-5`}> 
      <div className='flex items-center justify-between'>
        <div className='font-semibold text-lg'>{title}</div>
        <div className='text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10'>30d</div>
      </div>
      <div className='mt-2'>
        <div className={`text-4xl md:text-5xl font-extrabold tracking-tight ${accentColor}`}>{returnPct.toFixed(1)}%</div>
        <div className='text-white/60 text-xs mt-1'>Return</div>
      </div>
      <div className='mt-4'>
        <Sparkline data={series} colorClass={accent === 'teal' ? 'text-emerald-300' : 'text-rose-300'} />
      </div>
      <div className='mt-4 grid grid-cols-3 gap-3 text-sm'>
        <MiniStat label='Win rate' value={`${winRate}%`} />
        <MiniStat label='Max DD' value={`${maxDD.toFixed(1)}%`} />
        <MiniStat label='Volume' value={`${volumeLots} lots`} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2'>
      <div className='text-white/60 text-[10px] uppercase tracking-wide'>{label}</div>
      <div className='font-semibold'>{value}</div>
    </div>
  );
}

function Sparkline({ data, width = 240, height = 56, colorClass = 'text-teal-300' }: { data: number[]; width?: number; height?: number; colorClass?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const path = `M ${points.join(' L ')}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width='100%' height={height} className={`${colorClass}`}>
      <path d={path} fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    </svg>
  );
}

function CompareStatRow({ label, leftValue, rightValue, higherIsBetter, format }: { label: string; leftValue: number; rightValue: number; higherIsBetter: boolean; format: (v: number) => string }) {
  const leftWins = higherIsBetter ? leftValue > rightValue : leftValue < rightValue;
  const rightWins = higherIsBetter ? rightValue > leftValue : rightValue < leftValue;
  const maxValue = Math.max(leftValue, rightValue, 1);
  const leftPct = Math.max(6, Math.round((leftValue / maxValue) * 100));
  const rightPct = Math.max(6, Math.round((rightValue / maxValue) * 100));
  return (
    <div>
      <div className='grid grid-cols-3 gap-2 items-baseline'>
        <div className={`text-right font-semibold ${leftWins ? 'text-emerald-300' : ''}`}>{format(leftValue)}</div>
        <div className='text-white/60 text-xs text-center'>{label}</div>
        <div className={`font-semibold ${rightWins ? 'text-rose-300' : ''}`}>{format(rightValue)}</div>
      </div>
      <div className='mt-2 grid grid-cols-2 gap-3'>
        <div className='h-2 rounded-full bg-white/10 overflow-hidden'>
          <div className={`h-full ${leftWins ? 'bg-emerald-400' : 'bg-white/30'}`} style={{ width: `${leftPct}%` }} />
        </div>
        <div className='h-2 rounded-full bg-white/10 overflow-hidden'>
          <div className={`h-full ${rightWins ? 'bg-rose-400' : 'bg-white/30'}`} style={{ width: `${rightPct}%` }} />
        </div>
      </div>
    </div>
  );
}
