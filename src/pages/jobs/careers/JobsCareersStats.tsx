import { BarChart3, Globe, Users } from 'lucide-react';
import { jobLocations } from '../jobLocations';

const STATS = [
  {
    icon: Globe,
    value: `${jobLocations.length}+`,
    label: 'Global hubs',
  },
  {
    icon: Users,
    value: '500+',
    label: 'Team & partners',
  },
  {
    icon: BarChart3,
    value: '$2B+',
    label: 'Capital partnered',
  },
] as const;

export function JobsCareersStats() {
  return (
    <section className='tt-section px-4 pb-8 md:px-8'>
      <div className='mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3'>
        {STATS.map(({ icon: Icon, value, label }) => (
          <article key={label} className='tt-vp-card flex flex-col items-center gap-2 p-5 text-center'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
              <Icon className='h-5 w-5' aria-hidden />
            </div>
            <p className='text-2xl font-bold text-[var(--tt-fg-0)]'>{value}</p>
            <p className='text-xs text-[var(--tt-fg-2)]'>{label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
