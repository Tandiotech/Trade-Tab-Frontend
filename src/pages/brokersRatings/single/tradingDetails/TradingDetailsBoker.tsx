import ClientsReviews from '../../reviews/ClientsReviews';
import ShowList from './components/ShowList';
import IndividualList from './components/IndividualList';
import BrokerSummary from './BrokerSummary';
// import LatestArticles from '../latestArticles/LatestArticles';
// import { MdOutlinePendingActions } from 'react-icons/md';
// import getUser from '../../../../utils/getUser.tsx';

type Props = {
  pending: boolean;
  broker: any;
};

function TradingDetailsBoker({ pending, broker = {} }: Props) {
  return (
    <>
      <div className='flex justify-between w-full  md:px-2 rounded-2xl bg-gradient-to-t mt-2 from-cyan-700 via-transparent to-transparent border border-cyan-800 hover:border-cyan-500 ease-in-out duration-300'>
        <div className='grid md:grid-rows-1 grid-cols-1  gap-5 py-8'>
          <div className='div_entry_4 grid-rows-1 md:col-start-1 space-y-5 h-full text-white'>
            <ul className='space-y-3'>
              {/* Broker Overview */}
              <div className='bg-[#040E18] px-4 py-2 md:p-5 rounded-lg'>
                <h3 className={`font-bold text-xl lg:text-3xl`}>Broker Overview</h3>
                <hr className='h-[2px] opacity-30 bg-[#5EEAD4] mb-5' />

                <BrokerSummary summary={broker.generalInformation?.summaryOfTheBroker} />
              </div>
              {/* Trading Specifications */}
              <div className='bg-[#040E18] px-4 py-2 md:p-5 rounded-lg'>
                <h3 className={`font-bold text-xl lg:text-3xl`}>Trading Specifications</h3>
                <hr className='h-[2px] opacity-30 bg-[#5EEAD4] mb-5' />
                <ShowList data={broker?.generalInformation?.leverage} label={'leverage'} />
                <ShowList data={broker?.lotSizes?.lotSizes} label={'lotSizes'} />
                <IndividualList
                  style={'column2'}
                  data={broker?.tradingDetails?.averageSpreadValuesForMajorPairs}
                  title='Average Spread Across Major FX Pairs: '
                />
                <li className='space-x-2 -flex items-start'>
                  <span className='text-[#5EEAD4] text-base md:text-lg font-semibold whitespace-nowrap'>
                    Minimum Deposit Requirements
                  </span>

                  <span className='text-white'>
                    <div className='flex space-x-1 bg-[#585858] bg-opacity-20 w-fit p-2  rounded-lg px-5 shadow-xl relative group'>
                      {broker?.tradingDetails?.minimumDepositRequirementsForEachAccountType}
                    </div>
                  </span>
                </li>
              </div>
              {/* Platform Information */}
              <div className='bg-[#040E18] px-4 py-2 md:p-5 rounded-lg'>
                <h3 className={`font-bold text-xl lg:text-3xl`}>Platform Information</h3>
                <hr className='h-[2px] opacity-30 bg-[#5EEAD4] mb-5' />
                <ShowList data={broker?.typeAccounts?.typeAccounts} label='typeAccounts' />
                <ShowList data={broker?.platforms?.platforms} label={'platforms'} />
                <IndividualList
                  style='column2'
                  data={broker?.tradingDetails?.mobileAppAvailabilityAndFeatures}
                  title='Mobile App Availability: '
                />
                <ShowList data={broker?.instruments?.instruments} label={'instruments'} />
              </div>
              {/* Payment Methods */}
              <div className='bg-[#040E18] px-4 py-2 md:p-5 rounded-lg'>
                <h3 className={`font-bold text-xl lg:text-3xl`}>Payment Methods</h3>
                <hr className='h-[2px] opacity-30 bg-[#5EEAD4] mb-5' />
                <ShowList data={broker?.paymentMethods?.paymentMethods} label={'paymentMethods'} />
              </div>

              {/* Currency & Languages */}
              <div className='bg-[#040E18] px-4 py-2 md:p-5 rounded-lg'>
                <h3 className={`font-bold text-xl lg:text-3xl`}>Currency & Languages</h3>
                <hr className='h-[2px] opacity-30 bg-[#5EEAD4] mb-5' />

                <ShowList data={broker?.currency?.currency} label={'currency'} />
                <ShowList
                  data={broker?.languagesSupported?.languagesSupported}
                  label='languages Supported'
                />
              </div>
              {/* Sponsor */}
              <div className='bg-[#040E18] px-4 py-2 md:p-5 rounded-lg'>
                <h3 className={`font-bold text-xl lg:text-3xl`}>Sponsor</h3>
                <hr className='h-[2px] opacity-30 bg-[#5EEAD4] mb-5' />
                <ShowList data={broker?.sponsorships?.sponsorships} label='sponsorships' />
              </div>
            </ul>
          </div>

          {/* <div className='div_entry_2 md:col-start-2'>
            <ClientsReviews pending={pending} brokerId={broker._id} />
          </div> */}
        </div>
      </div>

      {/* {pending ? (
        <div className='relative whitespace-nowrap flex ml-14 items-center space-x-2 text-white font-urbanist bg-blue-500 text-base rounded-sm px-1 py-2 font-semibold transform -rotate-3'>
          <MdOutlinePendingActions />
          ARTICLES NOT YET VERIFIED
          <div className='absolute -top-3 -right-4 w-4 h-4 bg-[#2B2935] transform rotate-45 origin-top-left'></div>
        </div>
      ) : (
        <LatestArticles
          brokerId={broker._id}
          isAdmin={getUser?.profile?.typeProfile > 2 ? true : false}
        />
      )}
       */}
    </>
  );
}

export default TradingDetailsBoker;
