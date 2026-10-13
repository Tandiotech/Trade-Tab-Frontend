import { motion } from 'framer-motion';

const BrokerSkeleton = () => {
  return (
    <motion.div 
      className="w-full h-52 rounded-2xl relative overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main content structure */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        {/* Top section - Broker name placeholder */}
        <motion.div 
          className="bg-gray-700/60 rounded-xl h-6 mb-3"
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Middle section - Logo placeholder */}
        <motion.div 
          className="flex-1 bg-gray-700/40 rounded-xl mb-3 relative overflow-hidden"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 1.8, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        >
          {/* Inner shimmer for logo area */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.5
            }}
          />
        </motion.div>

        {/* Bottom section - Rating and info placeholders */}
        <div className="flex justify-between items-center">
          <motion.div 
            className="bg-gray-700/60 rounded-lg px-3 py-2 w-16 h-4"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              delay: 0.6
            }}
          />
          
          <motion.div 
            className="bg-gray-700/60 rounded-lg px-3 py-2 w-20 h-4"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              delay: 0.8
            }}
          />
        </div>
      </div>

      {/* Subtle pulse effect for the entire card */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: [
            "0 0 0 rgba(20, 184, 166, 0)",
            "0 0 15px rgba(20, 184, 166, 0.2)",
            "0 0 0 rgba(20, 184, 166, 0)"
          ]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating accent dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 2 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/40 rounded-full"
            style={{
              left: `${20 + i * 60}%`,
              top: `${40 + i * 30}%`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BrokerSkeleton;
