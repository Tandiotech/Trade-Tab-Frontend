import GlobalModal from '@/component/modal/GlobalModal';
import { useJournalContext } from '@/context/JournalProvider';
import { http } from '@/utils/http_request';
import { toast } from 'react-toastify';

export default function ResetEmotionalEvaluation({ currentAccount,showConfirmationModal,setShowConfirmationModal }:any) {
    
  const {setEmotional,setSentiments,fetchSentiments } = useJournalContext();

  // Función para resetear los sentimientos
  const handleConfirmReset = async () => {
    try {
      await http.post(`emotional/updateSentiments`, { account: currentAccount?._id });
      toast.success('Sentiments reset successfully');
      setEmotional({});
      setSentiments({});
      fetchSentiments();
      setShowConfirmationModal(false);
    } catch (e) {
      console.error('Error resetting sentiments:', e);
      toast.error('Error resetting sentiments. Please try again.');
    }
  };
  return (
    <GlobalModal
      isActive={showConfirmationModal}
      onClose={() => setShowConfirmationModal(false)}
      bg_color='bg-gray-800'
      width='w-1/3'
      height='h-fit'
    >
      <div className='text-center p-5'>
        <h2 className='text-2xl text-white mb-4'>Confirm Reset</h2>
        <p className='text-white text-xl mb-6'>Are you sure you want to reset your emotional evaluation?</p>
        <div className='flex justify-center gap-4'>
          <button
            onClick={handleConfirmReset}
            className='bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600'
          >
            Yes, Reset
          </button>
          <button
            onClick={() => setShowConfirmationModal(false)}
            className='bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-600'
          >
            No, Cancel
          </button>
        </div>
      </div>
    </GlobalModal>
  );
}
