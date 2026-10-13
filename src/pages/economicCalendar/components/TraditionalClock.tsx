import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TraditionalClockProps {
  city: string;
  timezone: string;
  flag: string;
  isActive?: boolean;
}

const TraditionalClock: React.FC<TraditionalClockProps> = ({
  city,
  timezone,
  flag,
  isActive = true,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeInCity = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));

  // Get clock hands angles
  const hours = timeInCity.getHours() % 12;
  const minutes = timeInCity.getMinutes();
  const seconds = timeInCity.getSeconds();

  const hourAngle = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col items-center cursor-pointer'
    >
      {/* Clock Face */}
      <div className='relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-gray-600 shadow-lg hover:shadow-xl hover:shadow-gray-900/30 transition-all duration-300'>
        {/* Clock Center */}
        <div className='absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm'></div>
        <div className='absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-gray-100 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20'></div>

        {/* Hour Hand */}
        <div
          className='absolute top-1/2 left-1/2 w-1 h-6 sm:h-7 bg-gray-300 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-out rounded-full'
          style={{ transform: `translate(-50%, -100%) rotate(${hourAngle}deg)` }}
        ></div>

        {/* Minute Hand */}
        <div
          className='absolute top-1/2 left-1/2 w-0.5 h-8 sm:h-9 bg-gray-400 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-out rounded-full'
          style={{ transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)` }}
        ></div>

        {/* Second Hand */}
        <div
          className='absolute top-1/2 left-1/2 w-px h-8 sm:h-9 bg-red-500 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-out shadow-sm'
          style={{
            transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
            boxShadow: '0 0 4px rgba(239, 68, 68, 0.3)',
          }}
        ></div>

        {/* Clock Numbers - Properly positioned */}
        <div className='absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='text-xs sm:text-sm font-bold text-gray-300'>12</div>
        </div>
        <div className='absolute right-1 top-1/2 transform translate-x-1/2 -translate-y-1/2'>
          <div className='text-xs sm:text-sm font-bold text-gray-300'>3</div>
        </div>
        <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/2'>
          <div className='text-xs sm:text-sm font-bold text-gray-300'>6</div>
        </div>
        <div className='absolute left-1 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='text-xs sm:text-sm font-bold text-gray-300'>9</div>
        </div>

        {/* Hour Markers */}
        {[1, 2, 4, 5, 7, 8, 10, 11].map(hour => {
          const angle = hour * 30;
          const radius = 28; // Distance from center
          const x = Math.sin(((angle - 90) * Math.PI) / 180) * radius;
          const y = -Math.cos(((angle - 90) * Math.PI) / 180) * radius;

          return (
            <div
              key={hour}
              className='absolute w-0.5 h-0.5 bg-gray-500 rounded-full'
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}

        {/* Minute Markers */}
        {Array.from({ length: 60 }, (_, i) => {
          if (i % 5 === 0) return null; // Skip hour markers
          const angle = i * 6;
          const radius = 30;
          const x = Math.sin(((angle - 90) * Math.PI) / 180) * radius;
          const y = -Math.cos(((angle - 90) * Math.PI) / 180) * radius;

          return (
            <div
              key={i}
              className='absolute w-px h-px bg-gray-600 rounded-full'
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>

      {/* City Info */}
      <div className='mt-2 text-center'>
        <div className='flex items-center justify-center gap-1 text-xs sm:text-sm text-white font-medium mb-1'>
          <span className='text-sm sm:text-base'>{flag}</span>
          <span className='truncate max-w-16 sm:max-w-20'>{city}</span>
        </div>
        <div className='text-xs text-gray-400 font-mono mb-1'>
          {timeInCity.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className='text-xs text-gray-500'>
          {timeInCity.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default TraditionalClock;
