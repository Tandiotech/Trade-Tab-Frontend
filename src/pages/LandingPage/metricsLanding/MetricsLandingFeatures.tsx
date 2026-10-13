import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CalendarRange, Link2 } from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Know your edge',
    description:
      'Win rate, profit factor, drawdown, and 30+ metrics update as your broker syncs — no spreadsheets.',
  },
  {
    icon: CalendarRange,
    title: 'Filter any period',
    description:
      'Presets and custom ranges slice KPIs and the trader chart so you see exactly how you performed.',
  },
  {
    icon: Link2,
    title: 'One-click broker connect',
    description:
      'Link MT4, MT5, or supported brokers and get live metrics in minutes — free to start.',
  },
] as const;

export function MetricsLandingFeatures() {
  return (
    <section className='tt-marketing-section tt-marketing-section--features px-4 md:px-8'>
      <div className='mx-auto max-w-[1440px] tt-shell'>
        <div className='mb-10 text-center'>
          <p className='tt-kicker mb-3'>Why TradeTab metrics</p>
          <h2 className='tt-title text-3xl font-bold md:text-4xl'>
            Everything you need to trade with clarity
          </h2>
        </div>

        <div className='grid gap-4 md:grid-cols-3 md:gap-5'>
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article key={title} className='tt-vp-card flex flex-col gap-3 p-5 md:p-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
                <Icon className='h-5 w-5' aria-hidden />
              </div>
              <h3 className='text-lg font-semibold text-[var(--tt-fg-0)]'>{title}</h3>
              <p className='text-sm leading-relaxed text-[var(--tt-fg-2)]'>{description}</p>
            </article>
          ))}
        </div>

        <div className='mt-12 flex flex-col items-center gap-4 text-center'>
          <p className='max-w-xl text-[var(--tt-fg-2)]'>
            Ready to replace sample data with your live account?
          </p>
          <Link
            to='/signup'
            className='tt-btn tt-btn-primary inline-flex items-center gap-2 px-8 py-3 text-base no-underline'
          >
            Create free account <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  );
}
