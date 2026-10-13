import { useEffect, useState, useMemo } from 'react';
import MiniCell from './MiniCell';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface MiniPlCalendarProps {
  TRADES: any;
  balance: number;
  cellHeight: string;
  relative?: boolean;
  example?: boolean;
  displaySeeFullJournal?: boolean;
  displayTitle?: boolean;
  enableNavigation?: boolean;
  enableModal?: boolean;
}

export default function MiniJournal({
  TRADES,
  balance,
  cellHeight,
  example = false,
  relative = true,
  displaySeeFullJournal = false,
  displayTitle = true,
  enableNavigation = true,
  enableModal = true,
}: MiniPlCalendarProps) {
  // Memoriza el journalData para que solo se genere cuando `TRADES` cambia
  const journalData = useMemo(() => {
    const journal = TRADES?.reduce((acc: any, trade: any) => {
      if (trade.type === 'DEAL_TYPE_BALANCE') return acc;

      const date = trade.closeTime.split(' ')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          totalProfit: 0,
          totalTrades: 0,
          successfulTrades: 0,
          failedTrades: 0,
          type: trade.type,
        };
      }

      acc[date].totalProfit += trade.profit;
      acc[date].totalTrades += 1;
      if (trade.success === 'won') {
        acc[date].successfulTrades += 1;
      } else {
        acc[date].failedTrades += 1;
      }
      return acc;
    }, {});
    return Object.values(journal);
  }, [TRADES]);

  // Find the last trading day
  const lastTradeInfo = useMemo(() => {
    if (!journalData || journalData.length === 0) return null;
    
    // Sort by date to find the most recent trade
    const sortedTrades = journalData.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const lastTrade = sortedTrades[0] as any;
    const lastTradeDate = new Date(lastTrade.date);
    const today = new Date();
    const daysSinceLastTrade = Math.floor((today.getTime() - lastTradeDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      date: lastTradeDate,
      daysAgo: daysSinceLastTrade,
      month: lastTradeDate.getMonth() + 1,
      year: lastTradeDate.getFullYear(),
      totalTrades: lastTrade.totalTrades,
      totalProfit: lastTrade.totalProfit
    };
  }, [journalData]);

  // Determine which month to display
  const getDisplayMonth = () => {
    if (example) {
      return { month: 8, year: new Date().getFullYear() };
    }
    
    if (lastTradeInfo) {
      return { month: lastTradeInfo.month, year: lastTradeInfo.year };
    }
    
    // Fallback to current month if no trades
    return { month: new Date().getMonth() + 1, year: new Date().getFullYear() };
  };

  // Navigation state
  const [currentMonth, setCurrentMonth] = useState(() => {
    const initial = getDisplayMonth();
    return initial.month;
  });
  const [currentYear, setCurrentYear] = useState(() => {
    const initial = getDisplayMonth();
    return initial.year;
  });
  
  const [highlightedDay, setHighlightedDay] = useState<number | null>(null);
  const [pnlData, setPnlData] = useState<Record<number, number>>({});
  const [tradesData, setTradesData] = useState<Record<number, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: number; year: number } | null>(null);

  const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (!enableNavigation) return;
    
    setCurrentMonth(prevMonth => {
      let newMonth = direction === 'next' ? prevMonth + 1 : prevMonth - 1;
      let newYear = currentYear;
      
      if (newMonth > 12) {
        newMonth = 1;
        newYear = currentYear + 1;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear = currentYear - 1;
      }
      
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  const resetToCurrentMonth = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
  };

  const openModal = (day: number) => {
    if (!enableModal) return;
    setSelectedDate({ day, month: currentMonth, year: currentYear });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) {
        if (event.key === 'ArrowLeft' && enableNavigation) {
          navigateMonth('prev');
        } else if (event.key === 'ArrowRight' && enableNavigation) {
          navigateMonth('next');
        }
      } else {
        if (event.key === 'Escape') {
          closeModal();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, enableNavigation]);

  useEffect(() => {
    const pnl: Record<number, number> = {};
    const trades: Record<number, number> = {};

    journalData.forEach((entry: any) => {
      // Separar el string de fecha en componentes
      const [year, month, day] = entry.date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day); // Crear la fecha localmente

      if (entryDate.getMonth() + 1 === currentMonth && entryDate.getFullYear() === currentYear) {
        const dayOfMonth = entryDate.getDate();
        pnl[dayOfMonth] = entry.totalProfit;
        trades[dayOfMonth] = entry.totalTrades;
      }
    });

    setPnlData(pnl);
    setTradesData(trades);
  }, [journalData, currentMonth, currentYear]);

  const generateCells = () => {
    const cells = [];
    const daysCount = daysInMonth(currentMonth, currentYear);
    const startDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const today = new Date();

    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className='empty-cell' />);
    }

    for (let i = 1; i <= daysCount; i++) {
      const isWeekend =
        new Date(currentYear, currentMonth - 1, i).getDay() === 0 ||
        new Date(currentYear, currentMonth - 1, i).getDay() === 6;
      const isFutureDate = new Date(currentYear, currentMonth - 1, i) > today;
      const hasTrades = tradesData[i] !== undefined && tradesData[i] > 0;
      
      cells.push(
        <div
          key={`cell-${i}`}
          className={`${hasTrades && enableModal ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}`}
          onClick={() => hasTrades && enableModal && openModal(i)}
        >
          <MiniCell
            cellHeight={cellHeight}
            i={i}
            balance={balance}
            currentMonth={currentMonth}
            currentYear={currentYear}
            highlightedDay={highlightedDay}
            pnlData={pnlData}
            tradesData={tradesData}
            setHighlightedDay={setHighlightedDay}
            today={today}
            isWeekend={isWeekend}
            isFutureDate={isFutureDate}
            relative={relative}
          />
        </div>
      );
    }

    return cells;
  };

  const getStatusMessage = () => {
    if (!lastTradeInfo) {
      return "No trading activity found";
    }

    // Check if current month has any trades
    const currentMonthHasTrades = Object.keys(tradesData).length > 0;
    if (!currentMonthHasTrades) {
      return "No trades this month";
    }

    if (lastTradeInfo.daysAgo === 0) {
      return "Last trade: Today";
    } else if (lastTradeInfo.daysAgo === 1) {
      return "Last trade: Yesterday";
    } else {
      return `Last trade: ${lastTradeInfo.daysAgo} days ago`;
    }
  };

  const getMonthDisplayName = () => {
    return new Date(currentYear, currentMonth - 1, 1).toLocaleString('en-US', { month: 'long' });
  };

  // Get trades for selected date
  const getTradesForDate = (day: number, month: number, year: number) => {
    if (!TRADES) return [];
    
    const targetDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return TRADES.filter((trade: any) => {
      if (trade.type === 'DEAL_TYPE_BALANCE') return false;
      const tradeDate = trade.closeTime.split(' ')[0];
      return tradeDate === targetDate;
    });
  };

  // Check if navigation is available
  const canNavigatePrev = () => {
    if (!enableNavigation) return false;
    const today = new Date();
    return !(currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear());
  };

  const canNavigateNext = () => {
    if (!enableNavigation) return false;
    const today = new Date();
    const currentDate = new Date(currentYear, currentMonth - 1, 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return currentDate < maxDate;
  };

  return (
    <div className='p-1 h-full flex flex-col justify-between rounded-2xl transition duration-300 relative overflow-hidden'>
      {displayTitle && (
        <div className='flex flex-col mb-4 px-4'>
          <div className='flex justify-between items-center mb-2'>
            <div className='flex items-center space-x-1 md:space-x-2 flex-1 min-w-0'>
              {enableNavigation && (
                <div className='flex items-center space-x-1'>
                  <button
                    onClick={() => navigateMonth('prev')}
                    disabled={!canNavigatePrev()}
                    className={`p-1 md:p-1.5 rounded-full transition-all duration-200 touch-manipulation ${
                      canNavigatePrev()
                        ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30 active:bg-cyan-900/50'
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeftIcon className='w-3 h-3 md:w-4 md:h-4' />
                  </button>
                  
                  <button
                    onClick={resetToCurrentMonth}
                    className='p-1 md:p-1.5 rounded-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30 active:bg-cyan-900/50 transition-all duration-200 touch-manipulation'
                    title='Go to current month'
                  >
                    <CalendarDaysIcon className='w-3 h-3 md:w-4 md:h-4' />
                  </button>
                  
                  <button
                    onClick={() => navigateMonth('next')}
                    disabled={!canNavigateNext()}
                    className={`p-1 md:p-1.5 rounded-full transition-all duration-200 touch-manipulation ${
                      canNavigateNext()
                        ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30 active:bg-cyan-900/50'
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRightIcon className='w-3 h-3 md:w-4 md:h-4' />
                  </button>
                </div>
              )}
              
              <span className='text-xs md:text-sm text-white font-semibold truncate ml-1'>
                {getMonthDisplayName()} {currentYear}
              </span>
            </div>
            
            {displaySeeFullJournal && (
              <Link to={'/journal'} className='text-sm text-white font-semibold hover:text-cyan-500 transition-colors duration-200'>
                See Full Journal
              </Link>
            )}
          </div>
          
          {/* Status message */}
          <div className='flex items-center justify-between'>
            <span className='text-xs text-cyan-300 font-medium'>
              {getStatusMessage()}
            </span>
            {lastTradeInfo && (
              <span className='text-xs text-gray-400'>
                {lastTradeInfo.totalTrades} trades, {lastTradeInfo.totalProfit > 0 ? '+' : ''}{lastTradeInfo.totalProfit.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}

      <div className='flex flex-col'>
        <div className='grid grid-cols-7 text-center mb-2'>
          {daysOfWeek.map((day, index) => (
            <span
              key={index}
              className={`text-[0.8rem] ${day === 'Sun' || day === 'Sat' ? 'text-red-500' : 'text-white'}`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className='grid grid-cols-7 gap-1 rounded-lg transition-all duration-300 ease-in-out'>{generateCells()}</div>
      </div>

      {/* Modal for detailed journal view */}
      {isModalOpen && selectedDate && (
        <div 
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4 animate-in fade-in duration-200'
          onClick={closeModal}
        >
          <div 
            className='bg-slate-800 rounded-xl md:rounded-2xl border border-cyan-600 max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className='flex items-center justify-between p-4 md:p-6 border-b border-slate-700'>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg md:text-xl font-bold text-white truncate'>
                  Trading Journal - {getMonthDisplayName()} {selectedDate.day}, {selectedDate.year}
                </h3>
                <p className='text-xs md:text-sm text-cyan-300 mt-1'>
                  {tradesData[selectedDate.day] || 0} trades • 
                  {pnlData[selectedDate.day] !== undefined ? (
                    <span className={pnlData[selectedDate.day] >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {pnlData[selectedDate.day] > 0 ? '+' : ''}{pnlData[selectedDate.day].toFixed(2)}
                    </span>
                  ) : (
                    <span className='text-gray-400'>No P&L data</span>
                  )}
                </p>
              </div>
              <button
                onClick={closeModal}
                className='p-2 rounded-full text-gray-400 hover:text-white hover:bg-slate-700 transition-colors duration-200 touch-manipulation flex-shrink-0 ml-2'
              >
                <XMarkIcon className='w-5 h-5 md:w-6 md:h-6' />
              </button>
            </div>

            {/* Modal Content */}
            <div className='p-4 md:p-6 overflow-y-auto max-h-[60vh]'>
              {(() => {
                const trades = getTradesForDate(selectedDate.day, selectedDate.month, selectedDate.year);
                
                if (trades.length === 0) {
                  return (
                    <div className='text-center py-8'>
                      <div className='w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center'>
                        <CalendarDaysIcon className='w-8 h-8 text-gray-400' />
                      </div>
                      <p className='text-gray-400'>No trades found for this date</p>
                    </div>
                  );
                }

                return (
                  <div className='space-y-4'>
                    {trades.map((trade: any, index: number) => (
                      <div
                        key={index}
                        className='bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-cyan-500 transition-colors duration-200'
                      >
                        <div className='flex justify-between items-start mb-2'>
                          <div className='flex items-center space-x-2'>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              trade.success === 'won' 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-red-900 text-red-300'
                            }`}>
                              {trade.success === 'won' ? 'Won' : 'Lost'}
                            </span>
                            <span className='text-sm text-gray-300'>
                              {trade.symbol || 'Unknown Symbol'}
                            </span>
                          </div>
                          <span className={`text-lg font-bold ${
                            trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-300'>
                          <div>
                            <span className='text-gray-400'>Type:</span> {trade.type}
                          </div>
                          <div>
                            <span className='text-gray-400'>Volume:</span> {trade.volume || 'N/A'}
                          </div>
                          <div className='md:col-span-2'>
                            <span className='text-gray-400'>Open Time:</span> {trade.openTime}
                          </div>
                          <div className='md:col-span-2'>
                            <span className='text-gray-400'>Close Time:</span> {trade.closeTime}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className='flex justify-end p-4 md:p-6 border-t border-slate-700'>
              <button
                onClick={closeModal}
                className='px-4 md:px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 touch-manipulation'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
