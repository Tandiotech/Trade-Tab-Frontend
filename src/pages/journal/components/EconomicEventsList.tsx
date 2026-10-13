import { FaCalendarAlt } from 'react-icons/fa';
import SingleEconomicEvent from './SingleEconomicEvent';

interface EconomicEventsListProps {
  sortedEvents: any[];
  onClose: () => void; // Keeping this for backward compatibility
}

const EconomicEventsList: React.FC<EconomicEventsListProps> = ({ sortedEvents }) => {
  return (
    <div className='w-full'>
      <div className='rounded-xl shadow-xl w-full overflow-auto'>
        {/* Content area */}
        <div className='space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar2'>
          {sortedEvents.map((event: any, idx) => (
            <SingleEconomicEvent key={`${event.date}-${idx}`} event={event.data} />
          ))}

          {sortedEvents.length === 0 && (
            <div className='text-center py-8'>
              <FaCalendarAlt className='mx-auto text-4xl text-gray-600' />
              <p className='text-gray-400 mt-2'>No events scheduled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EconomicEventsList;
