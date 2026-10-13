import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Globe, Target, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { PersonalInfo } from './Steps/PersonalInfo';
import { SocialMedia } from './Steps/SocialMedia';
import { Expertise } from './Steps/Expertise';
import { Skills } from './Steps/Skills';
import { FormData } from './types';

const steps: {
  number: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    number: 1,
    title: 'Personal Information',
    subtitle: 'Tell us about yourself',
    icon: User,
    description: 'Basic contact details',
  },
  {
    number: 2,
    title: 'Social Presence',
    subtitle: 'Your online profiles',
    icon: Globe,
    description: 'Social media links',
  },
  {
    number: 3,
    title: 'Position & Experience',
    subtitle: 'Your expertise level',
    icon: Briefcase,
    description: 'Role and experience',
  },
  {
    number: 4,
    title: 'Skills & Expertise',
    subtitle: 'Your capabilities',
    icon: Target,
    description: 'Technical skills',
  },
];

function buildInitialFormData(location?: string): FormData {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: location ?? '',
    socialMedia: {
      instagram: '',
      twitter: '',
      tiktok: '',
      telegram: '',
    },
    positionInterest: '',
    experienceYears: '',
    skills: [],
  };
}

type MultiStepFormProps = {
  initialLocation?: string;
  closeForm?: () => void;
};

export function MultiStepForm({ initialLocation, closeForm }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => buildInitialFormData(initialLocation));

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    const props = { formData, updateFormData, nextStep, prevStep, closeForm };

    switch (currentStep) {
      case 1:
        return <PersonalInfo {...props} />;
      case 2:
        return <SocialMedia {...props} />;
      case 3:
        return <Expertise {...props} />;
      case 4:
        return <Skills {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className='w-full'>
      <div className='overflow-hidden rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)]'>
        <div className='grid min-h-[420px] grid-cols-1 lg:grid-cols-5 lg:min-h-[500px]'>
          <div className='border-b border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-4 lg:col-span-2 lg:border-b-0 lg:border-r'>
            <StepIndicator currentStep={currentStep} steps={steps} />
          </div>
          <div className='p-4 md:p-6 lg:col-span-3'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className='h-full'
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
