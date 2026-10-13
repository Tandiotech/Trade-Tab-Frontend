import { FaBitcoin, FaEuroSign, FaYenSign } from 'react-icons/fa';
import { GiGoldBar } from 'react-icons/gi';

const TradeSymbolVisualizer = ({ symbol }: { symbol: string }) => {
  const normalizedSymbol = symbol?.replace(/\d|m/g, '').toUpperCase();

  const createIconWithOverlay = (mainIcon: JSX.Element, overlay: string) => (
    <div className='relative flex items-center mr-1'>
      {mainIcon}
      <span className='absolute -bottom-1 -right-2 bg-black text-white text-xs font-bold rounded-full px-1'>
        {overlay}
      </span>
    </div>
  );

  const symbolIcons: Record<string, JSX.Element> = {
    BTCUSD: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<FaBitcoin className='text-yellow-500 text-2xl' />, '🇺🇸')}
        <span className='text-white font-semibold'>BTC/USD</span>
      </div>
    ),
    GOLD: (
      <div className='flex items-center space-x-1'>
        <GiGoldBar className='text-yellow-400 text-2xl' />
        <span className='text-white font-semibold'>GOLD</span>
      </div>
    ),
    EURUSD: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<FaEuroSign className='text-blue-500 text-2xl' />, '🇺🇸')}
        <span className='text-white font-semibold'>EUR/USD</span>
      </div>
    ),
    USDCAD: (
      <div className='flex items-center space-x-1'>
        {/* {createIconWithOverlay(<FaDollarSign className="text-green-500 text-2xl" />, '🇨🇦')} */}
        {createIconWithOverlay(<span className='text-3xl font-bold'>{'🇺🇸'}</span>, '🇨🇦')}
        <span className='text-white font-semibold'>USD/CAD</span>
      </div>
    ),
    GBPUSD: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<span className='text-xl font-bold'>£</span>, '🇺🇸')}
        <span className='text-white font-semibold'>GBP/USD</span>
      </div>
    ),
    USDJPY: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<FaYenSign className='text-purple-500 text-2xl' />, '🇯🇵')}
        <span className='text-white font-semibold'>USD/JPY</span>
      </div>
    ),
    AUDUSD: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<span className='text-2xl font-bold'>A$</span>, '🇺🇸')}
        <span className='text-white font-semibold'>AUD/USD</span>
      </div>
    ),
    NZDUSD: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<span className='text-2xl font-bold'>NZ$</span>, '🇺🇸')}
        <span className='text-white font-semibold'>NZD/USD</span>
      </div>
    ),
    USDCHF: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<span className='text-2xl font-bold'>CHF</span>, '🇨🇭')}
        <span className='text-white font-semibold'>USD/CHF</span>
      </div>
    ),
    EURGBP: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<FaEuroSign className='text-blue-400 text-2xl' />, '🇬🇧')}
        <span className='text-white font-semibold'>EUR/GBP</span>
      </div>
    ),
    EURJPY: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<FaEuroSign className='text-blue-400 text-2xl' />, '🇯🇵')}
        <span className='text-white font-semibold'>EUR/JPY</span>
      </div>
    ),
    GBPCAD: (
      <div className='flex items-center space-x-1'>
        {createIconWithOverlay(<span className='text-2xl font-bold'>£</span>, '🇨🇦')}
        <span className='text-white font-semibold'>GBP/CAD</span>
      </div>
    ),
  };

  return (
    <div className='flex items-center space-x-2'>
      {symbolIcons[normalizedSymbol] ?? (
        <span className='text-white text-lg font-semibold'>{symbol}</span>
      )}
    </div>
  );
};

export default TradeSymbolVisualizer;
