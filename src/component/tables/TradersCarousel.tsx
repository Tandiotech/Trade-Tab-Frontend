import { useEffect, useRef } from 'react';

export default function TradersCarousel({ traders }:any) {
  const carouselRef:any = useRef(null);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 3000); // Desplazamiento cada 3 segundos

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="overflow-hidden relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 scrollbar-hide p-4 bg-slate-700 rounded-lg shadow-md"
      >
        {traders.map((trader:any, index:number) => (
          <SingleTraderCard
            key={index}
            trader={trader}
            />
        ))}
      </div>
    </div>
  );
}


const SingleTraderCard = ({ trader }: any) => {
    return (
      <div className="flex-shrink-0 w-64 p-6 bg-gray-800 rounded-lg shadow-lg text-center text-white">
        {/* Avatar */}
        <div className="flex items-center justify-center mb-4">
          <p className="text-5xl">{trader.avatar}</p>
        </div>
        
        {/* Trader's Name and Country */}
        <div className="mb-4">
          <h3 className="text-lg font-bold">{trader.name}</h3>
          <p className="text-sm text-gray-400">{trader.country}</p>
        </div>
        
        {/* Trader's Stats */}
        <div className="flex flex-col items-start text-left space-y-3">
          <div className="flex justify-between w-full">
            <span className="text-xs text-gray-400">Return:</span>
            <span className="text-xl font-semibold text-green-500">{trader.return}</span>
          </div>
          
          <div className="flex justify-between w-full">
            <span className="text-xs text-gray-400">Risk Score:</span>
            <span className="text-lg">{trader.riskScore}</span>
          </div>
          
          <div className="flex justify-between w-full">
            <span className="text-xs text-gray-400">Copiers:</span>
            <span className="text-lg">{trader.copiers}</span>
          </div>
          
          <div className="flex justify-between w-full">
            <span className="text-xs text-gray-400">Copier Change:</span>
            <span className={`text-lg ${trader.copierChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trader.copierChange}%
            </span>
          </div>
          
          <div className="flex justify-between w-full">
            <span className="text-xs text-gray-400">Weekly Drawdown:</span>
            <span className="text-lg">{trader.weeklyDD}</span>
          </div>
        </div>
      </div>
    );
  };
  