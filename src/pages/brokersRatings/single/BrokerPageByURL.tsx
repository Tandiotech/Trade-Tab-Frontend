import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TradingDetailsBoker from './tradingDetails/TradingDetailsBoker';
import BrokerReviews from '../BrokerReviews';
import ContactBroker from '../contact/ContactBroker';
import ProsVsCons from '../subMenu/ProsVsCons';
import Affiliate from '../../affiliate/Affiliate';
import getUser from '../../../utils/getUser';
import { BACKEND_URL } from '../../../utils/GlobalVars';
import Forum from '../../forum/Forum.tsx';
import WeAreImportingYourBrokerData from '../../../component/WeAreImportingYourBrokerData.tsx';
import ErrorFetchingBrokerData from './ErrorFetchingBrokerData.tsx';
import RiskDisclaimer from './Disclaimer.tsx';
import BrokerHeaderBusinessNature from './header/components/BrokerHeaderBusinessNature';
import ClientsReviews from '../reviews/ClientsReviews';
import {
  BrokerDetailBreadcrumb,
  BrokerDetailHero,
  BrokerDetailScorePanel,
  BrokerDetailSideColumn,
  BrokerDetailStatsStrip,
  BrokerDetailTrustBanner,
} from './BrokerDetailShell';
import '@/pages/shared/TradeTabDesign.css';
import './broker-detail-page.css';

const TAB_DEFS: { id: string; label: string }[] = [
  { id: 'TRADING DETAILS', label: 'Trading' },
  { id: 'SERVICES', label: 'Services' },
  { id: 'PARTNERSHIP_SCORE', label: 'Partnership' },
  { id: 'PROSVSCONS', label: 'Pros & cons' },
  { id: 'REVIEWS', label: 'Reviews' },
  { id: 'FORUM', label: 'Forum' },
];

const BrokerPageByURL = () => {
  const { name } = useParams();
  const [broker, setBroker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [select, setSelect] = useState('TRADING DETAILS');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setBroker(null);
    const slug = name ?? '';
    const fetchBroker = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}brokers?name=${encodeURIComponent(slug)}`);

        if (response.data) {
          setBroker(response.data.broker);
        } else {
          throw new Error('Broker not found');
        }
      } catch (err) {
        setError(true);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };
    fetchBroker();
  }, [name]);

  const guestShellPad = Object.keys(getUser ?? {}).length > 0 ? '' : 'pt-20 md:pt-24';

  if (error) {
    return (
      <div
        className={`tt-theme min-h-screen w-full overflow-x-hidden bg-[#0a0e1a] text-slate-100 antialiased ${guestShellPad}`}
      >
        <div className='pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_60%_at_50%_-15%,rgba(45,212,191,0.07),transparent_50%)]' />
        <div className='mx-auto w-full max-w-[1320px] px-3 sm:px-5 lg:px-6 py-8'>
          <ErrorFetchingBrokerData brokerName={name} userName={getUser?.userName} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`tt-theme broker-page-by-url min-h-screen w-full overflow-x-hidden bg-[#0a0e1a] text-slate-100 antialiased ${guestShellPad}`}
    >
      <div
        className='pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_55%_at_50%_-18%,rgba(45,212,191,0.08),transparent_52%),linear-gradient(180deg,#0c1122_0%,#0a0e1a_45%)]'
        aria-hidden
      />

      <div className='broker-detail-scope'>
        <div className='mx-auto w-full max-w-[1320px] px-3 sm:px-4 lg:px-6 pb-16 bd-main'>
          {loading ? (
            <WeAreImportingYourBrokerData loading={loading} />
          ) : (
            broker && (
              <>
                <BrokerDetailBreadcrumb brokerName={broker?.generalInformation?.brokerName} />
                <BrokerDetailTrustBanner broker={broker} />
                <BrokerDetailHero broker={broker} />
                <BrokerDetailStatsStrip broker={broker} />
                <BrokerDetailScorePanel broker={broker} />

                <section className='bd-body'>
                  <div className='bd-body-main' ref={sectionRef}>
                    <div className='bd-tabbar' role='tablist'>
                      {TAB_DEFS.map(td => (
                        <button
                          key={td.id}
                          type='button'
                          role='tab'
                          aria-selected={select === td.id}
                          className={`bd-tab${select === td.id ? ' bd-tab--active' : ''}`}
                          onClick={() => setSelect(td.id)}
                        >
                          {td.label}
                        </button>
                      ))}
                    </div>

                    <div className='bd-panel bd-tabpanel'>
                      {select === 'TRADING DETAILS' && (
                        <>
                          <div className='mb-8 grid gap-6 md:grid-cols-2'>
                            <BrokerHeaderBusinessNature broker={broker} />
                            <ClientsReviews pending={false} brokerId={broker._id} />
                          </div>
                          <TradingDetailsBoker pending={false} broker={broker} />
                        </>
                      )}
                      {select === 'SERVICES' && <ContactBroker />}
                      {select === 'PARTNERSHIP_SCORE' && <Affiliate broker={broker} />}
                      {select === 'PROSVSCONS' && <ProsVsCons data={broker?.prosAndCons} />}
                      {select === 'REVIEWS' && <BrokerReviews broker={broker._id} />}
                      {select === 'FORUM' && <Forum brokerId={broker._id} />}
                    </div>
                  </div>

                  <div className='bd-body-side'>
                    <BrokerDetailSideColumn broker={broker} />
                  </div>
                </section>
              </>
            )
          )}

          {name === 'fxcm' && !loading && broker && <RiskDisclaimer />}
        </div>
      </div>
    </div>
  );
};

export default BrokerPageByURL;
