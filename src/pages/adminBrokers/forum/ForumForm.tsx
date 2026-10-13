import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../../../utils/http_request';
import getUser from '../../../utils/getUser';
import { toast } from 'react-toastify';
import { useFetchData } from '../../../hook/fetchData';

export default function ForumForm() {
  const { id } = useParams(); // Identificar si se edita o crea

  const initialFormState = {
    userId: getUser?._id || '',
    brokerId: '',
    brokerName: '',
    title: '',
    content: '',
    status: 2, // Status por defecto al crear
    votes: [], // Votos iniciales
    comments: [], // Comentarios iniciales
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newComment, setNewComment] = useState(''); // Nuevo comentario
  const [searchValue, setSearchValue] = useState(''); // Valor del campo de búsqueda de brokers

  // Usamos `useFetchData` para cargar el post cuando se edita
  const { data: postData, loading: postLoading } = useFetchData(`/posts/${id}`, {});
  const {
    data: brokers,
    loading: brokersLoading,
    setParams: setBrokerSearch,
  } = useFetchData('/brokers/search?', { name: '' });
  // `/brokers/search?name=${encodeURIComponent(searchValue)}`
  // Actualizamos el formulario con los datos del post si existe
  useEffect(() => {
    if (postData && id) {
      setFormData({
        userId: postData.userId || '',
        brokerId: postData.brokerId || '',
        brokerName: postData.brokerName || '',
        title: postData.title || '',
        content: postData.content || '',
        status: postData.status || 2,
        votes: postData.votes || [],
        comments: postData.comments || [],
      });
    }
  }, [postData, id]);

  // Actualizar búsqueda de brokers
  useEffect(() => {
    if (searchValue.trim() !== '') {
      setBrokerSearch({ name: searchValue });
    }
  }, [searchValue, setBrokerSearch]);

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Agregar un comentario al formulario
  const addComment = () => {
    if (newComment.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        comments: [...prev.comments, { userId: getUser._id, content: newComment }],
      }));
      setNewComment('');
    }
  };

  // Agregar un "like"
  const addLike = () => {
    const userId = getUser._id;
    const existingVote = formData.votes.find((vote: any) => vote.userId === userId);
    if (!existingVote) {
      setFormData((prev: any) => ({
        ...prev,
        votes: [...prev.votes, { userId, type: 'like' }],
      }));
      toast.success('You liked this post!');
    } else {
      toast.error('You have already voted!');
    }
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await http.put(`/posts/${id}`, formData); // Actualizar post existente
        toast.success('Post updated successfully');
      } else {
        await http.post(`/posts`, formData); // Crear nuevo post
        toast.success('Post added successfully');
        setFormData(initialFormState); // Limpiar formulario
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('Error submitting post');
    }
  };

  if (id && postLoading) {
    return <p className='text-center text-lg text-gray-500 animate-pulse'>Loading...</p>;
  }

  return (
    <div className='max-w-2xl mx-auto p-8 bg-darkblack-600 text-white rounded-lg shadow-lg mt-10'>
      <h2 className='text-3xl font-bold text-[#02C686] mb-6 text-center'>
        {id ? 'Edit Post' : 'Create a New Forum Post'}
      </h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Título */}
        <div>
          <label className='block text-lg font-medium text-gray-300 mb-2' htmlFor='title'>
            Title:
          </label>
          <input
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
            placeholder='Enter the post title'
            required
          />
        </div>

        {/* Broker */}
        {!id && (
          <div>
            <label className='block text-lg font-medium text-gray-300 mb-2'>Select Broker:</label>
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder='Search for a broker...'
              className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
            />
            <ul className='mt-2 space-y-1'>
              {brokersLoading ? (
                <li className='text-gray-400'>Searching...</li>
              ) : (
                brokers?.brokers?.map((broker: any) => (
                  <li
                    key={broker._id}
                    className='cursor-pointer bg-teal-600 hover:bg-teal-500 p-2 rounded-md text-white'
                    onClick={() => {
                      setFormData({
                        ...formData,
                        brokerId: broker._id,
                        brokerName: broker.generalInformation.brokerName,
                      });
                      setSearchValue(broker.generalInformation.brokerName);
                    }}
                  >
                    {broker.generalInformation.brokerName}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

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

        {/* Contenido */}
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
            placeholder='Write your post here...'
            required
          />
        </div>

        {/* Comentarios */}
        <div>
          <label className='block text-lg font-medium text-gray-300 mb-2'>Add Comment:</label>
          <input
            type='text'
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
            placeholder='Write a comment...'
          />
          <button
            type='button'
            onClick={addComment}
            className='mt-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500'
          >
            Add Comment
          </button>
          <ul className='mt-2'>
            {formData.comments.map((comment: any, index: number) => (
              <li key={index} className='text-gray-400 mt-1'>
                {comment.content}
              </li>
            ))}
          </ul>
        </div>

        {/* Likes */}
        <div className='flex justify-between items-center'>
          <button
            type='button'
            onClick={addLike}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400'
          >
            Like
          </button>
          <span className='text-gray-300'>
            {formData.votes.filter((vote: any) => vote.type === 'like').length} Likes
          </span>
        </div>

        {/* Botón de envío */}
        <div className='flex justify-end'>
          <button
            type='submit'
            className='px-6 py-3 bg-[#02C686] text-white rounded-lg font-semibold hover:bg-[#00b377] transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02C686]'
          >
            {id ? 'Save Changes' : 'Add Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
