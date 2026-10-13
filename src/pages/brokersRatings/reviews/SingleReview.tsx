import { FaStar } from 'react-icons/fa6';
import AnimatedText from '../../../component/AnimateText';

export default function SingleReview({ review, isPending }: { review: any; isPending: boolean }) {
  const firstLetter = review.name[0];

  return (
    <div
      key={review._id}
      className=' bg-[#041421] custom-scrollbar2  rounded-lg shadow relative p-4 w-full h-full mb-5'
    >
      {isPending && <AnimatedText value={'Pending'} textSize='text-sm' />}
      <div className='flex flex-wrap justify-between items-center mb-2'>
        <div className='flex items-center justify-center gap-1'>
          <div className='bg-[#040E18]  flex justify-center items-center text-[#0DCB8E] text-sm font-bold rounded-full h-10 w-10 md:h-8 md:w-8 lg:h-14 lg:w-14 capitalize'>
            {firstLetter}
          </div>
          <h3 className='text-lg font-bold text-white ml-1'>{review.name}</h3>
        </div>
        <div className='flex space-x-1'>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={15}
              className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>

      <p className='text-gray-300 leading-relaxed italic ' style={{ overflowWrap: 'break-word' }}>
        "{review.content}"
      </p>
      <p className='text-xs text-right opacity-50 text-gray-300 mt-2'>
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
