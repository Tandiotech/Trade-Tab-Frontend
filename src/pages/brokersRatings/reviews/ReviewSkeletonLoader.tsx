interface ReviewSkeletonLoaderProps {
  style?: String;
  count?: number;
}
export const ReviewSkeletonLoader: React.FC<ReviewSkeletonLoaderProps> = ({ style, count = 3 }) => {
  return (
    <div className='w-full'>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={` ${style == 'entry' ? 'div_entry_5' : 'div_entry'} flex items-start space-x-4 p-4 mb-4 bg-sky-600 bg-opacity-5  rounded-lg animate-pulse`}
          >
            {/* Avatar skeleton */}
            <div className='w-12 h-12 bg-gray-800 rounded-full'></div>

            <div className='flex-1'>
              {/* Name and date skeleton */}
              <div className='flex justify-between items-center mb-2'>
                <div className='h-4 bg-gray-800 rounded w-1/4'></div>
                <div className='h-3 bg-gray-800 rounded w-1/6'></div>
              </div>

              {/* Rating skeleton */}
              <div className='flex mb-2'>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className='w-5 h-5 mr-1 bg-gray-800 rounded'></div>
                  ))}
              </div>

              {/* Review text skeleton */}
              <div className='space-y-2'>
                <div className='h-3 bg-gray-800 rounded w-full'></div>
                <div className='h-3 bg-gray-800 rounded w-5/6'></div>
                <div className='h-3 bg-gray-800 rounded w-4/6'></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
