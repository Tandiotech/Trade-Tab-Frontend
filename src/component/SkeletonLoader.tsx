// import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'chart' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  // const baseClasses = 'animate-pulse bg-gray-700/50 rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 bg-gray-700/50 rounded';
      case 'circular':
        return 'rounded-full bg-gray-700/50';
      case 'chart':
        return 'bg-gray-800/30 rounded-lg p-4';
      case 'card':
        return 'bg-gray-800/30 rounded-xl p-6';
      default:
        return 'bg-gray-700/50 rounded';
    }
  };

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'text' ? '16px' : variant === 'circular' ? '40px' : '200px')
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${getVariantClasses()} ${index < lines - 1 ? 'mb-2' : ''}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`${getVariantClasses()} ${className}`} style={style}>
        <div className="h-4 bg-gray-600/50 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-600/50 rounded mb-4"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-600/50 rounded w-1/6"></div>
          <div className="h-3 bg-gray-600/50 rounded w-1/6"></div>
          <div className="h-3 bg-gray-600/50 rounded w-1/6"></div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`${getVariantClasses()} ${className}`} style={style}>
        <div className="h-6 bg-gray-600/50 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-600/50 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-600/50 rounded w-5/6 mb-4"></div>
        <div className="h-8 bg-gray-600/50 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div
      className={`${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

export default SkeletonLoader;
