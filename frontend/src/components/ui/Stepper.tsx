import React from 'react';
import { cn } from '../../utils/cn';

interface Step {
  id: string;
  label: string;
  completed?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-center space-x-4', className)}>
      {steps.map((step, index) => {
        const isCompleted = step.completed || index < currentStep;
        const isCurrent = index === currentStep;
        const isActive = isCompleted || isCurrent;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                  {
                    'bg-primary-500 text-white': isCompleted,
                    'bg-primary-100 text-primary-600 border-2 border-primary-500': isCurrent,
                    'bg-neutral-200 text-neutral-600': !isActive,
                  }
                )}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium text-center',
                  {
                    'text-primary-600': isActive,
                    'text-neutral-600': !isActive,
                  }
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 transition-colors',
                  {
                    'bg-primary-500': isCompleted,
                    'bg-neutral-200': !isCompleted,
                  }
                )}
                style={{ minWidth: '40px' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export { Stepper };