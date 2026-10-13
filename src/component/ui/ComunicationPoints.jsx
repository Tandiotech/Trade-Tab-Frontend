import { OFFICIAL_TELEGRAM } from '@/utils/GlobalVars';
import { FaTelegram } from 'react-icons/fa';

export default function ComunicationPoints() {
  return (
    <div className='flex justify-center m-1'>
      <a
        href={OFFICIAL_TELEGRAM}
        target='_blank'
        rel='noreferrer'
        className='
          bg-[#229ED9] 
          rounded-full 
          flex items-center justify-center 
          text-white font-bold shadow-black
          transition-transform hover:scale-105 
          w-12 h-12             
          md:w-auto md:h-auto 
          md:p-2 lg:p-0 md:rounded-xl lg:px-2 
        '
      >
        <FaTelegram className='text-white size-9 md:size-7 lg:size-10' />
        <span className='hidden md:block text-sm px-1'>Join our Telegram</span>
      </a>
    </div>
  );
}
