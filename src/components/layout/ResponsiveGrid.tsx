import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveGrid = ({
  children,
  className = '',
  cols = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md'
}: ResponsiveGridProps) => {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }[gap];

  // Build responsive column classes
  const colClasses = [
    `grid`,
    `grid-cols-${cols.xs || 1}`,
    cols.sm ? `sm:grid-cols-${cols.sm}` : '',
    cols.md ? `md:grid-cols-${cols.md}` : '',
    cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    cols.xl ? `xl:grid-cols-${cols.xl}` : ''
  ].filter(Boolean).join(' ');

  const gridClasses = twMerge(
    clsx(colClasses, gapClasses, className)
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};