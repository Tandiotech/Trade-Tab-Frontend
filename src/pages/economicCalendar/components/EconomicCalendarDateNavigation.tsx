import { IoCalendarOutline, IoFilterSharp, IoTime, IoTrendingUp, IoStatsChart } from 'react-icons/io5';
import { BiCalendar, BiCalendarCheck, BiCalendarX } from 'react-icons/bi';

export default function EconomicCalendarDateNavigation({
    activeFilter,
    setActiveFilter
}:{
    activeFilter: string,
    setActiveFilter: (filter: string) => void
}) {
  const filterOptions = [
    { key: 'today', label: 'Today', icon: BiCalendarCheck, color: 'from-teal-500 to-teal-600' },
    { key: 'yesterday', label: 'Yesterday', icon: BiCalendar, color: 'from-blue-500 to-blue-600' },
    { key: 'tomorrow', label: 'Tomorrow', icon: BiCalendar, color: 'from-purple-500 to-purple-600' },
    { key: 'thisWeek', label: 'This Week', icon: IoStatsChart, color: 'from-orange-500 to-orange-600' },
    { key: 'nextWeek', label: 'Next Week', icon: IoTrendingUp, color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className='mb-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg'>
            <IoTime className='text-white text-lg' />
          </div>
          <div>
            <h3 className='text-white font-semibold'>Time Period</h3>
            <p className='text-gray-400 text-sm'>Select your preferred date range</p>
          </div>
        </div>
        
        <div className='flex items-center gap-2'>
          <button className='flex items-center gap-2 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 px-4 py-2 rounded-lg text-white transition-all duration-200 border border-gray-600/50'>
            <IoCalendarOutline className='text-lg' />
            <span className='text-sm font-medium'>Custom Date</span>
          </button>
          <button className='p-2 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg text-white transition-all duration-200 border border-gray-600/50'>
            <IoFilterSharp className='text-lg' />
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
        {filterOptions.map((option) => {
          const IconComponent = option.icon;
          const isActive = activeFilter === option.key;
          
          return (
            <button
              key={option.key}
              onClick={() => setActiveFilter(option.key)}
              className={`group relative p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                isActive
                  ? `bg-gradient-to-br ${option.color} border-transparent text-white shadow-lg shadow-gray-900/20`
                  : 'bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-700/50 text-gray-300 hover:border-gray-600/50 hover:bg-gray-700/50'
              }`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
              
              <div className='relative z-10 flex flex-col items-center gap-2'>
                <IconComponent className={`text-xl ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                  {option.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className='absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg'></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className='mt-6 grid grid-cols-3 gap-4'>
        <div className='bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg p-3'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-red-400 rounded-full'></div>
            <div>
              <p className='text-red-400 text-xs font-medium'>High Impact</p>
              <p className='text-white text-sm font-bold'>3 Events</p>
            </div>
          </div>
        </div>
        
        {/* <div className='bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-3'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
            <div>
              <p className='text-yellow-400 text-xs font-medium'>Medium Impact</p>
              <p className='text-white text-sm font-bold'>7 Events</p>
            </div>
          </div>
        </div> */}
        
        <div className='bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-3'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
            <div>
              <p className='text-green-400 text-xs font-medium'>Low Impact</p>
              <p className='text-white text-sm font-bold'>12 Events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
