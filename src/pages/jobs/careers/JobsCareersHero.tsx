import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { generateWhatsAppLink } from '@/services/generateWhatsAppLink';
import { careersBtnPrimary } from './jobFormStyles';
import type { JobsCareersVariant } from './jobsCareers.types';

type Props = {
  variant: JobsCareersVariant;
  onApply: () => void;
};

export function JobsCareersHero({ variant, onApply }: Props) {
  const isPublic = variant === 'public';

  const handleWhatsAppClick = () => {
    window.open(
      generateWhatsAppLink(
        import.meta.env.VITE_PHONE_SUPPORT || '+447494208836',
        'I want to learn more about careers and opportunities at TradeTab.'
      ),
      '_blank'
    );
  };

  return (
    <section
      className={`relative w-full overflow-hidden tt-section px-4 md:px-8 ${
        isPublic ? 'pb-4 pt-20 sm:pt-24 md:pb-6' : 'pb-6 pt-4 md:pt-6'
      }`}
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-40'
        style={{
          background:
            'radial-gradient(600px 400px at 20% 10%, var(--tt-brand-dim), transparent), radial-gradient(500px 360px at 80% 30%, var(--tt-profit-dim), transparent)',
        }}
      />
      <div className='relative z-10 mx-auto max-w-3xl tt-shell text-center'>
        <p className='tt-kicker mb-4'>Global careers</p>
        <h1 className='tt-title mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl'>
          Trade like a professional.
          <span className='block text-[var(--tt-brand)]'>Represent the desk.</span>
        </h1>
        <p className='tt-subtitle mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl'>
          Join an elite global network of traders, educators, and operators building on the TradeTab
          analytics stack — opportunities across our worldwide hubs and remote desks.
        </p>
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <button type='button' onClick={onApply} className={careersBtnPrimary} style={{ borderColor: 'var(--tt-brand)' }}>
            Apply now <ArrowRight className='h-4 w-4' />
          </button>
          <button type='button' onClick={handleWhatsAppClick} className='tt-btn tt-btn-ghost px-8 py-3 text-base'>
            Talk to us
          </button>
          {isPublic ? (
            <Link to='/signup' className='tt-btn tt-btn-ghost px-8 py-3 text-base no-underline'>
              Create account
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
