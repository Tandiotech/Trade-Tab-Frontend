import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = 'md',
  animate = true,
}) => {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={`bg-gray-700/50 ${roundedClass} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={{ width, height }}
    />
  );
};

interface SkeletonFormProps {
  showEmail?: boolean;
  showPassword?: boolean;
  showRememberMe?: boolean;
  showButton?: boolean;
}

export const SkeletonForm: React.FC<SkeletonFormProps> = ({
  showEmail = true,
  showPassword = true,
  showRememberMe = true,
  showButton = true,
}) => {
  return (
    <div className="space-y-4">
      {showEmail && (
        <div className="space-y-2">
          <Skeleton width="80px" height="0.75rem" />
          <Skeleton width="100%" height="2.5rem" />
        </div>
      )}
      
      {showPassword && (
        <div className="space-y-2">
          <Skeleton width="70px" height="0.75rem" />
          <Skeleton width="100%" height="2.5rem" />
        </div>
      )}
      
      {showRememberMe && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton width="1rem" height="1rem" rounded="sm" />
            <Skeleton width="80px" height="0.75rem" />
          </div>
          <Skeleton width="120px" height="0.75rem" />
        </div>
      )}
      
      {showButton && (
        <Skeleton width="100%" height="2.5rem" rounded="md" />
      )}
    </div>
  );
};

interface SkeletonCardProps {
  showTitle?: boolean;
  showDescription?: boolean;
  showFeatures?: boolean;
  featureCount?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showTitle = true,
  showDescription = true,
  showFeatures = true,
  featureCount = 4,
}) => {
  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="space-y-3">
          <Skeleton width="80%" height="2rem" />
          <Skeleton width="60%" height="1.5rem" />
        </div>
      )}
      
      {showDescription && (
        <div className="space-y-2">
          <Skeleton width="100%" height="1rem" />
          <Skeleton width="95%" height="1rem" />
          <Skeleton width="85%" height="1rem" />
        </div>
      )}
      
      {showFeatures && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: featureCount }).map((_, index) => (
            <div key={index} className="space-y-3 p-4 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Skeleton width="2rem" height="2rem" rounded="lg" />
                <Skeleton width="100px" height="0.875rem" />
              </div>
              <div className="space-y-1">
                <Skeleton width="100%" height="0.75rem" />
                <Skeleton width="80%" height="0.75rem" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { Skeleton as default };
