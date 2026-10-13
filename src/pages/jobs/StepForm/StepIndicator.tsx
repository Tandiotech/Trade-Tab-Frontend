import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const pct = Math.round((currentStep / steps.length) * 100);

  return (
    <div className='space-y-4'>
      <div className='mb-2 text-center lg:mb-4 lg:text-left'>
        <h2 className='text-base font-bold text-[var(--tt-fg-0)]'>Application</h2>
        <p className='text-xs text-[var(--tt-fg-3)]'>
          Step {currentStep} of {steps.length}
        </p>
      </div>

      <div className='flex justify-center gap-2 lg:hidden'>
        {steps.map(step => {
          const done = currentStep > step.number;
          const active = currentStep === step.number;
          return (
            <div
              key={step.number}
              className={`h-2 flex-1 max-w-12 rounded-full transition-colors ${
                done || active ? 'bg-[var(--tt-brand)]' : 'bg-[var(--tt-bg-3)]'
              }`}
              aria-hidden
            />
          );
        })}
      </div>

      <div className='hidden space-y-2 lg:block'>
        {steps.map(step => {
          const Icon = step.icon;
          const done = currentStep > step.number;
          const active = currentStep === step.number;

          return (
            <div
              key={step.number}
              className={`rounded-lg border p-3 transition-colors ${
                active
                  ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)]'
                  : done
                    ? 'border-[var(--tt-line-2)] bg-[var(--tt-bg-2)]'
                    : 'border-[var(--tt-line-1)] bg-[var(--tt-bg-1)]'
              }`}
            >
              <div className='flex items-center gap-2'>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    done || active
                      ? 'bg-[var(--tt-brand)] text-[oklch(0.14_0.014_250)]'
                      : 'bg-[var(--tt-bg-3)] text-[var(--tt-fg-3)]'
                  }`}
                >
                  {done ? <Check className='h-4 w-4' /> : <Icon className='h-4 w-4' />}
                </div>
                <div className='min-w-0'>
                  <p
                    className={`text-xs font-medium ${
                      active ? 'text-[var(--tt-fg-0)]' : 'text-[var(--tt-fg-2)]'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className='text-[10px] text-[var(--tt-fg-3)]'>{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-3'>
        <div className='mb-1 flex justify-between text-xs'>
          <span className='text-[var(--tt-fg-3)]'>Progress</span>
          <span className='font-semibold text-[var(--tt-brand)]'>{pct}%</span>
        </div>
        <div className='h-1.5 w-full overflow-hidden rounded-full bg-[var(--tt-bg-3)]'>
          <div
            className='h-full rounded-full bg-[var(--tt-brand)] transition-all duration-500'
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
