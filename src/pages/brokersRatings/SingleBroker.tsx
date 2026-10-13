import { CiGlobe } from 'react-icons/ci';
import { useEffect, useState } from 'react';
import { formaterCamelCase } from '../../utils/formaterCamelCase';
import { Link } from 'react-router-dom';
import StarRating from './StarsRating';
import CustomGaugeChart from '../../component/CustomGaugeChart';
import ReinventedGaugeChart from '../../component/chart/ReinventedGaugeChart';
import { useBrokerLogo } from '../../hook/useBrokerLogo';

export default function SingleBroker({ broker }: any) {
  const [parsedData, setParsedData] = useState([]);

  // Use the broker logo hook for robust logo handling
  const { logoSrc, handleError } = useBrokerLogo({
    dbLogo: broker?.generalInformation?.logo || broker?.logo,
    website: broker?.generalInformation?.website,
    partnerLookupStrings: [
      broker?.generalInformation?.brokerName,
      broker?.abbEn,
      broker?.slug,
    ],
    fallback: '/logo.png',
  });

  useEffect(() => {
    if (broker?.scoreboard) {
      const data = broker?.scoreboard;

      const _parsedData: any = Object.keys(data)
        .map(key => {
          if (key !== 'stars') {
            if (key !== 'overallReview') {
              return {
                label: key,
                value: parseFloat(data[key]) / 100,
              };
            }
          }
          return null;
        })
        .filter(item => item !== null);

      setParsedData(_parsedData);
    }
  }, [broker]);

  return (
    <div className='div_entry_4 relative px-6 py-4 h-auto flex flex-col lg:flex-row bg-slate-900 border border-slate-700 shadow-md rounded-lg items-center mx-auto cursor-pointer transition-all hover:shadow-2xl'>
      {/* Imagen del broker */}
      <Link
        to={`/broker/${broker.slug}`}
        className=' md:h-20 md:w-40 h-32 w-72 rounded-xl mx-2  bg-slate-800 hover:shadow-lg transition-shadow flex items-center justify-center overflow-hidden'
      >
        <img
          className='w-full h-full  object-cover'
          src={logoSrc}
          alt='Broker Logo'
          loading="lazy"
          onError={handleError}
        />
      </Link>

      {/* Información del broker */}
      <div className='flex-grow p-1 m-1 w-full lg:w-1/3'>
        <Link
          to={`/broker/${broker.slug}`}
          className='text-2xl text-green-400 font-semibold flex items-center space-x-2'
        >
          {broker?.abbEn || broker.generalInformation?.brokerName || 'TradeTab Broker'}
        </Link>

        <span className='text-amber-400 opacity-90 text-sm'>
          {broker.scoreboard?.overallReview || 0} / 100 Score
        </span>

        <div className='flex space-x-3 w-full mt-2'>
          <div className='flex items-center bg-slate-200 hover:bg-slate-100 hover:text-green-400 bg-opacity-20 px-2 py-1 rounded font-bold'>
            {/* <CiGlobe className='text-white hover:text-green-400 text-xl' /> */}
            <Link
              className='ml-1 text-white hover:text-green-400'
              // href={broker.website || '#'}
              // href={'https://' + broker.generalInformation.website || '#'}
              to={`/broker/${broker.slug}`}
              // target='_blank'
              // rel='noopener noreferrer'
            >
              {/* Visit Website */}
              See Broker
            </Link>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center space-x-1 w-fit absolute bottom-1 right-2'>
        <span className='text-sm text-white'>Partnership Score:</span>
        <StarRating rating={broker?.scoreboard?.stars} />
      </div>

      {/* Gauge Charts */}
      <div className='flex-grow-0 flex mt-4 w-full whitespace-nowrap'>
        <div className='w-full text-white text-center'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-10'>
            {parsedData.map((item: any, index: number) => (
              <div key={index} className='flex flex-col gap-4 items-center w-32'>
                <CustomGaugeChart item={item} index={index} displayLabel={false} className='' />
                <span className='text-[0.65rem] whitespace-nowrap'>
                  {formaterCamelCase(item.label)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Over-all Chart of this broker */}
      <div className='mt-2 w-full whitespace-nowrap'>
        <ReinventedGaugeChart
          value={
            !isNaN(parseFloat(broker.scoreboard?.overallReview))
              ? broker.scoreboard?.overallReview
              : 10
          }
          maxValue={100}
          size={100}
        />
      </div>

      {/* Botón */}
      <div className='mt-4 mb-5 lg:mt-0 lg:ml-4'>
        <Link
          to={`/broker/${broker.slug}`}
          className=' bg-slate-800 text-white text-center rounded py-2 px-3 text-sm hover:bg-gray-800 transition-all whitespace-nowrap'
        >
          View Score
        </Link>
      </div>
    </div>
  );
}
