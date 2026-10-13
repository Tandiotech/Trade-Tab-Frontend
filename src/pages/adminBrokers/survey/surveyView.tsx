import { Survey } from './survey';

interface SurveyViewProps {
  survey: Survey;
  onClose: () => void;
}

const SurveyView: React.FC<SurveyViewProps> = ({ survey, onClose }) => {
  return (
    <div className='bg-slate-800 shadow-lg p-6 rounded-lg text-white border border-cyan-500'>
      <h2 className='text-2xl font-bold mb-4 text-teal-400'>Survey Details</h2>
      <div className='space-y-4'>
        <p>
          <strong className='text-teal-300'>Broker:</strong> {survey.brokerId}
        </p>
        <p>
          <strong className='text-teal-300'>User:</strong>{' '}
          {survey?.user_id?.userName || 'Unknown User'}
        </p>
        <p>
          <strong className='text-teal-300'>Question 1:</strong> {survey.question_1}
        </p>
        <p>
          <strong className='text-teal-300'>Question 2:</strong> {survey.question_2}
        </p>
        <p>
          <strong className='text-teal-300'>Question 3:</strong> {survey.question_3}
        </p>
        <p>
          <strong className='text-teal-300'>Question 4:</strong> {survey.question_4}
        </p>
        <p>
          <strong className='text-teal-300'>Comments:</strong> {survey.comments || 'No comments'}
        </p>
      </div>
      <button
        className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md mt-6'
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default SurveyView;
