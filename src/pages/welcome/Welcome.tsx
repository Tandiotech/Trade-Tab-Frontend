import WelcomeHelmet from '@/component/helmets/WelcomeHelmet';
import ErrorBoundary from '@/component/ErrorBoundary';
import useAuthUser from '@/hook/useAuthUser';
import './TradetabLanding.css';

import WelcomeLandingNavbar from './sections/WelcomeLandingNavbar';
import DesignLandingSections from './sections/DesignLandingSections';

function Welcome() {
  const { isLoggedIn } = useAuthUser();

  return (
    <div className='tt-lp'>
      <WelcomeHelmet />

      {!isLoggedIn() && (
        <ErrorBoundary fallback={<div className='h-16 bg-black' />}>
          <WelcomeLandingNavbar />
        </ErrorBoundary>
      )}

      <DesignLandingSections />
    </div>
  );
}

export default Welcome;
