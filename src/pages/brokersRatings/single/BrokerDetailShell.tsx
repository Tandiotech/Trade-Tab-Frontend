import { Link } from 'react-router-dom';
import { memo } from 'react';
import { useBrokerLogo } from '../../../hook/useBrokerLogo';
import { getBrokerRegulators, parseOverallReview } from '../../../utils/brokerRegulators';

export function scoreColor(score: number): string {
  if (score >= 70) return 'oklch(0.82 0.18 145)';
  if (score >= 50) return 'oklch(0.82 0.17 75)';
  if (score >= 30) return 'oklch(0.72 0.18 40)';
  return 'oklch(0.65 0.2 25)';
}

function scoreLabel(score: number): string {
  if (score >= 75) return 'Strong';
  if (score >= 55) return 'Solid';
  if (score >= 40) return 'Mixed';
  return 'Weak';
}

function fmtUsdShort(n: unknown): string {
  if (n == null || n === '') return '—';
  const num = typeof n === 'number' ? n : parseFloat(String(n).replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(num) || num <= 0) return '—';
  return '$' + new Intl.NumberFormat('en-US').format(num);
}

function ensureAbsoluteUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

function subMetric(scoreboard: Record<string, unknown> | undefined, key: string): number {
  const v = parseFloat(String(scoreboard?.[key] ?? ''));
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

const ScoreRing = memo(({ score, size = 200, stroke = 12 }: { score: number; size?: number; stroke?: number }) => {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = C * pct;
  const color = scoreColor(score);
  return (
    <div className="bd-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="bd-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.35" />
            <stop offset="1" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#bd-ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="bd-ring-center">
        <span className="bd-ring-num" style={{ color }}>
          {score}
        </span>
        <span className="bd-ring-of">/100</span>
        <span className="bd-ring-label" style={{ color }}>
          {scoreLabel(score)}
        </span>
      </div>
    </div>
  );
});
ScoreRing.displayName = 'ScoreRing';

function ScoreRow({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div className="bd-scorerow">
      <span className="bd-scorerow-label">{label}</span>
      <div className="bd-scorerow-track">
        <div className="bd-scorerow-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="bd-scorerow-val" style={{ color }}>
        {Math.round(value)}
      </span>
    </div>
  );
}

function StarsLite({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="bd-stars-inline" aria-label={`${v} of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{
            color: i <= v ? 'var(--accent)' : 'var(--text-faint)',
            fontSize: 11,
            marginRight: 1,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export function BrokerDetailBreadcrumb({ brokerName }: { brokerName?: string }) {
  return (
    <nav className="bd-crumb">
      <Link to="/brokers">Brokers</Link>
      <span className="bd-crumb-sep">/</span>
      <span>{brokerName ?? '…'}</span>
    </nav>
  );
}

/** No “unregulated” wording — neutral copy only. */
export function BrokerDetailTrustBanner({ broker }: { broker: Record<string, unknown> }) {
  const regs = getBrokerRegulators(broker);
  const overall = parseOverallReview(broker) ?? 0;
  const thinRegs = regs.length === 0;
  const lowScore = overall < 50;
  if (!thinRegs && !lowScore) return null;
  return (
    <div className="bd-warn" role="status">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <path
          d="M9 2L1 16h16L9 2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M9 7v4M9 13.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <div>
        <strong>
          {thinRegs && lowScore
            ? 'Due diligence recommended.'
            : thinRegs
              ? 'Limited regulatory disclosure on file.'
              : 'Below-average trust score.'}
        </strong>
        <span>
          {' '}
          {thinRegs
            ? 'Verify protection schemes and entity registration before funding an account.'
            : 'Reviewers have flagged concerns with spreads, withdrawals, or support — proceed with caution.'}
        </span>
      </div>
      <a href="#methodology" className="bd-warn-link">
        How we score →
      </a>
    </div>
  );
}

export function BrokerDetailHero({ broker }: { broker: any }) {
  const { logoSrc, handleError } = useBrokerLogo({
    dbLogo: broker?.generalInformation?.logo || broker?.logo,
    website: broker?.generalInformation?.website,
    partnerLookupStrings: [
      broker?.generalInformation?.brokerName,
      broker?.abbEn,
      broker?.slug,
    ],
    fallback: '/assets/logo_1.png',
  });

  const regs = getBrokerRegulators(broker);
  const overall = parseOverallReview(broker) ?? 0;
  const verified = overall >= 50;
  const name = broker?.generalInformation?.brokerName ?? 'Broker';
  const founded = broker?.generalInformation?.founded ?? broker?.generalInformation?.yearFounded;
  const hq = broker?.generalInformation?.officeHq ?? broker?.generalInformation?.headquarters ?? '—';
  const platformsRaw = broker?.platforms?.platforms ?? broker?.tradingDetails?.tradingPlatforms;
  const platformStr =
    typeof platformsRaw === 'string'
      ? platformsRaw.split(/,|::/).slice(0, 4).join(' · ')
      : Array.isArray(platformsRaw)
        ? platformsRaw.slice(0, 4).join(' · ')
        : '—';

  return (
    <section className="bd-hero">
      <div className="bd-hero-left">
        <div className="bd-hero-logo-wrap">
          <img
            src={logoSrc}
            alt=""
            loading="eager"
            decoding="async"
            onError={handleError}
          />
        </div>
        <div className="bd-hero-info">
          <div className="bd-hero-tags">
            {verified ? (
              <span className="bd-tag bd-tag--ok">
                <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
                  <path
                    d="M2 6l2 2 5-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                TradeTab verified
              </span>
            ) : (
              <span className="bd-tag bd-tag--risk">
                <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
                  <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  <path d="M5.5 3v3M5.5 7.6v.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Review pending
              </span>
            )}
            {regs.length > 0 ? (
              <span className="bd-tag bd-tag--neutral">
                {regs.length} regulator{regs.length > 1 ? 's' : ''} on file
              </span>
            ) : (
              <span className="bd-tag bd-tag--neutral">Regulation · verify</span>
            )}
            {founded != null && founded !== '' && (
              <span className="bd-tag bd-tag--neutral">Est. {String(founded)}</span>
            )}
          </div>
          <h1 className="bd-h1">{name}</h1>
          <p className="bd-hero-meta">
            <span>{hq}</span>
            <span className="bd-dot">·</span>
            <span>{platformStr}</span>
          </p>
        </div>
      </div>
      <div className="bd-hero-actions">
        {broker?.generalInformation?.website && (
          <a
            className="bd-btn bd-btn--primary"
            href={ensureAbsoluteUrl(broker.generalInformation.website)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit website
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M4 10L10 4M6 4h4v4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
        <Link to="/brokers" className="bd-btn bd-btn--ghost">
          Back to directory
        </Link>
      </div>
    </section>
  );
}

export function BrokerDetailStatsStrip({ broker }: { broker: any }) {
  const overall = parseOverallReview(broker) ?? 0;
  const minRaw =
    broker?.tradingDetails?.minimumDepositRequirementsForEachAccountType ??
    broker?.tradingDetails?.minimumDeposit;
  const lev = broker?.generalInformation?.leverage ?? broker?.tradingDetails?.maxLeverage;
  const spread = broker?.tradingDetails?.averageSpreadValuesForMajorPairs ?? broker?.tradingDetails?.averageSpread;
  const instr = broker?.instruments?.instruments;
  const stars = Number(broker?.scoreboard?.stars) || 0;

  return (
    <div className="bd-stats">
      <div className="bd-stat">
        <div className="bd-stat-label">Overall score</div>
        <div className="bd-stat-value" style={{ color: scoreColor(overall) }}>
          {overall}
          <small>/100</small>
        </div>
      </div>
      <div className="bd-stat">
        <div className="bd-stat-label">Min deposit</div>
        <div className="bd-stat-value">{fmtUsdShort(minRaw)}</div>
      </div>
      <div className="bd-stat">
        <div className="bd-stat-label">Leverage</div>
        <div className="bd-stat-value">{lev ? String(lev).slice(0, 18) : '—'}</div>
      </div>
      <div className="bd-stat">
        <div className="bd-stat-label">Avg spread</div>
        <div className="bd-stat-value">{spread ? String(spread).slice(0, 14) : '—'}</div>
      </div>
      <div className="bd-stat">
        <div className="bd-stat-label">Instruments</div>
        <div className="bd-stat-value">{instr ? String(instr).slice(0, 12) : '—'}</div>
      </div>
      <div className="bd-stat">
        <div className="bd-stat-label">Partnership</div>
        <div className="bd-stat-value">
          <StarsLite value={stars} />
        </div>
      </div>
    </div>
  );
}

export function BrokerDetailScorePanel({ broker }: { broker: any }) {
  const sb = broker?.scoreboard ?? {};
  const overall = parseOverallReview(broker) ?? 0;

  const rows = [
    { label: 'Reputation', value: subMetric(sb, 'reputation') },
    { label: 'Spread quality', value: subMetric(sb, 'spread') },
    { label: 'Withdrawal process', value: subMetric(sb, 'withdrawalProcess') },
    { label: 'Customer service', value: subMetric(sb, 'customerService') },
  ];

  return (
    <section id="methodology" className="bd-panel bd-scorepanel mt-4">
      <header className="bd-panel-head">
        <div>
          <h2 className="bd-panel-title">Broker performance</h2>
          <p className="bd-panel-sub">
            Independent score across four dimensions — from connected accounts and desk research.
          </p>
        </div>
        <span className="bd-panel-meta">Score methodology</span>
      </header>
      <div className="bd-scorepanel-body">
        <div className="bd-scorepanel-ring">
          <ScoreRing score={overall} size={200} stroke={12} />
        </div>
        <div className="bd-scorepanel-bars">
          {rows.map(r => (
            <ScoreRow key={r.label} label={r.label} value={r.value} />
          ))}
        </div>
        <div className="bd-scorepanel-note">
          <h4>Methodology</h4>
          <p>
            We combine regulation, client reviews, execution data from linked accounts, and partnership terms.{' '}
            <Link to="/brokers" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Browse more brokers →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function BrokerDetailSideColumn({ broker }: { broker: any }) {
  const overall = parseOverallReview(broker) ?? 0;
  const cautious = overall < 50;
  const hq = broker?.generalInformation?.officeHq ?? '—';
  const ib = broker?.generalInformation?.IBLink;
  const web = broker?.generalInformation?.website;

  return (
    <>
      <aside className="bd-side-card bd-side-cta">
        {cautious && (
          <div className="bd-side-warn">
            <span aria-hidden>⚠</span> Elevated risk — verify terms before funding.
          </div>
        )}
        {ib && (
          <a
            className={`bd-btn bd-btn--primary bd-btn--lg${cautious ? ' bd-btn--muted' : ''}`}
            href={ib}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open account
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M4 10L10 4M6 4h4v4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
        {web && (
          <a
            className="bd-btn bd-btn--ghost bd-btn--lg"
            href={ensureAbsoluteUrl(web)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit website
          </a>
        )}
        <p className="bd-side-disclaimer">
          TradeTab may receive a referral fee. This does not affect our independent scoring.
        </p>
      </aside>

      <aside className="bd-side-card">
        <h3 className="bd-side-title">Headquarters</h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-mute)', lineHeight: 1.5 }}>{hq}</p>
      </aside>
    </>
  );
}
