import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { http } from '../../../utils/http_request';
import getUser from '../../../utils/getUser';
import { FaStar } from 'react-icons/fa';

export default function ReviewForm() {
  const { id } = useParams(); // Parámetro para identificar si se edita o crea
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: getUser?._id || '', // Añadimos userId al formulario
    brokerId: '', // Para almacenar el ID del broker seleccionado
    brokerName: '',
    username: '',
    content: '',
    rating: 0,
    images: [],
    status: 2, // Estado predefinido al crear
  });

  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Cargar la reseña existente si se proporciona un ID
  useEffect(() => {
    const fetchReview = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await http.get(`/reviews/${id}`);
          setFormData({
            userId: response.data.userId || '',
            brokerId: response.data.brokerId || '',
            username: response.data.userName || '',
            content: response.data.content || '',
            rating: response.data.rating || 0,
            images: response.data.images || [],
            status: response.data.status || 2,
          });
        } catch (error) {
          console.error('Error fetching review:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReview();
  }, [id]);

  // Buscar brokers por nombre
  useEffect(() => {
    if (searchValue.trim() !== '') {
      const fetchBrokers = async () => {
        try {
          const response = await http.get(`brokers/search?name=${encodeURIComponent(searchValue)}`);
          setBrokers(response.data.brokers);
        } catch (error) {
          console.error('Error searching brokers:', error);
        }
      };
      fetchBrokers();
    } else {
      setBrokers([]);
    }
  }, [searchValue]);

  // Manejar cambios en el formulario
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (id) {
        // Editar una reseña existente
        await http.put(`/reviews/${id}`, formData);
      } else {
        // Crear una nueva reseña
        await http.post(`/reviews`, formData);
      }
      navigate('/reviews'); // Redirigir a la lista de reseñas
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (id && loading) {
    return <p className='text-center text-lg text-gray-500 animate-pulse'>Loading...</p>;
  }

  return (
    <div className='max-w-2xl mx-auto p-8 bg-darkblack-600 text-white rounded-lg shadow-lg mt-10'>
      <h2 className='text-3xl font-bold text-[#02C686] mb-6 text-center'>
        {id ? `Edit Review for ${formData.username}` : 'Add a New Review'}
      </h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Username (solo en caso de creación) */}
        {!id && (
          <div>
            <label className='block text-lg font-medium text-gray-300 mb-2' htmlFor='username'>
              Username:
            </label>
            <input
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
              placeholder='Enter the username'
              required
            />
          </div>
        )}

        {/* Broker (solo en caso de creación) */}
        {!id && (
          <div>
            <label className='block text-lg font-medium text-gray-300 mb-2' htmlFor='brokerId'>
              Select Broker:
            </label>

            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder='Broker name'
              className='w-full p-2 mb-2 bg-darkblack-800 border border-gray-600 rounded-md'
            />

            {brokers?.map(broker => (
              <button
                type='button'
                className='bg-teal-600 hover:bg-teal-500 p-1 block m-1'
                onClick={() => {
                  setFormData({
                    ...formData,
                    brokerId: broker._id,
                    brokerName: broker.generalInformation.brokerName,
                  });
                  setSearchValue(broker.generalInformation.brokerName);
                }}
                key={broker._id}
                value={broker._id}
              >
                {broker.generalInformation.brokerName}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div>
          <label className='block text-lg font-medium text-gray-300 mb-2' htmlFor='content'>
            Content:
          </label>
          <textarea
            id='content'
            name='content'
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
            placeholder='Write your review here...'
            required
          />
        </div>

        {/* Rating */}
        <div className='flex items-center mb-2'>
          <span className='mr-2'>Rating:</span>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={20}
              className={i < formData.rating ? 'text-yellow-500' : 'text-gray-300'}
              onClick={() => setFormData({ ...formData, rating: i + 1 })}
            />
          ))}
        </div>

        {/* Status (solo en edición) */}
        {id && (
          <div>
            <label className='block text-lg font-medium text-gray-300 mb-2' htmlFor='status'>
              Status:
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
            >
              <option value='1'>Pending</option>
              <option value='2'>Accept</option>
              <option value='0'>Declined</option>
            </select>
          </div>
        )}


        {/* Submit Button */}
        <div className='flex justify-end'>
          <button
            type='submit'
            className='px-6 py-3 bg-[#02C686] text-white rounded-lg font-semibold hover:bg-[#00b377] transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02C686]'
          >
            {id ? 'Save Changes' : 'Add Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
