import { ArrowLeft, ArrowRight, Globe, Instagram, Music, Send, Twitter } from 'lucide-react';
import {
  careersBtnGhost,
  careersBtnPrimary,
  careersInputClass,
  careersLabelClass,
} from '../../careers/jobFormStyles';
import { StepProps } from '../types';

const socialPlatforms = [
  { name: 'instagram' as const, label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/…' },
  { name: 'twitter' as const, label: 'X (Twitter)', icon: Twitter, placeholder: 'https://twitter.com/…' },
  { name: 'tiktok' as const, label: 'TikTok', icon: Music, placeholder: 'https://tiktok.com/@…' },
  { name: 'telegram' as const, label: 'Telegram', icon: Send, placeholder: 'https://t.me/…' },
];

export function SocialMedia({ nextStep, prevStep, updateFormData, formData }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      socialMedia: { ...formData.socialMedia, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className='flex h-full flex-col'>
      <header className='mb-6'>
        <div className='mb-3 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
            <Globe className='h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-bold text-[var(--tt-fg-0)]'>Social Presence</h2>
            <p className='text-sm text-[var(--tt-fg-2)]'>Optional — helps us know your reach</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className='flex flex-1 flex-col'>
        <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-2'>
          {socialPlatforms.map(platform => {
            const Icon = platform.icon;
            const value = formData.socialMedia[platform.name] || '';
            return (
              <div
                key={platform.name}
                className={`rounded-lg border p-4 ${
                  value ? 'border-[var(--tt-brand)]/40 bg-[var(--tt-brand-dim)]' : 'border-[var(--tt-line-1)] bg-[var(--tt-bg-2)]'
                }`}
              >
                <div className='mb-3 flex items-center gap-2'>
                  <Icon className='h-4 w-4 text-[var(--tt-brand)]' />
                  <span className='text-sm font-medium text-[var(--tt-fg-0)]'>{platform.label}</span>
                </div>
                <input
                  name={platform.name}
                  placeholder={platform.placeholder}
                  value={value}
                  onChange={handleChange}
                  className={careersInputClass}
                />
              </div>
            );
          })}
        </div>
        <div className='mt-6 flex justify-between'>
          <button type='button' onClick={prevStep} className={careersBtnGhost}>
            <ArrowLeft className='h-4 w-4' /> Back
          </button>
          <button type='submit' className={careersBtnPrimary} style={{ borderColor: 'var(--tt-brand)' }}>
            Continue <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </form>
    </div>
  );
}
