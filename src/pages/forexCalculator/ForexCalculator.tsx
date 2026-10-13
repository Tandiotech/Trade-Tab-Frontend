import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import PositionSizeCalculator from '@/component/profitSizeCalculator/ProfitSizeCalculator';
import PipCalculator from './components/PipCalculator';
import ProfitCalculator from './components/ProfitCalculator';
import ComprehensiveTradeCalculator from './tradeCalculator/Index';
import '../shared/TradeTabDesign.css';

const SITE_ORIGIN = 'https://www.tradetab.com';
const PAGE_PATH = '/forexCalculator';

const SEO_TITLE = 'Forex calculator suite | TradeTab';
const SEO_DESCRIPTION =
  'Free forex calculator suite: position size, pip value, profit and loss, and an all-in-one trade planner. Plan risk before you trade, with tools aligned to your account currency and pair.';

type TabKey = 'position' | 'pip' | 'profit' | 'tradecalculator';

interface TabItem {
  key: TabKey;
  label: string;
  eyebrow: string;
  summary: string;
}

interface CalculatorInfo {
  title: string;
  howToUse: string[];
  description: string;
}

const TABS: TabItem[] = [
  {
    key: 'position',
    label: 'Position Size',
    eyebrow: 'Risk control',
    summary: 'Determine lot size based on balance, stop loss, and risk %.',
  },
  {
    key: 'pip',
    label: 'Pip Value',
    eyebrow: 'Know the move',
    summary: 'Understand the dollar value for every pip before you trade.',
  },
  {
    key: 'profit',
    label: 'Profit & Loss',
    eyebrow: 'Set expectations',
    summary: 'Estimate potential gain or loss from entry, exit, and size.',
  },
  {
    key: 'tradecalculator',
    label: 'Trade Planner',
    eyebrow: 'All-in-one',
    summary: 'Combine sizing, pip value, and profit analytics in one view.',
  },
];

const CALCULATOR_INFO: Record<TabKey, CalculatorInfo> = {
  position: {
    title: 'Position Size Calculator',
    howToUse: [
      "Select Account Currency – Choose your account's base currency.",
      'Select Currency Pair – Pick the currency pair you want to trade.',
      'Enter Account Size – Input your total trading capital.',
      'Enter Stop Loss (Pips) – Specify the number of pips you are willing to risk.',
      'Enter Risk % – Set the percentage of your account balance to risk.',
      'Review Results – Lot size and risk amount update instantly.',
      'Restart (Optional) – Click "Restart" to reset inputs.',
    ],
    description:
      'Determine the optimal trade size to stay within your risk tolerance. The calculator keeps you disciplined and prevents overexposure by aligning lot size with your account balance, risk %, and stop loss.',
  },
  pip: {
    title: 'Pip Calculator',
    howToUse: [
      'Select Currency Pair – Choose the pair you wish to calculate pip value for.',
      'Enter Trade Size – Specify the number of lots or units you plan to trade.',
      'Review Instant Result – Pip value updates automatically when inputs change.',
      'Adjust values as needed – Experiment with different pairs or trade sizes.',
    ],
    description:
      'Every pip carries weight. Quickly discover how much each pip is worth for the pair you are trading so you can size positions with confidence and anticipate potential drawdowns.',
  },
  profit: {
    title: 'Profit Calculator',
    howToUse: [
      'Select Trade Direction – Choose Buy or Sell.',
      'Enter Entry Price – The price at which you plan to enter the trade.',
      'Enter Exit Price – The price where you intend to close the trade.',
      'Enter Trade Size – Specify how many units you are trading.',
      'Review Results – Projected profit or loss is calculated instantly.',
    ],
    description:
      'Model the impact of price moves before they happen. The Profit Calculator reveals how each scenario affects your P&L so you can set realistic targets and protective stops.',
  },
  tradecalculator: {
    title: 'Comprehensive Trade Calculator',
    howToUse: [
      'Enter account currency and balance.',
      'Select the currency pair you want to trade.',
      'Define risk %, stop loss, and trade direction (Buy/Sell).',
      'Provide entry and exit prices to complete the scenario.',
      'Review the combined output: position size, pip value, and projected profit/loss.',
      'Fine-tune parameters until the plan matches your strategy.',
    ],
    description:
      'Bring every critical metric together in one workspace. The comprehensive view connects position sizing, pip valuation, and profit forecasting, giving you a holistic pre-trade checklist.',
  },
};

const panelClass =
  'rounded-2xl sm:rounded-3xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] p-2 sm:p-3 shadow-lg backdrop-blur';
const innerPanelClass =
  'rounded-xl sm:rounded-2xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm leading-relaxed text-[var(--tt-fg-2)]';

export default function ForexCalculator(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('position');
  const [openPanel, setOpenPanel] = useState<'description' | 'instructions' | null>('description');
  const [showSidebar, setShowSidebar] = useState(false);

  const handlePanelToggle = (panel: 'description' | 'instructions') => {
    setOpenPanel(prev => (prev === panel ? null : panel));
  };

  const renderCalculator = (): JSX.Element | null => {
    switch (activeTab) {
      case 'position':
        return <PositionSizeCalculator />;
      case 'pip':
        return <PipCalculator />;
      case 'profit':
        return <ProfitCalculator />;
      case 'tradecalculator':
        return <ComprehensiveTradeCalculator />;
      default:
        return null;
    }
  };

  const activeInfo = CALCULATOR_INFO[activeTab];
  const canonicalUrl = `${SITE_ORIGIN}${PAGE_PATH}`;

  const tabButtonFocus =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tt-brand)]';

  return (
    <section className='tt-theme relative isolate min-h-screen overflow-x-hidden bg-[var(--tt-bg-0)] text-[var(--tt-fg-1)]'>
      <Helmet prioritizeSeoTags>
        <title>{SEO_TITLE}</title>
        <meta name='description' content={SEO_DESCRIPTION} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:title' content={SEO_TITLE} />
        <meta property='og:description' content={SEO_DESCRIPTION} />
        <meta property='og:locale' content='en_US' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={SEO_TITLE} />
        <meta name='twitter:description' content={SEO_DESCRIPTION} />
      </Helmet>

      <div
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 sm:h-64 lg:h-72 blur-3xl'
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.72 0.15 230 / 0.12), transparent), radial-gradient(400px 280px at 70% 0%, var(--tt-profit-dim), transparent)',
        }}
        aria-hidden
      />

      <div className='mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8 lg:gap-10 px-3 py-6 sm:px-4 sm:py-8 lg:px-8 lg:py-12'>
        <header className='space-y-3 sm:space-y-4 lg:space-y-6 text-center'>
          <div className='tt-kicker'>TradeTab toolkit</div>
          <h1 className='tt-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2 sm:px-0'>
            Your all-in-one forex calculator suite
          </h1>
          <p className='tt-subtitle mx-auto max-w-2xl text-sm sm:text-base lg:text-lg px-4 sm:px-0'>
            Plan every trade with precision. Switch between calculators to size positions, clarify pip
            value, project profit, and validate your entire scenario before execution.
          </p>
        </header>

        <nav
          className={`flex gap-2 sm:gap-3 overflow-x-auto pb-2 ${panelClass} lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
          aria-label='Calculator tabs'
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type='button'
                onClick={() => setActiveTab(tab.key)}
                className={`group min-w-[160px] flex-shrink-0 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 sm:min-w-[180px] sm:rounded-2xl sm:px-4 sm:py-3 ${tabButtonFocus} ${
                  isActive
                    ? 'min-w-[180px] border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] shadow-[0_0_0_1px_oklch(0.72_0.15_230_/0.45)] sm:min-w-[200px]'
                    : 'border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.03)] text-[var(--tt-fg-2)] hover:border-[var(--tt-brand)]/40 hover:bg-[oklch(1_0_0_/0.06)] sm:min-w-[180px]'
                }`}
                aria-pressed={isActive}
              >
                <span className='block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--tt-brand)] sm:text-[11px] sm:tracking-[0.2em]'>
                  {tab.eyebrow}
                </span>
                <span className='mt-1 block text-sm font-semibold text-[var(--tt-fg-0)] sm:mt-2 sm:text-base lg:text-lg'>
                  {tab.label}
                </span>
                <span className='mt-0.5 block text-xs text-[var(--tt-fg-2)] line-clamp-2 group-hover:text-[var(--tt-fg-1)] sm:mt-1 sm:text-sm'>
                  {tab.summary}
                </span>
              </button>
            );
          })}
        </nav>

        <button
          type='button'
          onClick={() => setShowSidebar(!showSidebar)}
          className={`flex w-full items-center justify-between rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] px-4 py-3 text-sm font-medium text-[var(--tt-fg-0)] transition-colors hover:border-[var(--tt-brand)]/40 hover:bg-[oklch(1_0_0_/0.04)] lg:hidden ${tabButtonFocus}`}
        >
          <span>Calculator info and instructions</span>
          <span className={`transition-transform ${showSidebar ? 'rotate-180' : ''}`}>▼</span>
        </button>

        <div className='grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start'>
          <aside
            className={`space-y-4 transition-all duration-300 sm:space-y-5 lg:space-y-6 ${
              showSidebar ? 'block' : 'hidden lg:block'
            }`}
          >
            <nav
              className={`hidden flex-col gap-4 p-3 lg:flex ${panelClass}`}
              aria-label='Calculator tabs'
            >
              {TABS.map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type='button'
                    onClick={() => setActiveTab(tab.key)}
                    className={`group rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${tabButtonFocus} ${
                      isActive
                        ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] shadow-[0_0_0_1px_oklch(0.72_0.15_230_/0.45)]'
                        : 'border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.03)] text-[var(--tt-fg-2)] hover:border-[var(--tt-brand)]/40 hover:bg-[oklch(1_0_0_/0.06)]'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className='text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tt-brand)]'>
                      {tab.eyebrow}
                    </span>
                    <span className='mt-2 block text-lg font-semibold text-[var(--tt-fg-0)]'>{tab.label}</span>
                    <span className='mt-1 block text-sm text-[var(--tt-fg-2)] group-hover:text-[var(--tt-fg-1)]'>
                      {tab.summary}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className={`space-y-3 sm:space-y-4 p-4 sm:p-5 ${panelClass}`}>
              <h2 className='text-base font-semibold text-[var(--tt-brand)] sm:text-lg'>{activeInfo.title}</h2>
              <div className='space-y-2 sm:space-y-3'>
                <button
                  type='button'
                  onClick={() => handlePanelToggle('description')}
                  className={`flex w-full items-center justify-between rounded-xl border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.03)] px-3 py-2.5 text-left text-xs font-medium text-[var(--tt-fg-0)] transition hover:border-[var(--tt-brand)]/40 hover:bg-[oklch(1_0_0_/0.05)] sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm ${tabButtonFocus}`}
                  aria-expanded={openPanel === 'description'}
                >
                  <span>Description</span>
                  <span
                    className={`text-xs transition-transform sm:text-sm ${openPanel === 'description' ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>
                {openPanel === 'description' && <p className={innerPanelClass}>{activeInfo.description}</p>}

                <button
                  type='button'
                  onClick={() => handlePanelToggle('instructions')}
                  className={`flex w-full items-center justify-between rounded-xl border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.03)] px-3 py-2.5 text-left text-xs font-medium text-[var(--tt-fg-0)] transition hover:border-[var(--tt-brand)]/40 hover:bg-[oklch(1_0_0_/0.05)] sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm ${tabButtonFocus}`}
                  aria-expanded={openPanel === 'instructions'}
                >
                  <span>How to use</span>
                  <span
                    className={`text-xs transition-transform sm:text-sm ${openPanel === 'instructions' ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>
                {openPanel === 'instructions' && (
                  <ol className='list-decimal space-y-2 rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] px-3 py-3 pl-5 text-xs marker:text-[var(--tt-brand)] sm:space-y-3 sm:rounded-2xl sm:px-4 sm:py-4 sm:pl-6 sm:text-sm'>
                    {activeInfo.howToUse.map(step => (
                      <li key={step} className='pl-1 leading-relaxed text-[var(--tt-fg-2)]'>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className='rounded-xl border border-[var(--tt-line-2)] bg-[var(--tt-profit-dim)] px-4 py-3 text-xs text-[var(--tt-fg-1)] sm:rounded-2xl sm:px-5 sm:py-4 sm:text-sm'>
                <p className='font-semibold text-[var(--tt-profit)]'>Pro tip</p>
                <p className='mt-1 leading-relaxed text-[var(--tt-fg-2)]'>
                  Save your favorite settings per tool by leaving the tab open—each calculator retains
                  your inputs while you explore the rest of the suite.
                </p>
              </div>
            </div>
          </aside>

          <div
            className={`min-w-0 space-y-4 rounded-2xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-4 shadow-2xl backdrop-blur sm:space-y-5 sm:rounded-3xl sm:p-5 lg:space-y-6 lg:p-8`}
          >
            {renderCalculator()}
          </div>
        </div>
      </div>
    </section>
  );
}
