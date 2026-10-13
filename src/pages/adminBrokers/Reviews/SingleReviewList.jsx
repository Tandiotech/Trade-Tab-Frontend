import { Link } from 'react-router-dom';

export default function SingleReviewList({review}) {
  return (
    <li
      key={review._id}
      className='p-3 h-full bg-darkblack-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1'
    >
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
        <div>
          <h3 className='text-xl font-semibold text-white'>{review.userName}</h3>
          <p className='text-sm text-gray-400'>Broker: {review.brokerName}</p>
        </div>
        <Link
          to={`/reviews/${review._id}`}
          className='mt-2 md:mt-0 text-[#02C686] hover:text-[#00b377] font-semibold transition duration-300'
        >
          View / Edit
        </Link>
      </div>
      <p className='text-gray-300 mb-3'>{review.content}</p>
      <p className='text-sm text-gray-400 mb-2'>Rating: {review.rating} / 5</p>
      <p
        className={`text-sm font-medium mt-2 ${
          review.status === 2
            ? 'text-green-500'
            : review.status === 1
              ? 'text-yellow-500'
              : 'text-red-500'
        }`}
      >
        Status: {review.status === 2 ? 'Accepted' : review.status === 1 ? 'Pending' : 'Declined'}
      </p>
    </li>
  );
}
