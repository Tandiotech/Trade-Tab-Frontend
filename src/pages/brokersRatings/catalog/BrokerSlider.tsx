import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SingleBrokerCatalog from './SingleBrokerCatalog';
import BrokerSkeleton from './BrokerSkeleton';

interface BrokerSliderProps {
  brokers: any[];
  isLoading: boolean;
  imagesReady: boolean;
  scrollDirection?: 'left' | 'right';
  scrollSpeed?: number;
}

export const BrokerSlider: React.FC<BrokerSliderProps> = ({
  brokers,
  isLoading,
  imagesReady,
  scrollDirection = 'right',
  scrollSpeed = 1,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const isPaused = useRef(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shouldShowSkeletons, setShouldShowSkeletons] = useState(true);

  // Determine if we should show skeletons
  const showSkeletons = isLoading || !imagesReady || shouldShowSkeletons || brokers.length === 0;

  // Optimized scroll animation with better performance
  const animateScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !brokers.length || !imagesReady || isPaused.current || showSkeletons) return;

    const adjustedSpeed = scrollDirection === 'right' ? -scrollSpeed : scrollSpeed;
    
    const step = (timestamp: number) => {
      if (!container || isPaused.current) return;
      
      container.scrollLeft += (adjustedSpeed * 16.67) / 16.67; // 60fps

      // Smooth loop handling
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
      } else if (container.scrollLeft <= 0 && scrollDirection === 'right') {
        container.scrollLeft = container.scrollWidth - container.clientWidth - 1;
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  }, [brokers.length, scrollDirection, scrollSpeed, imagesReady, showSkeletons]);

  // Pause animation on hover for better UX
  const handleMouseEnter = useCallback(() => {
    isPaused.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPaused.current = false;
    animateScroll();
  }, [animateScroll]);

  // Handle loading state transitions
  useEffect(() => {
    if (brokers.length > 0 && imagesReady && !isLoading) {
      // Delay showing actual content to ensure smooth transition
      const timer = setTimeout(() => {
        setShouldShowSkeletons(false);
        setIsInitialLoad(false);
      }, 800); // Give time for smooth transition
      
      return () => clearTimeout(timer);
    } else {
      setShouldShowSkeletons(true);
    }
  }, [brokers.length, imagesReady, isLoading]);

  useEffect(() => {
    if (brokers.length && imagesReady && !showSkeletons) {
      animateScroll();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [brokers.length, imagesReady, animateScroll, showSkeletons]);

  // Enhanced skeleton loading with better animations
  const skeletonItems = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={`skeleton-${i}`}
        className="w-64 flex-shrink-0 h-auto"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: { 
            delay: i * 0.1, 
            duration: 0.4,
            ease: "easeOut"
          }
        }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
      >
        <BrokerSkeleton />
      </motion.div>
    ));
  }, []);

  // Enhanced broker items with better loading states
  const brokerItems = useMemo(() => {
    if (showSkeletons) {
      return skeletonItems;
    }

    return [...brokers, ...brokers].map((broker, index) => (
      <motion.div
        key={`broker-${broker.id || index}`}
        className="w-64 flex-shrink-0 h-auto"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { 
            delay: index * 0.05, 
            duration: 0.5,
            ease: "easeOut"
          }
        }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
      >
        <SingleBrokerCatalog
          isLoading={false}
          broker={broker}
          className="animate-scale-up"
        />
      </motion.div>
    ));
  }, [brokers, showSkeletons, skeletonItems]);

  // Loading overlay for better UX
  const LoadingOverlay = () => (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-400 rounded-full mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-teal-400 font-medium">Loading brokers...</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="overflow-hidden p-2 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient fade effects on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/80 to-transparent z-10 pointer-events-none" />
      
      <div
        ref={scrollContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex gap-6 overflow-x-scroll overflow-y-hidden no-scrollbar relative"
        style={{
          WebkitOverflowScrolling: 'touch',
          transform: 'translateZ(0)',
          minHeight: '220px',
          scrollBehavior: 'smooth',
        }}
      >
        <AnimatePresence mode="wait">
          {showSkeletons ? (
            <motion.div
              key="skeletons"
              className="flex gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {skeletonItems}
            </motion.div>
          ) : (
            <motion.div
              key="brokers"
              className="flex gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {brokerItems}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Loading overlay for initial load */}
      {/* <AnimatePresence>
        {isLoading && (
          <LoadingOverlay />
        )}
      </AnimatePresence>
       */}
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent pointer-events-none" />
    </motion.div>
  );
};
