import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Link2,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { OFFICIAL_TELEGRAM } from '@/utils/GlobalVars';

const LESSONS = [
  ['01', 'What is a pip?', '6 min'],
  ['02', 'Reading a candlestick', '9 min'],
  ['03', 'Risk management', '12 min'],
  ['04', 'Trading psychology', '8 min'],
] as const;

const FLOW = [
  { icon: Link2, title: 'Connect Account', desc: 'Link your broker in read-only mode — MT4 or MT5, free.' },
  { icon: BookOpen, title: 'Learn', desc: 'Start from zero in the free University, at your own pace.' },
  { icon: FileText, title: 'Journal', desc: 'Every trade logged automatically with full analytics.' },
  { icon: TrendingUp, title: 'Improve', desc: "See what works, fix what doesn't, and grow with the data." },
] as const;

const JP_CAL: [number, number][][] = [
  [
    [1, 420],
    [2, -180],
    [3, 260],
    [6, 680],
    [7, 120],
  ],
  [
    [8, -340],
    [9, 540],
    [10, 540],
    [13, -260],
    [14, 380],
  ],
  [
    [15, 1240],
    [16, 90],
    [17, -120],
    [20, 280],
    [21, 320],
  ],
  [
    [22, -480],
    [23, 740],
    [24, 180],
    [29, 610],
    [30, 430],
  ],
];

function abbr(n: number) {
  const a = Math.abs(n);
  const s = a >= 1000 ? `${(a / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(a);
  return `${n < 0 ? '−' : '+'}${s}`;
}

function pnlClass(n: number) {
  const a = Math.abs(n);
  if (n >= 0) return a >= 700 ? 'p3' : a >= 250 ? 'p2' : 'p1';
  return a >= 300 ? 'l2' : 'l1';
}

function CoreFlow() {
  return (
    <section className='tt-flow'>
      <div className='tt-flow-card'>
        <div className='tt-flow-head'>
          <div className='tt-flow-eyebrow'>How TradeTab works</div>
          <h3 className='tt-flow-title'>
            One simple path, <span className='grad'>free from day one</span>
          </h3>
        </div>
        <div className='tt-flow-track'>
          {FLOW.map((step, i) => (
            <div className='tt-flow-step' key={step.title}>
              <div className='tt-flow-node'>
                <step.icon size={22} strokeWidth={2} />
                <span className='tt-flow-num'>{i + 1}</span>
              </div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearnCard() {
  return (
    <div className='tt-twin learn'>
      <div className='tt-twin-top'>
        <div className='tt-tile cyan' style={{ marginBottom: 0 }}>
          <BookOpen size={26} strokeWidth={2.1} />
        </div>
        <span className='tt-pill cyan'>FREE UNIVERSITY · ENGLISH</span>
      </div>
      <h3>Start learning from zero</h3>
      <p className='desc'>
        No experience needed. Friendly, bite-sized lessons take you from your first candlestick to a
        real strategy — completely free.
      </p>
      <div className='tt-learn-list'>
        {LESSONS.map(([n, nm, du]) => (
          <div className='tt-ll' key={n}>
            <span className='n'>{n}</span>
            <span className='nm'>{nm}</span>
            <span className='du'>{du}</span>
          </div>
        ))}
        <div className='tt-ll-more'>
          <span className='line' />
          + 56 more lessons
          <span className='line' />
        </div>
      </div>
      <div className='tt-learn-prog'>
        <div className='lbl'>
          <span>Module 01 · Foundations</span>
          <span className='c'>0% complete</span>
        </div>
        <div className='bar'>
          <i style={{ width: '4%' }} />
        </div>
      </div>
      <div className='tt-learn-meta'>
        <div className='m'>
          <div className='v'>
            <span className='g'>12</span>
          </div>
          <div className='k'>Modules</div>
        </div>
        <div className='m'>
          <div className='v'>
            <span className='g'>60+</span>
          </div>
          <div className='k'>Lessons</div>
        </div>
        <div className='m'>
          <div className='v'>2.5h</div>
          <div className='k'>To finish M1</div>
        </div>
      </div>
      <Link
        to='/university'
        className='tt-btn tt-btn-outline tt-card-cta'
        style={{
          background: 'linear-gradient(102deg, rgba(52,216,176,0.18), rgba(34,211,238,0.18))',
          borderColor: 'rgba(34,211,238,0.4)',
        }}
      >
        Start Learning Free <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function JournalPreview() {
  return (
    <Link to='/journal' className='tt-jp'>
      <div className='tt-jp-head'>
        <span className='t'>
          <span className='dot' />
          Trading Journal <small>· April 2026</small>
        </span>
        <span className='pnl'>+$5,570</span>
      </div>
      <div className='tt-jp-body'>
        <div className='tt-jp-dow'>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
        </div>
        <div className='tt-jp-grid'>
          {JP_CAL.flat().map(([d, v], i) => (
            <div className={`tt-jp-cell ${pnlClass(v)}`} key={i}>
              <span className='cd'>{d}</span>
              <span className='cv'>{abbr(v)}</span>
            </div>
          ))}
        </div>
        <div className='tt-jp-stats'>
          <div className='tt-jp-stat'>
            <div className='v g'>73%</div>
            <div className='k'>Win rate</div>
          </div>
          <div className='tt-jp-stat'>
            <div className='v'>2.41</div>
            <div className='k'>Profit factor</div>
          </div>
          <div className='tt-jp-stat'>
            <div className='v'>142</div>
            <div className='k'>Trades</div>
          </div>
        </div>
      </div>
      <div className='tt-jp-explore'>Explore the full journal →</div>
    </Link>
  );
}

function ConnectCard({ onConnect }: { onConnect: () => void }) {
  return (
    <div className='tt-twin connect'>
      <div className='tt-twin-top'>
        <div className='tt-tile green' style={{ marginBottom: 0 }}>
          <Link2 size={22} strokeWidth={2} />
        </div>
        <span className='tt-pill green'>CONNECT FREE · READ-ONLY</span>
      </div>
      <h3>Connect your account</h3>
      <p className='desc'>
        Already trading? Link your broker and get a free journal with real P&amp;L analytics — your
        trades tracked automatically.
      </p>
      <div className='tt-broker-row'>
        <span className='lbl'>Works with</span>
        <span className='tt-mt mt4'>
          <span className='glyph'>MT4</span>
          <span className='txt'>
            <span className='a'>MetaTrader 4</span>
            <span className='b'>Auto-sync</span>
          </span>
        </span>
        <span className='tt-mt mt5'>
          <span className='glyph'>MT5</span>
          <span className='txt'>
            <span className='a'>MetaTrader 5</span>
            <span className='b'>Auto-sync</span>
          </span>
        </span>
      </div>
      <JournalPreview />
      <button type='button' className='tt-btn tt-btn-green tt-card-cta' onClick={onConnect}>
        Connect My Account <ArrowRight size={16} />
      </button>
    </div>
  );
}

function LandingFooter() {
  return (
    <footer className='tt-foot'>
      <div className='tt-foot-inner'>
        <div className='tt-foot-l'>
          <p className='h'>Questions? Talk to a real person.</p>
          <p className='p'>
            Not sure where to start, or how connecting works? Send us a note and the TradeTab team
            will help you get going — no pressure.
          </p>
          <div className='tt-foot-links'>
            <Link to='/settings/faq'>Help Center</Link>
            <a href={OFFICIAL_TELEGRAM} target='_blank' rel='noopener noreferrer'>
              Telegram community
            </a>
            <Link to='/brokers'>How connecting works</Link>
          </div>
        </div>
        <div className='tt-foot-actions'>
          <form
            className='tt-foot-field'
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <input type='email' placeholder='you@email.com' aria-label='Your email' />
            <button type='submit' className='tt-btn tt-btn-green' style={{ padding: '10px 16px' }}>
              Send <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
      <div className='tt-foot-bottom'>
        <span>© {new Date().getFullYear()} TradeTab — Learn. Connect. Improve.</span>
        <span>
          <Link to='/settings/faq'>Privacy</Link> · <Link to='/settings/termsAndconditions'>Terms</Link> ·
          Risk disclosure
        </span>
      </div>
    </footer>
  );
}

function ConnectModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [broker, setBroker] = useState<'mt4' | 'mt5'>('mt5');

  return (
    <div className='tt-modal-overlay' onMouseDown={onClose} role='presentation'>
      <div
        className='tt-modal'
        onMouseDown={e => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby='connect-modal-title'
      >
        <button type='button' className='tt-modal-x' onClick={onClose} aria-label='Close'>
          <X size={16} />
        </button>
        <div className='tt-modal-eyebrow'>Step 1 of 1 · Free</div>
        <h2 id='connect-modal-title'>Connect &amp; start learning</h2>
        <p className='lede'>
          Link your account and unlock your free journal + the University. Takes about a minute.
        </p>

        <p className='tt-field-lbl'>Your trading platform</p>
        <div className='tt-broker-pick'>
          <button
            type='button'
            className={`tt-broker-opt mt4${broker === 'mt4' ? ' sel' : ''}`}
            onClick={() => setBroker('mt4')}
          >
            <span className='glyph'>MT4</span>
            <span>
              <span className='nm'>MetaTrader 4</span>
              <div className='sb'>MT4</div>
            </span>
          </button>
          <button
            type='button'
            className={`tt-broker-opt mt5${broker === 'mt5' ? ' sel' : ''}`}
            onClick={() => setBroker('mt5')}
          >
            <span className='glyph'>MT5</span>
            <span>
              <span className='nm'>MetaTrader 5</span>
              <div className='sb'>MT5</div>
            </span>
          </button>
        </div>

        <p className='tt-field-lbl'>Email</p>
        <input className='tt-input' type='email' placeholder='you@email.com' />
        <p className='tt-field-lbl'>Phone number</p>
        <div className='tt-phone'>
          <input className='cc' defaultValue='+1' aria-label='Country code' />
          <input className='tt-input' type='tel' placeholder='(555) 000-0000' />
        </div>

        <button
          type='button'
          className='tt-btn tt-btn-green tt-modal-cta'
          onClick={() => navigate('/signup')}
        >
          Connect My Account <ArrowRight size={16} />
        </button>
        <div className='tt-reassure'>
          <Shield size={14} />
          Read-only · We never touch your funds
        </div>
        <p className='tt-modal-alt'>
          Prefer to explore first?{' '}
          <Link to='/university' onClick={onClose}>
            Start with the free University →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function DesignLandingSections() {
  const [modalOpen, setModalOpen] = useState(false);
  const openConnect = () => setModalOpen(true);

  return (
    <div className='tt-inner'>
      <header className='tt-hero tt-warm-hero'>
        <div className='tt-eyebrow'>
          <span className='tag'>FREE</span>
          Learn to trade, and journal it — all in one place <ArrowRight size={14} />
        </div>
        <h1 className='tt-h1'>
          Track your trading.
          <br />
          <span className='grad'>Or start learning from zero.</span>
        </h1>
        <p className='tt-sub'>
          TradeTab is free to learn and free to connect. Start from zero in our University, or link
          your broker for a real journal — and improve with every trade.
        </p>
        <div className='tt-hero-actions'>
          <button type='button' className='tt-btn tt-btn-green' onClick={openConnect}>
            Connect account <ArrowRight size={16} />
          </button>
          <Link to='/university' className='tt-btn tt-btn-outline'>
            Explore the University
          </Link>
        </div>
        <div className='tt-free-note'>
          Free forever
          <span className='pip' />
          No card required
          <span className='pip' />
          Beginner-friendly
        </div>
      </header>

      <div style={{ paddingTop: '52px' }}>
        <CoreFlow />
      </div>

      <section className='tt-twins' style={{ paddingTop: '30px' }}>
        <LearnCard />
        <ConnectCard onConnect={openConnect} />
      </section>

      <p className='tt-trust' style={{ paddingTop: '34px' }}>
        Connect → Learn → Journal → Improve · Built to help traders actually get better
      </p>

      <LandingFooter />

      {modalOpen ? <ConnectModal onClose={() => setModalOpen(false)} /> : null}
    </div>
  );
}
