interface Review {
  author: string;
  rating: number;
  date: string;
  content: string;
  avatar: string;
}

interface TrustpilotModalProps {
  onClose: () => void;
}

const reviews: Review[] = [
  {
    author: 'Eleanor Pena',
    rating: 5,
    date: '28 Apr 2022',
    content: 'Good experience',
    avatar: '/assets/img/team/team_img01.png',
  },
  {
    author: 'Wade Warren',
    rating: 5,
    date: '21 Mar 2022',
    content:
      'ONE OF THE BEST PLATFORMS THAT I HAVE USED TILL NOW... BEST IN EVERY DEPARTMENT. THE UI COULD BE A LITTLE BETTER THOUGH',
    avatar: '/assets/img/team/team_img01.png',
  },
  {
    author: 'Darrell Steward',
    rating: 5,
    date: '28 Jan 2022',
    content: 'Amazing user experience and easy to use interface',
    avatar: '/assets/img/team/team_img01.png',
  },
  {
    author: 'Esther Howard',
    rating: 5,
    date: '01 Dec 2021',
    content: 'Improve technology and services',
    avatar: '/assets/img/team/team_img01.png',
  },
];

const analytics = [
  { name: 'Platform', votes: 15 },
  { name: 'Charges', votes: 12 },
  { name: 'Features', votes: 88 },
  { name: 'Customer Support', votes: 100 },
  { name: 'Transparency', votes: 180 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='flex gap-0.5'>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-green-400' : 'text-gray-300'}`}
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ))}
    </div>
  );
}

export default function TrustpilotModal({ onClose }: TrustpilotModalProps) {
  const overallRating = 4.5;
  const totalReviews = 307;
  const ratingDistribution = [
    { stars: 5, percentage: 64 },
    { stars: 4, percentage: 25 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg relative max-w-4xl w-full max-h-[80vh] overflow-y-auto mx-auto'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-600 hover:text-gray-800'
        >
          X
        </button>
        <h2 className='text-2xl text-black font-bold mb-6'>Broker Name</h2>
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Overall Rating */}
          <div className='space-y-4'>
            <div className='text-6xl text-black font-bold'>{overallRating}</div>
            <StarRating rating={Math.round(overallRating)} />
            <div className='text-sm text-gray-600'>Based on {totalReviews} reviews</div>
            <button className='w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>
              View all {totalReviews} Reviews
            </button>
          </div>

          {/* Rating Distribution */}
          <div className='space-y-3'>
            {ratingDistribution.map(({ stars, percentage }) => (
              <div key={stars} className='flex items-center gap-2'>
                <div className='w-3'>{stars}</div>
                <svg
                  className='h-4 w-4 text-green-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
                <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
                  <div className='h-full bg-green-400' style={{ width: `${percentage}%` }}></div>
                </div>
                <div className='w-8 text-sm text-gray-600'>{percentage}%</div>
              </div>
            ))}
          </div>

          {/* Analytics */}
          <div className='space-y-3'>
            {analytics.map(item => (
              <div key={item.name} className='flex items-center text-slate-500 gap-2'>
                <div className='flex-1'>{item.name}</div>
                <div className='text-sm text-gray-600'>{item.votes} votes</div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className='col-span-full space-y-4'>
            {reviews.map(review => (
              <div key={review.author} className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-start gap-4'>
                  <img
                    src={review.avatar}
                    alt={review.author}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <div className='flex-1'>
                    <div className='font-semibold'>{review.author}</div>
                    <StarRating rating={review.rating} />
                    <p className='text-sm text-gray-600 mt-1'>{review.content}</p>
                  </div>
                  <div className='text-sm text-gray-500'>Posted on {review.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div className='col-span-full flex justify-center'>
            <button className='py-2 px-4 bg-green-500 text-white  rounded hover:bg-green-600 transition-colors'>
              View all {totalReviews} Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
