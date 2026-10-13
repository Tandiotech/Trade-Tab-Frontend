import { ArrowLeft, ArrowRight, Briefcase, ChevronDown, TrendingUp } from 'lucide-react';
import {
  careersBtnGhost,
  careersBtnPrimary,
  careersInputWithIconClass,
  careersLabelClass,
} from '../../careers/jobFormStyles';
import { StepProps } from '../types';

const positions = [
  'Technical Trader',
  'Fundamental Trader',
  'Risk Management Specialist',
  'Marketing',
  'Administration',
  'Analyst',
  'Recruiter',
  'Other',
];

const experienceLevels = ['Less than 1 year', '1-3 years', '4-6 years', '+7 years'];

const selectClass = `${careersInputWithIconClass} appearance-none cursor-pointer pr-10`;

export function Expertise({ nextStep, prevStep, updateFormData, formData }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const isFormValid = formData.positionInterest && formData.experienceYears;

  return (
    <div className='flex h-full flex-col'>
      <header className='mb-6'>
        <div className='mb-3 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
            <Briefcase className='h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-bold text-[var(--tt-fg-0)]'>Position & Experience</h2>
            <p className='text-sm text-[var(--tt-fg-2)]'>Your role and track record</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className='flex flex-1 flex-col'>
        <div className='flex flex-1 flex-col gap-6'>
          <div className='space-y-2'>
            <label className={careersLabelClass}>Desired position *</label>
            <div className='relative'>
              <Briefcase className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tt-fg-3)]' />
              <select
                name='positionInterest'
                value={formData.positionInterest}
                onChange={handleChange}
                required
                className={selectClass}
              >
                <option value=''>Select position</option>
                {positions.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tt-fg-3)]' />
            </div>
          </div>

          <div className='space-y-2'>
            <label className={careersLabelClass}>Experience level *</label>
            <div className='relative'>
              <TrendingUp className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tt-fg-3)]' />
              <select
                name='experienceYears'
                value={formData.experienceYears}
                onChange={handleChange}
                required
                className={selectClass}
              >
                <option value=''>Select experience</option>
                {experienceLevels.map(l => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tt-fg-3)]' />
            </div>
          </div>
        </div>

        <div className='mt-6 flex justify-between'>
          <button type='button' onClick={prevStep} className={careersBtnGhost}>
            <ArrowLeft className='h-4 w-4' /> Back
          </button>
          <button type='submit' disabled={!isFormValid} className={careersBtnPrimary} style={{ borderColor: 'var(--tt-brand)' }}>
            Continue <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </form>
    </div>
  );
}
