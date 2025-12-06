import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circle' | 'rounded';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
}) => {
  const baseClasses = 'animate-pulse bg-neutral-200';

  const variantClasses = {
    default: 'h-4 w-full',
    circle: 'h-10 w-10 rounded-full',
    rounded: 'h-4 w-full rounded-full',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
    />
  );
};

// Specific skeleton components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 border border-neutral-200 rounded-medium', className)}>
    <Skeleton className="h-6 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-4', className)}>
    <Skeleton className="h-6 w-1/3" />
    <Skeleton className="h-64 w-full rounded-medium" />
  </div>
);

export { Skeleton };