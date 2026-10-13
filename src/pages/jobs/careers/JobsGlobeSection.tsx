import { lazy, Suspense } from 'react';
import { MapPin } from 'lucide-react';
import { jobLocations } from '../jobLocations';
import { JobsLocationList } from './JobsLocationList';
import { formatJobLocation } from './jobsCareers.types';
import type { JobLocation, SelectedJobLocation } from './jobsCareers.types';
import { careersBtnPrimary } from './jobFormStyles';

const Globe3D = lazy(() => import('@/component/3d/Globe3D'));

type Props = {
  selected: SelectedJobLocation | null;
  onSelect: (location: SelectedJobLocation) => void;
  onApply: () => void;
};

function GlobeFallback() {
  return (
    <div className='flex h-full min-h-[16rem] items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-2 border-[var(--tt-brand)] border-t-transparent' />
    </div>
  );
}

export function JobsGlobeSection({ selected, onSelect, onApply }: Props) {
  const handleGlobeSelect = (loc: SelectedJobLocation) => {
    onSelect(loc);
  };

  const locations = jobLocations as JobLocation[];

  return (
    <section className='tt-section px-4 pb-12 md:px-8' aria-label='Global hubs'>
      <div className='mx-auto max-w-[1440px]'>
        <div className='mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='tt-kicker mb-2'>Worldwide network</p>
            <h2 className='tt-title text-2xl font-bold md:text-3xl'>Choose your hub</h2>
            <p className='mt-2 max-w-xl text-sm text-[var(--tt-fg-2)]'>
              Explore our global footprint on the map or search below — then apply to represent the desk
              in your market.
            </p>
          </div>
          {selected ? (
            <p className='inline-flex items-center gap-1.5 rounded-full border border-[var(--tt-brand)]/40 bg-[var(--tt-brand-dim)] px-3 py-1.5 text-sm font-medium text-[var(--tt-fg-0)]'>
              <MapPin className='h-4 w-4 text-[var(--tt-brand)]' />
              {formatJobLocation(selected)}
            </p>
          ) : null}
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
          <div className='tt-panel tt-careers-globe-pane relative hidden overflow-hidden lg:col-span-3 lg:flex lg:flex-col'>
            <Suspense fallback={<GlobeFallback />}>
              <Globe3D locations={locations} onSelect={handleGlobeSelect} />
            </Suspense>
          </div>

          <div className='tt-panel flex flex-col lg:col-span-2 lg:min-h-[28rem]'>
            <JobsLocationList locations={locations} selected={selected} onSelect={onSelect} />
            <button
              type='button'
              onClick={onApply}
              className={`${careersBtnPrimary} mt-4 w-full`}
              style={{ borderColor: 'var(--tt-brand)' }}
            >
              Apply now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
