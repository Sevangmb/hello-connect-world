
import React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4'
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('animate-spin rounded-full border-solid border-primary border-r-transparent', sizeClasses[size], className)}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
