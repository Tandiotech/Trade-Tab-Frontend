import { useEffect, useState } from 'react';
import { http } from '../../../utils/http_request';
import { useNavigate } from 'react-router-dom';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await http.get('/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles', error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/articles/edit/${id}`);
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await http.delete('/articles/' + id);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article', error);
    }
  };

  return (
    <div className='max-w-5xl mx-auto p-8 bg-darkblack-700 text-white rounded-lg shadow-lg'>
      <h1 className='text-3xl font-bold text-[#02C686] mb-8 text-center'>Articles List</h1>
      <ul className='space-y-8'>
        {articles.map((article: any) => (
          <li
            key={article._id}
            className='p-6 bg-darkblack-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1'
          >
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
              <div>
                <h2 className='text-2xl font-semibold text-white'>{article.title}</h2>
                <p className='text-sm text-gray-400'>
                  Published on: {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className='flex space-x-4 mt-4 md:mt-0'>
                <button
                  onClick={() => handleEdit(article._id)}
                  className='text-[#02C686] hover:text-[#00b377] font-semibold transition duration-300'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleSoftDelete(article._id)}
                  className='text-red-500 hover:text-red-700 font-semibold transition duration-300'
                >
                  Delete
                </button>
              </div>
            </div>
            <p className='text-gray-300'>{article.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticlesList;
