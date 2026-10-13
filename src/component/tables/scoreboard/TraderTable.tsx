import ScoreBoardFilter from './ScoreBoardFilters';
import TradersCarousel from '../TradersCarousel';
import { HotTradersCarousel } from './HotTradersCarousel';
import traders from '../../../assets/data/traders';

const tradersData = [
  {
    name: 'eisenbachl',
    avatar: '🇦🇹', // Austria
    country: 'Austria',
    return: '97.08%',
    riskScore: 5,
    copiers: 16,
    copierChange: 0,
    weeklyDD: '-6.68%',
  },
  {
    name: 'mgd1x07',
    avatar: '🇬🇧', // United Kingdom
    country: 'United Kingdom',
    return: '92.86%',
    riskScore: 6,
    copiers: 398,
    copierChange: 5.29,
    weeklyDD: '-8.90%',
  },
  {
    name: 'Chrochtik',
    avatar: '🇨🇿', // Czech Republic
    country: 'Czech Republic',
    return: '92.27%',
    riskScore: 5,
    copiers: 431,
    copierChange: 3.86,
    weeklyDD: '-5.22%',
  },
  {
    name: 'EJimenezMedz',
    avatar: '🇬🇧', // United Kingdom
    country: 'United Kingdom',
    return: '91.78%',
    riskScore: 5,
    copiers: 45,
    copierChange: -10.0,
    weeklyDD: '-7.77%',
  },
  {
    name: 'Smart_Invest0',
    avatar: '🇩🇪', // Germany
    country: 'Germany',
    return: '91.76%',
    riskScore: 6,
    copiers: 55,
    copierChange: 52.78,
    weeklyDD: '-6.64%',
  },
  {
    name: 'LuisFelipeAR',
    avatar: '🇨🇱', // Chile
    country: 'Chile',
    return: '91.67%',
    riskScore: 6,
    copiers: 26,
    copierChange: 62.5,
    weeklyDD: '-8.24%',
  },
  {
    name: 'Pascal29',
    avatar: '🇫🇷', // France
    country: 'France',
    return: '90.24%',
    riskScore: 7,
    copiers: 5,
    copierChange: 66.67,
    weeklyDD: '-10.35%',
  },
  {
    name: 'TradingInvest890',
    avatar: '🇮🇹', // Italy
    country: 'Italy',
    return: '89.25%',
    riskScore: 5,
    copiers: 26,
    copierChange: 0,
    weeklyDD: '-7.75%',
  },
];

const ScoreBoardTable = () => {
  return (
    <div className='p-7'>
      <p className=' text-xl text-teal-500 font-semibold pl-1'>Hot Traders Today 🔥</p>
      <HotTradersCarousel hotTraders={traders} />

      <ScoreBoardFilter />

      <TradersCarousel traders={tradersData} />

      {/* <table className="min-w-full bg-slate-700 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-300 border-b text-emerald-600">
            <tr>
            <th className="p-3 text-sm font-semibold tracking-wide text-left pl-14">People</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Return</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Risk Score</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Copiers</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Copier Change</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Weekly DD</th>
            </tr>
        </thead>
        <tbody>
            {traders.map((trader:any, index:number) => (
            <tr className="border-b hover:bg-teal-600 hover:cursor-pointer" key={index}>
                <td className="p-3 text-sm flex items-center space-x-2">

                <p className=" text-2xl">
                {trader.avatar}

                </p>

                <div>
                    <span className="font-bold">{trader.name}</span>
                    <span className="block text-xs text-gray-500">{trader.country}</span>
                </div>
                </td>
                <td className="p-3 text-xl text-green-500 font-semibold">{trader.return}</td>
                <td className="p-3 text-xl pl-10">{trader.riskScore}</td>
                <td className="p-3 text-xl pl-7">{trader.copiers}</td>
                <td className={`p-3 text-xl pl-12 ${trader.copierChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trader.copierChange}%
                </td>
                <td className="p-3 text-xl pl-7">{trader.weeklyDD}</td>
            </tr>
            ))}
        </tbody>
        </table> */}
    </div>
  );
};

export default ScoreBoardTable;
