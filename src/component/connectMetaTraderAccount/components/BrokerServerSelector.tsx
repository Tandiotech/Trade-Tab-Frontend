import MetaTraderHelp from '../../MetaTraderHelp';
import { SelectBrokerServerProps } from '../interfaces';
import { isLikelyBrokerServerName } from '@/utils/isLikelyBrokerServerName';
import useBrokerServerSelector from '../hooks/useBrokerServerSelector';
import { PiSealCheckLight } from 'react-icons/pi';

export default function BrokerServerSelect({
  setSelectedServer,
  mt_version,
  setSearchTerm,
  searchTerm,
}: SelectBrokerServerProps) {
  
  const {
    showList,
    isModalOpen,
    setIsModalOpen,
    filteredBrokers,
    handleInputChange,
    handleOptionClick,
    inputRef,
    loading,
    error,
  } = useBrokerServerSelector(setSearchTerm, searchTerm, mt_version, setSelectedServer);

  return (

    <div className='relative mb-4' ref={inputRef}>
      <label className='text-[11px] font-medium text-gray-400 tracking-wider uppercase flex items-center gap-1.5 mb-2'>
        Broker Server
      </label>

      <input
        className='border border-gray-700/50 bg-darkblack-600 text-white rounded-lg p-3 w-full text-[13px] placeholder:text-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200'
        value={searchTerm}
        onChange={handleInputChange}
        onClick={() => isModalOpen && setIsModalOpen(false)}
        placeholder='Search or type broker server...'
        type='search'
        autoComplete='off'
        name='mt-broker-search'
        data-form-type='other'
        data-lpignore='true'
        data-1p-ignore='true'
      />

      <div className='text-[11px] text-gray-500 mt-1.5 flex items-center gap-1'>
        <div className='w-3 h-3 flex items-center justify-center bg-gray-700/50 rounded-full text-[9px]'>?</div>
        Found in MT4/MT5 under File → Open an Account
      </div>

      {loading && (
        <p className='mt-2 bg-darkblack-600 border border-gray-700 text-gray-300 px-3 py-2 rounded-lg shadow-lg text-[11px]'>
          Loading brokers...
        </p>
      )}

      {error && <p className='text-red-400 text-[11px] mt-1.5'>{error}</p>}

      {showList && !loading && (
        <ul className='w-full bg-darkblack-600 border border-gray-700 rounded-lg mt-2 max-h-48 overflow-auto shadow-xl'>
          {filteredBrokers.length ? (
            filteredBrokers.map(broker => (
              <li
                key={broker.id}
                className='px-3 py-2 text-[12px] text-gray-300 cursor-pointer hover:bg-darkblack-500 hover:text-white transition-colors duration-100 flex items-center gap-2'
                onClick={() => handleOptionClick(broker.name)}
              >
                <div className='w-5 h-5 bg-darkblack-700 rounded flex items-center justify-center text-[10px] text-teal-400 font-bold flex-shrink-0'>
                  {broker.name.substring(0, 2).toUpperCase()}
                </div>
                {broker.name}
              </li>
            ))
          ) : isLikelyBrokerServerName(searchTerm) ? (
            <li className='p-3 text-center text-[11px] text-gray-400'>
              <div className='flex items-center justify-center gap-1.5 mb-2'>
                <span>Looks like a <strong>legitimate</strong> server.</span>
                <PiSealCheckLight color={'#4ade80'} />
              </div>
              <button
                className='text-teal-400 hover:text-teal-300 underline transition-colors'
                onClick={() => setSelectedServer(searchTerm)}
              >
                Connect using this server
              </button>
            </li>
          ) : (
            <li className='p-3 text-center text-[11px] text-gray-400'>
              <div className='mb-2'>No matching broker server found.</div>
              <button
                className='text-teal-400 hover:text-teal-300 underline transition-colors'
                onClick={() => setIsModalOpen(true)}
              >
                Request a new broker server
              </button>
            </li>
          )}
        </ul>
      )}

      {isModalOpen && (
        <MetaTraderHelp
          value={searchTerm}
          mt_version={mt_version}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
