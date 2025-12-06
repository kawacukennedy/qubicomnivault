import React from 'react';
import { cn } from '../../utils/cn';

interface Step {
  label: string;
  completed?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                index < currentStep
                  ? 'bg-success-500 text-white'
                  : index === currentStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 text-neutral-600'
              )}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={cn(
                'mt-2 text-sm',
                index <= currentStep ? 'text-primary-700' : 'text-neutral-500'
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-4',
                index < currentStep ? 'bg-success-500' : 'bg-neutral-200'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export { Stepper };