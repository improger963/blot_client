import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  animated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  elevation?: 'low' | 'medium' | 'high';
}

export const GlassCard = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  animated = true,
  padding = 'md',
  elevation = 'medium'
}: GlassCardProps) => {
  // Padding classes based on prop
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }[padding];

  // Elevation classes based on prop
  const elevationClasses = {
    low: 'shadow-glass',
    medium: 'shadow-premium',
    high: 'shadow-elevated'
  }[elevation];

  const baseClasses = `glass-card rounded-2xl relative z-10 border border-[hsl(var(--color-primary)/0.1)] ${elevationClasses}`;
  
  const hoverClasses = hoverEffect 
    ? 'glass-card-hover' 
    : '';
    
  const animatedClasses = animated 
    ? 'animate-in' 
    : '';

  const cardClasses = twMerge(
    clsx(baseClasses, paddingClasses, hoverClasses, animatedClasses, className)
  );

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};