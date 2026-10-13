import { Helmet } from 'react-helmet-async';
// import { Benefits } from './sections/benefits';
// import { Commissions } from './sections/commissions';
import { FaqsAffiliate } from './sections/faqs';
// import { Features } from './sections/features';
import { FooterAffiliate } from './sections/footer';
// import { Hero } from './sections/hero';
import CPABrokerComponent from '../cpa/CPABrokerComponent';
import { useEffect } from 'react';
// import { Insights } from './sections/insights';
// import { Rates } from './sections/rates';
// import { Secure } from './sections/secure';
// import { Traders } from './sections/traders';
// import NavigationAffiliate from './sections/navigation';

export default function Affiliate({broker}:any) {

  useEffect(() => {
  }, [])
  
  return (
    <div className='bg-white min-h-screen'>
      {/* <NavigationAffiliate /> */}
      <Helmet prioritizeSeoTags>
        <meta name='description' content='Register.' />
        <meta property='og:type' content='website' />
        <title>Affiliate</title>
        <link rel='canonical' href='https://tradetab.com/affiliate' />
        <meta property='og:title' content='Affiliates of TradeTab' />
      </Helmet>
      
      {/* <Hero logo={broker.generalInformation.logo}/> */}

      <CPABrokerComponent />
      {/* <Benefits /> */}
      {/* <Insights /> */}
      {/* <Secure /> */}
      {/* <Features /> */}
      {/* <Traders /> */}
      {/* <Commissions /> */}
      {/* <Rates /> */}
      <FaqsAffiliate />
      <FooterAffiliate />
    </div>
  );
}
