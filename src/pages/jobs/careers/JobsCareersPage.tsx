import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LandingNavbar from '@/pages/welcome/sections/LandingNavbar';
import { FooterAffiliate } from '@/pages/affiliate/sections/footer';
import '@/pages/shared/TradeTabDesign.css';
import { JobsCareersHero } from './JobsCareersHero';
import { JobsCareersStats } from './JobsCareersStats';
import { JobsGlobeSection } from './JobsGlobeSection';
import { JobsCareersValueProps } from './JobsCareersValueProps';
import { JobsApplicationDrawer } from './JobsApplicationDrawer';
import type { JobsCareersVariant, SelectedJobLocation } from './jobsCareers.types';

const DEFAULT_REMOTE: SelectedJobLocation = { city: 'Global (Remote)', country: 'Remote' };

type Props = {
  variant?: JobsCareersVariant;
};

export function JobsCareersPage({ variant = 'public' }: Props) {
  const [selectedLocation, setSelectedLocation] = useState<SelectedJobLocation | null>(null);
  const [applicationOpen, setApplicationOpen] = useState(false);

  const openApplication = () => {
    setApplicationOpen(true);
  };

  const applyLocation = selectedLocation ?? DEFAULT_REMOTE;

  return (
    <div className='relative min-h-screen overflow-x-hidden tt-theme'>
      {variant === 'public' ? (
        <Helmet prioritizeSeoTags>
          <meta
            name='description'
            content='Join TradeTab careers: global trading hubs, professional roles for traders and operators, and applications worldwide.'
          />
          <meta property='og:type' content='website' />
          <title>Careers · TradeTab</title>
          <link rel='canonical' href='https://tradetab.com/careers' />
          <meta property='og:title' content='Careers · TradeTab — global trading network' />
        </Helmet>
      ) : null}

      {variant === 'public' ? <LandingNavbar /> : null}

      <JobsCareersHero variant={variant} onApply={openApplication} />
      <JobsCareersStats />
      <JobsGlobeSection
        selected={selectedLocation}
        onSelect={setSelectedLocation}
        onApply={openApplication}
      />
      <JobsCareersValueProps />

      {variant === 'public' ? (
        <section className='tt-section px-4 pb-16 text-center md:px-8'>
          <button
            type='button'
            onClick={openApplication}
            className='tt-btn tt-btn-primary bg-[var(--tt-brand)] px-8 py-3 text-base text-[oklch(0.14_0.014_250)]'
            style={{ borderColor: 'var(--tt-brand)' }}
          >
            Start your application
          </button>
        </section>
      ) : null}

      {variant === 'public' ? <FooterAffiliate /> : null}

      <JobsApplicationDrawer
        open={applicationOpen}
        selectedLocation={applyLocation}
        onClose={() => setApplicationOpen(false)}
      />
    </div>
  );
}

export default JobsCareersPage;
