import { Briefcase, MapPin, TrendingUp } from 'lucide-react';
import { jobLocations } from '../jobLocations';

const PROPS = [
  {
    icon: TrendingUp,
    title: 'Cutting-edge technology',
    description: 'Trade on the same analytics stack our global desk uses — AI-assisted insights, metrics, and journal tooling.',
  },
  {
    icon: Briefcase,
    title: 'Competitive compensation',
    description: 'Industry-leading packages for traders, educators, and operators who deliver results.',
  },
  {
    icon: MapPin,
    title: 'Global mobility',
    description: `${jobLocations.length}+ hubs worldwide plus remote desks — choose your market.`,
  },
] as const;

export function JobsCareersValueProps() {
  return (
    <section className='tt-section px-4 pb-16 md:px-8'>
      <div className='mx-auto max-w-[1440px] tt-shell'>
        <div className='mb-8 text-center md:text-left'>
          <p className='tt-kicker mb-3'>Why TradeTab</p>
          <h2 className='tt-title text-2xl font-bold md:text-3xl'>Built for professionals who operate at scale</h2>
        </div>
        <div className='grid gap-4 md:grid-cols-3'>
          {PROPS.map(({ icon: Icon, title, description }) => (
            <article key={title} className='tt-vp-card flex flex-col gap-3 p-5 md:p-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
                <Icon className='h-5 w-5' aria-hidden />
              </div>
              <h3 className='text-lg font-semibold text-[var(--tt-fg-0)]'>{title}</h3>
              <p className='text-sm leading-relaxed text-[var(--tt-fg-2)]'>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
