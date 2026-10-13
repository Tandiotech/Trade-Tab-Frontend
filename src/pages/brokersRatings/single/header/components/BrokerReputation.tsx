import { IoFingerPrintSharp } from "react-icons/io5";

interface BrokerReputationProps {
  positiveCount: number;
  negativeCount: number;
}

/**
 * A component that visually represents a broker’s reputation:
 * - Positive ("thumbs-up") count on the left
 * - “Masked fingerprint” graphic in the center
 * - Negative ("thumbs-down") count on the right
 */
const BrokerReputation: React.FC<BrokerReputationProps> = ({
  positiveCount = 59,
  negativeCount = 10,
}) => {
  return (
    <div className='flex items-center justify-center space-x-8  rounded-md p-4 shadow-md'>
      {/* Left side: Positive count */}
      <div className='flex items-center text-green-600 space-x-2'>
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
          <path d='M2 11c0-.55.45-1 1-1h3V4c0-1.65 1.35-3 3-3 2.21 0 3.94 1.79 3.99 4l.01.28V10l4.12-5.02c.35-.43.82-.75 1.36-.94L18.95 4c1.04.31 1.75 1.27 1.82 2.34l.01.16-.05 7.64c0 1.01-.36 1.98-1.02 2.76l-4.59 5.46c-.56.67-1.29 1.13-2.12 1.31l-.31.06h-2.34c-.94 0-1.82-.34-2.5-.95l-.17-.16-3.23-3.61a2.993 2.993 0 01-.76-2.15L4 12H3c-.55 0-1-.45-1-1zm8.35-7.59c-.38-.36-.9-.54-1.42-.41-.65.17-1.15.77-1.15 1.45V11c0 .55-.45 1-1 1H4.82l.93 4.91c.08.42.28.8.58 1.11l3.23 3.61c.31.28.7.43 1.1.43h2.34c.35 0 .69-.16.93-.44l4.59-5.46c.33-.39.51-.88.51-1.39l.06-7.64c0-.42-.28-.79-.68-.91l-1.73-.51-.53.65-4.12 5.02c-.26.31-.64.49-1.05.49-.83 0-1.5-.67-1.5-1.5V4.72c0-.39-.16-.76-.45-1.03z' />
        </svg>
        <span className='text-lg font-semibold'>{positiveCount}</span>
      </div>

      {/* Center: Masked/fingerprint-like image */}
      <div className='flex-shrink-0'>
        {/* <img
          src='/images/fingerprint-mask.png'
          alt='Broker identity'
          className='h-16 w-16 object-contain'
          /> */}
          <IoFingerPrintSharp size={100} color="teal"/>
      </div>

      {/* Right side: Negative count */}
      <div className='flex items-center text-red-600 space-x-2'>
        <span className='text-lg font-semibold'>{negativeCount}</span>
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
          <path d='M22 13c0 .55-.45 1-1 1h-3v6c0 1.65-1.35 3-3 3-2.21 0-3.94-1.79-3.99-4l-.01-.28V14l-4.12 5.02c-.35.43-.82.75-1.36.94l-1.24.38C3.95 20.02 3.25 19.06 3.18 17.99l-.01-.16.05-7.64c0-1.01.36-1.98 1.02-2.76l4.59-5.46c.56-.67 1.29-1.13 2.12-1.31l.31-.06h2.34c.94 0 1.82.34 2.5.95l.17.16 3.23 3.61c.48.53.76 1.22.76 1.95l.04 4.03H21c.55 0 1 .45 1 1zm-8.35 7.59c.38.36.9.54 1.42.41.65-.17 1.15-.77 1.15-1.45V13c0-.55.45-1 1-1h1.18l-.93-4.91c-.08-.42-.28-.8-.58-1.11l-3.23-3.61c-.31-.28-.7-.43-1.1-.43h-2.34c-.35 0-.69.16-.93.44l-4.59 5.46c-.33.39-.51.88-.51 1.39l-.06 7.64c0 .42.28.79.68.91l1.73.51.53-.65L13 13.5c.26-.31.64-.49 1.05-.49.83 0 1.5.67 1.5 1.5v4.78c0 .39.16.76.45 1.03z' />
        </svg>
      </div>
    </div>
  );
};

export default BrokerReputation;
