import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Event, PredictionResult, getResultColor, getResultText } from '@/types/predictions';
import { useHasPrediction } from '@/hook/usePredictionsDev';
import MakeCallModal from './MakeCallModal';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className = '' }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasPrediction, prediction, isLoading } = useHasPrediction(event.event_id);

  const eventDate = new Date(event.time_utc);
  const isPassed = event.status === 'passed';
  const hasResult = prediction?.result !== null;

  const getStatusBadge = () => {
    if (hasPrediction) {
      if (isPassed && hasResult) {
        const result = prediction!.result as PredictionResult;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(result)}`}>
            {getResultText(result)}
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
            Your Call
          </span>
        );
      }
    }
    return null;
  };

  const getSymbolHints = () => {
    if (!event.symbolHints || event.symbolHints.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {event.symbolHints.map((symbol, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
          >
            {symbol}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600
          transition-all duration-200 ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-white font-medium text-lg leading-tight">
              {event.title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{format(eventDate, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{format(eventDate, 'HH:mm')} UTC</span>
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Symbol Hints */}
        {getSymbolHints()}

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          {isLoading ? (
            <div className="w-full h-10 bg-gray-700 rounded-lg animate-pulse" />
          ) : hasPrediction ? (
            <div className="text-center">
              <span className="text-gray-400 text-sm">
                {isPassed && hasResult
                  ? 'Prediction evaluated'
                  : 'Prediction submitted'
                }
              </span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              disabled={isPassed}
              className={`
                w-full py-2 px-4 rounded-lg font-medium transition-all duration-200
                ${isPassed
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }
              `}
            >
              {isPassed ? 'Event Passed' : 'Make a Call'}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <MakeCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={event.event_id}
        eventTitle={event.title}
      />
    </>
  );
}

// Compact version for lists
export function EventCardCompact({ event, className = '' }: EventCardProps) {
  const { hasPrediction, prediction, isLoading } = useHasPrediction(event.event_id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const eventDate = new Date(event.time_utc);
  const isPassed = event.status === 'passed';
  const hasResult = prediction?.result !== null;

  const getStatusBadge = () => {
    if (hasPrediction) {
      if (isPassed && hasResult) {
        const result = prediction!.result as PredictionResult;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(result)}`}>
            {getResultText(result)}
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
            Your Call
          </span>
        );
      }
    }
    return null;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className={`
          bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-gray-600
          transition-all duration-200 ${className}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate">{event.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span>{format(eventDate, 'MMM dd, HH:mm')} UTC</span>
              {event.symbolHints && event.symbolHints.length > 0 && (
                <span className="text-gray-500">
                  {event.symbolHints.slice(0, 2).join(', ')}
                  {event.symbolHints.length > 2 && '...'}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            {getStatusBadge()}
            {!hasPrediction && !isPassed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Call
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <MakeCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={event.event_id}
        eventTitle={event.title}
      />
    </>
  );
}

