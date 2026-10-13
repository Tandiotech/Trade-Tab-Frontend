import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Brain, FileText } from 'lucide-react';

const FEATURES = [
  {
    icon: FileText,
    title: 'Advanced journaling',
    description:
      'Track every trade with detailed notes, screenshots, and performance metrics. Build a comprehensive trading history that reveals your patterns.',
  },
  {
    icon: Brain,
    title: 'Emotional intelligence',
    description:
      'Monitor your mental state before, during, and after trades. Understand how emotions impact your decision-making and performance.',
  },
  {
    icon: BarChart3,
    title: 'Performance analytics',
    description:
      'Deep insights into your trading patterns, win rates, and risk management. Identify strengths and areas for improvement with data-driven analysis.',
  },
] as const;

export function JournalLandingFeatures() {
  return (
    <section className='tt-marketing-section tt-marketing-section--features px-4 md:px-8'>
      <div className='mx-auto max-w-7xl tt-shell'>
        <div className='mb-10 text-center'>
          <p className='tt-kicker mb-3'>Why TradeTab journal</p>
          <h2 className='tt-title text-3xl font-bold md:text-4xl'>Everything you need to succeed</h2>
          <p className='tt-subtitle mx-auto mt-3 max-w-2xl text-lg'>
            Our comprehensive suite of tools helps you become a better trader through data-driven
            insights and emotional awareness.
          </p>
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
            Ready to replace sample data with your live trading journal?
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
