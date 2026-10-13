import AnimatedText from '../AnimateText';

interface NoAccountsHeaderProps {
  message?: string | null;
}

export default function NoAccountsHeader({ message = null }: NoAccountsHeaderProps) {
  return (
    // <div className="flex items-center justify-between w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md">
    <div className='flex items-center justify-between w-full px-6 py-1 bg-gradient-to-r from-teal-600 to-indigo-700 text-white font-semibold shadow-md'>
      {/* Animated Example Mode Text */}
      <AnimatedText
        value='Example Mode'
        textSize='text-sm font-bold'
        fromColor='from-slate-100'
        toColor='to-slate-200'
      />

      {/* Message or Call to Action */}
      {message ? (
        <p className='text-lg md:text-xl font-bold'>{message}</p>
      ) : (
        <a
          href='/accounts'
          className='px-2 py-1 md:text-lg text-sm font-medium bg-white text-indigo-600 rounded-lg hover:bg-indigo-100 hover:text-indigo-500 transition-all duration-300'
        >
          Connect an Account
        </a>
      )}
    </div>
  );
}
