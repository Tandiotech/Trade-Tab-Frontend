import { useRef, useState, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  id?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, id, position = 'top' }) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const uniqueId = id || `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  // Position classes based on the position prop
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  // Arrow classes based on the position prop
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform translate-x-[-50%] translate-y-[100%] border-t-8 border-l-8 border-r-8 border-t-gray-800 border-l-transparent border-r-transparent',
    bottom:
      'top-0 left-1/2 transform translate-x-[-50%] translate-y-[-100%] border-b-8 border-l-8 border-r-8 border-b-gray-800 border-l-transparent border-r-transparent',
    left: 'right-0 top-1/2 transform translate-x-[100%] translate-y-[-50%] border-l-8 border-t-8 border-b-8 border-l-gray-800 border-t-transparent border-b-transparent',
    right:
      'left-0 top-1/2 transform translate-x-[-100%] translate-y-[-50%] border-r-8 border-t-8 border-b-8 border-r-gray-800 border-t-transparent border-b-transparent',
  };

  // Handle clicks outside the tooltip to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    }

    // Handle escape key to close tooltip
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowTooltip(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setShowTooltip(!showTooltip);
    }
  };

  return (
    <div className='relative inline-block'>
      <div
        ref={triggerRef}
        onClick={() => setShowTooltip(!showTooltip)}
        onKeyDown={handleKeyDown}
        className='cursor-pointer'
        tabIndex={0}
        role='button'
        aria-describedby={showTooltip ? uniqueId : undefined}
        aria-expanded={showTooltip}
      >
        {children}
      </div>

      {showTooltip && (
        <div
          ref={tooltipRef}
          id={uniqueId}
          role='tooltip'
          className={`absolute z-10 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg ${positionClasses[position]}`}
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
