import { useState } from 'react';
import { ArrowLeft, Check, Loader2, Target, X } from 'lucide-react';
import { StepProps } from '../types';
import { RUTE_SLACK_JOB_APPLICATION } from '../../../../utils/Rutes';
import { http } from '../../../../utils/http_request';
import JoinOurFreeTelegram from '@/component/JoinOurFreeTelegram';
import {
  careersBtnGhost,
  careersBtnPrimary,
  careersLabelClass,
} from '../../careers/jobFormStyles';

const skills = [
  'Technical Analysis',
  'Fundamental Analysis',
  'Risk Management',
  'Algorithmic Trading',
  'Other',
];

export function Skills({ prevStep, formData, updateFormData, closeForm }: StepProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    updateFormData({
      skills: checked
        ? [...formData.skills, value]
        : formData.skills.filter(skill => skill !== value),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmittingForm(true);

    try {
      const response = await http.post(RUTE_SLACK_JOB_APPLICATION, formData);

      if (response.status === 200) {
        setModalMessage('Application submitted successfully!');
        setPopupOpen(true);
      } else {
        setModalMessage(response.data?.message || 'Error submitting application');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setModalMessage('Error submitting application. Please try again.');
      setShowModal(true);
    } finally {
      setIsSubmittingForm(false);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  return (
    <>
      <div className='flex h-full flex-col'>
        <header className='mb-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
              <Target className='h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-[var(--tt-fg-0)]'>Skills & Expertise</h2>
              <p className='text-sm text-[var(--tt-fg-2)]'>Select all that apply</p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className='flex flex-1 flex-col'>
          <div className='grid flex-1 grid-cols-1 gap-3 md:grid-cols-2'>
            {skills.map(skill => {
              const isSelected = formData.skills.includes(skill);
              return (
                <label
                  key={skill}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)]'
                      : 'border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] hover:border-[var(--tt-line-2)]'
                  }`}
                >
                  <input
                    type='checkbox'
                    name='skills'
                    value={skill}
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    className='sr-only'
                  />
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                      isSelected
                        ? 'border-[var(--tt-brand)] bg-[var(--tt-brand)] text-[oklch(0.14_0.014_250)]'
                        : 'border-[var(--tt-line-2)]'
                    }`}
                  >
                    {isSelected ? <Check className='h-4 w-4' /> : null}
                  </div>
                  <span className='text-sm font-medium text-[var(--tt-fg-0)]'>{skill}</span>
                </label>
              );
            })}
          </div>

          {formData.skills.length > 0 ? (
            <p className='mt-4 text-xs text-[var(--tt-fg-2)]'>
              <span className={careersLabelClass}>Selected: </span>
              {formData.skills.join(', ')}
            </p>
          ) : null}

          <div className='mt-6 flex justify-between'>
            <button type='button' onClick={prevStep} className={careersBtnGhost}>
              <ArrowLeft className='h-4 w-4' /> Back
            </button>
            <button
              type='submit'
              disabled={isSubmittingForm || formData.skills.length === 0}
              className={careersBtnPrimary}
              style={{ borderColor: 'var(--tt-brand)' }}
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' /> Submitting…
                </>
              ) : (
                <>
                  Submit <Check className='h-4 w-4' />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isPopupOpen ? (
        <div
          className='fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'
          role='dialog'
          aria-modal='true'
        >
          <div className='tt-panel relative max-w-md p-6'>
            <button
              type='button'
              onClick={() => {
                setPopupOpen(false);
                closeForm?.();
              }}
              className='absolute right-4 top-4 text-[var(--tt-fg-3)] hover:text-[var(--tt-fg-0)]'
              aria-label='Close'
            >
              <X className='h-5 w-5' />
            </button>
            <h2 className='mb-2 text-xl font-bold text-[var(--tt-fg-0)]'>Application received</h2>
            <p className='mb-4 text-sm text-[var(--tt-fg-2)]'>
              Thank you for applying. Connect with our team on Telegram to complete your enquiry.
            </p>
            <JoinOurFreeTelegram
              telegramLink='https://t.me/tradetabteam'
              text='Message us on Telegram'
              className='inline-flex'
              preparedMessage={`Hello, I have submitted my job application for the position of ${formData.positionInterest} at TradeTab. My name is ${formData.firstName}.`}
            />
          </div>
        </div>
      ) : null}

      {showModal && modalMessage && !isPopupOpen ? (
        <div
          className='fixed bottom-4 left-1/2 z-[110] -translate-x-1/2 rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] px-4 py-2 text-sm text-[var(--tt-fg-0)] shadow-lg'
          role='status'
        >
          {modalMessage}
        </div>
      ) : null}
    </>
  );
}
