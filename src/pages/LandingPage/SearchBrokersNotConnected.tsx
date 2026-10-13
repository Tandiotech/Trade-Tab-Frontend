import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import AnimatedText from '../../component/AnimateText';
// import { FooterAffiliate } from '../affiliate/sections/footer';
import SingleBroker from '../brokersRatings/SingleBroker';
import { BACKEND_URL } from '../../utils/GlobalVars';
import BrokerCatalog from '../brokersRatings/catalog/BrokersCatalog';
import FooterGuest from '../welcome/sections/FooterGuest';
import { FaCheckCircle, FaSearch, FaTimes } from 'react-icons/fa';

const SearchBrokersNotConnected: React.FC = () => {
  const [brokersList, setBrokersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brokersMessage, setBrokersMessage] = useState('No results for this search');

  // Ref para almacenar el timeoutId del debounce
  const debounceTimeoutRef = useRef<any>(null);

  const cleanSearchTerm = (term: string) => term.trim().toLowerCase().replace(/\s+/g, '-');

  // Función que ejecuta la búsqueda de brokers
  const fetchBrokers = async (term: string) => {
    if (!term) {
      // setBrokersMessage('No results for this search');
      setBrokersList([]);
      return;
    }
    try {
      const response = await axios.get(
        `${BACKEND_URL}brokers/search?name=${encodeURIComponent(term)}`
      );
      if (response.data.brokers.length === 0) {
        setBrokersMessage('No results for this search');
      }
      setBrokersList(response.data.brokers || []);
    } catch (error) {
      console.error('Error searching brokers:', error);
      setBrokersList([]);
    }
  };

  // Manejar el cambio del campo de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBrokersMessage('Loading Brokers');
    setSearchTerm(value);

    // Limpiar el timeout anterior para evitar múltiples solicitudes
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Aplicar debounce para ejecutar la búsqueda después de 500ms
    debounceTimeoutRef.current = setTimeout(() => {
      const cleanedTerm = cleanSearchTerm(value);
      fetchBrokers(cleanedTerm);
    }, 500); // Cambia el tiempo de debounce según tus necesidades
  };

  return (
    <main>
      <Helmet prioritizeSeoTags>
        <meta
          name='description'
          content='View the score of +1500 Forex Brokers left by its active clients.'
        />
        <meta property='og:type' content='website' />
        <title>Search</title>
        <link rel='canonical' href='https://tradetab.com/brokers' />
        <meta
          property='og:title'
          content='View the score of +1,200 Forex Brokers left by its active clients.'
        />
      </Helmet>

      <div className='max-w-4xl mx-auto px-4 mb-14 mt-24'>
        {/* Main search container */}
        <div className='relative bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg shadow-slate-900/30 transition-all duration-200 focus-within:border-teal-500/50 focus-within:shadow-teal-500/5'>
          <div className='flex items-center px-5 sm:px-6 py-4 sm:py-5'>
            {/* Search Icon */}
            <div className='flex-shrink-0 mr-4'>
              <div className='p-2 rounded-lg bg-slate-700/30 border border-slate-600/40 transition-all duration-200 focus-within:bg-teal-500/10 focus-within:border-teal-500/30'>
                <FaSearch className='text-slate-400 text-lg sm:text-xl transition-colors duration-200 focus-within:text-teal-400' />
              </div>
            </div>
            
            {/* Input Field */}
            <input
              type='search'
              className='flex-1 bg-transparent text-white placeholder-gray-500 placeholder:text-base sm:placeholder:text-lg text-lg sm:text-xl focus:outline-none focus:ring-0 font-medium tracking-wide'
              placeholder='Search for a Broker'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            
            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='flex-shrink-0 ml-3 p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-slate-700/30 transition-colors duration-150'
                aria-label='Clear search'
              >
                <FaTimes className='text-lg sm:text-xl' />
              </button>
            )}
          </div>
          
          {/* Bottom accent line - only on focus */}
          <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0 opacity-0 focus-within:opacity-100 transition-opacity duration-200' />
        </div>
      </div>

      {searchTerm.trim() === '' ? (
        <>
          <BrokerCatalog />
          <div className='max-w-2xl mx-auto my-8 bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-slate-900/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/30 border border-slate-700/50'>
            <ul className='space-y-4 sm:space-y-5'>
              <li className='flex items-start gap-4'>
                <div className='flex-shrink-0 p-2 rounded-lg bg-teal-500/10 border border-teal-500/20'>
                  <FaCheckCircle className='text-teal-400 text-lg sm:text-xl' />
                </div>
                <span className='text-gray-200 text-base sm:text-lg leading-relaxed pt-0.5'>
                  All reviews and scores are based exclusively on actual traders who have linked
                  their accounts to their respective brokers.
                </span>
              </li>

              <li className='flex items-start gap-4'>
                <div className='flex-shrink-0 p-2 rounded-lg bg-teal-500/10 border border-teal-500/20'>
                  <FaCheckCircle className='text-teal-400 text-lg sm:text-xl' />
                </div>
                <span className='text-gray-200 text-base sm:text-lg leading-relaxed pt-0.5'>
                  Our findings are further enhanced by our own research.
                </span>
              </li>
            </ul>
          </div>
          <div className='bg-slate-100 bg-opacity-80 rounded-t-lg'>
            {/* <FooterAffiliate /> */}
            <FooterGuest />
          </div>
        </>
      ) : (
        <div className='w-full min-h-screen'>
          <h1 className='text-xl font-bold mb-1 text-native-100'>Results</h1>
          {/* {brokersList.length === 0 && (
            <AnimatedText value={'No results for this search'} textSize='text-3xl pl-14 pt-10' />
          )} */}
          {brokersList.length == 0 && (
            <>
              <AnimatedText value={brokersMessage} textSize='text-3xl pl-14 pt-10' />
            </>
          )}
          <div className='space-y-1 p-1'>
            {brokersList.map((broker: any, index) => (
              // broker.generalInformation?.logo &&
              <SingleBroker key={index} broker={broker} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default SearchBrokersNotConnected;
