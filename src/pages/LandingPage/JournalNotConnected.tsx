import { useMemo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PlCalendarFake from '../journal/journaling/PlCalendarFake';
import SLTFormExample from './SLTFormExample';
import EvaluationboxExample from './EvaluationBoxExample';
import { generateDummyTrades } from '../../utils/dummyTradesGenerator';
import { generateWhatsAppLink } from '@/services/generateWhatsAppLink';
import type { PlCalendarProps } from '../journal/journaling/InterfacesJournal';
import { JournalDemoBanner } from './journalLanding/JournalDemoBanner';
import { JournalLandingFeatures } from './journalLanding/JournalLandingFeatures';
import MarketingFinalCta from '@/pages/welcome/sections/MarketingFinalCta';

type DummyTrade = {
  type?: string;
  closeTime: string;
  profit: number;
  success?: string;
};

export default function JournalNotConnected() {
  const [withdrawalPlanMode] = useState(false);
  const [stlPlan, setStlPlan] = useState<PlCalendarProps['stlPlan']>({});

  const currentAccount = { balance: 1000, currency: 'USD', id: 'dummy-account' };
  const dummyTrades = useMemo(generateDummyTrades, []);

  const journalData = useMemo((): PlCalendarProps['journalData'] => {
    const journal: Record<
      string,
      PlCalendarProps['journalData'][number] & { trades?: unknown[] }
    > = {};
    (dummyTrades as DummyTrade[]).forEach(trade => {
      if (!trade || trade.type === 'DEAL_TYPE_BALANCE') return;

      const date = trade.closeTime.split(' ')[0];
      if (!journal[date]) {
        journal[date] = {
          date,
          totalProfit: 0,
          totalTrades: 0,
          successfulTrades: 0,
          failedTrades: 0,
          trades: [],
        };
      }

      journal[date].totalProfit += trade.profit;
      journal[date].totalTrades += Math.floor(Math.random() * 5) + 1;
      if (trade.success === 'won') {
        journal[date].successfulTrades += 1;
      } else {
        journal[date].failedTrades += 1;
      }
    });

    return Object.values(journal) as PlCalendarProps['journalData'];
  }, [dummyTrades]);

  useEffect(() => {
    const fetchSTL = async () => {
      try {
        setStlPlan({});
      } catch (error) {
        console.error('Error fetching SLT:', error);
        setStlPlan(null);
      }
    };

    void fetchSTL();
  }, []);

  const handleWhatsAppClick = () => {
    window.open(
      generateWhatsAppLink(
        import.meta.env.VITE_PHONE_SUPPORT || '+447494208836',
        `I want to learn more about TradeTab's journaling features.`
      ),
      '_blank'
    );
  };

  return (
    <>
      <Helmet prioritizeSeoTags>
        <meta
          name='description'
          content='Optimize trades with our free journal and trading calendar tool.'
        />
        <meta property='og:type' content='website' />
        <title>Journal · TradeTab</title>
        <link rel='canonical' href='https://tradetab.com/journal' />
        <meta
          property='og:title'
          content='Optimize trades with our free journal and trading calendar tool.'
        />
      </Helmet>

      <section className='relative w-full overflow-hidden tt-marketing-section tt-marketing-section--hero px-4 md:px-8'>
        <div
          className='pointer-events-none absolute inset-0 opacity-40'
          style={{
            background:
              'radial-gradient(600px 400px at 20% 10%, var(--tt-brand-dim), transparent), radial-gradient(500px 360px at 80% 30%, var(--tt-profit-dim), transparent)',
          }}
        />
        <div className='relative z-10 mx-auto max-w-3xl tt-shell text-center'>
          <p className='tt-kicker mb-4'>Trading journal</p>
          <h1 className='tt-title mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl'>
            Master your
            <span className='block text-[var(--tt-brand)]'>trading journey</span>
          </h1>
          <p className='tt-subtitle mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl'>
            Discover how professional traders use advanced journaling to track performance, analyze
            emotions, and optimize their strategies.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              to='/signup'
              className='tt-btn tt-btn-primary inline-flex items-center gap-2 px-8 py-3 text-base no-underline'
            >
              Start free <ArrowRight className='h-4 w-4' />
            </Link>
            <button
              type='button'
              onClick={handleWhatsAppClick}
              className='tt-btn tt-btn-ghost px-8 py-3 text-base'
            >
              Learn more
            </button>
          </div>
        </div>
      </section>

      <section className='tt-marketing-section tt-marketing-section--demo px-4 md:px-8 pb-0' aria-label='Journal demo'>
        <div className='mx-auto max-w-7xl'>
          <JournalDemoBanner />

          <div className='mb-10 text-center tt-shell'>
            <h2 className='tt-title text-3xl font-bold md:text-4xl'>See it in action</h2>
            <p className='tt-subtitle mx-auto mt-3 max-w-2xl text-lg'>
              Explore our interactive demo to experience TradeTab&apos;s journaling platform.
            </p>
          </div>

          <div className='tt-journal-landing-demo grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='col-span-2'>
              <div className='tt-card rounded-2xl p-4 md:p-6'>
                <PlCalendarFake
                  journalData={journalData}
                  stlPlan={stlPlan}
                  withdrawalPlanMode={withdrawalPlanMode}
                  balance={currentAccount?.balance}
                  currentAccount={currentAccount}
                  economicCalendarData={[]}
                />

                <div className='tt-panel mt-4 rounded-xl px-4 py-4 sm:px-6'>
                  <div className='mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-3 text-left'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--tt-line-2)] bg-[oklch(1_0_0_/0.04)]'>
                        <BrainIcon />
                      </div>
                      <div>
                        <h3 className='tt-title text-lg font-bold'>Mind mastery analytics</h3>
                        <p className='text-sm text-[var(--tt-fg-2)]'>Track your trading psychology</p>
                      </div>
                    </div>
                    <span className='self-start rounded-full border border-[var(--tt-line-2)] bg-[oklch(1_0_0_/0.04)] px-3 py-1 text-xs font-medium text-[var(--tt-fg-0)] sm:self-auto'>
                      Live demo
                    </span>
                  </div>
                  <p className='text-left text-sm leading-relaxed text-[var(--tt-fg-2)]'>
                    Discover how emotional awareness can transform your trading. Professional traders
                    use this tool to identify psychological patterns that cost them money.
                  </p>
                </div>
              </div>
            </div>

            <div className='col-span-1 space-y-6'>
              <div className='tt-card rounded-2xl p-4 md:p-5'>
                <SLTFormExample />
              </div>
              <div className='tt-card rounded-2xl p-4 md:p-5'>
                <EvaluationboxExample />
              </div>
            </div>
          </div>
        </div>
      </section>

      <JournalLandingFeatures />
      <MarketingFinalCta
        title='Start journaling with real trade data'
        description='Connect your broker and auto-import fills, P&L, and psychology notes — free to start.'
      />
    </>
  );
}

function BrainIcon() {
  return (
    <svg
      className='h-5 w-5 text-[var(--tt-brand)]'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      aria-hidden
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
      />
    </svg>
  );
}
