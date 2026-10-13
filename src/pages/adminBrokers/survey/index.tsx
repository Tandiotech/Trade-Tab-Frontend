import { useEffect, useState } from 'react';
import { http } from '../../../utils/http_request';
import { toast } from 'react-toastify';
import Loading2 from '../../../component/loader/Loading2/Loading2';
import SurveyEdit from './surveyEdit';
import SurveyView from './surveyView';
import { RUTE_POST_SURVEY } from '../../../utils/Rutes';
import GlobalModal from '../../../component/modal/GlobalModal';

interface Survey {
  _id: string;
  brokerId: string;
  user_id: { userName: string } | null;
  comments: string;
  question_1: number;
  question_2: number;
  question_3: number;
  question_4: number;
}

const AdminSurveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch surveys
  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await http.get('/survey');
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await http.delete(`${RUTE_POST_SURVEY}/${id}`);
        toast.success('Survey deleted successfully');
        fetchSurveys();
      } catch (error) {
        console.error('Error deleting survey:', error);
        toast.error('Failed to delete survey');
      }
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSurvey(null); // Resetea el survey seleccionado
  };

  const handleEdit = (survey: Survey) => {
    setSelectedSurvey(survey);
    setEditMode(true);
    openModal();
  };

  const handleView = (survey: Survey) => {
    setSelectedSurvey(survey);
    setEditMode(false);
    openModal();
  };

  return (
    <div className='bg-slate-800 w-full min-h-screen p-6 text-white'>
      <h1 className='text-2xl font-bold mb-6'>Survey Management</h1>

      {loading ? (
        <div className='flex justify-center items-center'>
          <Loading2 />
        </div>
      ) : (
        <table className='w-full bg-slate-800 border border-teal-600 rounded-lg overflow-x-auto'>
          <thead className='bg-slate-700 text-white'>
            <tr>
              <th className='py-2 px-4 text-left'>Survey ID</th>
              <th className='py-2 px-4 text-left'>Broker</th>
              <th className='py-2 px-4 text-left'>User</th>
              <th className='py-2 px-4 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map(survey => (
              <tr key={survey._id} className='hover:bg-slate-700 border-b border-slate-600'>
                <td className='py-2 px-4'>{survey._id}</td>
                <td className='py-2 px-4'>{survey.brokerId}</td>
                <td className='py-2 px-4'>{survey?.user_id?.userName || 'Unknown User'}</td>
                <td className='py-2 px-4 flex space-x-2'>
                  <button
                    className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition'
                    onClick={() => handleView(survey)}
                  >
                    View
                  </button>
                  <button
                    className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition'
                    onClick={() => handleEdit(survey)}
                  >
                    Edit
                  </button>
                  <button
                    className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition'
                    onClick={() => handleDelete(survey._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para Editar o Ver */}
      {selectedSurvey && (
        <GlobalModal isActive={isModalOpen} onClose={closeModal} height='80-[vh]'>
          {editMode ? (
            <SurveyEdit survey={selectedSurvey} onClose={closeModal} onSave={fetchSurveys} />
          ) : (
            <SurveyView survey={selectedSurvey} onClose={closeModal} />
          )}
        </GlobalModal>
      )}
    </div>
  );
};

export default AdminSurveys;
