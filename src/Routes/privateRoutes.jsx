import { lazy, Suspense } from 'react';
import { JournalProvider } from '@/context/JournalProvider';
import { MetricsPageShellSkeleton } from '@/pages/metrics/components/MetricsSkeletons';

const Metrics = lazy(() => import('@/pages/metrics/Metrics'));

// Lazy load all routes for better performance - only load what's needed
const Statistics = lazy(() => import('../pages/statistics/Statistics'));
const ComingSoon = lazy(() => import('../pages/commingSoon'));
const ExportDataHtml = lazy(() => import('../pages/alent/exportdatahtml'));
const TraderGenome = lazy(() => import('../pages/traderGenome/TraderGenome'));
const SearchBrokers = lazy(() => import('../pages/brokersRatings/SearchBrokers'));
const BrokerComplaintReport = lazy(
  () => import('../pages/brokerComplainReport/BrokerComplainReport')
);
const University = lazy(() => import('../pages/university/University'));
const TraderTable = lazy(() => import('../component/tables/scoreboard/TraderTable'));
const ReviewList = lazy(() => import('../pages/adminBrokers/Reviews/ReviewList'));
const EditArticle = lazy(() => import('../pages/adminBrokers/articles/EditArticle'));
const ArticlesList = lazy(() => import('../pages/adminBrokers/articles/ArticlesList'));
const ReviewForm = lazy(() => import('../pages/adminBrokers/Reviews/ReviewForm'));
const ForumForm = lazy(() => import('../pages/adminBrokers/forum/ForumForm'));
const TradeTabJobs = lazy(() => import('@/pages/jobs/TradeTabJobs'));
const Journal = lazy(() => import('@/pages/journal/Journal'));
const TradingAccountsDashboard = lazy(() => import('../pages/home/TradingAccountsDashboard'));
const UniversityDashboard = lazy(() => import('@/pages/university/UniversityDashboard'));
const EconomicCalendar = lazy(() => import('@/pages/economicCalendar/EconomicCalendar'));
const RedirectTokenPage = lazy(() => import('@/component/CTrader/RedirectTokenPage'));
const Leaderboards = lazy(() => import('@/pages/leaderboards/Leaderboards'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const ComparePage = lazy(() => import('@/pages/compare/ComparePage'));
const TradingPassport = lazy(() => import('@/pages/Passport/TradingPassport'));
const PredictionsPage = lazy(() => import('@/pages/predictions/PredictionsPage'));
const TestPredictions = lazy(() => import('@/component/predictions/TestPredictions'));
const TradePageWrapper = lazy(() => import('@/component/TradePage/TradePageWrapper'));
const TradePageWrapperSimple = lazy(() => import('@/component/TradePage/TradePageWrapperSimple'));
const PerformanceTestPage = lazy(() => import('@/component/TradePage/PerformanceTestPage'));
const IntegrationTest = lazy(() => import('@/component/TradePage/IntegrationTest'));
const UsersList = lazy(() => import('@/component/header/UserList'));
const BrokerComplaintReportNotConnected = lazy(
  () => import('@/pages/LandingPage/BrokerComplainReportNotConnected')
);


// Loading component for Suspense fallback (for other routes)
const RouteLoader = () => (
  <div className='flex items-center justify-center min-h-[400px] bg-slate-950'>
    <div className='flex flex-col items-center gap-4'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500'></div>
      <p className='text-gray-400 text-sm'>Cargando...</p>
    </div>
  </div>
);

// Wrapper component for Suspense
const LazyWrapper = ({ children }) => <Suspense fallback={<RouteLoader />}>{children}</Suspense>;

const privateRoutes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<MetricsPageShellSkeleton />}>
        <Metrics />
      </Suspense>
    ),
  },
  {
    path: '/brokers',
    element: (
      <LazyWrapper>
        <SearchBrokers />
      </LazyWrapper>
    ),
  },
  {
    path: '/trades',
    element: (
      <LazyWrapper>
        <TradePageWrapperSimple />
      </LazyWrapper>
    ),
  },
  {
    path: '/economic-calendar',
    element: (
      <LazyWrapper>
        <EconomicCalendar />
      </LazyWrapper>
    ),
  },
  {
    path: '/redirectToken',
    element: (
      <LazyWrapper>
        <RedirectTokenPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/scoreboard',
    element: (
      <LazyWrapper>
        <TraderTable />
      </LazyWrapper>
    ),
  },
  {
    path: '/leaderboards',
    element: (
      <LazyWrapper>
        <Leaderboards />
      </LazyWrapper>
    ),
  },
  {
    path: '/u/:handle',
    element: (
      <LazyWrapper>
        <ProfilePage />
      </LazyWrapper>
    ),
  },
  {
    path: '/compare/:a/:b',
    element: (
      <LazyWrapper>
        <ComparePage />
      </LazyWrapper>
    ),
  },
  {
    path: '/passport',
    element: (
      <LazyWrapper>
        <TradingPassport />
      </LazyWrapper>
    ),
  },
  {
    path: '/university',
    element: (
      <LazyWrapper>
        <University variant='app' />
      </LazyWrapper>
    ),
  },
  {
    path: '/admin',
    element: (
      <LazyWrapper>
        <UsersList />
      </LazyWrapper>
    ),
  },
  {
    path: '/statistics',
    element: (
      <LazyWrapper>
        <Statistics />
      </LazyWrapper>
    ),
  },
  {
    path: '/learning',
    element: (
      <LazyWrapper>
        <UniversityDashboard />
      </LazyWrapper>
    ),
  },
  {
    path: '/coming-soon',
    element: (
      <LazyWrapper>
        <ComingSoon />
      </LazyWrapper>
    ),
  },
  {
    path: '/reviews',
    element: (
      <LazyWrapper>
        <ReviewList />
      </LazyWrapper>
    ),
  },
  {
    path: '/jobs',
    element: (
      <LazyWrapper>
        <TradeTabJobs />
      </LazyWrapper>
    ),
  },
  {
    path: '/report',
    element: (
      <LazyWrapper>
        <BrokerComplaintReportNotConnected />
      </LazyWrapper>
    ),
  },
  {
    path: '/forum/add',
    element: (
      <LazyWrapper>
        <ForumForm />
      </LazyWrapper>
    ),
  },
  {
    path: '/reviews/add',
    element: (
      <LazyWrapper>
        <ReviewForm />
      </LazyWrapper>
    ),
  },
  {
    path: '/forum/:id',
    element: (
      <LazyWrapper>
        <ForumForm />
      </LazyWrapper>
    ),
  },
  {
    path: '/reviews/:id',
    element: (
      <LazyWrapper>
        <ReviewForm />
      </LazyWrapper>
    ),
  },
  {
    path: '/articles/edit/:id',
    element: (
      <LazyWrapper>
        <EditArticle />
      </LazyWrapper>
    ),
  },
  {
    path: '/articles',
    element: (
      <LazyWrapper>
        <ArticlesList />
      </LazyWrapper>
    ),
  },
  {
    path: '/journal',
    element: (
      <LazyWrapper>
        <JournalProvider>
          <Journal />
        </JournalProvider>
      </LazyWrapper>
    ),
  },
  {
    path: '/accounts',
    element: (
      <LazyWrapper>
        <TradingAccountsDashboard />
      </LazyWrapper>
    ),
  },
  {
    path: '/traderGenome',
    element: (
      <LazyWrapper>
        <TraderGenome />
      </LazyWrapper>
    ),
  },
  {
    path: '/searchBrokers',
    element: (
      <LazyWrapper>
        <SearchBrokers />
      </LazyWrapper>
    ),
  },
  {
    path: '/exportdata',
    element: (
      <LazyWrapper>
        <ExportDataHtml />
      </LazyWrapper>
    ),
  },
  {
    path: '/brokersComplain',
    element: (
      <LazyWrapper>
        <BrokerComplaintReport />
      </LazyWrapper>
    ),
  },
  {
    path: '/founders',
    element: (
      <LazyWrapper>
        <SearchBrokers type={'founder'} />
      </LazyWrapper>
    ),
  },
  {
    path: '/predictions',
    element: (
      <LazyWrapper>
        <PredictionsPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/test-predictions',
    element: (
      <LazyWrapper>
        <TestPredictions />
      </LazyWrapper>
    ),
  },
  {
    path: '/performance-test',
    element: (
      <LazyWrapper>
        <PerformanceTestPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/integration-test',
    element: (
      <LazyWrapper>
        <IntegrationTest />
      </LazyWrapper>
    ),
  },
];

export default privateRoutes;
