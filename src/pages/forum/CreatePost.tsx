import { useState } from 'react';
import { http } from '../../utils/http_request';
import getUser from '../../utils/getUser';
import { toast } from 'react-toastify';

interface CreatePostProps {
  addPost: (newPost: any) => void;
  brokerId: string;
}

export default function CreatePost({ addPost, brokerId }: CreatePostProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    content: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', content: '' };

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
      isValid = false;
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Limpiar errores al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await http.post('posts', {
        ...formData,
        brokerId,
        userId: getUser._id,
      });

      addPost(response.data); // Agregar el nuevo post a la lista
      setFormData({ title: '', content: '' }); // Limpiar el formulario
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mb-6 bg-darkblack-700 p-6 rounded-lg shadow-lg space-y-4'
    >
      <h2 className='text-2xl font-semibold text-teal-500 mb-4'>Create a New Post</h2>

      {/* Title Input */}
      <div>
        <label className='block text-sm text-gray-300 mb-1' htmlFor='title'>
          Post Title
        </label>
        <input
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2 bg-gray-900 text-white rounded-md border ${
            errors.title ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder='Enter your post title'
          disabled={loading}
        />
        {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
      </div>

      {/* Content Textarea */}
      <div>
        <label className='block text-sm text-gray-300 mb-1' htmlFor='content'>
          Content
        </label>
        <textarea
          id='content'
          name='content'
          value={formData.content}
          onChange={handleChange}
          className={`w-full p-2 bg-gray-900 text-white rounded-md border ${
            errors.content ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder='Write your post content here...'
          rows={4}
          disabled={loading}
        />
        {errors.content && <p className='text-red-500 text-sm mt-1'>{errors.content}</p>}
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={loading}
          className='bg-teal-500 px-6 py-2 rounded-md text-white hover:bg-teal-400 disabled:bg-gray-600 transition-all'
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}
