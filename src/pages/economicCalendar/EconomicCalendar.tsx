import React, { useState, useEffect, useCallback, useMemo } from 'react';
import EconomicTable from './EconomicTable';
import NewsSidebar from './NewsSidebar';
import TraditionalClock from './components/TraditionalClock';
import TradingSessionIndicator from './components/TradingSessionIndicator';
import MarketInsights from './components/MarketInsights';
import {
  IoCalendarOutline,
  IoStatsChart,
  IoTrendingUp,
  IoTime,
  IoGlobe,
  IoRefresh,
  IoAlertCircle,
  IoNotificationsOutline,
} from 'react-icons/io5';
import MarketOpenAlarmWidget from '@/component/MarketOpenAlarmWidget';
import { http } from '@/utils/http_request';
import '@/pages/shared/TradeTabDesign.css';

export interface EconomicCalendarRow {
  impact?: string;
  follow?: boolean;
  actual?: number;
  prevision?: number;
  [key: string]: unknown;
}

export interface EconomicNewsItem {
  overall_sentiment_label?: string | null;
  overall_sentiment_score?: number | null;
  [key: string]: unknown;
}

interface EconomicDashboardPayload {
  economicCalendar?: EconomicCalendarRow[];
  news?: EconomicNewsItem[];
}

interface NewsStats {
  totalNews: number;
  bullish: number;
  bearish: number;
  neutral: number;
  avgSentiment: number;
}

interface DashboardStats {
  totalEvents: number;
  highImpact: number;
  mediumImpact: number;
  lowImpact: number;
  followedEvents: number;
  avgDeviation: number;
  newsStats: NewsStats;
}

function sentimentLabel(item: EconomicNewsItem): string {
  return String(item?.overall_sentiment_label ?? '');
}

function safeDeviationPercent(item: EconomicCalendarRow): number {
  const prev = Number(item.prevision);
  const act = Number(item.actual);
  if (!Number.isFinite(prev) || prev === 0 || !Number.isFinite(act)) return 0;
  return Math.abs(((act - prev) / prev) * 100);
}

const EconomicCalendar: React.FC = () => {
  const [economicData, setEconomicData] = useState<EconomicDashboardPayload>({
    economicCalendar: [],
    news: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('today');
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    highImpact: 0,
    mediumImpact: 0,
    lowImpact: 0,
    followedEvents: 0,
    avgDeviation: 0,
    newsStats: {
      totalNews: 0,
      bullish: 0,
      bearish: 0,
      neutral: 0,
      avgSentiment: 0,
    },
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showMarketAlerts, setShowMarketAlerts] = useState(false);

  const fetchEconomicData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await http.get<EconomicDashboardPayload>('economic/dashboard-data');

      setEconomicData(data);
      setLastUpdated(new Date());

      const calendar = data.economicCalendar ?? [];
      const news = data.news ?? [];

      const economicStats = {
        totalEvents: calendar.length,
        highImpact: calendar.filter(item => item.impact === 'red').length,
        mediumImpact: calendar.filter(item => item.impact === 'yellow').length,
        lowImpact: calendar.filter(item => item.impact === 'green').length,
        followedEvents: calendar.filter(item => item.follow === true).length,
        avgDeviation:
          calendar.length > 0
            ? calendar.reduce((sum, item) => sum + safeDeviationPercent(item), 0) / calendar.length
            : 0,
      };

      const newsStats: NewsStats = {
        totalNews: news.length,
        bullish: news.filter(item => sentimentLabel(item).includes('Bullish')).length,
        bearish: news.filter(item => sentimentLabel(item).includes('Bearish')).length,
        neutral: news.filter(
          item =>
            !sentimentLabel(item).includes('Bullish') && !sentimentLabel(item).includes('Bearish')
        ).length,
        avgSentiment:
          news.length > 0
            ? news.reduce(
                (sum, item) => sum + Math.abs(Number(item?.overall_sentiment_score) || 0),
                0
              ) / news.length
            : 0,
      };

      setStats({
        ...economicStats,
        newsStats,
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching economic data:', err);
      setError('Failed to fetch economic data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEconomicData();
  }, [fetchEconomicData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      void fetchEconomicData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchEconomicData]);

  const sentimentIconClass = useMemo(() => {
    const b = stats.newsStats?.bullish ?? 0;
    const be = stats.newsStats?.bearish ?? 0;
    return b > be ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]';
  }, [stats.newsStats?.bearish, stats.newsStats?.bullish]);

  const sentimentHeadline =
    (stats.newsStats?.bullish ?? 0) > (stats.newsStats?.bearish ?? 0) ? 'Bullish' : 'Bearish';

  const barFillClass =
    (stats.newsStats?.avgSentiment || 0) > 0.2
      ? 'bg-[var(--tt-profit)]'
      : (stats.newsStats?.avgSentiment || 0) < -0.2
        ? 'bg-[var(--tt-loss)]'
        : 'bg-[var(--tt-brand)]';

  return (
    <div className='tt-theme min-h-screen'>
      <div className='tt-shell py-4 sm:py-8'>
        {/* Header */}
        <div className='mb-6 sm:mb-8'>
          <div className='mb-6 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='rounded-xl bg-[var(--tt-brand-dim)] p-2 text-[var(--tt-brand)] shadow-sm sm:p-3'>
                <IoStatsChart className='text-xl sm:text-2xl' />
              </div>
              <div>
                <p className='tt-kicker mb-1'>Markets</p>
                <h1 className='tt-title text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                  Economic calendar
                </h1>
                <p className='tt-subtitle mt-1 text-sm sm:text-base'>
                  Track market-moving events and stay ahead of the curve
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2 sm:gap-3'>
              <button
                type='button'
                onClick={() => setShowMarketAlerts(!showMarketAlerts)}
                className={`relative rounded-xl border p-3 transition-all duration-300 ${
                  showMarketAlerts
                    ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
                    : 'border-[var(--tt-line-2)] bg-[var(--tt-bg-2)] text-[var(--tt-fg-1)] hover:border-[var(--tt-line-1)]'
                }`}
                title='Market open alerts'
              >
                <IoNotificationsOutline
                  className={`text-xl sm:text-2xl transition-transform duration-300 ${
                    showMarketAlerts ? 'animate-bell-ring' : ''
                  }`}
                />
                {showMarketAlerts && (
                  <div className='absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-[var(--tt-profit)]' />
                )}
              </button>

              <div className='flex items-center gap-2 overflow-x-auto pb-2 sm:gap-4 lg:pb-0'>
                <TraditionalClock city='New York' timezone='America/New_York' flag='🇺🇸' />
                <TraditionalClock city='London' timezone='Europe/London' flag='🇬🇧' />
                <TraditionalClock city='Tokyo' timezone='Asia/Tokyo' flag='🇯🇵' />
                <TraditionalClock city='Sydney' timezone='Australia/Sydney' flag='🇦🇺' />
                <TraditionalClock city='Frankfurt' timezone='Europe/Berlin' flag='🇩🇪' />
                <TraditionalClock city='Hong Kong' timezone='Asia/Hong_Kong' flag='🇭🇰' />
              </div>
            </div>
          </div>

          {showMarketAlerts && (
            <div className='animate-fade-in-down mb-6'>
              <MarketOpenAlarmWidget
                soundUrl='/assets/data/bell-sound.mp3'
                defaultEnabled={['newyork', 'london', 'tokyo']}
              />
            </div>
          )}

          <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
            {lastUpdated && (
              <div className='flex items-center gap-2 text-xs text-[var(--tt-fg-3)]'>
                <IoTime className='text-sm' />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}

            <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
              <button
                type='button'
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`tt-btn tt-btn-sm inline-flex items-center gap-2 ${
                  autoRefresh ? 'tt-btn-primary' : 'tt-btn-ghost'
                }`}
              >
                <IoRefresh className={`text-sm ${autoRefresh ? 'animate-spin' : ''}`} />
                <span className='hidden sm:inline'>Auto-refresh</span>
              </button>
              <button type='button' onClick={() => void fetchEconomicData()} className='tt-btn tt-btn-sm tt-btn-ghost'>
                Refresh now
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className='mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6'>
            <div className='tt-card border border-[var(--tt-line-1)] p-3 sm:p-4'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <IoGlobe className='text-lg text-[var(--tt-brand)] sm:text-xl' />
                <div>
                  <p className='text-xs font-medium text-[var(--tt-fg-3)] sm:text-sm'>Total events</p>
                  <p className='text-xl font-bold text-[var(--tt-fg-0)] sm:text-2xl'>{stats.totalEvents}</p>
                </div>
              </div>
            </div>

            <div className='tt-card border border-[var(--tt-line-1)] p-3 sm:p-4'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <IoTrendingUp className='text-lg text-[var(--tt-loss)] sm:text-xl' />
                <div>
                  <p className='text-xs font-medium text-[var(--tt-fg-3)] sm:text-sm'>High impact</p>
                  <p className='text-xl font-bold text-[var(--tt-fg-0)] sm:text-2xl'>{stats.highImpact}</p>
                </div>
              </div>
            </div>

            <div className='tt-card border border-[var(--tt-line-1)] p-3 sm:p-4'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <IoCalendarOutline className='text-lg text-[var(--tt-profit)] sm:text-xl' />
                <div>
                  <p className='text-xs font-medium text-[var(--tt-fg-3)] sm:text-sm'>Low impact</p>
                  <p className='text-xl font-bold text-[var(--tt-fg-0)] sm:text-2xl'>{stats.lowImpact}</p>
                </div>
              </div>
            </div>

            <div className='tt-card border border-[var(--tt-line-1)] p-3 sm:p-4'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <IoStatsChart className={`text-lg sm:text-xl ${sentimentIconClass}`} />
                <div>
                  <p className='text-xs font-medium text-[var(--tt-fg-3)] sm:text-sm'>News sentiment</p>
                  <p className='text-xl font-bold text-[var(--tt-fg-0)] sm:text-2xl'>{sentimentHeadline}</p>
                </div>
              </div>
            </div>

            <div className='tt-card border border-[var(--tt-line-1)] p-3 sm:p-4'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <IoAlertCircle className='text-lg text-amber-400 sm:text-xl' />
                <div>
                  <p className='text-xs font-medium text-[var(--tt-fg-3)] sm:text-sm'>Avg deviation</p>
                  <p className='text-xl font-bold text-[var(--tt-fg-0)] sm:text-2xl'>
                    {Number.isFinite(stats.avgDeviation) ? stats.avgDeviation.toFixed(1) : '0.0'}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className='mb-4 max-w-full rounded-xl border border-[var(--tt-loss)] bg-[oklch(0.22_0.12_25_/0.2)] p-3 text-[var(--tt-fg-0)] backdrop-blur-sm sm:mb-6 sm:p-4'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-[var(--tt-loss)]' />
                <span className='text-sm sm:text-base'>{error}</span>
              </div>
              <button type='button' onClick={() => void fetchEconomicData()} className='tt-btn tt-btn-sm tt-btn-primary'>
                Retry
              </button>
            </div>
          </div>
        )}

        <div className='mb-6 space-y-6'>
          <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2'>
            <div className='tt-card border border-[var(--tt-line-1)] p-3 shadow-xl sm:p-6'>
              <div className='mb-4 flex items-center justify-between sm:mb-6'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='rounded-lg bg-[var(--tt-brand-dim)] p-1.5 text-[var(--tt-brand)] sm:p-2'>
                    <IoCalendarOutline className='text-base sm:text-lg' />
                  </div>
                  <div>
                    <h2 className='tt-title text-lg font-bold sm:text-xl'>Market events</h2>
                    <p className='text-xs text-[var(--tt-fg-3)] sm:text-sm'>Real-time economic calendar</p>
                  </div>
                </div>

                <div className='flex items-center gap-1 text-[10px] sm:gap-2 sm:text-xs'>
                  <div className='flex items-center gap-1'>
                    <div className='h-2 w-2 rounded-full bg-red-500' />
                    <span className='text-[var(--tt-fg-3)]'>High</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='h-2 w-2 rounded-full bg-yellow-500' />
                    <span className='text-[var(--tt-fg-3)]'>Medium</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='h-2 w-2 rounded-full bg-green-500' />
                    <span className='text-[var(--tt-fg-3)]'>Low</span>
                  </div>
                </div>
              </div>

              <div className='custom-scrollbar max-h-[60vh] overflow-x-hidden overflow-y-auto rounded-xl'>
                <EconomicTable economicData={economicData.economicCalendar ?? []} loading={loading} />
              </div>
            </div>

            <div className='tt-card border border-[var(--tt-line-1)] p-4 shadow-xl sm:p-6'>
              <div className='mb-5 flex items-center gap-3 sm:mb-6'>
                <div className='rounded-lg bg-[var(--tt-brand-dim)] p-2 text-[var(--tt-brand)] shadow-sm sm:p-2.5'>
                  <IoStatsChart className='text-lg sm:text-xl' />
                </div>
                <div>
                  <h2 className='tt-title text-xl font-bold sm:text-2xl'>Market sentiment</h2>
                  <p className='tt-subtitle mt-0.5 text-sm sm:text-base'>AI-powered analysis</p>
                </div>
              </div>

              <div className='space-y-5'>
                <div className='grid grid-cols-3 gap-3 sm:gap-4'>
                  <div className='rounded-xl border border-[var(--tt-line-1)] bg-[oklch(0.22_0.08_145_/0.12)] p-4 text-center sm:p-5'>
                    <div className='mb-1 text-3xl font-bold text-[var(--tt-profit)] sm:text-4xl'>
                      {stats.newsStats?.bullish ?? 0}
                    </div>
                    <div className='text-sm font-semibold text-[var(--tt-profit)] sm:text-base'>Bullish</div>
                  </div>
                  <div className='rounded-xl border border-[var(--tt-line-1)] bg-[oklch(0.22_0.12_25_/0.12)] p-4 text-center sm:p-5'>
                    <div className='mb-1 text-3xl font-bold text-[var(--tt-loss)] sm:text-4xl'>
                      {stats.newsStats?.bearish ?? 0}
                    </div>
                    <div className='text-sm font-semibold text-[var(--tt-loss)] sm:text-base'>Bearish</div>
                  </div>
                  <div className='rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-4 text-center sm:p-5'>
                    <div className='mb-1 text-3xl font-bold text-[var(--tt-fg-2)] sm:text-4xl'>
                      {stats.newsStats?.neutral ?? 0}
                    </div>
                    <div className='text-sm font-semibold text-[var(--tt-fg-2)] sm:text-base'>Neutral</div>
                  </div>
                </div>

                <div className='rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-5 sm:p-6'>
                  <div className='mb-3 flex items-center justify-between'>
                    <span className='text-base font-semibold text-[var(--tt-fg-1)] sm:text-lg'>
                      Average sentiment score
                    </span>
                    <span className='text-xl font-bold text-[var(--tt-fg-0)] sm:text-2xl'>
                      {stats.newsStats?.avgSentiment?.toFixed(2) ?? '0.00'}
                    </span>
                  </div>
                  <div className='h-3 w-full rounded-full bg-[var(--tt-bg-3)] sm:h-3.5'>
                    <div
                      className={`h-3 rounded-full transition-all duration-500 sm:h-3.5 ${barFillClass}`}
                      style={{
                        width: `${Math.min(100, Math.abs(stats.newsStats?.avgSentiment || 0) * 200)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className='rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-5 sm:p-6'>
                  <h3 className='mb-4 text-base font-semibold text-[var(--tt-fg-1)] sm:text-lg'>Market insights</h3>
                  <div className='space-y-3 text-sm text-[var(--tt-fg-2)] sm:text-base'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>Total news analyzed:</span>
                      <span className='text-lg font-bold text-[var(--tt-fg-0)] sm:text-xl'>
                        {stats.newsStats?.totalNews ?? 0}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>Events being followed:</span>
                      <span className='text-lg font-bold text-[var(--tt-fg-0)] sm:text-xl'>
                        {stats.followedEvents ?? 0}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>Average market deviation:</span>
                      <span className='text-lg font-bold text-[var(--tt-fg-0)] sm:text-xl'>
                        {Number.isFinite(stats.avgDeviation) ? stats.avgDeviation.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full'>
            <NewsSidebar
              newsData={economicData.news ?? []}
              loading={loading}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
        </div>

        <div className='mb-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2'>
          <MarketInsights
            economicData={economicData.economicCalendar ?? []}
            stats={{
              totalEvents: stats.totalEvents,
              highImpact: stats.highImpact,
              mediumImpact: stats.mediumImpact,
              lowImpact: stats.lowImpact,
            }}
          />
          <TradingSessionIndicator />
        </div>
      </div>
    </div>
  );
};

export default EconomicCalendar;
