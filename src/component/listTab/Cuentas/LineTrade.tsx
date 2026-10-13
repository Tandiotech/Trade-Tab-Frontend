import { SeparadorDecimal } from '../../../utils/SeparadorDecimal';
import TradeSymbolVisualizer from './TradeSymbolVisualizer';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { BiTransfer } from 'react-icons/bi';

interface LineTradeProps {
  positionId?: string | number;
  profit?: number;
  type?: string;
  symbol?: string;
  volume?: number;
  openTime?: string;
  openPrice?: number;
  success?: 'won' | 'lost' | string;
  closePrice?: number;
  marketValue?: number;
  pips?: number;
  closeTime?: string;
  setdisplayCardModal: (data: any) => void;
}

// Type badge component with color coding
const TypeBadge = ({ type }: { type?: string }) => {
  if (!type) return <span className='text-gray-400'>—</span>;

  const normalizedType = type?.toLowerCase();

  // Buy types
  if (normalizedType.includes('buy')) {
    return (
      <div className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/15 border border-green-500/30'>
        <FiArrowUp className='w-3.5 h-3.5 text-green-400' />
        <span className='text-xs font-semibold text-green-300'>BUY</span>
      </div>
    );
  }

  // Sell types
  if (normalizedType.includes('sell')) {
    return (
      <div className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/15 border border-red-500/30'>
        <FiArrowDown className='w-3.5 h-3.5 text-red-400' />
        <span className='text-xs font-semibold text-red-300'>SELL</span>
      </div>
    );
  }

  // Balance/Deposit types
  if (normalizedType.includes('balance') || normalizedType.includes('deposit')) {
    return (
      <div className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/15 border border-blue-500/30'>
        <BiTransfer className='w-3.5 h-3.5 text-blue-400' />
        <span className='text-xs font-semibold text-blue-300'>BAL</span>
      </div>
    );
  }

  // Fallback for unknown types
  return (
    <div className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-500/15 border border-gray-500/30'>
      <span className='text-xs font-semibold text-gray-300'>
        {type.substring(0, 3).toUpperCase()}
      </span>
    </div>
  );
};

export default function LineTrade({
  positionId,
  profit,
  type,
  symbol,
  volume,
  openTime,
  openPrice,
  success,
  closePrice,
  marketValue = 0,
  pips,
  closeTime,
  setdisplayCardModal,
}: LineTradeProps) {
  // Define cell alignment helper
  const getCellAlignment = (index: number): string => {
    // Profit, Volume, Open Price, Close Price should be right-aligned
    if (index === 4 || index === 5 || index === 7 || index === 8) {
      return 'justify-end text-right';
    }
    // Type should be centered
    if (index === 3) {
      return 'justify-center text-center';
    }
    // Others left-aligned
    return 'justify-start text-left';
  };

  const list_trades = [
    positionId,
    // openTime,
    new Date(openTime).toUTCString(),
    <TradeSymbolVisualizer symbol={symbol} key='symbol' />,
    <TypeBadge type={type} key='type' />,
    volume?.toFixed(2) || '—',
    openPrice?.toFixed(2) || '—',
    closeTime || '—',
    closePrice?.toFixed(2) || '—',
    SeparadorDecimal(profit?.toFixed(2)) || '—',
  ];

  // Determine profit/loss badge
  const renderProfitBadge = () => {
    if (success === 'won') {
      return (
        <div className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40'>
          <div className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
          <span className='text-xs font-semibold text-green-300'>WIN</span>
        </div>
      );
    }

    if (success === 'lost') {
      return (
        <div className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40'>
          <div className='w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse' />
          <span className='text-xs font-semibold text-red-300'>LOSS</span>
        </div>
      );
    }

    return (
      <div className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40'>
        <div className='w-1.5 h-1.5 rounded-full bg-blue-400' />
        <span className='text-xs font-semibold text-blue-300'>DEP</span>
      </div>
    );
  };

  return (
    <tr
      onClick={() => setdisplayCardModal({ symbol, pips, marketValue })}
      className='line_account bg-slate-900/50 cursor-pointer hover:bg-teal-700/30 transition-colors duration-200 border-b border-slate-800/50'
    >
      {list_trades.map((item, key) => {
        const isFirst = key === 0;
        const alignment = getCellAlignment(key);

        return (
          <td
            key={key}
            className={`px-4 py-3 xl:px-3 ${isFirst ? 'rounded-l-xl' : ''} ${alignment}`}
          >
            <div className={`font-medium text-white text-sm flex ${alignment}`}>{item}</div>
          </td>
        );
      })}

      <td className='px-4 py-3 xl:px-3 text-center rounded-r-xl'>
        <div className='flex justify-center'>{renderProfitBadge()}</div>
      </td>
    </tr>
  );
}
