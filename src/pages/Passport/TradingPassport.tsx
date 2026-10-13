import SeasonsWidget from '@/component/Seasons/SeasonsWidget';
import { Link } from 'react-router-dom';
import { teams } from './teams';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BiTrophy, BiBoltCircle, BiLineChart, BiShieldAlt2, BiTime, BiStar } from 'react-icons/bi';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { http } from '@/utils/http_request.tsx';

export default function TradingPassport() {
  const { currentAccount } = useMTAccounts();
  const [metrics, setMetrics] = useState<any | null>(null);
  const [activeTier, setActiveTier] = useState<'All' | 'Elite' | 'Pro' | 'Lab'>('All');

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!currentAccount?._id) return;
      try {
        const res = await http.get(`/api/metrics/${currentAccount._id}`);
        setMetrics(res?.data || null);
      } catch (e) {
        // Silent fail; snapshot will be hidden
      }
    };
    fetchMetrics();
  }, [currentAccount?._id]);

  const snapshot = useMemo(() => {
    if (!metrics) return null;
    const winRate = Number(metrics?.wonTradesPercent || 0);
    const maxDD = Number(metrics?.maxDrawdown || 0);
    const profitFactor = Number(metrics?.profitFactor || 0);
    const sharpe = Number(metrics?.sharpeRatio || 0);
    const avgMs = Number(metrics?.averageTradeLengthInMilliseconds || 0);
    return { winRate, maxDD, profitFactor, sharpe, avgMs };
  }, [metrics]);

  const seedSpotsLeft = (name: string) => {
    const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return 8 + (seed % 17); // 8..24
  };

  const evaluateTeamFit = (s: any, team: any) => {
    if (!s) return { score: 0, badges: [] as string[] };
    let score = 0;
    const badges: string[] = [];
    // Heuristics based on available metrics
    if (team.name === 'Falcon') {
      if (s.winRate >= 55) score += 40;
      if (s.maxDD <= 8) score += 40;
      if (s.profitFactor >= 1.6) score += 20;
      if (score >= 70) badges.push('Precision fit');
    }
    if (team.name === 'Nimbus') {
      if (s.maxDD <= 5) score += 60;
      if (s.sharpe >= 1.2) score += 20;
      if (s.profitFactor >= 1.5) score += 20;
      if (score >= 70) badges.push('Calm equity');
    }
    if (team.name === 'Wolfpack') {
      if (s.profitFactor >= 1.5) score += 40;
      if (s.maxDD <= 20) score += 30;
      if (s.sharpe >= 1.0) score += 30;
    }
    if (team.name === 'Titan') {
      if (s.avgMs >= 1000 * 60 * 60 * 6) score += 50; // >= 6h avg duration
      if (s.winRate >= 50) score += 20;
      if (s.profitFactor >= 1.4) score += 30;
    }
    if (team.name === 'Apex') {
      if (s.sharpe >= 1.5) score += 50;
      if (s.winRate >= 55) score += 25;
      if (s.profitFactor >= 1.6) score += 25;
    }
    if (team.name === 'Eclipse') {
      if (s.sharpe >= 1.2) score += 40;
      if (s.maxDD <= 12) score += 30;
      if (s.profitFactor >= 1.4) score += 30;
    }
    if (team.name === 'Vanguard') {
      if (s.profitFactor >= 1.8) score += 50;
      if (s.sharpe >= 1.3) score += 25;
      if (s.winRate >= 52) score += 25;
    }
    if (team.name === 'Maverick') {
      if (s.winRate >= 50) score += 35;
      if (s.sharpe >= 1.0) score += 35;
      if (s.profitFactor >= 1.3) score += 30;
    }
    if (team.name === 'Phoenix') {
      if (s.winRate >= 52) score += 30;
      if (s.profitFactor >= 1.5) score += 30;
      if (s.maxDD <= 15) score += 40;
    }
    if (team.name === 'Quantum') {
      if (s.sharpe >= 1.0) score += 30;
      if (s.profitFactor >= 1.3) score += 30;
      if (s.winRate >= 50) score += 20;
    }
    return { score: Math.min(100, score), badges };
  };

  const rankedTeams = useMemo(() => {
    const base = teams
      .map((t) => ({
        team: t,
        fit: evaluateTeamFit(snapshot, t)
      }))
      .sort((a, b) => b.fit.score - a.fit.score);
    if (activeTier === 'All') return base;
    return base.filter(({ team }) => team.tier === activeTier);
  }, [snapshot, activeTier]);

  const seasonEndsIn = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const diff = Math.max(0, end.getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  }, []);

  const liveJoinsToday = useMemo(() => {
    const seed = (currentAccount?.account_number || 137) % 27;
    return 12 + seed; // 12..38
  }, [currentAccount?.account_number]);

  return (
    <div className='px-4 sm:px-6 md:px-8 pt-4 md:pt-6 text-white max-w-7xl mx-auto w-full'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className='rounded-2xl border border-white/10 bg-gradient-to-br from-teal-500/20 via-sky-500/10 to-indigo-500/20 p-5 md:p-6 relative overflow-hidden'
      >
        <div className='absolute -top-8 -right-8 w-40 h-40 rounded-full bg-teal-500/20 blur-3xl' />
        <div className='absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-indigo-500/10 blur-3xl' />
        <div className='relative flex items-end justify-between'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2'>
              <BiStar className='text-teal-300' /> Trading Passport
            </h1>
            <p className='text-white/70 mt-1'>Your public trader identity: seasons, achievements, consistency, and team rank.</p>
          </div>
          <Link to='/leaderboards' className='px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition'>Leaderboards</Link>
        </div>

        {/* Buzz + Countdown */}
        <div className='relative mt-3 flex flex-wrap items-center gap-3 text-xs'>
          <div className='px-2 py-1 rounded-md bg-emerald-400/15 border border-emerald-400/20 text-emerald-200'>
            {liveJoinsToday} traders joined teams today
          </div>
          <div className='px-2 py-1 rounded-md bg-amber-400/15 border border-amber-400/20 text-amber-200'>
            Season ends in {seasonEndsIn.days}d {seasonEndsIn.hours}h
          </div>
          <div className='px-2 py-1 rounded-md bg-sky-400/15 border border-sky-400/20 text-sky-200'>
            Limited spots remain
          </div>
        </div>
      </motion.div>

      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='md:col-span-2 space-y-4'>
          <SeasonsWidget title='Monthly Mini-Leagues' />

          {/* Personalized Snapshot */}
          {snapshot && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className='rounded-xl border border-white/10 p-4 md:p-5 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm'
            >
              <div className='flex items-center justify-between mb-3'>
                <div className='font-semibold flex items-center gap-2'>
                  <BiLineChart className='text-teal-300' /> Your Snapshot
                </div>
                <span className='text-xs text-white/60'>Auto-updates from your current account</span>
              </div>
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                <div className='rounded-lg bg-white/10 border border-white/10 p-3 hover:bg-white/15 transition'>
                  <div className='text-xs text-white/60 flex items-center gap-1'><BiTrophy className='text-amber-300' /> Win Rate</div>
                  <div className='text-xl font-bold'>{snapshot.winRate.toFixed(1)}%</div>
                  <div className='text-[11px] text-white/50'>Target 55%+ for Elite</div>
                </div>
                <div className='rounded-lg bg-white/10 border border-white/10 p-3 hover:bg-white/15 transition'>
                  <div className='text-xs text-white/60 flex items-center gap-1'><BiShieldAlt2 className='text-emerald-300' /> Max Drawdown</div>
                  <div className='text-xl font-bold'>{snapshot.maxDD.toFixed(1)}%</div>
                  <div className='text-[11px] text-white/50'>Lower is better</div>
                </div>
                <div className='rounded-lg bg-white/10 border border-white/10 p-3 hover:bg-white/15 transition'>
                  <div className='text-xs text-white/60 flex items-center gap-1'><BiBoltCircle className='text-sky-300' /> Profit Factor</div>
                  <div className='text-xl font-bold'>{snapshot.profitFactor.toFixed(2)}</div>
                  <div className='text-[11px] text-white/50'>1.5+ is strong</div>
                </div>
                <div className='rounded-lg bg-white/10 border border-white/10 p-3 hover:bg-white/15 transition'>
                  <div className='text-xs text-white/60 flex items-center gap-1'><BiTime className='text-fuchsia-300' /> Avg Duration</div>
                  <div className='text-xl font-bold'>{snapshot.avgMs > 0 ? `${Math.floor(snapshot.avgMs/60000)}m` : '—'}</div>
                  <div className='text-[11px] text-white/50'>Helps team placement</div>
                </div>
              </div>
            </motion.div>
          )}

          <div className='rounded-xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm'>
            <div className='font-semibold mb-2'>Badges & Achievements</div>
            <div className='flex flex-wrap gap-2'>
              <span className='px-2 py-1 bg-white/10 rounded-full text-xs'>Top 10 Weekly</span>
              <span className='px-2 py-1 bg-white/10 rounded-full text-xs'>4-Week Consistency</span>
              <span className='px-2 py-1 bg-white/10 rounded-full text-xs'>Low Drawdown</span>
            </div>
          </div>

          <div className='rounded-xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm'>
            <div className='flex items-center justify-between mb-3'>
              <div className='font-semibold'>Elite Teams</div>
              <span className='text-xs text-white/60'>Join by proving skills and consistency</span>
            </div>

            {/* Tier Filters */}
            <div className='mb-3 flex flex-wrap gap-2'>
              {(['All','Elite','Pro','Lab'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition ${
                    activeTier === tier
                      ? 'border-teal-400/40 bg-teal-500/15 text-teal-200'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Recommended banner */}
            {rankedTeams.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className='mb-3 rounded-lg p-3 bg-gradient-to-r from-teal-500/20 via-sky-500/10 to-transparent border border-teal-400/20'
              >
                <div className='text-sm'>
                  <span className='text-white/80'>Recommended fit:</span>{' '}
                  <span className='font-semibold text-teal-300'>{rankedTeams[0].team.name}</span>{' '}
                  <span className='text-white/70'>({rankedTeams[0].fit.score}% match)</span>
                </div>
                <div className='mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rankedTeams[0].fit.score}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className='h-full bg-gradient-to-r from-teal-400 to-emerald-400'
                  />
                </div>
              </motion.div>
            )}

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
              {rankedTeams.map(({ team, fit }) => (
                <motion.div
                  key={team.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                  className='group rounded-lg border border-white/10 bg-gradient-to-tr from-teal-500/10 via-white/5 to-transparent p-3 hover:border-white/20 hover:from-teal-500/20 transition-all duration-200 transform-gpu hover:-translate-y-0.5 hover:shadow-md hover:shadow-teal-500/10'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <div className='font-medium leading-tight flex items-center gap-2'>
                        {team.name}
                        {fit.score >= 70 && (
                          <span className='text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-500/30'>Recommended</span>
                        )}
                      </div>
                      <div className='text-xs text-white/70'>{team.focus}</div>
                    </div>
                    <span className='px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-white/80'>{team.tier}</span>
                  </div>
                  <div className='mt-2 text-[11px] text-white/60'>{team.requirement}</div>

                  {/* Fit bar */}
                  <div className='mt-2'>
                    <div className='w-full h-1 bg-white/10 rounded-full overflow-hidden'>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${fit.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className='h-full bg-gradient-to-r from-teal-400 to-emerald-400'
                      />
                    </div>
                    <div className='mt-1 flex items-center justify-between text-[11px] text-white/60'>
                      <span>Match: {fit.score}%</span>
                      <span>Spots left: {seedSpotsLeft(team.name)}</span>
                    </div>
                  </div>

                  {/* Perks */}
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {['Coaching','Private channel','Leaderboard boost'].map((perk) => (
                      <span key={perk} className='text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10'>
                        {perk}
                      </span>
                    ))}
                  </div>

                  <div className='mt-3 flex items-center justify-between'>
                    <Link
                      to='/leaderboards'
                      className='text-xs px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors'
                    >
                      Apply now
                    </Link>
                    <span className='text-[11px] text-white/50 group-hover:text-white/70 transition-colors'>
                      Learn more →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className='space-y-4'>
          <div className='rounded-xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm'>
            <div className='font-semibold mb-2'>Quick Journaling</div>
            <div className='text-white/60 text-sm mb-3'>Log a daily note or attach a standout trade.</div>
            <div className='flex gap-2'>
              <Link to='/journal' className='px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 transition text-sm'>Open Journal</Link>
              <Link to='/metrics' className='px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm'>View Metrics</Link>
            </div>
          </div>
          <div className='rounded-xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm'>
            <div className='font-semibold mb-2'>Public Card</div>
            <div className='h-32 rounded-lg bg-white/10 flex items-center justify-center text-white/40'>
              Preview (OG image)
            </div>
          </div>
          <div className='rounded-xl border border-white/10 p-4 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent backdrop-blur-sm'>
            <div className='font-semibold mb-1'>Team Perks</div>
            <ul className='text-white/70 text-sm list-disc list-inside space-y-1'>
              <li>Private coaching and weekly reviews</li>
              <li>Priority leaderboard features</li>
              <li>Access to elite trader channels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


