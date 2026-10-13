import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type OnboardingStep = 'welcome' | 'features' | 'preview' | 'connect' | 'complete';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  isOnboardingActive: boolean;
  hasCompletedOnboarding: boolean;
  startOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  goToStep: (step: OnboardingStep) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'tradetab_onboarding_completed';
const ONBOARDING_STEP_KEY = 'tradetab_onboarding_step';

const STEPS: OnboardingStep[] = ['welcome', 'features', 'preview', 'connect'];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load onboarding state from localStorage
  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    const savedStep = localStorage.getItem(ONBOARDING_STEP_KEY) as OnboardingStep | null;
    
    setHasCompletedOnboarding(completed);
    
    if (!completed && savedStep && STEPS.includes(savedStep)) {
      setCurrentStep(savedStep);
      setIsOnboardingActive(true);
    } else if (!completed) {
      setIsOnboardingActive(true);
      setCurrentStep('welcome');
    }
  }, []);

  const startOnboarding = useCallback(() => {
    setIsOnboardingActive(true);
    setCurrentStep('welcome');
    localStorage.setItem(ONBOARDING_STEP_KEY, 'welcome');
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      const currentIndex = STEPS.indexOf(prev);
      if (currentIndex < STEPS.length - 1) {
        const next = STEPS[currentIndex + 1];
        localStorage.setItem(ONBOARDING_STEP_KEY, next);
        return next;
      }
      return prev;
    });
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => {
      const currentIndex = STEPS.indexOf(prev);
      if (currentIndex > 0) {
        const prevStep = STEPS[currentIndex - 1];
        localStorage.setItem(ONBOARDING_STEP_KEY, prevStep);
        return prevStep;
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((step: OnboardingStep) => {
    if (STEPS.includes(step) || step === 'complete') {
      setCurrentStep(step);
      if (step !== 'complete') {
        localStorage.setItem(ONBOARDING_STEP_KEY, step);
      }
    }
  }, []);

  const skipOnboarding = useCallback(() => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    localStorage.removeItem(ONBOARDING_STEP_KEY);
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
    setCurrentStep('complete');
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    localStorage.removeItem(ONBOARDING_STEP_KEY);
  }, []);

  const resetOnboarding = useCallback(() => {
    setIsOnboardingActive(true);
    setCurrentStep('welcome');
    setHasCompletedOnboarding(false);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    localStorage.setItem(ONBOARDING_STEP_KEY, 'welcome');
  }, []);

  const value: OnboardingContextType = {
    currentStep,
    isOnboardingActive,
    hasCompletedOnboarding,
    startOnboarding,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    resetOnboarding,
    goToStep,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

