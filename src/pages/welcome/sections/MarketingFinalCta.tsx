import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { OFFICIAL_TELEGRAM } from '@/utils/GlobalVars';

type MarketingFinalCtaProps = {
  title?: string;
  description?: string;
};

export default function MarketingFinalCta({
  title = 'Ready to trade smarter?',
  description = 'Free to start. No credit card. Your broker stays read-only.',
}: MarketingFinalCtaProps) {
  return (
    <section className='tt-final-cta'>
      <h2>{title}</h2>
      <p className='mx-auto mt-0 max-w-xl text-base text-[var(--tt-fg-2)]'>{description}</p>
      <div className='mt-8 inline-flex flex-wrap justify-center gap-3'>
        <Link to='/signup' className='tt-btn tt-btn-primary px-6 py-3.5 text-[15px] no-underline'>
          Add your account <ArrowRight className='h-4 w-4' />
        </Link>
        <a
          href={OFFICIAL_TELEGRAM}
          className='tt-btn tt-btn-ghost px-6 py-3.5 text-[15px]'
          target='_blank'
          rel='noreferrer'
        >
          Join Telegram
        </a>
      </div>
    </section>
  );
}
