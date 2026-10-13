export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    telegram?: string;
  };
  positionInterest: string;
  experienceYears: string;
  skills: string[];
};

export type StepProps = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  closeForm?: () => void;
};
