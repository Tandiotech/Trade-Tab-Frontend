import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePredictionHistory } from '@/hook/usePredictionsDev';
import { PredictionHistoryItem, getResultColor, getResultText } from '@/types/predictions';
import { format } from 'date-fns';

interface HistoryTableProps {
  className?: string;
  pageSize?: number;
}

export default function HistoryTable({ className = '', pageSize = 10 }: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = usePredictionHistory(currentPage, pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTotalPages = () => {
    if (!data) return 0;
    return Math.ceil(data.total / pageSize);
  };

  const renderPagination = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-400">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data?.total || 0)} of {data?.total || 0} predictions
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${page === currentPage
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-3">
              {Array.from({ length: pageSize }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg border border-gray-700 p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p>Failed to load prediction history</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg border border-gray-700 p-6 ${className}`}>
        <div className="text-center text-gray-400">
          <p className="text-lg mb-2">No predictions yet</p>
          <p className="text-sm">Start making predictions on economic events to see your history here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Prediction History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Event ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Result</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-300 font-mono">
                    {item.event_id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(item.result)}`}>
                      {getResultText(item.result)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {renderPagination()}
      </div>
    </div>
  );
}

// Compact version for mobile
export function HistoryTableCompact({ className = '', pageSize = 5 }: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = usePredictionHistory(currentPage, pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTotalPages = () => {
    if (!data) return 0;
    return Math.ceil(data.total / pageSize);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data || data.items.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg border border-gray-700 p-4 ${className}`}>
        <div className="text-center text-gray-400">
          <p>No predictions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Predictions</h3>
        
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 font-mono truncate">
                  {item.event_id}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(item.created_at), 'MMM dd, HH:mm')}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(item.result)}`}>
                {getResultText(item.result)}
              </span>
            </motion.div>
          ))}
        </div>

        {getTotalPages() > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            <span className="text-sm text-gray-400">
              {currentPage} / {getTotalPages()}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === getTotalPages()}
              className="p-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

