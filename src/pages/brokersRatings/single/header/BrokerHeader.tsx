import { useEffect, useState } from 'react';
import BrokerHeaderGaugeChart from './components/BrokerHeaderGaugeChart';
import BrokerHeaderBusinessNature from './components/BrokerHeaderBusinessNature';
import { isEmptyObject } from '../../../../utils/UtilTools';
import Loader1 from '../../../../component/loader/Loader1.jsx';
import StarRating from '../../StarsRating.tsx';
import BrokerHeaderNetworkInteractions from './components/BrokerHeaderNetworkInteractions';
import ClientsReviews from '../../reviews/ClientsReviews.tsx';
import { useBrokerLogo } from '../../../../hook/useBrokerLogo';
// import getUser from '../../../../utils/getUser.tsx';
// import BrokerLikeAndDislike from './components/BrokerLikeAndDislike.tsx';

export default function BrokerHeader({ broker = {}, pending, sectionRef }: any) {
  const [rating, setRating] = useState(broker?.scoreboard?.stars || 0); // Estado para la puntuación de estrellas
  const [loading, setloading] = useState(false);

  // Use the broker logo hook for robust logo handling
  const { logoSrc, handleError } = useBrokerLogo({
    dbLogo: broker?.generalInformation?.logo || broker?.logo,
    website: broker?.generalInformation?.website,
    partnerLookupStrings: [
      broker?.generalInformation?.brokerName,
      broker?.abbEn,
      broker?.slug,
    ],
    fallback: '/assets/logo_1.png',
  });

  useEffect(() => {
    if (!broker) return setloading(true);
    setloading(false);
  }, [broker]);

  // useEffect para detectar cambios en el valor de las estrellas en broker.scoreboard.stars
  useEffect(() => {
    if (broker?.scoreboard?.stars) {
      setRating(broker.scoreboard.stars); // Actualiza el estado local con el valor del broker
    }
  }, [broker?.scoreboard?.stars]); // Se ejecuta cada vez que cambia broker.scoreboard.stars

  // const handleRatingChange = (newRating: number) => {
  //   setRating(newRating); // Actualiza el estado local cuando se selecciona un nuevo rating
  //   // Aquí puedes agregar la lógica para guardar el nuevo rating en el backend si es necesario
  // };

  function ensureAbsoluteUrl(url: any) {
    if (!url) return url; // retorna si no hay URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // La URL ya es absoluta
    }
    return `https://${url}`; // Asume https y lo añade si falta
  }

  const renderStars = () => {
    if (!broker?.scoreboard || !broker?.scoreboard?.stars) {
      return <p className='text-center text-white text-xl'>No Rating Data</p>;
    }

    return (
      <div
        onClick={() => {
          // setSelect('PARTNERSHIP_SCORE');
          sectionRef.current.scrollIntoView({ behavior: 'smooth' }); // Hacer scroll suave
        }}
        className='flex flex-col-reverse items-center justify-center space-x-1 mb-10 pt-3'
      >
        <span className='text-base text-white'>Partnership Score</span>
        <StarRating rating={rating} />
      </div>
    );
  };

  return (
    <div className='p-3 lg:p-5 mx-2 lg:mx-3 flex relative '>
      <div className='grid grid-cols-1 md:grid-cols-3 md:gap-5 lg:gap-5'>
        {/* Broker left container */}
        <div className='div_entry_3 relative space-y-1 py-5 md:py-0 md:col-span-2  overflow-hidden  border-yellow-400'>
          <div className='flex flex-col  '>
            <div className='flex justify-between relative gap-3 md:gap-0'>
              <div>
                {!loading ? (
                  <div className=' md:w-full md:h-full lg:h-60 lg:w-[15rem] border-96 rounded-xl  shadow-md shadow-[#00FF6A]'>
                    <img
                      className={`mr-3 w-full h-full rounded-xl shadow-lg object-fill `}
                      src={logoSrc}
                      alt='Broker'
                      loading="lazy"
                      onError={handleError}
                    />
                    <div className='absolute -bottom-2 lg:left-0 my-2 md:my-0'>
                      {broker?.generalInformation?.website && (
                        <a
                          href={ensureAbsoluteUrl(broker?.generalInformation?.website)}
                          rel='noopener noreferrer'
                          target='_blank'
                          className='bg-slate-800 text-xs border border-teal-500 hover:bg-slate-700 text-white rounded-lg py-2 px-4 shadow-xl'
                        >
                          See Broker
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`h-36 max-w-72 mr-3 rounded-xl shadow-lg`}>
                    <Loader1 />
                  </div>
                )}
              </div>
              {/* <div className='mt-5 w-1/2'>
                <BrokerLikeAndDislike />
              </div> */}
            </div>

            <div className='flex justify-between mt-5'>
              <h1
                className={`font-bold text-3xl lg:text-[2.3rem] py-1 leading-[2rem] content-center text-white items-center `}
              >
                {broker?.generalInformation?.brokerName ?? '...'}
              </h1>
              <p className='text-[#00FF6A] text-lg flex gap-2 items-center'>
                <span className='text-sm md:text-base font-semibold'>TradeTab Verified</span>
                <span className='bg-[#00FF6A] p-1 rounded-full'>
                  <svg
                    className='w-4 h-4'
                    fill='white' // Changed from 'currentColor' to 'white'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </p>
            </div>
          </div>

          <br />

          {/* <div className='grid md:grid-cols-2 gap-5 md:gap-0  bg-[#0E1629]  py-5 rounded-2xl bg-gradient-to-t from-cyan-700 via-transparent to-transparent border border-cyan-800 hover:border-cyan-500 ease-in-out duration-300'> */}
          <div className='grid md:grid-cols-2 gap-5 md:gap-0  py-4 rounded-2xl bg-gradient-to-t from-slate-900 via-transparent to-transparent ease-in-out duration-300'>
            {/* Broker basic data */}
            <div>
              <BrokerHeaderBusinessNature broker={broker} />
            </div>
            <div>
              <ClientsReviews pending={pending} brokerId={broker._id} />
            </div>
          </div>

          <>{pending && <p className='absolute  bottom-1 right-1'>Under Review</p>}</>
          {/* <div className=' absolute top-14 left-2/3'>
          <BrokerReputation positiveCount={50} negativeCount={44} />
          </div> */}
        </div>

        {/* Broker right container */}
        {/* <div className='div_entry relative flex-1 py-5 flex flex-col h-fit md:col-span-1 rounded-2xl bg-gradient-to-t from-cyan-700 via-transparent to-transparent border border-cyan-800 hover:border-cyan-500 ease-in-out duration-300'> */}
        <div className='div_entry relative flex-1 py-5 flex flex-col h-full md:col-span-1 rounded-2xl bg-gradient-to-t from-slate-800 via-transparent to-transparent  ease-in-out duration-300'>
          <BrokerHeaderNetworkInteractions brokerName={broker?.generalInformation?.brokerName} />

          <div className='px-5 lg:px-3'>
            <BrokerHeaderGaugeChart
              data={isEmptyObject(broker.scoreboard ?? {}) ? {} : broker?.scoreboard}
            />
            <p className='text-sm md:text-base mt-14 mb-8'>
              TradeTab's Broker Score is determined by reviews from actual clients who have
              connected their accounts using the TradeTab platform, along with independent research
              conducted by our team based on the factors stated above. This score reflects both the
              real experiences of traders and our detailed analysis of the broker's services.
            </p>
            <div className='absolute z-10 -bottom-5 md:bottom-14 cursor-pointer w-full flex justify-center'>
              {/* {getUser?.profile?.typeProfile > 2 && renderStars()} */}
              {renderStars()}
            </div>
          </div>
          {/* Estrellas de calificación */}
        </div>

        <div className='space-x-2 mt-1 text-xl absolute bottom-2 left-1  p-1 col-span-12 md:col-span-5'>
          {broker?.generalInformation?.IBLink && (
            <a
              target='_blank'
              href={broker?.generalInformation?.IBLink}
              className='bg-[#14101E] btn hover:bg-slate-700 text-white rounded py-2 px-4 shadow-xl'
            >
              Open Account
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
