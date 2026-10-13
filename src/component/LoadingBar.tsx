export const LoadingBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className='w-full px-4 sm:px-0 sm:max-w-md md:max-w-lg mx-auto'>
      <div className='relative'>
        <div className='text-center pb-2 text-base sm:text-lg md:text-xl text-gray-300 font-medium'>
          Loading... {Math.round(progress)}%
        </div>
        <div className='overflow-hidden h-2 sm:h-3 md:h-4 text-xs flex rounded-full bg-gray-700'>
          <div
            style={{ width: `${progress}%` }}
            className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 transition-all duration-300 rounded-full'
          ></div>
        </div>

        {/* Loading animation dots */}
        <div className='flex justify-center mt-4'>
          <span
            className='w-3 h-3 mx-1 bg-teal-500 rounded-full animate-pulse'
            style={{ animationDelay: '0ms' }}
          ></span>
          <span
            className='w-3 h-3 mx-1 bg-teal-500 rounded-full animate-pulse'
            style={{ animationDelay: '300ms' }}
          ></span>
          <span
            className='w-3 h-3 mx-1 bg-teal-500 rounded-full animate-pulse'
            style={{ animationDelay: '600ms' }}
          ></span>
        </div>
      </div>
    </div>
  );
};