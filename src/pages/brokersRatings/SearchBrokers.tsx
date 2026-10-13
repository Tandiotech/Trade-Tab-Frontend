import { useEffect, useState, useMemo, memo, useRef } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/GlobalVars.ts';
import { http } from '../../utils/http_request';
import { Link } from 'react-router-dom';
import { useBrokerLogo } from '../../hook/useBrokerLogo';
import { parseOverallReview, getBrokerRegulators, brokerRegulatorMatches } from '@/utils/brokerRegulators';
import './brokers-directory.css';

// ─── Types ─────────────────────────────────────────────────────────────────

interface Broker {
  id?: string;
  _id?: string;
  slug: string;
  abbEn?: string;
  generalInformation: {
    brokerName: string;
    logo?: string;
    regulatedBy?: string[];
    website?: string;
    headquarters?: string;
    yearFounded?: number | string;
  };
  scoreboard: {
    overallReview?: number | string;
    stars: number;
  };
  tradingDetails?: {
    minimumDeposit?: number | string;
    maxLeverage?: number | string;
    averageSpread?: number | string;
    tradingPlatforms?: string[];
    instruments?: number | string;
  };
  accountDetails?: {
    minimumDeposit?: number | string;
  };
  regulations?: { regulations?: string };
  regulation?: { listOfRegulatoryAuthorities?: string };
}

type SortOption = 'score-desc' | 'score-asc' | 'name-asc';
type ViewMode = 'table' | 'grid';

// ─── Helpers ────────────────────────────────────────────────────────────────

const TIER1_REGS = ['FCA', 'ASIC', 'SEC', 'BaFin', 'FINMA', 'MAS', 'NFA', 'IIROC'];

function fmtUsd(n: number | string | null | undefined) {
  if (n == null || n === '' || n === 0) return '—';
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num) || num === 0) return '—';
  return '$' + new Intl.NumberFormat('en-US').format(num);
}

function fmtLeverage(n: number | string | null | undefined) {
  if (n == null || n === '') return '—';
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num) || num === 0) return '—';
  return `1:${num}`;
}

function getScoreColor(score: number) {
  if (score >= 70) return 'oklch(0.82 0.18 145)';  // green
  if (score >= 50) return 'oklch(0.82 0.17 75)';   // amber
  if (score >= 30) return 'oklch(0.72 0.18 40)';   // orange
  return 'oklch(0.65 0.2 25)';                      // red
}

function brokerInitials(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase() || name.slice(0, 2).toUpperCase();
}

function generateSparkline(name: string, baseVal: number): number[] {
  const seed = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const pts: number[] = [];
  let v = baseVal > 0 ? baseVal : 0.5;
  for (let k = 0; k < 30; k++) {
    const noise = (Math.sin(seed + k * 1.3) + Math.cos(seed * 0.7 + k)) * 0.15;
    v = Math.max(0.05, v + noise * 0.12);
    pts.push(+v.toFixed(2));
  }
  return pts;
}

function getMinDep(b: Broker): number | null {
  const raw =
    b.tradingDetails?.minimumDeposit ??
    b.accountDetails?.minimumDeposit ??
    null;
  if (raw == null) return null;
  const n = typeof raw === 'string' ? parseFloat(raw) : raw;
  return isNaN(n) ? null : n;
}

function getSpread(b: Broker): number | null {
  const raw = b.tradingDetails?.averageSpread ?? null;
  if (raw == null) return null;
  const n = typeof raw === 'string' ? parseFloat(raw) : raw;
  return isNaN(n) ? null : n;
}

function getPlatforms(b: Broker): string[] {
  return b.tradingDetails?.tradingPlatforms ?? [];
}

// ─── Atomic Components ──────────────────────────────────────────────────────

const Sparkline = memo(({ data, color = 'currentColor', w = 80, h = 20 }: {
  data: number[]; color?: string; w?: number; h?: number;
}) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * (h - 2) - 1).toFixed(1)}`)
    .join(' ');
  const last = data[data.length - 1];
  const lx = (data.length - 1) * step;
  const ly = h - ((last - min) / range) * (h - 2) - 1;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx={lx} cy={ly} r="1.6" fill={color} />
    </svg>
  );
});
Sparkline.displayName = 'Sparkline';

const ScoreBar = memo(({ score }: { score: number }) => {
  const pct = Math.max(0, Math.min(100, score));
  const color = getScoreColor(score);
  return (
    <div className="bd-scorebar">
      <span className="bd-scorebar-num" style={{ color }}>{score}</span>
      <span className="bd-scorebar-of">/100</span>
      <div className="bd-scorebar-track">
        <div className="bd-scorebar-fill" style={{ width: pct + '%', background: color }} />
      </div>
    </div>
  );
});
ScoreBar.displayName = 'ScoreBar';

const Stars = memo(({ value }: { value: number }) => (
  <div className="bd-stars" aria-label={`${value} of 5`}>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} className={`bd-star${i <= value ? ' bd-star--on' : ''}`}>★</span>
    ))}
  </div>
));
Stars.displayName = 'Stars';

const RegChips = memo(({ regs, max = 3 }: { regs?: string[]; max?: number }) => {
  const valid = regs?.filter(r => r && r !== '—') ?? [];
  if (valid.length === 0) return null;
  const show = valid.slice(0, max);
  const more = valid.length - show.length;
  return (
    <div className="bd-regs">
      {show.map(r => <span key={r} className="bd-reg-chip">{r}</span>)}
      {more > 0 && <span className="bd-reg-more">+{more}</span>}
    </div>
  );
});
RegChips.displayName = 'RegChips';

// Logo sub-component — needs hook so must be a real component
const BrokerLogo = memo(({ broker, size = 32 }: { broker: Broker; size?: number }) => {
  const { logoSrc, handleError } = useBrokerLogo({
    dbLogo: broker.generalInformation?.logo,
    website: broker.generalInformation?.website,
    partnerLookupStrings: [
      broker.generalInformation?.brokerName,
      broker.abbEn,
      broker.slug,
    ],
    fallback: '/logo.png',
  });
  /** Shown under image until decode; must NOT use display:none + lazy (browser may never load). */
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [logoSrc]);

  const hash = [...(broker.generalInformation.brokerName)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = (hash * 47) % 360;
  const bg = `oklch(0.22 0.02 ${hue})`;
  const fg = `oklch(0.78 0.07 ${hue})`;

  return (
    <div
      className="bd-logo"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.35 }}
    >
      {!loaded && (
        <span
          className="bd-logo-initials bd-logo-initials--overlay"
          aria-hidden
        >
          {brokerInitials(broker.generalInformation.brokerName)}
        </span>
      )}
      <img
        src={logoSrc}
        alt={broker.generalInformation.brokerName}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setLoaded(false);
          handleError(e);
        }}
        loading="eager"
        decoding="async"
        className="bd-logo-img-el"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          padding: size * 0.08,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.12s ease-out',
        }}
      />
    </div>
  );
});
BrokerLogo.displayName = 'BrokerLogo';

// ─── Filter + Sort config ────────────────────────────────────────────────────

interface FilterChip {
  id: string;
  label: string;
  test: (b: Broker) => boolean;
}

const FILTER_CHIPS: FilterChip[] = [
  { id: 'all',       label: 'All brokers',     test: () => true },
  {
    id: 'tier1',
    label: 'Tier-1 regulated',
    test: b =>
      getBrokerRegulators(b).some(t => {
        const up = t.toUpperCase();
        return TIER1_REGS.some(reg => up.includes(reg));
      }),
  },
  { id: 'fca',       label: 'FCA',             test: b => brokerRegulatorMatches(b, 'FCA') },
  { id: 'asic',      label: 'ASIC',            test: b => brokerRegulatorMatches(b, 'ASIC') },
  { id: 'cysec',     label: 'CySEC',           test: b => brokerRegulatorMatches(b, 'CYSEC') },
  { id: 'highscore', label: 'Score 70+',       test: b => (parseOverallReview(b) ?? 0) >= 70 },
];

const SORTS: { id: SortOption; label: string; cmp: (a: Broker, b: Broker) => number }[] = [
  { id: 'score-desc', label: 'Score · high to low',  cmp: (a, b) => (parseOverallReview(b) ?? -1) - (parseOverallReview(a) ?? -1) },
  { id: 'score-asc',  label: 'Score · low to high',  cmp: (a, b) => (parseOverallReview(a) ?? -1) - (parseOverallReview(b) ?? -1) },
  { id: 'name-asc',   label: 'Name · A → Z',         cmp: (a, b) => (a.generalInformation.brokerName).localeCompare(b.generalInformation.brokerName) },
];

// ─── Spotlight ───────────────────────────────────────────────────────────────

const SpotlightCard = memo(({ broker, rank }: { broker: Broker; rank: number }) => {
  const score = parseOverallReview(broker) ?? 0;
  const spark = useMemo(
    () => generateSparkline(broker.generalInformation.brokerName, score / 100),
    [broker.generalInformation.brokerName, score]
  );
  const minDep = getMinDep(broker);
  const leverage = broker.tradingDetails?.maxLeverage;

  return (
    <article className="bd-spot-card">
      <div className="bd-spot-rank">
        <span className="bd-rank-num">{String(rank).padStart(2, '0')}</span>
        <span className="bd-rank-label">Rank</span>
      </div>
      <div className="bd-spot-main">
        <div className="bd-spot-head">
          <BrokerLogo broker={broker} size={48} />
          <div>
            <h3 className="bd-spot-name">
              {broker.abbEn || broker.generalInformation.brokerName}
            </h3>
            <div className="bd-spot-meta">
              {broker.generalInformation.headquarters && (
                <span>{broker.generalInformation.headquarters}</span>
              )}
              {broker.generalInformation.yearFounded && (
                <>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>Est. {broker.generalInformation.yearFounded}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bd-spot-score">
          <span className="bd-spot-score-num">{score}</span>
          <span className="bd-spot-score-of">/100</span>
          <div style={{ marginLeft: 'auto' }}>
            <Sparkline data={spark} color="var(--tt-brand)" w={80} h={20} />
          </div>
        </div>

        <dl className="bd-spot-dl">
          <div>
            <dt>Min deposit</dt>
            <dd>{fmtUsd(minDep)}</dd>
          </div>
          <div>
            <dt>Leverage</dt>
            <dd>{fmtLeverage(leverage)}</dd>
          </div>
          <div>
            <dt>Score</dt>
            <dd>{score}/100</dd>
          </div>
          <div>
            <dt>Partnership</dt>
            <dd>{'★'.repeat(Math.round(broker.scoreboard?.stars ?? 0))}</dd>
          </div>
        </dl>

        <div className="bd-spot-foot">
          <RegChips regs={getBrokerRegulators(broker)} max={4} />
          <Link to={`/broker/${broker.slug}`} className="bd-cta">
            View profile <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
});
SpotlightCard.displayName = 'SpotlightCard';

// ─── Table Row ───────────────────────────────────────────────────────────────

const TableRow = memo(({ broker, rank, showSpark, showPlatforms }: {
  broker: Broker; rank: number; showSpark: boolean; showPlatforms: boolean;
}) => {
  const score = parseOverallReview(broker) ?? 0;
  const spark = useMemo(
    () => generateSparkline(broker.generalInformation.brokerName, score / 100),
    [broker.generalInformation.brokerName, score]
  );
  const minDep = getMinDep(broker);
  const leverage = broker.tradingDetails?.maxLeverage;
  const spread = getSpread(broker);
  const platforms = getPlatforms(broker);

  return (
    <tr>
      <td className="bd-td-rank">{String(rank).padStart(2, '0')}</td>
      <td>
        <div className="bd-broker-cell">
          <BrokerLogo broker={broker} size={28} />
          <div>
            <div className="bd-broker-name">
              {broker.abbEn || broker.generalInformation.brokerName}
            </div>
            {(broker.generalInformation.headquarters || broker.generalInformation.yearFounded) && (
              <div className="bd-broker-sub">
                {[broker.generalInformation.headquarters, broker.generalInformation.yearFounded ? `Est. ${broker.generalInformation.yearFounded}` : ''].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
        </div>
      </td>
      <td><ScoreBar score={score} /></td>
      <td><RegChips regs={getBrokerRegulators(broker)} max={3} /></td>
      <td className="bd-num">{fmtUsd(minDep)}</td>
      <td className="bd-num">{fmtLeverage(leverage)}</td>
      <td className="bd-num">{spread != null ? `${spread.toFixed(2)}p` : '—'}</td>
      {showSpark && (
        <td>
          <Sparkline data={spark} color="var(--tt-brand)" w={64} h={18} />
        </td>
      )}
      {showPlatforms && (
        <td>
          {platforms.length > 0 ? (
            <div className="bd-plats">
              {platforms.slice(0, 3).map(p => <span key={p} className="bd-plat">{p}</span>)}
            </div>
          ) : <span style={{ color: 'var(--tt-fg-3)' }}>—</span>}
        </td>
      )}
      <td><Stars value={Math.round(broker.scoreboard?.stars ?? 0)} /></td>
      <td>
        <Link to={`/broker/${broker.slug}`} className="bd-row-cta">
          View →
        </Link>
      </td>
    </tr>
  );
});
TableRow.displayName = 'TableRow';

// ─── Grid Card ───────────────────────────────────────────────────────────────

const GridCard = memo(({ broker, rank }: { broker: Broker; rank: number }) => {
  const score = parseOverallReview(broker) ?? 0;
  const spark = useMemo(
    () => generateSparkline(broker.generalInformation.brokerName, score / 100),
    [broker.generalInformation.brokerName, score]
  );
  const minDep = getMinDep(broker);
  const leverage = broker.tradingDetails?.maxLeverage;
  const spread = getSpread(broker);

  return (
    <article className="bd-card">
      <div className="bd-card-head">
        <BrokerLogo broker={broker} size={36} />
        <span className="bd-card-rank">{String(rank).padStart(2, '0')}</span>
      </div>
      <h3 className="bd-card-name">
        {broker.abbEn || broker.generalInformation.brokerName}
      </h3>
      {(broker.generalInformation.headquarters || broker.generalInformation.yearFounded) && (
        <div className="bd-card-meta">
          {[broker.generalInformation.headquarters, broker.generalInformation.yearFounded ? `Est. ${broker.generalInformation.yearFounded}` : ''].filter(Boolean).join(' · ')}
        </div>
      )}
      <ScoreBar score={score} />
      <dl className="bd-card-dl">
        <div><dt>Min dep</dt><dd>{fmtUsd(minDep)}</dd></div>
        <div><dt>Leverage</dt><dd>{fmtLeverage(leverage)}</dd></div>
        <div><dt>Spread</dt><dd>{spread != null ? `${spread.toFixed(2)}p` : '—'}</dd></div>
        <div><dt>Score</dt><dd>{score}/100</dd></div>
      </dl>
      <RegChips regs={getBrokerRegulators(broker)} max={3} />
      <div className="bd-card-spark">
        <span>Spread trend, 30d</span>
        <Sparkline data={spark} color="var(--tt-brand)" w={100} h={20} />
      </div>
      <div className="bd-card-foot">
        <Stars value={Math.round(broker.scoreboard?.stars ?? 0)} />
        <Link to={`/broker/${broker.slug}`} className="bd-card-cta">View →</Link>
      </div>
    </article>
  );
});
GridCard.displayName = 'GridCard';

// ─── Main ────────────────────────────────────────────────────────────────────

const SearchBrokers = () => {
  const [allBrokers, setAllBrokers] = useState<Broker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState<SortOption>('score-desc');
  const [view, setView] = useState<ViewMode>('table');
  const [searchResults, setSearchResults] = useState<Broker[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Fetch all brokers
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const { data } = await http.get('brokers/getBrokersCatalog');
        const list = Array.isArray(data) ? data : data.brokers ?? [];
        setAllBrokers(list);
      } catch (e) {
        console.error('Error fetching brokers:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Cmd-K / Ctrl-K focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Live search via API
  useEffect(() => {
    const term = search.trim().toLowerCase().replace(/\s+/g, '-');
    if (!term) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}brokers/search?name=${encodeURIComponent(term)}`);
        setSearchResults(res.data.brokers ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Filtered + sorted catalog
  const displayed = useMemo(() => {
    if (search.trim()) return searchResults;
    const chip = FILTER_CHIPS.find(c => c.id === filter) ?? FILTER_CHIPS[0];
    const sortDef = SORTS.find(s => s.id === sort) ?? SORTS[0];
    return [...allBrokers].filter(chip.test).sort(sortDef.cmp);
  }, [allBrokers, search, searchResults, filter, sort]);

  // Top 3 for spotlight (by score)
  const spotlight = useMemo(
    () =>
      [...allBrokers]
        .sort((a, b) => (parseOverallReview(b) ?? -1) - (parseOverallReview(a) ?? -1))
        .slice(0, 3),
    [allBrokers]
  );

  // Stats
  const regulatorSet = useMemo(() => {
    const s = new Set<string>();
    allBrokers.forEach(b => {
      for (const r of getBrokerRegulators(b)) {
        if (r && r !== '—') s.add(r);
      }
    });
    return s;
  }, [allBrokers]);

  const avgScore = useMemo(() => {
    if (!allBrokers.length) return 0;
    let sum = 0;
    let n = 0;
    for (const b of allBrokers) {
      const v = parseOverallReview(b);
      if (v != null) {
        sum += v;
        n++;
      }
    }
    if (!n) return 0;
    return Math.round(sum / n);
  }, [allBrokers]);

  // Check if any broker has trading detail data (to decide table columns)
  const hasPlatformData = useMemo(
    () => allBrokers.some(b => (b.tradingDetails?.tradingPlatforms?.length ?? 0) > 0),
    [allBrokers]
  );

  const isSearchMode = search.trim() !== '';

  return (
    <div className="bd-page">
      <div className="bd-inner">

        {/* ── Page Header ── */}
        <header className="bd-header">
          <div>
            <div className="bd-eyebrow">Directory · Updated daily</div>
            <h1 className="bd-h1">Brokers</h1>
            <p className="bd-h1-sub">
              Every broker we cover, scored on partnership terms, regulation, costs and execution quality.
            </p>
          </div>
          {!isLoading && allBrokers.length > 0 && (
            <dl className="bd-stats">
              <div>
                <dt>Brokers</dt>
                <dd>{allBrokers.length}</dd>
              </div>
              <div>
                <dt>Regulators</dt>
                <dd>{regulatorSet.size}</dd>
              </div>
              <div>
                <dt>Avg score</dt>
                <dd>{avgScore}</dd>
              </div>
              <div>
                <dt>Last review</dt>
                <dd>Today</dd>
              </div>
            </dl>
          )}
        </header>

        {/* ── Editor's Spotlight ── */}
        {!isLoading && spotlight.length > 0 && !isSearchMode && (
          <section className="bd-spotlight">
            <div className="bd-section-head">
              <h2>Editor's spotlight</h2>
              <span className="bd-section-sub">Top three by overall score, this quarter</span>
            </div>
            <div className="bd-spotlight-grid">
              {spotlight.map((b, i) => (
                <SpotlightCard key={b.slug} broker={b} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* ── Directory Section ── */}
        <section>
          <div className="bd-section-head">
            <h2>Full directory</h2>
            <span className="bd-section-sub">
              {isSearchMode
                ? `Search results for "${search.trim()}"`
                : `All ${allBrokers.length} brokers — filter, sort, drill in`}
            </span>
          </div>

          {/* Toolbar */}
          <div className="bd-toolbar">
            <div className="bd-toolbar-row">
              {/* Search */}
              <div className="bd-search">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <input
                  ref={searchRef}
                  placeholder={`Search ${allBrokers.length} brokers by name, regulator…`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tt-fg-3)', padding: 0, lineHeight: 1 }}
                    aria-label="Clear"
                  >
                    ✕
                  </button>
                )}
                <kbd>⌘K</kbd>
              </div>

              {/* Sort */}
              <label className="bd-sortwrap">
                <span>Sort</span>
                <select value={sort} onChange={e => setSort(e.target.value as SortOption)} disabled={isSearchMode}>
                  {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <svg className="bd-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </label>

              {/* View toggle */}
              <div className="bd-viewtoggle">
                <button
                  className={view === 'table' ? 'on' : ''}
                  onClick={() => setView('table')}
                  title="Table view"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M1 4h12M1 7h12M1 10h12" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  Table
                </button>
                <button
                  className={view === 'grid' ? 'on' : ''}
                  onClick={() => setView('grid')}
                  title="Grid view"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="8" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="1" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="8" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  Grid
                </button>
              </div>
            </div>

            {/* Filter chips + count */}
            {!isSearchMode && (
              <div className="bd-toolbar-row bd-toolbar-row--chips">
                <div className="bd-chips">
                  {FILTER_CHIPS.map(c => (
                    <button
                      key={c.id}
                      className={`bd-chip${filter === c.id ? ' bd-chip--on' : ''}`}
                      onClick={() => setFilter(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="bd-result-count">
                  <span className="bd-result-num">{displayed.length}</span>
                  <span>results</span>
                </div>
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--tt-fg-3)' }}>
              <div
                style={{
                  width: 40, height: 40, border: '3px solid var(--tt-line-1)',
                  borderTopColor: 'var(--tt-brand)', borderRadius: '50%',
                  margin: '0 auto 16px', animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ fontSize: 13 }}>Loading brokers…</p>
            </div>
          )}

          {/* Searching indicator */}
          {isSearching && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--tt-fg-3)', fontSize: 13 }}>
              Searching…
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isSearching && displayed.length === 0 && (
            <div className="bd-empty">
              <p style={{ fontSize: 14, color: 'var(--tt-fg-2)' }}>
                {isSearchMode ? `No brokers found for "${search.trim()}"` : 'No brokers match that combination.'}
              </p>
              <button onClick={() => { setSearch(''); setFilter('all'); }}>
                Clear filters
              </button>
            </div>
          )}

          {/* Table view */}
          {!isLoading && !isSearching && displayed.length > 0 && view === 'table' && (
            <div className="bd-table-wrap">
              <table className="bd-table">
                <thead>
                  <tr>
                    <th className="bd-th-rank">#</th>
                    <th>Broker</th>
                    <th>Score</th>
                    <th>Regulators</th>
                    <th className="bd-num">Min deposit</th>
                    <th className="bd-num">Leverage</th>
                    <th className="bd-num">Spread</th>
                    <th>30-day</th>
                    {hasPlatformData && <th>Platforms</th>}
                    <th>Partnership</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((b, i) => (
                    <TableRow
                      key={b.id || b._id || b.slug}
                      broker={b}
                      rank={i + 1}
                      showSpark={true}
                      showPlatforms={hasPlatformData}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid view */}
          {!isLoading && !isSearching && displayed.length > 0 && view === 'grid' && (
            <div className="bd-grid">
              {displayed.map((b, i) => (
                <GridCard key={b.id || b._id || b.slug} broker={b} rank={i + 1} />
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SearchBrokers;
