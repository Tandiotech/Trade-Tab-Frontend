import { ArrowRight, Mail, MapPin, Phone, User } from 'lucide-react';
import {
  careersBtnPrimary,
  careersInputWithIconClass,
  careersLabelClass,
} from '../../careers/jobFormStyles';
import { StepProps } from '../types';

export function PersonalInfo({ nextStep, updateFormData, formData }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const isFormValid =
    formData.firstName && formData.lastName && formData.email && formData.phoneNumber;

  return (
    <div className='flex h-full flex-col'>
      <header className='mb-6'>
        <div className='mb-3 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
            <User className='h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-bold text-[var(--tt-fg-0)]'>Personal Information</h2>
            <p className='text-sm text-[var(--tt-fg-2)]'>Tell us about yourself</p>
          </div>
        </div>
        {formData.location ? (
          <p className='inline-flex items-center gap-1.5 rounded-full border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] px-3 py-1 text-xs text-[var(--tt-fg-2)]'>
            <MapPin className='h-3.5 w-3.5 text-[var(--tt-brand)]' />
            Applying from: <span className='font-medium text-[var(--tt-fg-0)]'>{formData.location}</span>
          </p>
        ) : null}
      </header>

      <form onSubmit={handleSubmit} className='flex flex-1 flex-col'>
        <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-2'>
          {(
            [
              { name: 'firstName', label: 'First Name *', icon: User, placeholder: 'First name' },
              { name: 'lastName', label: 'Last Name *', icon: User, placeholder: 'Last name' },
              { name: 'email', label: 'Email *', icon: Mail, placeholder: 'you@email.com', type: 'email' },
              { name: 'phoneNumber', label: 'Phone *', icon: Phone, placeholder: '+1 …' },
            ] as const
          ).map(({ name, label, icon: Icon, placeholder, type }) => (
            <div key={name} className='space-y-2'>
              <label className={careersLabelClass}>{label}</label>
              <div className='relative'>
                <Icon className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tt-fg-3)]' />
                <input
                  name={name}
                  type={type ?? 'text'}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className={careersInputWithIconClass}
                />
              </div>
            </div>
          ))}
        </div>

        <div className='mt-6 flex justify-end'>
          <button type='submit' disabled={!isFormValid} className={careersBtnPrimary}>
            Continue <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </form>
    </div>
  );
}
