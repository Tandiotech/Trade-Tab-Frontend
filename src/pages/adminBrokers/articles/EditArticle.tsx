import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { http } from '../../../utils/http_request';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: '',
    content: '',
    link: '',
    status: 1,
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await http.get('/articles/' + id);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article', error);
      }
    };

    fetchArticle();
  }, [id]);

  const handleChange = (e: any) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await http.put('/articles/' + id, article);
      navigate('/articles');
    } catch (error) {
      console.error('Error updating article', error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-8 bg-darkblack-600 text-white shadow-lg rounded-lg mt-10'>
      <h1 className='text-3xl font-bold mb-6 text-center text-[#02C686]'>Edit Article</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='title' className='block text-lg font-medium text-gray-300 mb-2'>
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={article.title}
            onChange={handleChange}
            placeholder='Title'
            required
            className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
          />
        </div>

        <div>
          <label htmlFor='content' className='block text-lg font-medium text-gray-300 mb-2'>
            Content
          </label>
          <textarea
            id='content'
            name='content'
            value={article.content}
            onChange={handleChange}
            placeholder='Content'
            required
            rows={6}
            className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
          />
        </div>

        <div>
          <label htmlFor='link' className='block text-lg font-medium text-gray-300 mb-2'>
            Link
          </label>
          <input
            type='text'
            id='link'
            name='link'
            value={article.link}
            onChange={handleChange}
            placeholder='Link'
            className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
          />
        </div>

        <div>
          <label htmlFor='status' className='block text-lg font-medium text-gray-300 mb-2'>
            Status
          </label>
          <select
            id='status'
            name='status'
            value={article.status}
            onChange={handleChange}
            className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <div className='text-center'>
          <button
            type='submit'
            className='w-full bg-[#02C686] text-white py-3 rounded-lg font-semibold hover:bg-[#00b377] transition duration-300'
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
