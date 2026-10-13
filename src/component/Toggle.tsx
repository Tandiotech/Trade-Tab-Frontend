import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  label?: any;
  initialValue?: boolean;
  onToggle?: any;
  activationColor?: any;
}

const Toggle: React.FC<ToggleProps> = ({ 
  label = ["On","Off"], 
  initialValue = false, 
  onToggle,
  activationColor='bg-teal-500'
}) => {

  const [isActive, setIsActive] = useState(initialValue);

  // Sync with external initialValue changes
  useEffect(() => {
    setIsActive(initialValue);
  }, [initialValue]);

  const handleToggle = () => {
    const newValue = !isActive;
    setIsActive(newValue);
    onToggle()
  };

  // If label has 2 options, render as segmented control (better for Percentage/Money)
  if (label && Array.isArray(label) && label.length === 2) {
    return (
      <div className="relative inline-flex items-center bg-gradient-to-br from-darkblack-700 to-darkblack-800 rounded-xl p-1.5 border border-gray-700/60 shadow-lg shadow-black/20 backdrop-blur-sm">
        {/* Active background slider */}
        <motion.div
          layout
          className={`absolute top-1.5 bottom-1.5 rounded-lg ${activationColor} shadow-lg shadow-teal-500/30 transition-all duration-300 ease-out ${
            isActive ? 'left-1.5 right-1/2' : 'left-1/2 right-1.5'
          }`}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        
        {/* Option buttons */}
        <button
          onClick={() => {
            if (!isActive) {
              setIsActive(true);
              if (onToggle) onToggle();
            }
          }}
          className={`
            relative z-10 px-4 md:px-5 py-2.5 md:py-3 
            text-xs md:text-sm font-semibold
            rounded-lg transition-all duration-300 ease-out
            whitespace-nowrap
            min-w-[70px] md:min-w-[85px]
            touch-manipulation
            transform active:scale-95
            ${isActive 
              ? 'text-white drop-shadow-sm' 
              : 'text-gray-400 hover:text-gray-200 active:text-gray-300'
            }
          `}
        >
          {label[0]}
        </button>
        
        <button
          onClick={() => {
            if (isActive) {
              setIsActive(false);
              if (onToggle) onToggle();
            }
          }}
          className={`
            relative z-10 px-4 md:px-5 py-2.5 md:py-3 
            text-xs md:text-sm font-semibold
            rounded-lg transition-all duration-300 ease-out
            whitespace-nowrap
            min-w-[70px] md:min-w-[85px]
            touch-manipulation
            transform active:scale-95
            ${!isActive 
              ? 'text-white drop-shadow-sm' 
              : 'text-gray-400 hover:text-gray-200 active:text-gray-300'
            }
          `}
        >
          {label[1]}
        </button>
      </div>
    );
  }

  // Fallback to original toggle switch for other use cases
  return (
    <div className="flex items-center space-x-3">
      <span className='whitespace-nowrap text-sm text-gray-300'>{initialValue ? label[0] : label[1]}</span>
      <button
        onClick={handleToggle}
        className={`w-12 h-6 rounded-full p-1 flex items-center ${
          isActive ? activationColor : 'bg-gray-600'
        } transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
      >
        <div
          className={`h-4 w-4 bg-white rounded-full shadow-md transform ${
            isActive ? 'translate-x-6' : 'translate-x-0'
          } transition-transform duration-300 ease-in-out`}
        ></div>
      </button>
    </div>
  );
};

export default Toggle;
