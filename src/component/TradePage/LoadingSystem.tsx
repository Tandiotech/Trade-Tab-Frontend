// import React from 'react';

// Base skeleton component
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = true,
  animate = true,
}) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`bg-slate-700 ${rounded ? 'rounded' : ''} ${
        animate ? 'animate-pulse' : ''
      } ${className}`}
      style={style}
    />
  );
};

// Card skeleton
const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 ${className}`}>
      <div className="animate-pulse">
        <Skeleton height="1.5rem" width="60%" className="mb-4" />
        <div className="space-y-3">
          <Skeleton height="1rem" />
          <Skeleton height="1rem" width="80%" />
          <Skeleton height="1rem" width="40%" />
        </div>
      </div>
    </div>
  );
};

// Table skeleton
const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string 
}> = ({ rows = 5, columns = 6, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
      <div className="p-6">
        <div className="animate-pulse">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton height="1.5rem" width="40%" />
            <Skeleton height="1rem" width="20%" />
          </div>
          
          {/* Table header */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} height="1rem" />
            ))}
          </div>
          
          {/* Table rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid gap-4 mb-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} height="1rem" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Chart skeleton
const ChartSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <Skeleton height="1.5rem" width="40%" />
          <Skeleton height="1rem" width="20%" />
        </div>
        
        {/* Chart area */}
        <div className="h-64 bg-slate-700 rounded-lg mb-4"></div>
        
        {/* Chart controls */}
        <div className="flex space-x-2 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="2rem" width="6rem" />
          ))}
        </div>
        
        {/* Chart insights */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-700/50 rounded-lg p-3">
              <Skeleton height="0.75rem" width="60%" className="mb-2" />
              <Skeleton height="1rem" width="40%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Summary card skeleton
const SummaryCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <Skeleton height="1.5rem" width="50%" />
          <Skeleton height="1rem" width="30%" />
        </div>
        
        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <Skeleton height="0.75rem" width="70%" className="mb-1" />
              <Skeleton height="1.25rem" width="50%" />
            </div>
          ))}
        </div>
        
        {/* Additional stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <Skeleton height="0.75rem" width="60%" className="mb-1" />
              <Skeleton height="1rem" width="40%" />
            </div>
          ))}
        </div>
        
        {/* Trade distribution */}
        <div>
          <Skeleton height="0.75rem" width="30%" className="mb-3" />
          <div className="flex items-center space-x-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton height="0.75rem" width="0.75rem" rounded />
                <Skeleton height="0.75rem" width="4rem" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Best trades skeleton
const BestTradesSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <Skeleton height="1.5rem" width="40%" />
          <Skeleton height="1rem" width="30%" />
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Skeleton height="2rem" width="2rem" rounded />
                  <div className="flex items-center space-x-2">
                    <Skeleton height="1.5rem" width="1.5rem" />
                    <div>
                      <Skeleton height="1rem" width="4rem" />
                      <Skeleton height="0.75rem" width="6rem" className="mt-1" />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton height="1.25rem" width="5rem" />
                  <Skeleton height="0.75rem" width="4rem" className="mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="text-center">
                    <Skeleton height="0.75rem" width="60%" className="mb-1 mx-auto" />
                    <Skeleton height="1rem" width="40%" className="mx-auto" />
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {Array.from({ length: 3 }).map((_, k) => (
                  <div key={k} className="bg-slate-700/30 rounded-lg p-3">
                    <Skeleton height="0.75rem" width="50%" className="mb-2" />
                    <div className="space-y-1">
                      {Array.from({ length: 3 }).map((_, l) => (
                        <div key={l} className="flex justify-between">
                          <Skeleton height="0.75rem" width="40%" />
                          <Skeleton height="0.75rem" width="30%" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Filters skeleton
const FiltersSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <Skeleton height="1.5rem" width="30%" />
          <div className="flex items-center space-x-2">
            <Skeleton height="1.5rem" width="3rem" />
            <Skeleton height="1rem" width="4rem" />
          </div>
        </div>
        
        {/* Basic filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <Skeleton height="0.75rem" width="40%" className="mb-1" />
              <Skeleton height="2.5rem" width="100%" />
            </div>
          ))}
        </div>
        
        {/* Advanced filters */}
        <div className="space-y-6">
          <div>
            <Skeleton height="1rem" width="20%" className="mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton height="1rem" width="1rem" />
                  <Skeleton height="0.75rem" width="3rem" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton height="1rem" width="30%" className="mb-3" />
                <div className="space-y-2">
                  <Skeleton height="2.5rem" width="100%" />
                  <Skeleton height="2.5rem" width="100%" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick filters */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <Skeleton height="1rem" width="25%" className="mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="2rem" width="6rem" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Page skeleton
export const PageSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}>
      {/* Header skeleton */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton height="2rem" width="12rem" className="mb-2" />
                <Skeleton height="1rem" width="20rem" />
              </div>
              <div className="flex items-center space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height="2.5rem" width="6rem" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Filters skeleton */}
          <div className="mb-8">
            <FiltersSkeleton />
          </div>
          
          {/* Content grid skeleton */}
          <div className="space-y-8">
            {/* Summary row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SummaryCardSkeleton />
              </div>
              <div>
                <CardSkeleton />
              </div>
            </div>
            
            {/* Analytics row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <BestTradesSkeleton />
              <ChartSkeleton />
            </div>
            
            {/* Additional content */}
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading spinner
const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
  color?: string;
}> = ({ size = 'md', className = '', color = 'text-blue-500' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${color} ${className}`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Loading overlay
export const LoadingOverlay: React.FC<{ 
  isLoading: boolean; 
  children: React.ReactNode;
  className?: string;
}> = ({ isLoading, children, className = '' }) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-white font-medium">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
