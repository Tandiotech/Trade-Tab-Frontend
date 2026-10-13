import { useState, useMemo, type ReactNode, type SVGProps } from 'react';
import './forexCalculatorModal.shell.css';

interface ForexCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAIRS = [
  { sym: 'EUR/USD', price: 1.0834, pipSize: 0.0001, jpy: false },
  { sym: 'GBP/USD', price: 1.2671, pipSize: 0.0001, jpy: false },
  { sym: 'USD/JPY', price: 154.21, pipSize: 0.01, jpy: true },
  { sym: 'AUD/USD', price: 0.6582, pipSize: 0.0001, jpy: false },
  { sym: 'USD/CHF', price: 0.9047, pipSize: 0.0001, jpy: false },
  { sym: 'USD/CAD', price: 1.3712, pipSize: 0.0001, jpy: false },
  { sym: 'NZD/USD', price: 0.6041, pipSize: 0.0001, jpy: false },
  { sym: 'EUR/GBP', price: 0.8551, pipSize: 0.0001, jpy: false },
  { sym: 'EUR/JPY', price: 167.1, pipSize: 0.01, jpy: true },
  { sym: 'XAU/USD', price: 2384.5, pipSize: 0.1, jpy: false },
] as const;

type PairSym = (typeof PAIRS)[number]['sym'];

const fmtMoney = (n: number, d = 2) => {
  if (!isFinite(n)) return '—';
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
};

const Icon = {
  Trend: (p: SVGProps<SVGSVGElement>) => (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...p}>
      <path d='M3 17l6-6 4 4 8-8' />
      <path d='M17 7h4v4' />
    </svg>
  ),
  Coin: (p: SVGProps<SVGSVGElement>) => (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...p}>
      <circle cx='12' cy='12' r='9' />
      <path d='M14.5 9c-.4-1-1.4-1.5-2.5-1.5-1.7 0-3 1-3 2.3 0 3 6 1.5 6 4.4 0 1.4-1.4 2.3-3 2.3-1.3 0-2.4-.6-2.8-1.6M12 6v12' />
    </svg>
  ),
  Stack: (p: SVGProps<SVGSVGElement>) => (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...p}>
      <path d='M12 3l9 5-9 5-9-5 9-5z' />
      <path d='M3 13l9 5 9-5M3 18l9 5 9-5' />
    </svg>
  ),
  Calc: (p: SVGProps<SVGSVGElement>) => (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...p}>
      <rect x='5' y='3' width='14' height='18' rx='2.5' />
      <path d='M9 7h6M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01M9 17h6' />
    </svg>
  ),
  X: (p: SVGProps<SVGSVGElement>) => (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}>
      <path d='M6 6l12 12M18 6L6 18' />
    </svg>
  ),
  Shield: (p: SVGProps<SVGSVGElement>) => (
    <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...p}>
      <path d='M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z' />
    </svg>
  ),
  Bolt: (p: SVGProps<SVGSVGElement>) => (
    <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...p}>
      <path d='M13 3L5 14h6l-1 7 8-11h-6l1-7z' />
    </svg>
  ),
};

function PaneSplit({ inputs, outcome }: { inputs: ReactNode; outcome: ReactNode }) {
  return (
    <div className='pane pane-layout'>
      <div className='pane-inputs'>{inputs}</div>
      <aside className='pane-outcome' aria-label='Results'>
        {outcome}
      </aside>
    </div>
  );
}

function PipPane() {
  const [pairSym, setPairSym] = useState<PairSym>('EUR/USD');
  const [entry, setEntry] = useState(1.0834);
  const [exit, setExit] = useState(1.0856);
  const [lots, setLots] = useState(1);
  const [side, setSide] = useState<'long' | 'short'>('long');

  const pair = useMemo(() => PAIRS.find(p => p.sym === pairSym) || PAIRS[0], [pairSym]);
  const direction = side === 'long' ? 1 : -1;

  const diff = (exit - entry) * direction;
  const pips = diff / pair.pipSize;
  const contractSize = 100000;
  const units = lots * contractSize;
  const pipValueQuote = pair.pipSize * units;
  const pipValueUSD = pair.jpy ? pipValueQuote / pair.price : pipValueQuote;
  const pnlUSD = pips * pipValueUSD;
  const positive = pnlUSD >= 0;

  const onPairChange = (sym: PairSym) => {
    const next = PAIRS.find(p => p.sym === sym) || PAIRS[0];
    setPairSym(sym);
    setEntry(next.price);
    setExit(+(next.price + next.pipSize * 22).toFixed(next.jpy ? 3 : 5));
  };

  return (
    <PaneSplit
      inputs={
        <div className='body-grid'>
          <div className='field' style={{ gridColumn: '1 / -1' }}>
            <div className='field-row'>
              <span className='field-label'>Instrument</span>
              <span className='field-hint'>Spot mid · indicative</span>
            </div>
            <div className='input-wrap'>
              <select
                className='pair-select'
                value={pairSym}
                onChange={e => onPairChange(e.target.value as PairSym)}
              >
                {PAIRS.map(p => (
                  <option key={p.sym} value={p.sym}>
                    {p.sym} · {p.price}
                  </option>
                ))}
              </select>
              <div className='suffix' style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                1 pip = {pair.pipSize}
              </div>
            </div>
          </div>

          <div className='field' style={{ gridColumn: '1 / -1' }}>
            <div className='field-row'>
              <span className='field-label'>Direction</span>
            </div>
            <div className='side'>
              <button
                type='button'
                className={'side-btn long' + (side === 'long' ? ' active' : '')}
                onClick={() => setSide('long')}
              >
                <span className='arrow'>▲</span> Long · Buy
              </button>
              <button
                type='button'
                className={'side-btn short' + (side === 'short' ? ' active' : '')}
                onClick={() => setSide('short')}
              >
                <span className='arrow'>▼</span> Short · Sell
              </button>
            </div>
          </div>

          <div className='field'>
            <div className='field-row'>
              <span className='field-label'>Entry price</span>
            </div>
            <div className='input-wrap'>
              <input
                type='number'
                step={pair.pipSize}
                value={entry}
                onChange={e => setEntry(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className='field'>
            <div className='field-row'>
              <span className='field-label'>Exit price</span>
              <span className='field-hint'>
                {pips >= 0 ? '+' : ''}
                {pips.toFixed(1)} pips
              </span>
            </div>
            <div className='input-wrap'>
              <input
                type='number'
                step={pair.pipSize}
                value={exit}
                onChange={e => setExit(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className='field' style={{ gridColumn: '1 / -1' }}>
            <div className='field-row'>
              <span className='field-label'>Position size</span>
              <span className='field-hint'>{units.toLocaleString()} units</span>
            </div>
            <div className='input-wrap'>
              <button type='button' className='step-btn' onClick={() => setLots(l => Math.max(0.01, +(l - 0.1).toFixed(2)))}>
                −
              </button>
              <input
                type='number'
                step={0.01}
                value={lots}
                onChange={e => setLots(Math.max(0, parseFloat(e.target.value) || 0))}
                style={{ textAlign: 'center' }}
              />
              <button type='button' className='step-btn' onClick={() => setLots(l => +(l + 0.1).toFixed(2))}>
                +
              </button>
              <div className='suffix'>lots</div>
            </div>
            <div className='lot-chips'>
              {[
                { lots: 0.01, label: 'Micro' },
                { lots: 0.1, label: 'Mini' },
                { lots: 1, label: 'Standard' },
                { lots: 5, label: '5 lots' },
                { lots: 10, label: '10 lots' },
              ].map(c => (
                <button key={c.label} type='button' className='lot-chip' onClick={() => setLots(c.lots)}>
                  <strong>{c.lots}</strong>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      outcome={
        <div className='result'>
          <div className='result-head'>
            <div className='result-tag'>Estimated P&amp;L</div>
            <div className='result-context'>
              {pair.sym} · {lots} lot{lots !== 1 ? 's' : ''} · {side}
            </div>
          </div>
          <div className='result-main'>
            <span className='result-currency'>USD</span>
            <span className='result-value' style={{ color: positive ? 'var(--positive)' : 'var(--danger)' }}>
              {positive ? '+' : ''}
              {fmtMoney(pnlUSD)}
            </span>
          </div>
          <div className='result-sub'>
            {pips >= 0 ? 'Gain of ' : 'Loss of '}
            <span className='mono'>{Math.abs(pips).toFixed(1)} pips</span>
            {' · '}
            Pip value <span className='mono'>${fmtMoney(pipValueUSD, 2)}</span>
          </div>
          <div className='breakdown'>
            <div className='bd'>
              <div className='k'>Pip movement</div>
              <div className={'v ' + (pips >= 0 ? 'pos' : 'neg')}>
                {pips >= 0 ? '+' : ''}
                {pips.toFixed(1)}
              </div>
            </div>
            <div className='bd'>
              <div className='k'>Pip value</div>
              <div className='v'>${fmtMoney(pipValueUSD, 2)}</div>
            </div>
            <div className='bd'>
              <div className='k'>Notional</div>
              <div className='v'>${fmtMoney(units * pair.price, 0)}</div>
            </div>
          </div>
        </div>
      }
    />
  );
}

function PositionPane() {
  const [pairSym, setPairSym] = useState<PairSym>('EUR/USD');
  const [account, setAccount] = useState(10000);
  const [risk, setRisk] = useState(2);
  const [stop, setStop] = useState(50);

  const pair = useMemo(() => PAIRS.find(p => p.sym === pairSym) || PAIRS[0], [pairSym]);
  const contractSize = 100000;

  const riskUSD = account * (risk / 100);
  const pipPerLotUSD = pair.jpy ? (pair.pipSize * contractSize) / pair.price : pair.pipSize * contractSize;
  const lots = stop > 0 ? riskUSD / (stop * pipPerLotUSD) : 0;
  const units = lots * contractSize;
  const notional = units * pair.price;
  const lotsBand = lots >= 1 ? 'Standard' : lots >= 0.1 ? 'Mini' : 'Micro';

  return (
    <PaneSplit
      inputs={
        <div className='body-grid'>
          <div className='field' style={{ gridColumn: '1 / -1' }}>
            <div className='field-row'>
              <span className='field-label'>Instrument</span>
              <span className='field-hint'>1 pip = {pair.pipSize}</span>
            </div>
            <div className='input-wrap'>
              <select
                className='pair-select'
                value={pairSym}
                onChange={e => setPairSym(e.target.value as PairSym)}
              >
                {PAIRS.map(p => (
                  <option key={p.sym} value={p.sym}>
                    {p.sym} · {p.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='field' style={{ gridColumn: '1 / -1' }}>
            <div className='field-row'>
              <span className='field-label'>Account balance</span>
              <span className='field-hint'>Equity available to risk</span>
            </div>
            <div className='input-wrap'>
              <div className='prefix'>$</div>
              <input type='number' value={account} onChange={e => setAccount(parseFloat(e.target.value) || 0)} />
              <div className='suffix'>USD</div>
            </div>
          </div>

          <div className='field'>
            <div className='field-row'>
              <span className='field-label'>Risk per trade</span>
              <span className='field-hint'>${fmtMoney(riskUSD)}</span>
            </div>
            <div className='input-wrap'>
              <input type='number' step={0.1} value={risk} onChange={e => setRisk(parseFloat(e.target.value) || 0)} />
              <div className='suffix'>%</div>
            </div>
            <div className='pill-row'>
              {[0.5, 1, 2, 3, 5].map(v => (
                <button key={v} type='button' className={'pill' + (risk === v ? ' active' : '')} onClick={() => setRisk(v)}>
                  {v}%
                </button>
              ))}
            </div>
          </div>
          <div className='field'>
            <div className='field-row'>
              <span className='field-label'>Stop loss</span>
              <span className='field-hint'>distance to invalidation</span>
            </div>
            <div className='input-wrap'>
              <input type='number' value={stop} onChange={e => setStop(parseFloat(e.target.value) || 0)} />
              <div className='suffix'>pips</div>
            </div>
            <div className='pill-row'>
              {[10, 25, 50, 75, 100].map(v => (
                <button key={v} type='button' className={'pill' + (stop === v ? ' active' : '')} onClick={() => setStop(v)}>
                  {v}p
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      outcome={
        <div className='result'>
          <div className='result-head'>
            <div className='result-tag'>Recommended position</div>
            <div className='result-context'>
              {lotsBand} · {pair.sym}
            </div>
          </div>
          <div className='result-main'>
            <span className='result-value'>{fmtMoney(lots, 2)}</span>
            <span className='result-unit'>lots</span>
          </div>
          <div className='result-sub'>
            Risk <span className='mono'>${fmtMoney(riskUSD)}</span> on a <span className='mono'>{stop}</span>-pip stop ·{' '}
            <span className='mono'>{units.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> units
          </div>
          <div className='breakdown'>
            <div className='bd'>
              <div className='k'>$ risk</div>
              <div className='v'>${fmtMoney(riskUSD)}</div>
            </div>
            <div className='bd'>
              <div className='k'>Notional</div>
              <div className='v'>${fmtMoney(notional, 0)}</div>
            </div>
            <div className='bd'>
              <div className='k'>$/pip</div>
              <div className='v'>${fmtMoney(pipPerLotUSD * lots, 2)}</div>
            </div>
          </div>
        </div>
      }
    />
  );
}

function MarginPane() {
  const [pairSym, setPairSym] = useState<PairSym>('EUR/USD');
  const [lots, setLots] = useState(1);
  const [lev, setLev] = useState(100);
  const [account, setAccount] = useState(10000);

  const pair = useMemo(() => PAIRS.find(p => p.sym === pairSym) || PAIRS[0], [pairSym]);
  const contractSize = 100000;
  const units = lots * contractSize;
  const notional = units * pair.price;
  const margin = notional / lev;
  const free = Math.max(0, account - margin);
  const usedPct = account > 0 ? (margin / account) * 100 : 0;
  const danger = usedPct > 50;

  return (
    <PaneSplit
      inputs={
        <div className='body-grid body-grid-margin'>
          <div className='field'>
            <div className='field-row'>
              <span className='field-label'>Instrument</span>
              <span className='field-hint'>Price {pair.price}</span>
            </div>
            <div className='input-wrap'>
              <select
                className='pair-select'
                value={pairSym}
                onChange={e => setPairSym(e.target.value as PairSym)}
              >
                {PAIRS.map(p => (
                  <option key={p.sym} value={p.sym}>
                    {p.sym} · {p.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='field'>
            <div className='field-row'>
              <span className='field-label'>Lot size</span>
              <span className='field-hint'>{units.toLocaleString()} units</span>
            </div>
            <div className='input-wrap'>
              <button type='button' className='step-btn' onClick={() => setLots(l => Math.max(0.01, +(l - 0.1).toFixed(2)))}>
                −
              </button>
              <input
                type='number'
                step={0.01}
                value={lots}
                onChange={e => setLots(Math.max(0, parseFloat(e.target.value) || 0))}
                style={{ textAlign: 'center' }}
              />
              <button type='button' className='step-btn' onClick={() => setLots(l => +(l + 0.1).toFixed(2))}>
                +
              </button>
              <div className='suffix'>lots</div>
            </div>
          </div>
          <div className='field'>
            <div className='field-row'>
              <span className='field-label'>Leverage</span>
              <span className='field-hint'>1 : {lev}</span>
            </div>
            <div className='input-wrap'>
              <div className='prefix'>1 :</div>
              <input type='number' value={lev} onChange={e => setLev(parseFloat(e.target.value) || 1)} />
              <div className='suffix'>×</div>
            </div>
            <div className='pill-row pill-row-leverage'>
              {[10, 30, 50, 100, 200, 500].map(v => (
                <button key={v} type='button' className={'pill' + (lev === v ? ' active' : '')} onClick={() => setLev(v)}>
                  1:{v}
                </button>
              ))}
            </div>
          </div>

          <div className='field'>
            <div className='field-row'>
              <span className='field-label'>Account balance</span>
              <span className='field-hint'>For free-margin context</span>
            </div>
            <div className='input-wrap'>
              <div className='prefix'>$</div>
              <input type='number' value={account} onChange={e => setAccount(parseFloat(e.target.value) || 0)} />
              <div className='suffix'>USD</div>
            </div>
          </div>
        </div>
      }
      outcome={
        <div
          className='result'
          style={{
            borderColor: danger ? 'color-mix(in oklch, var(--danger) 35%, var(--line))' : undefined,
          }}
        >
          <div className='result-head'>
            <div className='result-tag' style={{ color: danger ? 'var(--danger)' : undefined }}>
              Margin required
            </div>
            <div className='result-context'>{usedPct.toFixed(1)}% of equity used</div>
          </div>
          <div className='result-main result-main-margin'>
            <span className='result-currency'>USD</span>
            <span className='result-value' style={{ color: danger ? 'var(--danger)' : undefined }}>
              {fmtMoney(margin)}
            </span>
          </div>
          <div className='result-sub'>
            To open <span className='mono'>{lots}</span> lot{lots !== 1 ? 's' : ''} of {pair.sym} at 1:{lev} · notional{' '}
            <span className='mono'>${fmtMoney(notional, 0)}</span>
          </div>
          <div className='breakdown'>
            <div className='bd'>
              <div className='k'>Notional</div>
              <div className='v'>${fmtMoney(notional, 0)}</div>
            </div>
            <div className='bd'>
              <div className='k'>Free margin</div>
              <div className={'v ' + (free > 0 ? 'pos' : 'neg')}>${fmtMoney(free)}</div>
            </div>
            <div className='bd'>
              <div className='k'>Account used</div>
              <div className={'v ' + (danger ? 'neg' : '')}>{usedPct.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default function ForexCalculatorModal({ isOpen, onClose }: ForexCalculatorModalProps) {
  const [tab, setTab] = useState<'pip' | 'position' | 'margin'>('pip');

  const TABS = [
    { id: 'pip' as const, label: 'Pip Value', num: '01', icon: <Icon.Trend /> },
    { id: 'position' as const, label: 'Position Size', num: '02', icon: <Icon.Stack /> },
    { id: 'margin' as const, label: 'Margin', num: '03', icon: <Icon.Coin /> },
  ];

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:px-10'
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
      role='presentation'
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id='tt-calc-modal'
        className='w-full max-w-[min(1100px,calc(100vw-2rem))] max-h-[min(94vh,900px)] flex flex-col min-h-0'
        onClick={e => e.stopPropagation()}
      >
        <div
          className='calc flex max-h-[min(92vh,880px)] min-h-0 flex-col overflow-hidden'
          role='dialog'
          aria-modal='true'
          aria-labelledby='forex-calc-title'
        >
          <div className='head shrink-0'>
            <div className='head-mark'>
              <Icon.Calc />
            </div>
            <div className='head-text'>
              <h1 id='forex-calc-title'>Forex Calculator</h1>
              <p>Calculate pip values, position sizes &amp; margins</p>
            </div>
            <div className='head-meta'>
              <span className='dot' />
              Live rates
            </div>
            <button type='button' className='head-close' aria-label='Close' onClick={onClose}>
              <Icon.X />
            </button>
          </div>

          <div className='tabs shrink-0' role='tablist'>
            {TABS.map(t => (
              <button
                key={t.id}
                type='button'
                className={'tab' + (tab === t.id ? ' active' : '')}
                role='tab'
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                <span style={{ color: tab === t.id ? 'var(--accent-2)' : 'var(--ink-3)' }}>{t.icon}</span>
                <span className='tab-label'>{t.label}</span>
                <span className='num'>/{t.num}</span>
              </button>
            ))}
          </div>

          <div className='body min-h-0 flex-1 overflow-y-auto overscroll-contain'>
            {tab === 'pip' && <PipPane />}
            {tab === 'position' && <PositionPane />}
            {tab === 'margin' && <MarginPane />}
          </div>

          <div className='footbar shrink-0'>
            <div className='left'>
              <span>
                <Icon.Shield style={{ marginRight: 6, verticalAlign: '-2px' }} /> Indicative · not advice
              </span>
              <span>
                <Icon.Bolt style={{ marginRight: 6, verticalAlign: '-2px' }} /> Instant update
              </span>
            </div>
            <div className='right'>
              <button type='button' className='primary-btn' onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
