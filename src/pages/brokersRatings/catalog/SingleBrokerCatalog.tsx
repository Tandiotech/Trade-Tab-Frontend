import { useState, useEffect, memo } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useBrokerLogo } from '../../../hook/useBrokerLogo';

// Memoized star rating component with enhanced styling
const StarRating = memo(({ score }: { score: number }) => {
  const maxStars = 5;
  const normalizedScore = (score / 100) * maxStars;
  const fullStars = Math.floor(normalizedScore);
  const hasHalfStar = normalizedScore - fullStars >= 0.5;

  return (
    <motion.div 
      className="flex items-center gap-0.5"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      {/* Full stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.2 }}
          >
            <FaStar className="text-yellow-400 text-lg drop-shadow-sm" />
          </motion.div>
        ))}
      {/* Half star */}
      {hasHalfStar && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + fullStars * 0.1, duration: 0.2 }}
        >
          <FaStarHalfAlt className="text-yellow-400 text-lg drop-shadow-sm" />
        </motion.div>
      )}
      {/* Empty stars */}
      {Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))
        .fill(0)
        .map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + (fullStars + (hasHalfStar ? 1 : 0) + index) * 0.1, duration: 0.2 }}
          >
            <FaRegStar className="text-gray-400 text-lg" />
          </motion.div>
        ))}
    </motion.div>
  );
});

export default function SingleBrokerCatalog({
  broker,
  className = '',
  style = {},
}: any) {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [isHovered, setIsHovered] = useState(false);
  const fallbackImage = 'logo.png';

  // Use the broker logo hook for robust logo handling
  const { logoSrc, handleError } = useBrokerLogo({
    dbLogo: broker.generalInformation?.logo,
    website: broker.generalInformation?.website,
    partnerLookupStrings: [
      broker.generalInformation?.brokerName,
      broker.abbEn,
      broker.slug,
    ],
    fallback: fallbackImage,
  });

  // Handle broker click to redirect
  const handleBrokerClick = (brokerSlug: string, brokerId: string) => {
    window.location.href = `/broker/${brokerSlug}?id=${brokerId}`;
  };

  // Preload image before displaying with better error handling
  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageStatus('loaded');
    };

    img.onerror = () => {
      setImageStatus('error');
      // Trigger the hook's error handler
      handleError({ currentTarget: img } as React.SyntheticEvent<HTMLImageElement, Event>);
    };

    img.src = logoSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [logoSrc, handleError]);

  return (
    <motion.div
      onClick={() => handleBrokerClick(broker.slug, broker._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-64 h-52 py-0 rounded-2xl relative flex flex-col cursor-pointer group ${
        imageStatus === 'loading' ? 'opacity-90' : 'opacity-100'
      } ${className}`}
      style={{ minHeight: '120px', ...style }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Enhanced background with gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95"></div>

      {/* Image container with enhanced styling */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        {imageStatus === 'loaded' && (
          <motion.img
            src={logoSrc}
            alt={`${broker.generalInformation.brokerName} logo`}
            className="h-full w-full object-cover rounded-2xl opacity-90 transition-opacity duration-300"
            initial={{ scale: 1.1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
            onError={handleError}
          />
        )}

        {/* Enhanced loading spinner */}
        {imageStatus === 'loading' && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800/50 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSpinner className="text-teal-400 text-3xl" />
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced error state */}
        {imageStatus === 'error' && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800/50 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center p-4">
              <p className="text-red-400 text-sm font-medium">Image not available</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced broker name with better styling */}
      <motion.div
        className="absolute top-3 left-3 right-3 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="bg-gradient-to-r from-teal-900/90 to-blue-900/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-teal-500/30">
          <p className="text-center font-semibold text-teal-300 text-sm leading-tight">
            {broker.generalInformation.brokerName}
          </p>
        </div>
      </motion.div>

      {/* Enhanced score display */}
      <motion.div 
        className="absolute bottom-3 right-3 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="bg-gradient-to-r from-teal-900/90 to-blue-900/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-teal-500/30 shadow-lg">
          <StarRating score={broker.scoreboard?.overallReview || 0} />
        </div>
      </motion.div>

      {/* Hover overlay with external link icon */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute bottom-3 left-3">
          <motion.div
            className="bg-teal-500/90 backdrop-blur-sm p-2 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaExternalLinkAlt className="text-white text-sm" />
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl ring-2 ring-teal-500/0 group-hover:ring-teal-500/50 transition-all duration-300"
        animate={{
          boxShadow: isHovered 
            ? "0 0 20px rgba(20, 184, 166, 0.3)" 
            : "0 0 0px rgba(20, 184, 166, 0)"
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
