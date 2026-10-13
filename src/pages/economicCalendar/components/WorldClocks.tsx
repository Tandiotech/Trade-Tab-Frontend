import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoTime, IoGlobe } from 'react-icons/io5';

interface ClockData {
  city: string;
  timezone: string;
  flag: string;
  isActive: boolean;
  session: 'open' | 'closed' | 'pre-market' | 'post-market';
}

const WorldClocks: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Major trading cities with their timezones and flags
  const tradingCities: ClockData[] = [
    {
      city: 'New York',
      timezone: 'America/New_York',
      flag: '🇺🇸',
      isActive: true,
      session: 'open',
    },
    {
      city: 'London',
      timezone: 'Europe/London',
      flag: '🇬🇧',
      isActive: true,
      session: 'open',
    },
    {
      city: 'Tokyo',
      timezone: 'Asia/Tokyo',
      flag: '🇯🇵',
      isActive: true,
      session: 'open',
    },
    {
      city: 'Sydney',
      timezone: 'Australia/Sydney',
      flag: '🇦🇺',
      isActive: true,
      session: 'open',
    },
    {
      city: 'Frankfurt',
      timezone: 'Europe/Berlin',
      flag: '🇩🇪',
      isActive: true,
      session: 'open',
    },
    {
      city: 'Hong Kong',
      timezone: 'Asia/Hong_Kong',
      flag: '🇭🇰',
      isActive: true,
      session: 'open',
    },
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get session status based on time
  const getSessionStatus = (
    timezone: string
  ): { status: string; color: string; bgColor: string } => {
    const now = new Date();
    const timeInCity = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const hour = timeInCity.getHours();
    const day = timeInCity.getDay();

    // Trading hours logic (simplified)
    if (day === 0 || day === 6) {
      return { status: 'Closed', color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
    }

    if (hour >= 9 && hour < 16) {
      return { status: 'Open', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    } else if (hour >= 6 && hour < 9) {
      return { status: 'Pre-Market', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    } else if (hour >= 16 && hour < 20) {
      return { status: 'After Hours', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    } else {
      return { status: 'Closed', color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
    }
  };

  return (
    <div className='bg-gradient-to-br from-darkblack-700 to-darkblack-800 rounded-xl border border-gray-700/50 p-4 sm:p-6 shadow-xl backdrop-blur-sm'>
      <div className='flex items-center gap-3 mb-4 sm:mb-6'>
        <div className='p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg'>
          <IoGlobe className='text-white text-lg sm:text-xl' />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4'>
        {tradingCities.map((city, index) => {
          const timeInCity = new Date(
            currentTime.toLocaleString('en-US', { timeZone: city.timezone })
          );
          const sessionData = getSessionStatus(city.timezone);

          return (
            <motion.div
              key={city.city}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gradient-to-br from-gray-800/30 to-gray-700/30 rounded-lg p-3 sm:p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20`}
            >
              {/* City and Flag */}
              <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                <span className='text-lg sm:text-xl'>{city.flag}</span>
                <div>
                  <h4 className='text-white font-medium text-sm sm:text-base'>{city.city}</h4>
                  <p className='text-gray-400 text-xs'>{city.timezone.split('/')[1]}</p>
                </div>
              </div>

              {/* Time */}
              <div className='mb-2'>
                <div className='text-white font-mono text-lg sm:text-xl font-bold'>
                  {timeInCity.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
                <div className='text-gray-400 text-xs'>
                  {timeInCity.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>

              {/* Session Status */}
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sessionData.bgColor} ${sessionData.color}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${sessionData.color.replace('text-', 'bg-')}`}
                ></div>
                <span>{sessionData.status}</span>
              </div>

              {/* Hover effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg'></div>
            </motion.div>
          );
        })}
      </div>

      {/* Market Status Summary */}
      <div className='mt-4 sm:mt-6 pt-4 border-t border-gray-700/30'>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2'>
            <IoTime className='text-gray-400' />
            <span className='text-gray-400'>Market Status:</span>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <span className='text-green-400 text-xs'>Open</span>
            </div>
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
              <span className='text-gray-400 text-xs'>Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldClocks;
