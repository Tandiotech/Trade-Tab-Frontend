import type { RouteObject } from 'react-router-dom';
import Login from '../pages/auth/signin/Login';
import Register from '../pages/auth/register/Register';
import ForgotPassword from '../pages/auth/forgotPassword/forgotPassword';
import ResetPassword from '../pages/auth/forgotPassword/ResetPassword';
import MetricsNotConnected from '../pages/LandingPage/MetricsNotConnected';
import JobsCareersPage from '../pages/jobs/careers/JobsCareersPage';
import JournalNotConnected from '../pages/LandingPage/JournalNotConnected';
import SearchBrokers from '../pages/brokersRatings/SearchBrokers';
import PublicMarketingLayout from './PublicMarketingLayout';
import Affiliate from '../pages/affiliate/Affiliate';
import ZohoForm from '../pages/auth/register/WaitList';
import JoinNow from '../pages/joinNow/JoinNow';
import BrokerComplaintReport from '../pages/brokerComplainReport/BrokerComplainReport';
import { Helmet } from 'react-helmet-async';
import WelcomeNavbar from '../pages/welcome/sections/WelcomeNavbar';

import EmailVerification from '../pages/auth/register/verify/EmailVerification';
import University from '../pages/university/University';
import TradeTabDownload from '../pages/reports/TradeTabDownload';
import { FooterAffiliate } from '@/pages/affiliate/sections/footer';
import Leaderboards from '@/pages/leaderboards/Leaderboards';
import ProfilePage from '@/pages/profile/ProfilePage';
import ComparePage from '@/pages/compare/ComparePage';
import TradingPassport from '@/pages/Passport/TradingPassport';
import VerifyEmail from '@/pages/auth/register/verify/VerifyEmail';

const publicRoutes: RouteObject[] = [
  {
    path: '/leaderboards',
    element: (
      <>
        <WelcomeNavbar />
        <div className='h-24'></div>
        <Leaderboards />
      </>
    ),
  },
  {
    path: '/u/:handle',
    element: (
      <>
        <WelcomeNavbar />
        <div className='h-24'></div>
        <ProfilePage />
      </>
    ),
  },
  {
    path: '/compare/:a/:b',
    element: (
      <>
        <WelcomeNavbar />
        <div className='h-24'></div>
        <ComparePage />
      </>
    ),
  },
  {
    path: '/passport',
    element: (
      <>
        <WelcomeNavbar />
        <div className='h-24'></div>
        <TradingPassport />
      </>
    ),
  },
  {
    path: '/login',
    element: (
      <div>
        <Login />
      </div>
    ),
  },
  {
    path: '/signup',
    element: <Register />,
  },
  {
    path: '/download',
    element: <TradeTabDownload />,
  },
  {
    path: '/brokersComplaints',
    element: (
      <>
        <Helmet prioritizeSeoTags>
          <meta name='description' content='.' />
          <meta property='og:type' content='website' />
          <title>Broker Complaint</title>
          <link rel='canonical' href='https://tradetab.com/brokersComplaints' />
          <meta
            property='og:title'
            content='Share your personal experiences and report issues with forex brokerages. Join retail traders to expose unethical practices and help others.'
          />
        </Helmet>
        <WelcomeNavbar />
        <div className='h-24'></div>
        <div className='relative'>
          <BrokerComplaintReport
          brokerName={''}
          complaints={[]}
          />
          <div className='absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'>
            <div className='text-white font-bold text-3xl'>
              Please login to interact with this section
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    path: '/waitlist',
    element: <ZohoForm />,
  },
  {
    path: '/joinnow',
    element: <JoinNow />,
  },
  {
    path: '/affiliate',
    element: <Affiliate />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
  {
    path: '/emailVerification/:token',
    element: <EmailVerification />,
  },

  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '/university',
    element: <University variant='public' />,
  },

  {
    path: '/careers',
    element: <JobsCareersPage variant='public' />,
  },
  {
    path: '/metrics',
    element: (
      <PublicMarketingLayout>
        <MetricsNotConnected />
      </PublicMarketingLayout>
    ),
  },
  {
    path: '/journal',
    element: (
      <PublicMarketingLayout>
        <JournalNotConnected />
      </PublicMarketingLayout>
    ),
  },

  {
    path: '/brokers',
    element: (
      <PublicMarketingLayout>
        <SearchBrokers />
      </PublicMarketingLayout>
    ),
  },
];

export default publicRoutes;
