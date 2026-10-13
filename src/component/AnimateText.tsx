import { motion } from 'framer-motion';
import { SeparadorDecimal } from '../utils/SeparadorDecimal';

const AnimatedText = ({
  value,
  textSize = 'text-xl md:text-2xl xl:text-4xl leading-[48px]',
  fromColor = 'from-green-400',
  toColor = 'to-teal-500',
  decimalComa = true,
  style=false,
}: {
  value: any;
  textSize?: string;
  fromColor?: string;
  toColor?: string;
  decimalComa?: boolean;
  style?: boolean;
}) => {

  return (
    <motion.p
      className={`${textSize}  bg-gradient-to-r ${fromColor} ${toColor} ${style ? 'text-white whitespace-nowrap w-[10.5rem] text-center' : ''}  bg-clip-text text-transparent  rounded-lg whitespace-pre-wrap`}
      initial={{ opacity: 0, y: 10 }} // Reduced initial offset for smoother animation
      animate={{ opacity: 1, y: 0 }} // Estado final (visible en su lugar)
      transition={{ 
        duration: 0.6, // Reduced duration for snappier feel
        ease: "easeOut" // Better easing function
      }}
      style={{ willChange: 'transform, opacity' }} // Optimize for GPU acceleration
    >
      {decimalComa ? SeparadorDecimal(value) : value}
    </motion.p>
  );
};

export default AnimatedText;
