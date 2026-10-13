import { useState, useEffect } from 'react';
import GlobalModal from '../../../component/modal/GlobalModal.jsx';
import CreateNewReview from './CreateNewReview.tsx';
import SingleReview from './SingleReview.tsx';
import { http } from '../../../utils/http_request.tsx';
// import AuthUser from '../../../hook/useAuthUser.tsx';
import getUser from '../../../utils/getUser.tsx';
import { ReviewSkeletonLoader } from './ReviewSkeletonLoader.tsx';
import { safeConsoleLog } from '@/utils/safeConsoleLog.ts';

const ClientsReviews: React.FC<{ brokerId: string; pending: boolean }> = ({
  brokerId,
  pending,
}) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const { isLoggedIn } = useAuthUser();

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const url = `reviews/perBroker/${brokerId}${getUser._id ? `?a=${getUser._id}` : ''}`;
        const { data } = await http.get(url);
        safeConsoleLog(`Reviews: ${data.reviews}`);

        // Sort reviews by newest first and keep only the first 5
        const sortedReviews = Array.isArray(data.reviews)
          ? data.reviews
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              .slice(0, 5)
          : [];

        setReviews(sortedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [brokerId]);

  return (
    <div className=' md:col-span-4 col-span-12  p-1 md:p-2 rounded-lg '>
      {/* <GlobalModal
        isActive={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        height='h-[60vh] lg:h-[50vh]'
        width='w-[70vw]'
      >
        {isLoggedIn() ? (
          <CreateNewReview
            brokerId={brokerId}
            reviews={reviews}
            setReviews={setReviews}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <h3 className='mb-6 bg-darkblack-700 p-6 rounded-lg shadow-lg'>
            Please log in to add a review.
          </h3>
        )}
      </GlobalModal> */}

      <div className='flex items-center flex-wrap justify-between gap-2 px-3 md:px-5'>
        <h2 className='font-bold text-xl lg:text-3xl mt-1 md:mt-0'>
          {pending ? 'Pending Reviews' : 'Client Reviews'}
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className={`text-white text-sm px-5  bg-[#149327] rounded-lg py-2 justify-center cursor-pointer animate-glow`}
        >
          Write a Review
        </button>
      </div>

      <div className='px-1 md:pr-2 h-[500px] overflow-y-scroll overflow-x-hidden custom-scrollbar2 mt-5 w-full'>
        {isLoading ? (
          <ReviewSkeletonLoader count={3} />
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className={`flex items-center px-2 md:px-0 `}>
              <SingleReview
                review={review}
                isPending={getUser?.userName === review.name && review.status === 1}
              />
            </div>
          ))
        ) : (
          <div className='w-full text-center py-6'>
            <p className='text-base mb-2'>No reviews available yet.</p>
            <p className='text-sm text-gray-500'>Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsReviews;
