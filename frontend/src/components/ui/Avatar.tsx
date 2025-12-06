import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 font-medium',
  {
    variants: {
      size: {
        32: 'w-8 h-8 text-sm',
        48: 'w-12 h-12 text-base',
        64: 'w-16 h-16 text-lg',
      },
    },
    defaultVariants: {
      size: 48,
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const displayText = fallback || (alt ? getInitials(alt) : '?');

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full rounded-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          displayText
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };