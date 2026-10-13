import { MultiStepForm } from '../StepForm/MultiStepForm';

type ApplicationFormProps = {
  closeForm?: () => void;
  initialLocation?: string;
};

const ApplicationForm = ({ closeForm, initialLocation }: ApplicationFormProps) => {
  return (
    <div className='w-full'>
      <MultiStepForm closeForm={closeForm} initialLocation={initialLocation} />
    </div>
  );
};

export default ApplicationForm;
