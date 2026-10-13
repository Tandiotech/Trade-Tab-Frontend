// CardData.tsx
import { SeparadorDecimal } from '../../utils/SeparadorDecimal';
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { MdOutlineAttachMoney } from 'react-icons/md';
import Loading2 from '../loader/Loading2/Loading2';
import { informationAboutComponents } from '../../utils/informationAboutComponents';
import { ReactNode } from 'react';

const colorRba = '201,125,10';
const _size = 30;

const icons = {
  trendingUp: <FiTrendingUp color={`rgb(${colorRba})`} size={_size} />,
  trendingDown: <FiTrendingDown color={`rgb(${colorRba})`} size={_size} />,
  money: <MdOutlineAttachMoney color={`rgb(${colorRba})`} size={_size} />,
};

interface CardDataItem {
  title: string;
  value: string | ReactNode;
  icon: ReactNode;
  id: string;
  chart?: boolean;
  dna?: boolean;
  info?: string;
  colorClass: string;
  iconBg: string;
}

function generateCardData(
  balance?: number | string | ReactNode,
  averageWin?: number,
  account_currency?: string,
  _averageGrowth?: number,
  floatingPnL?: number | null,
  _equity?: number | string | ReactNode,
  _equityLabel?: string,
  _averageProfitLoss?: number,
  _averageBalance?: number,
  _accountData?: any,
  _accountStats?: any,
  _highestBalance?: number,
  showData?: boolean,
  averageWinPips?: number,
  averageLossPips?: number,
  riskReward?: number
): CardDataItem[] {
  // Safely handle riskReward conversion to number
  const safeRiskReward =
    typeof riskReward === 'number' ? riskReward : parseFloat(String(riskReward || '0'));
  const hasValidRiskReward = !isNaN(safeRiskReward) && safeRiskReward > 0;

  const calculatedRiskReward = hasValidRiskReward
    ? safeRiskReward.toFixed(2)
    : averageWinPips && averageLossPips && averageLossPips < 0
      ? (averageWinPips / (averageLossPips * -1)).toFixed(2)
      : '1.00';

  const cards: CardDataItem[] = [
    {
      title: 'Balance',
      value: showData ? (
        (SeparadorDecimal(balance) ?? <Loading2 />)
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>****</span>
      ),
      icon: icons.trendingUp,
      id: 'totalEarn',
      chart: true,
      info: informationAboutComponents.accountBalance,
      colorClass: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
    },
    {
      title: 'Risk Reward',
      value: `1:${calculatedRiskReward}`,
      icon: icons.money,
      id: 'riskreward',
      dna: false,
      chart: false,
      info: informationAboutComponents.riskReward,
      colorClass: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
    },
    {
      title: 'Currency',
      value: showData && account_currency ? SeparadorDecimal(account_currency) : 'USD',
      icon: icons.money,
      id: 'currency',
      chart: false,
      info: informationAboutComponents.mainCurrency,
      colorClass: 'text-teal-400',
      iconBg: 'bg-teal-500/10',
    },
  ];

  if (floatingPnL !== undefined && floatingPnL !== null) {
    cards.push({
      title: 'Floating PnL',
      value: showData ? (
        (floatingPnL ?? <Loading2 />)
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>****</span>
      ),
      icon: icons.trendingUp,
      id: 'floatingPnL',
      chart: true,
      info: 'Real-time profit and loss from open positions',
      colorClass: 'text-green-400',
      iconBg: 'bg-green-500/10',
    });
  } else {
    cards.push({
      title: 'Average Win',
      value: averageWin ? (
        (averageWin.toFixed(2) ?? <Loading2 />)
      ) : (
        <span className='text-xl text-success-300 flex items-center top-1 relative'>****</span>
      ),
      icon: icons.trendingUp,
      id: 'averageWin',
      chart: true,
      info: 'Average amount won per winning trade',
      colorClass: 'text-green-400',
      iconBg: 'bg-green-500/10',
    });
  }

  return cards;
}

export { generateCardData };
// export type { CardDataItem };
