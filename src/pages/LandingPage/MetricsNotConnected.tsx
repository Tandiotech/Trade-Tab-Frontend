import { Helmet } from 'react-helmet-async';
import { MetricsLandingHero } from './metricsLanding/MetricsLandingHero';
import { MetricsPublicDemo } from './metricsLanding/MetricsPublicDemo';
import { MetricsLandingFeatures } from './metricsLanding/MetricsLandingFeatures';
import MarketingFinalCta from '@/pages/welcome/sections/MarketingFinalCta';

export default function MetricsNotConnected() {
  return (
    <>
      <Helmet prioritizeSeoTags>
        <meta
          name='description'
          content='Explore TradeTab metrics: 30+ performance KPIs, period filtering, and a dynamic trader chart. Try the live dashboard demo, then connect your broker free.'
        />
        <meta property='og:type' content='website' />
        <title>Metrics Dashboard · TradeTab</title>
        <link rel='canonical' href='https://tradetab.com/metrics' />
        <meta
          property='og:title'
          content='Metrics Dashboard · TradeTab — performance analytics for traders'
        />
      </Helmet>

      <MetricsLandingHero />
      <MetricsPublicDemo />
      <MetricsLandingFeatures />
      <MarketingFinalCta
        title='Replace sample data with live metrics'
        description='Connect your broker in minutes and see win rate, drawdown, and 30+ KPIs update in real time.'
      />
    </>
  );
}
