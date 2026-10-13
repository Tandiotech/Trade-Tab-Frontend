import { useState } from 'react';
import { toast } from 'react-toastify';
import { http } from '../../../utils/http_request';
import { Survey } from './survey';
import { RUTE_POST_SURVEY } from '../../../utils/Rutes';

interface SurveyEditProps {
  survey: Survey;
  onClose: () => void;
  onSave: () => void;
}

const SurveyEdit: React.FC<SurveyEditProps> = ({ survey, onClose, onSave }) => {
  const [formData, setFormData] = useState(survey);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await http.put(`${RUTE_POST_SURVEY}/${formData._id}`, formData);
      toast.success('Survey updated successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating survey:', error);
      toast.error('Failed to update survey');
    }
  };

  return (
    <div className='bg-slate-800 shadow-lg p-6 rounded-lg text-white border border-cyan-500'>
      <h2 className='text-2xl font-bold mb-4 text-teal-400'>Edit Survey</h2>
      <form className='space-y-4'>
        <div>
          <label htmlFor='brokerId' className='block text-teal-300 mb-1'>
            Broker
          </label>
          <input
            type='text'
            id='brokerId'
            name='brokerId'
            value={formData.brokerId}
            onChange={handleChange}
            className='w-full p-2 rounded bg-slate-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500'
          />
        </div>

        <div>
          <label htmlFor='user_id' className='block text-teal-300 mb-1'>
            User
          </label>
          <p className='w-full p-2 rounded bg-slate-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500'>
            {formData.user_id?.userName || 'Unknown User'}
          </p>
        </div>

        <div>
          <label htmlFor='comments' className='block text-teal-300 mb-1'>
            Comments
          </label>
          <textarea
            id='comments'
            name='comments'
            value={formData.comments}
            onChange={handleChange}
            className='w-full p-2 rounded bg-slate-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500'
          ></textarea>
        </div>
      </form>
      <div className='mt-6 flex space-x-4'>
        <button
          className='bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md'
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md'
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SurveyEdit;
