import { useEffect, useState } from 'react';
import StarRating from './StarsRating';
import { http } from '../../utils/http_request';
import getUser from '../../utils/getUser';
import { RUTE_GET_REVIEWS_PER_BROKER } from '@/utils/Rutes';
import { ReviewSkeletonLoader } from './reviews/ReviewSkeletonLoader';

export default function BrokerReviews({ broker }: any) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await http.get(
          `${RUTE_GET_REVIEWS_PER_BROKER}${broker}${getUser._id ? `?a=${getUser._id}` : ''}`
        );
        const sortedReviews = Array.isArray(data.reviews)
          ? data.reviews.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          : [];

        setReviews(sortedReviews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [broker]);

  return (
    <section className='w-full flex justify-center items-center flex-col p-2 rounded-2xl shadow-xl mt-2 gradient-border bg-gradient-to-b from-transparent via-transparent to-cyan-700 border border-cyan-800 hover:border-cyan-500 ease-in-out duration-300'>
      <div className='-flex justify-center items-center gap-3 my-5'>
        <div className='flex items-center justify-center mb-5'>
          <h1 className='font-bold text-xl md:text-3xl lg:text-4xl'>Client Reviews</h1>
          <img className='ml-2 h-8 md:h-10 lg:h-14' src='/assets/megaphone.png' alt='' />
        </div>
        <p className='text-white text-base max-lg max-w-4xl text-center px-2  md:px-10'>
          Real stories from real people. Discover how we've made a difference in our clients' lives
          and what they truly value about partnering with us. Their experiences speak louder than
          words.
        </p>
      </div>
      {/* Review component */}
      <div className='div_entry_4 w-full max-w-4xl mx-auto rounded-xl bg-[#040E18] py-7 shadow-lg '>
        <div className='overflow-y-auto max-h-[600px] custom-scrollbar bg-[#040E18] rounded-xl p-7 py-0 space-y-6 shadow-inner'>
          <ul className=''>
            {loading ? (
              <ReviewSkeletonLoader style={'entry'} count={5} />
            ) : (
              reviews.map(review => (
                <li
                  key={review._id}
                  className=' mb-3 py-6 px-4 bg-[#041421] rounded-md shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300'
                >
                  <div className='flex md:justify-between md:items-center mb-3 flex-col items-start md:flex-row '>
                    <div className='flex items-center justify-center gap-1'>
                      <div className='flex justify-center items-center text-[#0DCB8E] text-sm font-bold rounded-full h-10 w-10 md:h-10 md:w-10 lg:h-14 lg:w-14 bg-[#040E18] capitalize'>
                        {review.name?.charAt(0).toUpperCase() ?? ''}
                      </div>
                      <div className='flex flex-wrap'>
                        <h3 className='text-lg font-bold text-white ml-1'>{review.name}</h3>
                      </div>
                    </div>
                    <div>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>

                  <p className='text-gray-300 leading-relaxed italic'>"{review.content}"</p>
                  <p className='text-xs text-right opacity-50 text-gray-300 mt-2'>
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
