import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoTime, IoPulse, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

interface SessionStatus {
  name: string;
  status: 'open' | 'closed' | 'pre-market' | 'post-market';
  nextOpen?: string;
  nextClose?: string;
}

const TradingSessionIndicator: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessions, setSessions] = useState<SessionStatus[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateSessionStatus();
    }, 1000);

    updateSessionStatus();
    return () => clearInterval(timer);
  }, []);

  const updateSessionStatus = () => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcDay = now.getUTCDay();

    const newSessions: SessionStatus[] = [
      {
        name: 'New York',
        status: getSessionStatus(utcHour, utcDay, 14, 21), // 9 AM - 4 PM EST
        nextOpen: utcHour < 14 ? '9:00 AM EST' : 'Tomorrow 9:00 AM EST',
        nextClose: utcHour < 21 ? '4:00 PM EST' : 'Tomorrow 4:00 PM EST'
      },
      {
        name: 'London',
        status: getSessionStatus(utcHour, utcDay, 8, 16), // 8 AM - 4 PM GMT
        nextOpen: utcHour < 8 ? '8:00 AM GMT' : 'Tomorrow 8:00 AM GMT',
        nextClose: utcHour < 16 ? '4:00 PM GMT' : 'Tomorrow 4:00 PM GMT'
      },
      {
        name: 'Tokyo',
        status: getSessionStatus(utcHour, utcDay, 0, 6), // 9 AM - 3 PM JST
        nextOpen: utcHour < 0 ? '9:00 AM JST' : 'Tomorrow 9:00 AM JST',
        nextClose: utcHour < 6 ? '3:00 PM JST' : 'Tomorrow 3:00 PM JST'
      }
    ];

    setSessions(newSessions);
  };

  const getSessionStatus = (hour: number, day: number, openHour: number, closeHour: number): 'open' | 'closed' | 'pre-market' | 'post-market' => {
    if (day === 0 || day === 6) return 'closed';
    if (hour >= openHour && hour < closeHour) return 'open';
    if (hour >= openHour - 2 && hour < openHour) return 'pre-market';
    if (hour >= closeHour && hour < closeHour + 2) return 'post-market';
    return 'closed';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          icon: IoCheckmarkCircle,
          label: 'Open'
        };
      case 'pre-market':
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          icon: IoTime,
          label: 'Pre-Market'
        };
      case 'post-market':
        return {
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          icon: IoPulse,
          label: 'After Hours'
        };
      default:
        return {
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          icon: IoCloseCircle,
          label: 'Closed'
        };
    }
  };

  const openSessions = sessions.filter(session => session.status === 'open').length;
  const totalSessions = sessions.length;

  return (
    <div className='bg-gradient-to-br from-darkblack-700 to-darkblack-800 rounded-xl border border-gray-700/50 p-5 sm:p-6 shadow-xl backdrop-blur-sm'>
      <div className='flex items-center gap-3 mb-5 sm:mb-6'>
        <div className='p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg'>
          <IoPulse className='text-white text-xl sm:text-2xl' />
        </div>
        <div>
          <h3 className='text-white font-bold text-xl sm:text-2xl'>Trading Sessions</h3>
          <p className='text-gray-400 text-sm sm:text-base mt-0.5'>
            {openSessions}/{totalSessions} markets open
          </p>
        </div>
      </div>

      <div className='space-y-3 sm:space-y-4'>
        {sessions.map((session, index) => {
          const config = getStatusConfig(session.status);
          const IconComponent = config.icon;
          
          return (
            <motion.div
              key={session.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-xl border-2 ${config.bgColor} ${config.borderColor} hover:shadow-lg transition-all`}
            >
              <div className='flex items-center gap-3'>
                <IconComponent className={`text-xl sm:text-2xl ${config.color}`} />
                <div>
                  <h4 className='text-white font-semibold text-sm sm:text-base'>{session.name}</h4>
                  <p className={`text-xs sm:text-sm font-medium ${config.color}`}>{config.label}</p>
                </div>
              </div>
              
              <div className='text-right'>
                <div className={`text-sm sm:text-base font-bold ${config.color}`}>
                  {session.status === 'open' ? session.nextClose : session.nextOpen}
                </div>
                <div className='text-gray-400 text-xs sm:text-sm'>
                  {session.status === 'open' ? 'Closes' : 'Opens'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Market Status Summary - Enhanced */}
      <div className='mt-5 sm:mt-6 pt-4 sm:pt-5 border-t-2 border-gray-700/30'>
        <div className='flex items-center justify-between text-sm sm:text-base'>
          <span className='text-gray-400 font-medium'>Global Market Status:</span>
          <div className='flex items-center gap-2.5'>
            <div className={`w-2.5 h-2.5 rounded-full ${openSessions > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`font-semibold ${openSessions > 0 ? 'text-green-400' : 'text-gray-400'}`}>
              {openSessions > 0 ? 'Active Trading' : 'Markets Closed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSessionIndicator;
