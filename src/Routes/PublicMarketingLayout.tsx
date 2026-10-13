import type { ReactNode } from 'react';
import '../pages/shared/TradeTabDesign.css';
import LandingNavbar from '../pages/welcome/sections/LandingNavbar';
import MarketingFooter from '../pages/welcome/sections/MarketingFooter';

type PublicMarketingLayoutProps = {
  children: ReactNode;
  /** When false, footer is omitted (e.g. pages that bring their own footer). */
  showFooter?: boolean;
};

export default function PublicMarketingLayout({
  children,
  showFooter = true,
}: PublicMarketingLayoutProps) {
  return (
    <div className='tt-theme relative min-h-screen overflow-x-hidden'>
      <LandingNavbar />
      <div className='pt-24'>{children}</div>
      {showFooter ? <MarketingFooter /> : null}
    </div>
  );
}
