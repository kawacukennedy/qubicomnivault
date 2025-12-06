import React from 'react';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

interface BannerProps {
  title: string;
  statusBadge?: {
    label: string;
    variant: 'success' | 'warning' | 'error' | 'neutral';
  };
  metrics?: Array<{
    label: string;
    value: string | number;
  }>;
  className?: string;
}

const Banner: React.FC<BannerProps> = ({
  title,
  statusBadge,
  metrics = [],
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-large border border-primary-200',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
        {statusBadge && (
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        )}
      </div>
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-sm text-neutral-600">{metric.label}</p>
              <p className="text-2xl font-semibold text-neutral-900">
                {typeof metric.value === 'number'
                  ? metric.value.toLocaleString()
                  : metric.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { Banner };