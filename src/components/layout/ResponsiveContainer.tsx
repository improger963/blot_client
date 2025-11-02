// src/components/layout/ResponsiveContainer.tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none';
}

export const ResponsiveContainer = ({
  children,
  className = '',
  fluid = false,
  padding = 'md',
  margin = 'none',
  maxWidth = 'none'
}: ResponsiveContainerProps) => {
  // Base container classes
  const baseClasses = fluid ? 'w-full' : 'responsive-container';
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }[padding];
  
  // Margin classes
  const marginClasses = {
    none: 'm-0',
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8'
  }[margin];
  
  // Max width classes
  const maxWidthClasses = maxWidth !== 'none' ? `max-w-${maxWidth}` : '';
  
  const containerClasses = twMerge(
    clsx(
      baseClasses,
      paddingClasses,
      marginClasses,
      maxWidthClasses,
      className
    )
  );
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;