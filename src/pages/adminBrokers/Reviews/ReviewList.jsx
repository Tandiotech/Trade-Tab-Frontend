import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchData } from '../../../hook/fetchData';
import SingleReviewList from './SingleReviewList';
import { useDebounce } from '../../../hook/useDebounce';

export default function ReviewList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Construir parámetros para el fetch
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const params = new URLSearchParams();
  if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
  // if (searchQuery) params.append('search', searchQuery);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);


  // Usar el hook para manejar el fetch
  const { data: reviews, loading } = useFetchData(`reviews?${params.toString()}`);

  if (loading) {
    return <p className='text-center text-lg text-gray-500 animate-pulse'>Loading...</p>;
  }

  return (
    <div className='mx-auto p-6 w-10/12 text-white rounded-lg shadow-lg'>
      <h1 className='text-3xl font-bold text-center text-[#02C686] mb-8'>Reviews List</h1>

      {/* Filtros */}
      <div className='flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0'>
        {/* Búsqueda */}
        <input
          type='text'
          placeholder='Search by title or broker...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='w-full md:w-1/3 p-2 bg-darkblack-800 text-white border border-gray-600 rounded-md'
        />

        {/* Rango de fechas */}
        <div className='flex space-x-4 items-center'>
          <div>
            <label className='block text-sm text-gray-400 mb-1'>Start Date:</label>
            <input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className='p-2 bg-darkblack-800 text-white border border-gray-600 rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm text-gray-400 mb-1'>End Date:</label>
            <input
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className='p-2 bg-darkblack-800 text-white border border-gray-600 rounded-md'
            />
          </div>
        </div>

        {/* Botón para reiniciar filtros */}
        <button
          onClick={() => {
            setSearchQuery('');
            setStartDate('');
            setEndDate('');
          }}
          className='p-2 bg-red-500 hover:bg-red-600 text-white rounded-md'
        >
          Reset Filters
        </button>
      </div>

      {/* Botón para agregar una nueva reseña */}
      <Link
        to={`/reviews/add`}
        className='block mb-6 text-center bg-teal-700 p-4 text-white rounded-md hover:bg-teal-600'
      >
        Add Review
      </Link>

      {/* Lista de reseñas */}
      <ul className='grid grid-cols-3 gap-2'>
        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <SingleReviewList key={review._id} review={review}/>
          ))
        ) : (
          <p className='text-center text-gray-400'>No reviews found.</p>
        )}
      </ul>
    </div>
  );
}
