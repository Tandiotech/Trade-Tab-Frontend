import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';

const ModalInfo = ({
  children,
  content,
  infoIconSize = 'text-base hover:text-xl',
  infoIconPosition = 'top-1 right-2',
  modalPosition = 'top-10 left-0 ',
}) => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const duration = 3;

  useEffect(() => {
    let interval;

    if (show && !isHovered) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - 100 / (duration * 10);
          if (newProgress <= 0) {
            setShow(false);
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [show, isHovered]);

  const resetProgress = () => {
    setProgress(100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    resetProgress();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className='relative'>
      {/* Main Content */}
      <div className='h-full'>{children}</div>
      
      {/* Info Icon */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setShow(!show);
          resetProgress();
        }}
        className={`absolute ${infoIconPosition} text-slate-400 cursor-pointer w-fit hover:text-cyan-400 transition-colors duration-200 ${infoIconSize}`}
      >
        {/* <BsFillInfoCircleFill /> */}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute ${modalPosition} min-w-64 p-4 bg-slate-900/95 backdrop-blur-md text-white shadow-2xl rounded-xl z-[9999] border border-slate-700`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShow(false)}
              className='absolute top-2 right-2 text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-slate-800 transition-all duration-200'
            >
              <AiOutlineClose size={14} />
            </motion.button>

            {/* Content */}
            <div className='pr-6'>
              <p className='text-sm font-medium leading-relaxed text-gray-200'>{content}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-900/95 border-l border-t border-slate-700 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModalInfo;
