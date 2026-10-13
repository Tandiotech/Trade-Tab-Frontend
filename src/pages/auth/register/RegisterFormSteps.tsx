import { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { http } from '../../../utils/http_request';
import { RUTE_USER_REGISTER } from '../../../utils/Rutes';
import { sendToZohoCRM } from './services/sendToZohoCRM';

import UsernameStep from './RegisterSteps/UsernameStep';
import CountryStep from './RegisterSteps/CountryStep';
import PhoneStep from './RegisterSteps/PhoneStep';
import AccountStep from './RegisterSteps/AccountStep';

interface FormData {
  userName: string;
  country: string;
  countryFlag?: string;
  countryCode: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const RegisterFormSteps = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [currentStep, setCurrentStep] = useState(1);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isCountrySelected, setIsCountrySelected] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [skipPhone, setSkipPhone] = useState(false);

  const password = watch('password');
  const country = watch('country');

  useEffect(() => {
    if (country) setIsCountrySelected(true);
  }, [country]);

  const validatePasswordConfirm = (value: string) => value === password || 'Passwords do not match';

  const steps = [
    { id: 1, title: 'Identity', completed: isUsernameValid },
    { id: 2, title: 'Region', completed: isCountrySelected },
    { id: 3, title: 'Phone', completed: isPhoneValid || skipPhone },
    { id: 4, title: 'Secure', completed: false },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      const response = await http.post(RUTE_USER_REGISTER, data);
      if (response.data) {
        await sendToZohoCRM(data);
        navigate('/verify-email');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return isUsernameValid;
      case 2:
        return isCountrySelected;
      case 3:
        return isPhoneValid || skipPhone;
      default:
        return false;
    }
  };

  return (
    <>
      <div className='stepper' role='tablist' aria-label='Signup progress'>
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isDone = step.completed;
          const state = isActive ? 'active' : isDone ? 'done' : '';
          return (
            <Fragment key={step.id}>
              <div className={`step ${state}`} role='tab' aria-selected={isActive}>
                <span className='num'>
                  {isDone && !isActive ? <FaCheck style={{ width: 12, height: 12 }} /> : `0${index + 1}`}
                </span>
                <span>{step.title}</span>
              </div>
              {index < steps.length - 1 && <span className='step-sep' />}
            </Fragment>
          );
        })}
      </div>

      <div className='form-card'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            className='step-pane'
          >
            {currentStep === 1 && (
              <UsernameStep
                setValue={setValue}
                watch={watch}
                onNext={nextStep}
                setIsUsernameValid={setIsUsernameValid}
              />
            )}

            {currentStep === 2 && (
              <CountryStep setValue={setValue} onNext={nextStep} onBack={prevStep} />
            )}

            {currentStep === 3 && (
              <PhoneStep
                setValue={setValue}
                watch={watch}
                setIsPhoneValid={setIsPhoneValid}
                setSkipPhone={setSkipPhone}
                onNext={nextStep}
                onBack={prevStep}
                onSkip={() => {
                  setSkipPhone(true);
                  nextStep();
                }}
              />
            )}

            {currentStep === 4 && (
              <AccountStep
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(onSubmit)}
                onBack={prevStep}
                validatePasswordConfirm={validatePasswordConfirm}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {currentStep > 1 && currentStep < steps.length && (
        <div className='btn-row'>
          <button type='button' onClick={prevStep} className='btn btn-secondary'>
            ← Back
          </button>
          <button
            type='button'
            onClick={nextStep}
            disabled={!canProceedToNext()}
            className='btn btn-primary btn-flex'
            aria-disabled={!canProceedToNext()}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
};

export default RegisterFormSteps;
