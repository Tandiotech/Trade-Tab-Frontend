import { Link } from 'react-router-dom';
import AnimatedText from './AnimateText';

export default function ButtonConnectAccountForFree() {
  return (
    <Link
      to='/signup'
      className='fixed px-4 py-2 font-sans shadow-xl rounded-lg text-xl  text-white bg-teal-600 hover:bg-teal-500 hover:text-white bottom-10 left-10 transform z-50'
    >
      <AnimatedText
        value={'Connect Your Account For Free'}
        textSize={'text-xl leading-[24px] text-center'}
        fromColor='from-slate-200'
        toColor='to-slate-100'
      />
    </Link>
  );
}
