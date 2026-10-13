import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiTrendingUp, BiTime, BiGlobe } from 'react-icons/bi';
import { 
  IoStatsChart, 
  IoCalendarOutline, 
  IoLink, 
  IoEye, 
  IoEyeOff,
  IoRefresh,
  IoTrendingUp,
  IoTrendingDown,
  IoRemove,
  IoAlertCircle
} from 'react-icons/io5';

const EconomicTable = ({ economicData = [], loading = false }) => {
  const [sortBy, setSortBy] = useState('time');
  const [filterImpact, setFilterImpact] = useState('all');
  const [showFollowed, setShowFollowed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Country Flag Map
  const getCountryFlag = (countryName: string) => {
    const countryMap: Record<string, string> = {
      'United States': '🇺🇸',
      'European Union': '🇪🇺',
      'United Kingdom': '🇬🇧',
      Japan: '🇯🇵',
      China: '🇨🇳',
      Germany: '🇩🇪',
      France: '🇫🇷',
      Italy: '🇮🇹',
      Canada: '🇨🇦',
      Australia: '🇦🇺',
      Spain: '🇪🇸',
      'South Africa': '🇿🇦',
    };
    return countryMap[countryName] || '🌐';
  };

  // Impact styles
  const getImpactData = (impact: string) => {
    switch (impact) {
      case 'red':
        return {
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          icon: <BiTrendingUp className='text-red-400' />,
          label: 'High Impact',
        };
      case 'yellow':
        return {
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          icon: <BiTime className='text-yellow-400' />,
          label: 'Medium Impact',
        };
      case 'green':
        return {
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          icon: <BiGlobe className='text-green-400' />,
          label: 'Low Impact',
        };
      default:
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30',
          icon: <IoStatsChart className='text-gray-400' />,
          label: 'Unknown',
        };
    }
  };

  const getActualValueClass = (actual: number, prevision: number) => {
    if (actual > prevision) return 'text-green-400 font-semibold';
    if (actual < prevision) return 'text-rose-400 font-semibold';
    return 'text-yellow-400 font-semibold';
  };

  const formatActualValue = (actual: number, prevision: number) => {
    if (actual > prevision) return `+${actual}`;
    return `${actual}`;
  };

  const getDeviationPercentage = (actual: number, prevision: number) => {
    if (prevision === 0) return 0;
    return ((actual - prevision) / prevision) * 100;
  };

  const getDeviationClass = (actual: number, prevision: number) => {
    const deviation = getDeviationPercentage(actual, prevision);
    if (deviation > 5) return 'text-green-400';
    if (deviation < -5) return 'text-red-400';
    return 'text-yellow-400';
  };

  const formatDeviation = (actual: number, prevision: number) => {
    const deviation = getDeviationPercentage(actual, prevision);
    if (deviation > 0) return `+${deviation.toFixed(1)}%`;
    return `${deviation.toFixed(1)}%`;
  };

  // Toggle item expansion
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Format time with better display
  const formatTime = (timeString: string) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  // Get deviation icon
  const getDeviationIcon = (actual: number, prevision: number) => {
    const deviation = getDeviationPercentage(actual, prevision);
    if (deviation > 5) return <IoTrendingUp className="text-green-400" />;
    if (deviation < -5) return <IoTrendingDown className="text-red-400" />;
    return <IoRemove className="text-yellow-400" />;
  };

  // Filter + sort
  const processedData = useMemo(() => {
    let filtered = economicData;

    if (filterImpact !== 'all') {
      filtered = filtered.filter((item: any) => item.impact === filterImpact);
    }

    if (showFollowed) {
      filtered = filtered.filter((item: any) => item.follow === true);
    }

    return filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'time':
          return new Date(a.hora).getTime() - new Date(b.hora).getTime();
        case 'impact': {
          const order: Record<string, number> = { red: 3, yellow: 2, green: 1 };
          return (order[b.impact] || 0) - (order[a.impact] || 0);
        }
        case 'country':
          return a.country.localeCompare(b.country);
        case 'deviation': {
          const aDev = getDeviationPercentage(a.actual, a.prevision);
          const bDev = getDeviationPercentage(b.actual, b.prevision);
          return Math.abs(bDev) - Math.abs(aDev);
        }
        default:
          return 0;
      }
    });
  }, [economicData, sortBy, filterImpact, showFollowed]);

  // Loading skeleton (unchanged)
  if (loading) {
    return (
      <div className='w-full h-full bg-gradient-to-br from-darkblack-600 to-darkblack-700 rounded-xl border border-gray-700/50 overflow-hidden'>
        <div className='bg-gradient-to-br from-gray-800/50 to-gray-700/50 p-4 border-b border-gray-700/50'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gray-600 rounded-lg animate-pulse'></div>
              <div className='space-y-2'>
                <div className='h-4 w-32 bg-gray-600 rounded animate-pulse'></div>
                <div className='h-3 w-24 bg-gray-600 rounded animate-pulse'></div>
              </div>
            </div>
            <div className='flex gap-2'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='w-16 h-8 bg-gray-600 rounded-lg animate-pulse'></div>
              ))}
            </div>
          </div>
        </div>
        <div className='p-4 space-y-4'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='bg-gray-800/30 rounded-xl p-4 animate-pulse'>
              <div className='flex items-center gap-4'>
                <div className='w-4 h-4 bg-gray-600 rounded-full'></div>
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-600 rounded w-3/4'></div>
                  <div className='h-3 bg-gray-600 rounded w-1/2'></div>
                </div>
                <div className='w-16 h-6 bg-gray-600 rounded'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-full bg-gradient-to-br from-darkblack-600 to-darkblack-700 rounded-xl border border-gray-700/50 overflow-hidden flex flex-col'>
      {/* Header - Improved Layout */}
      <div className='bg-gradient-to-br from-gray-800/50 to-gray-700/50 p-4 sm:p-5 border-b border-gray-700/50'>
        {/* Title Section */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg'>
              <IoCalendarOutline className='text-white text-lg sm:text-xl' />
            </div>
            <div>
              <h3 className='text-white font-bold text-base sm:text-lg leading-tight'>
                Economic Events
              </h3>
              <p className='text-gray-400 text-xs sm:text-sm mt-0.5'>
                {processedData.length} {processedData.length === 1 ? 'event' : 'events'} today
              </p>
            </div>
          </div>
        </div>

        {/* Controls - Better Mobile Layout */}
        <div className='space-y-3'>
          {/* Impact Filters - Full Width on Mobile */}
          <div className='flex flex-wrap gap-2'>
            {['all', 'red', 'yellow', 'green'].map(impact => {
              const impactData = getImpactData(impact === 'all' ? 'green' : impact);
              const active = filterImpact === impact;
              return (
                <button
                  key={impact}
                  onClick={() => setFilterImpact(impact)}
                  className={[
                    'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                    active
                      ? `${impactData.bg} ${impactData.border} border-2 text-white shadow-md scale-105`
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30',
                  ].join(' ')}
                >
                  {impact !== 'all' && impactData.icon}
                  <span>{impact === 'all' ? 'All Events' : impactData.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Controls */}
          <div className='flex flex-wrap items-center gap-2'>
            {/* Followed Toggle */}
            <button
              onClick={() => setShowFollowed(!showFollowed)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                showFollowed
                  ? 'bg-blue-500/20 border-2 border-blue-500/50 text-blue-300 shadow-md'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30'
              }`}
            >
              {showFollowed ? <IoEye className="text-base" /> : <IoEyeOff className="text-base" />}
              <span>Followed Only</span>
            </button>

            {/* Sort Options */}
            <div className='flex items-center gap-2'>
              <IoStatsChart className='text-gray-400 text-sm' />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='px-3 py-2 rounded-lg text-xs sm:text-sm bg-gray-700/50 text-gray-300 border border-gray-600/50 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all'
              >
                <option value="time">Sort by Time</option>
                <option value="impact">Sort by Impact</option>
                <option value="country">Sort by Country</option>
                <option value="deviation">Sort by Deviation</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Body - Improved Spacing and Layout */}
      <div className='flex-1 p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar'>
        <AnimatePresence>
          {processedData.length > 0 ? (
            processedData.map((item: any, idx: number) => {
              const impactData = getImpactData(item.impact);
              const isExpanded = expandedItems.has(item._id);
              const deviation = getDeviationPercentage(item.actual, item.prevision);
              
              return (
                <motion.div
                  key={item._id ?? `${item.country}-${item.hora}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.02, duration: 0.3 }}
                  className='group relative bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-xl p-4 sm:p-5 border-2 border-gray-700/40 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 cursor-pointer'
                  onClick={() => toggleExpanded(item._id)}
                >
                  {/* Top Row - Time, Country, Impact */}
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='text-2xl sm:text-3xl shrink-0'>
                        {getCountryFlag(item.country)}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <div className='text-white font-bold text-sm sm:text-base'>
                            {formatTime(item.hora)}
                          </div>
                          {item.follow && (
                            <div className='flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded-full'>
                              <IoEye className='text-blue-400 text-xs' />
                              <span className='text-blue-300 text-[10px] font-medium'>Following</span>
                            </div>
                          )}
                        </div>
                        <div className='text-gray-400 text-xs sm:text-sm'>
                          {item.country}
                        </div>
                      </div>
                    </div>

                    {/* Impact badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${impactData.bg} ${impactData.border} border-2 shrink-0`}
                    >
                      {impactData.icon}
                      <span className={`text-xs font-semibold ${impactData.color} hidden sm:inline`}>
                        {impactData.label}
                      </span>
                      <span className={`text-xs font-semibold ${impactData.color} sm:hidden`}>
                        {impactData.label.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Event Title */}
                  <h4 className='text-white font-semibold text-sm sm:text-base leading-snug mb-4 group-hover:text-teal-400 transition-colors line-clamp-2'>
                    {item.event}
                  </h4>

                  {/* Data Cards - Improved Layout */}
                  <div className='grid grid-cols-2 gap-3 mb-3'>
                    {/* Forecast Card */}
                    <div className='bg-gray-800/50 rounded-lg p-3 border border-gray-700/50'>
                      <div className='text-gray-400 text-[10px] sm:text-xs mb-1.5 font-medium uppercase tracking-wide'>Forecast</div>
                      <div className='text-white font-bold text-base sm:text-lg'>{item.prevision}</div>
                    </div>

                    {/* Actual Card */}
                    <div className={`bg-gray-800/50 rounded-lg p-3 border-2 ${
                      item.actual > item.prevision 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : item.actual < item.prevision 
                        ? 'border-red-500/50 bg-red-500/10' 
                        : 'border-yellow-500/50 bg-yellow-500/10'
                    }`}>
                      <div className='text-gray-400 text-[10px] sm:text-xs mb-1.5 font-medium uppercase tracking-wide'>Actual</div>
                      <div className={`font-bold text-base sm:text-lg ${getActualValueClass(item.actual, item.prevision)}`}>
                        {formatActualValue(item.actual, item.prevision)}
                      </div>
                    </div>
                  </div>

                  {/* Deviation and Source Row */}
                  <div className='flex items-center justify-between pt-3 border-t border-gray-700/50'>
                    <div className='flex items-center gap-2'>
                      {getDeviationIcon(item.actual, item.prevision)}
                      <span className={`text-xs sm:text-sm font-semibold ${getDeviationClass(item.actual, item.prevision)}`}>
                        {formatDeviation(item.actual, item.prevision)} deviation
                      </span>
                    </div>
                    
                    {/* Source link */}
                    {item.sourceLink && (
                      <a
                        href={item.sourceLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        onClick={(e) => e.stopPropagation()}
                        className='flex items-center gap-1.5 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium'
                      >
                        <IoLink className='text-sm' />
                        <span className='hidden sm:inline'>Source</span>
                      </a>
                    )}
                    
                    {/* Expand indicator */}
                    <div className='flex items-center gap-1 text-gray-500 text-xs'>
                      <span className='hidden sm:inline'>{isExpanded ? 'Less' : 'More'}</span>
                      <IoStatsChart className={`text-sm transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className='border-t-2 border-gray-700/50 pt-4 mt-4 space-y-3'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm'>
                          {item.sourceId && (
                            <div className='bg-gray-800/30 rounded-lg p-2'>
                              <span className='text-gray-400'>Source ID:</span>
                              <span className='text-white ml-2 font-medium'>{item.sourceId}</span>
                            </div>
                          )}
                          {item.fetchedAt && (
                            <div className='bg-gray-800/30 rounded-lg p-2'>
                              <span className='text-gray-400'>Fetched:</span>
                              <span className='text-white ml-2 font-medium'>
                                {new Date(item.fetchedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {deviation > 10 && (
                          <div className='p-3 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg'>
                            <div className='flex items-start gap-2 text-yellow-300 text-xs sm:text-sm'>
                              <IoAlertCircle className='text-base shrink-0 mt-0.5' />
                              <span className='font-medium'>High deviation detected - significant market impact expected</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none'></div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-12 sm:py-16'
            >
              <div className='text-gray-400'>
                <IoCalendarOutline className='text-4xl sm:text-5xl mx-auto mb-3 text-gray-500' />
                <p className='text-lg sm:text-xl font-semibold text-gray-300 mb-1'>No economic events</p>
                <p className='text-sm sm:text-base'>No events available for the selected filters</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EconomicTable;
