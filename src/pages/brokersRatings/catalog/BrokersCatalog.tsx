import { useEffect, useState, useCallback, useMemo } from 'react';
import { http } from '../../../utils/http_request';
import { LoadingBar } from '@/component/LoadingBar';
import { BrokerSlider } from './BrokerSlider';
import { motion, AnimatePresence } from 'framer-motion';
import './broker-catalog.css';

const BrokerCatalog: React.FC = () => {
  const [allBrokers, setAllBrokers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesReady, setImagesReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [randomNumber, setRandomNumber] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'fetching' | 'processing' | 'ready'>('initial');

  // Optimized data fetching with error handling
  const fetchBrokers = useCallback(async () => {
    try {
      setLoadingPhase('fetching');
      setIsLoading(true);
      setImagesReady(false);
      setLoadingProgress(0);
      
      const { data } = await http.get('brokers/getBrokersCatalog');
      const list = Array.isArray(data) ? data : data?.brokers ?? [];
      setAllBrokers(list);
      setLoadingProgress(30);
      setLoadingPhase('processing');
      preloadImages(data);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      setImagesReady(true);
      setLoadingProgress(100);
      setLoadingPhase('ready');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  // Optimized random number generation with better performance
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRandomNumber(0.7 + Math.random() * 0.8);
    }, 2000); // Reduced frequency for better performance

    return () => clearInterval(intervalId);
  }, []);

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.broker-catalog-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized image preloading with better error handling and progress tracking
  const preloadImages = useCallback((brokers: any[]) => {
    const imageUrls = brokers.map(broker => broker.generalInformation.logo || 'logo.png');
    let loadedCount = 0;
    const totalImages = imageUrls.length;

    if (totalImages === 0) {
      setImagesReady(true);
      setLoadingProgress(100);
      setLoadingPhase('ready');
      setIsLoading(false);
      return;
    }

    const loadImage = (url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          const progress = 30 + (loadedCount / totalImages) * 70; // Start from 30% (after fetch)
          setLoadingProgress(progress);
          
          // Update loading phase based on progress
          if (progress < 60) {
            setLoadingPhase('processing');
          } else if (progress >= 90) {
            setLoadingPhase('ready');
          }
          
          if (loadedCount === totalImages) {
            setImagesReady(true);
            setLoadingProgress(100);
            setIsLoading(false);
          }
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          const progress = 30 + (loadedCount / totalImages) * 70;
          setLoadingProgress(progress);
          resolve();
        };
        img.src = url;
      });
    };

    // Load images in parallel with concurrency limit
    const concurrencyLimit = 5;
    const chunks: string[][] = [];
    for (let i = 0; i < imageUrls.length; i += concurrencyLimit) {
      chunks.push(imageUrls.slice(i, i + concurrencyLimit));
    }

    const loadChunks = async () => {
      for (const chunk of chunks) {
        await Promise.all(chunk.map(loadImage));
      }
      setImagesReady(true);
      setLoadingProgress(100);
      setLoadingPhase('ready');
      setIsLoading(false);
    };

    loadChunks();

    // Fallback timeout to prevent infinite loading
    setTimeout(() => {
      if (!imagesReady) {
        setImagesReady(true);
        setLoadingProgress(100);
        setLoadingPhase('ready');
        setIsLoading(false);
      }
    }, 8000); // Increased timeout
  }, [imagesReady]);

  // Memoized broker division for better performance
  const brokerLists = useMemo(() => {
    const chunkSize = Math.ceil(allBrokers.length / 3);
    return [
      allBrokers.slice(0, chunkSize),
      allBrokers.slice(chunkSize, chunkSize * 2),
      allBrokers.slice(chunkSize * 2),
    ];
  }, [allBrokers]);

  const [firstList, secondList, thirdList] = brokerLists;

  // Animation variants for smooth entrance
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const sliderVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Loading phase messages
  const getLoadingMessage = () => {
    switch (loadingPhase) {
      case 'initial':
        return 'Initializing...';
      case 'fetching':
        return 'Fetching broker data...';
      case 'processing':
        return 'Processing images...';
      case 'ready':
        return 'Ready!';
      default:
        return 'Loading...';
    }
  };

  return (
    <motion.div
      className="broker-catalog-container relative min-h-[600px] div_entry_5 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Enhanced loading bar with better styling and phase indication */}
      {/* <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50"
          >
            <div className="bg-gray-900/90 backdrop-blur-sm border-b border-teal-500/30 p-4">
              <LoadingBar progress={loadingProgress} />
              <motion.div 
                className="text-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-teal-400 text-sm font-medium">
                  {getLoadingMessage()} ({Math.round(loadingProgress)}%)
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Gradient background for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-blue-900/10 to-purple-900/20 pointer-events-none" />

      {/* Loading overlay for initial load */}
      {/* <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <motion.div
                className="w-20 h-20 border-4 border-teal-500/30 border-t-teal-400 rounded-full mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.h3 
                className="text-2xl font-bold text-white mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading Brokers
              </motion.h3>
              <p className="text-teal-400 font-medium">{getLoadingMessage()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Animated sliders with staggered entrance */}
      <motion.div variants={sliderVariants} className="mb-4">
        <BrokerSlider
          brokers={firstList}
          isLoading={isLoading}
          imagesReady={imagesReady}
          scrollSpeed={randomNumber * 1.2}
          scrollDirection="right"
        />
      </motion.div>

      <motion.div variants={sliderVariants} className="mb-4">
        <BrokerSlider
          brokers={secondList}
          isLoading={isLoading}
          imagesReady={imagesReady}
          scrollDirection="right"
          scrollSpeed={randomNumber * 0.8}
        />
      </motion.div>

      <motion.div variants={sliderVariants}>
        <BrokerSlider
          brokers={thirdList}
          isLoading={isLoading}
          imagesReady={imagesReady}
          scrollSpeed={randomNumber * 1.0}
          scrollDirection="right"
        />
      </motion.div>

      {/* Floating particles effect for visual appeal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Success animation when loading completes */}
      
    </motion.div>
  );
};

export default BrokerCatalog;
