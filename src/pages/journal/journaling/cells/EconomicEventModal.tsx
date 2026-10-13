import { useEffect } from 'react';

interface EconomicEventModalProps {
  event: string;
  date: string;
  importance: '🔴' | '🟠' | '🟢';
  impactProbability: number;
  onClose: () => void;
}

const EconomicEventModal: React.FC<EconomicEventModalProps> = ({
  event,
  date,
  importance,
  impactProbability,
  onClose,
}) => {
  const importanceDetails = {
    '🔴': { label: 'High', color: 'bg-red-500' },
    '🟠': { label: 'Medium', color: 'bg-yellow-500 text-black' },
    '🟢': { label: 'Low', color: 'bg-green-500' },
  };

  // const { label, color } = importanceDetails[importance];
  const fallback = { label: 'Medium', color: 'bg-yellow-500 text-black' };
  const { label, color } = importanceDetails[importance] || fallback;

  
  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000] p-4 animate-fadeIn'
      onClick={onClose}
    >
      <div
        className='relative bg-darkblack-800 rounded-xl shadow-xl overflow-auto max-h-[85vh] w-full max-w-6xl'
        onClick={e => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-white transition'
        >
          ✕
        </button>

        <div className='p-6 text-white flex flex-col gap-4'>
          {/* Event Title (Dynamic Handling for Long Titles) */}
          <div className='flex items-start gap-3'>
            <span className='text-2xl md:text-3xl font-bold text-teal-400 flex-shrink-0'>📅</span>
            <h2 className='text-lg md:text-2xl font-bold flex-1 whitespace-pre-wrap'>{event}</h2>
          </div>

          {/* Event Date */}
          <p className='text-gray-400 text-sm md:text-base'>
            {new Date(date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {/* Importance & Impact Probability */}
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <span className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold ${color}`}>
              {label} Importance
            </span>

            <div className='flex-1 w-full md:max-w-md'>
              <div className='flex justify-between mb-1'>
                <span className='font-semibold text-sm'>Impact Probability</span>
                <span className='font-semibold text-sm'>{impactProbability}%</span>
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-width duration-500 ease-out ${
                    impactProbability > 70
                      ? 'bg-red-500'
                      : impactProbability > 40
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${impactProbability}%` }}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className='border-t border-gray-700' />

          {/* Additional Information */}
          <p className='text-sm md:text-base leading-relaxed whitespace-pre-wrap'>
            This event may significantly influence market volatility. Careful analysis and risk
            management are advised.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EconomicEventModal;
