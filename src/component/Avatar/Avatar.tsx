import { useState, useEffect } from 'react';
import { getUserInitials } from '../../utils/getUserInitials';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
  showOnlineIndicator?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

/**
 * Avatar component that displays user profile picture or initials fallback
 * Shows the first letter(s) of the user's name when no image is available
 */
export default function Avatar({
  src,
  name,
  alt,
  size = 'md',
  className = '',
  fallbackClassName = '',
  showOnlineIndicator = false,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getUserInitials(name);
  const sizeClass = sizeClasses[size];
  const hasImage = src && !imageError;

  // Reset error state when src changes
  useEffect(() => {
    if (src) {
      setImageError(false);
    }
  }, [src]);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClass} bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden ${
          !hasImage ? fallbackClassName : ''
        }`}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt || name || 'User avatar'}
            className="w-full h-full object-cover rounded-full"
            onError={handleError}
            loading="lazy"
          />
        ) : (
          <span className="text-white font-semibold select-none">{initials}</span>
        )}
      </div>
      {showOnlineIndicator && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-darkblack-700"></div>
      )}
    </div>
  );
}

