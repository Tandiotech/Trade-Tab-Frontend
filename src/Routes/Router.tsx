import type { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Layout from '../component/layout/Layout';
import Error from '../pages/error';
import PublicLink from '../pages/PublicLink/PublicLink';
import privateRoutes from './privateRoutes';
import publicRoutes from './publicRoutes';
import Welcome from '../pages/welcome/Welcome';
import BrokerPageByURL from '../pages/brokersRatings/single/BrokerPageByURL';
import AppProviders from '../context/AppProviders';
import PersonalInfo from '../pages/settings/personal-info/PersonalInfo';
import Faq from '../pages/settings/faq';
import Security from '../pages/settings/security/Security';
import TermsAndCondition from '../pages/settings/terms&condition';
import AccountSettings from '../pages/settings';
import Navbar from '../component/header/Navbar';
import WelcomeNavbar from '../pages/welcome/sections/WelcomeNavbar';
import Unsubscribe from '@/pages/auth/Unsuscribe';
import useAuthUser from '@/hook/useAuthUser';
import PublicMarketingLayout from './PublicMarketingLayout';

const ForexCalculator = lazy(() => import('@/pages/forexCalculator/ForexCalculator'));

const forexRouteFallback = (
  <div className='flex min-h-[50vh] items-center justify-center bg-slate-950 text-slate-400 text-sm'>
    Loading calculator…
  </div>
);

function Router() {
  const { isLoggedIn } = useAuthUser();

  const routes = useRoutes([
    {
      path: '/settings',
      element: isLoggedIn() ? (
        <AppProviders>
          <Navbar />
          <AccountSettings />
        </AppProviders>
      ) : (
        <Welcome />
      ),
      children: [
        {
          index: true,
          element: <PersonalInfo />,
        },
        {
          path: 'faq',
          element: <Faq />,
        },
        {
          path: 'security',
          element: <Security />,
        },
        {
          path: 'termsAndconditions',
          element: <TermsAndCondition />,
        },
      ],
    },
    {
      path: '/unsubscribe',
      element: <Unsubscribe />,
    },

    {
      path: '/broker/:name',
      element: isLoggedIn() ? (
        <AppProviders>
          <Layout>
            <BrokerPageByURL />
          </Layout>
        </AppProviders>
      ) : (
        <>
          <WelcomeNavbar />
          <BrokerPageByURL />
        </>
      ),
    },

    {
      path: '/forexCalculators',
      element: <Navigate to='/forexCalculator' replace />,
    },
    {
      path: '/forexCalculator',
      element: (
        <Suspense fallback={forexRouteFallback}>
          {isLoggedIn() ? (
            <AppProviders>
              <Layout>
                <ForexCalculator />
              </Layout>
            </AppProviders>
          ) : (
            <PublicMarketingLayout>
              <ForexCalculator />
            </PublicMarketingLayout>
          )}
        </Suspense>
      ),
    },

    {
      path: '/',
      element: isLoggedIn() ? (
        <AppProviders>
          <Layout />
        </AppProviders>
      ) : (
        <Welcome />
      ),
      // Logged-in: nested private routes render inside <Layout />.
      // Logged-out: `/` is the marketing home only; it has no child routes here — other public
      // pages are siblings merged via `...publicRoutes` below (not children of `/`).
      children: isLoggedIn() ? privateRoutes : [],
    },

    ...publicRoutes,

    {
      path: '/b/:username/:account',
      element: isLoggedIn() ? (
        <AppProviders>
          <Layout>
            <PublicLink b='/b' />
          </Layout>
        </AppProviders>
      ) : (
        <>
          <WelcomeNavbar />
          <PublicLink b='/b' />
        </>
      ),
    },

    {
      path: '/:username/:account',
      element: isLoggedIn() ? (
        <AppProviders>
          <PublicLink />
        </AppProviders>
      ) : (
        <>
          <WelcomeNavbar />
          <PublicLink />
        </>
      ),
    },
    {
      path: '/link2/:username/:account',
      element: isLoggedIn() ? (
        <AppProviders>
          <Layout personalBanner={true}>
            <PublicLink />
          </Layout>
        </AppProviders>
      ) : (
        <>
          <WelcomeNavbar />
          <PublicLink />
        </>
      ),
    },

    {
      path: '*',
      element: <Error />,
    },
  ] as RouteObject[]);

  return routes;
}

export default Router;
