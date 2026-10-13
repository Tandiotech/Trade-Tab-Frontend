import { FaStar } from 'react-icons/fa6';
import { useState } from 'react';
import { http } from '../../../utils/http_request';
import getUser from '../../../utils/getUser';

export default function CreateNewReview({ brokerId, setIsModalOpen, reviews, setReviews }: any) {
  const [newReview, setNewReview] = useState({
    rating: 0,
    content: '',
  });

  const handleAddReview = async () => {
    try {
      const response = await http.post(`reviews`, {
        ...newReview,
        brokerId,
        userId: getUser._id,
        date: new Date().toISOString(),
      });

      if (response.status === 201) {
        setReviews([...reviews, response.data.review]);
        setNewReview({ rating: 0, content: '' });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const isSubmitDisabled = newReview.rating === 0 || newReview.content === '';

  return (
    <div className='flex items-center justify-center'>
      <div className='w-full p-5 rounded-lg'>
        <h2 className='text-2xl '>Add Review</h2>

        <div className='flex items-center mb-2'>
          <span className='mr-2'>Rating:</span>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={20}
              className={i < newReview.rating ? 'text-yellow-500' : 'text-gray-300'}
              onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
            />
          ))}
        </div>
        <textarea
          name='content'
          value={newReview.content}
          onChange={e => setNewReview({ ...newReview, content: e.target.value })}
          placeholder='Write your review...'
          className='p-2 w-full border border-gray-300 rounded-lg text-black'
          style={{ height: '180px' }} // Ajusta la altura según necesites
        ></textarea>
        <div className='flex justify-end mt-4'>
          <button
            onClick={() => setIsModalOpen(false)}
            className='mr-2 bg-red-500 text-white py-1 px-2 rounded-lg'
          >
            Cancel
          </button>

          <button
            onClick={handleAddReview}
            className={`py-1 px-2 rounded-lg text-white ${
              isSubmitDisabled ? 'bg-slate-500 cursor-not-allowed' : 'bg-green-700'
            }`}
            disabled={isSubmitDisabled}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
