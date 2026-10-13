import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { generateWhatsAppLink } from '@/services/generateWhatsAppLink';

export function MetricsLandingHero() {
  const handleWhatsAppClick = () => {
    window.open(
      generateWhatsAppLink(
        import.meta.env.VITE_PHONE_SUPPORT || '+447494208836',
        'I want to learn more about TradeTab metrics and analytics.'
      ),
      '_blank'
    );
  };

  return (
    <section className='relative w-full overflow-hidden tt-marketing-section tt-marketing-section--hero px-4 md:px-8'>
      <div
        className='pointer-events-none absolute inset-0 opacity-40'
        style={{
          background:
            'radial-gradient(600px 400px at 20% 10%, var(--tt-brand-dim), transparent), radial-gradient(500px 360px at 80% 30%, var(--tt-profit-dim), transparent)',
        }}
      />
      <div className='relative z-10 mx-auto max-w-3xl tt-shell text-center'>
        <p className='tt-kicker mb-4'>Metrics dashboard</p>
        <h1 className='tt-title mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl'>
          See your edge
          <span className='block text-[var(--tt-brand)]'>before the market moves on</span>
        </h1>
        <p className='tt-subtitle mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl'>
          Real-time performance analytics, period filtering, and a dynamic trader chart — explore
          the full dashboard with sample data, then connect your broker in minutes.
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
            Talk to us
          </button>
        </div>
      </div>
    </section>
  );
}
