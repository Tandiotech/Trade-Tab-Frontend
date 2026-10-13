import { useState } from 'react';
import EconomicEventModal from './EconomicEventModal';
import AnimatedText from '@/component/AnimateText';

interface EconomicEventDetailProps {
  event: string;
  date: string;
  importance: string;
  impactProbability: number;
  dayNumber: number;
  onClose: () => void;
}

const EconomicEventDetail: React.FC<EconomicEventDetailProps> = ({
  event,
  date,
  importance,
  impactProbability,
  onClose,
  dayNumber,
}) => {
  const [showLargeModal, setShowLargeModal] = useState(false);

  return (
    <div
      onClick={e => {
        e.stopPropagation();
        setShowLargeModal(true);
      }}
      className='absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center p-1 rounded-lg text-white'
    >
      {/* Modal expandido */}
      {showLargeModal && (
        <EconomicEventModal
          event={event}
          date={date}
          importance={importance}
          impactProbability={impactProbability}
          onClose={(e: any) => {
            e.stopPropagation();
            setShowLargeModal(false);
          }}
        />
      )}

      {/* Cerrar el modal */}
      <button
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
        className='absolute top-0 right-1 text-gray-200 hover:text-white text-sm z-10'
      >
        ✕
      </button>

      {/* Fecha del evento */}
      <p className='text-xs pt-2 text-start w-full opacity-90'>
        <span>{dayNumber}</span>
        {/* Importancia */}
        <span className='pl-1'>{importance}</span>
      </p>

      {/* 🔥 Mostrar el nombre del evento de forma destacada */}
      <p
        className='text-xs font-semibold text-center px-2 text-teal-300 truncate overflow-auto w-11/12'
        title={event}
      >
        {event}
      </p>

      {/* 🔥 Hacer que "More" sea más claro */}
      <AnimatedText
        value='View Details'
        textSize='text-xs underline cursor-pointer mt-1'
        fromColor='from-green-400 hover:from-teal-400 hover:to-indigo-500'
      />

      {/* Probabilidad de impacto con barra de color */}
      <div className='flex flex-col items-center w-full mt-2'>
        <span className='text-[10px] opacity-80 hidden md:block whitespace-pre-wrap text-center'>
          Probability of market impact
        </span>
        <div className='w-full bg-gray-700 rounded-full h-2 mt-1 relative'>
          <div
            className={`h-2 rounded-full ${
              impactProbability > 70
                ? 'bg-red-500'
                : impactProbability > 40
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${impactProbability}%` }}
          ></div>
        </div>
        <strong className='text-end w-full text-xs -mt-3 z-10 '>{impactProbability}%</strong>
      </div>
    </div>
  );
};

export default EconomicEventDetail;
