import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export interface ReviewCardProps {
  key: any;
  review: any;
}

const ReviewCard = ({ key, review }: ReviewCardProps) => {
  return (
    <div
      key={key}
      className='m-2 relative mb-6 p-5 bg-slate-800 rounded-lg shadow-md w-full flex flex-col justify-between'
    >
      <div>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm text-white font-poppins antialiased'>{review.createdAt}</p>
        </div>

        <p className='text-[#DEDEDE] font-poppins antialiased whitespace-normal min-h-24'>
          {review.content}
        </p>
      </div>

      <div className='mt-3 flex justify-end gap-4'>
        <FaThumbsUp className='text-[#DEDEDE] text-2xl hover:cursor-pointer' />
        <FaThumbsDown className='text-[#DEDEDE] text-2xl hover:cursor-pointer' />
      </div>
    </div>
  );
};

export default ReviewCard;
