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
  // Padding classes based on prop using standardized spacing
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

  const baseClasses = `glass-card rounded-xl relative z-10 ${elevationClasses}`;
  
  const hoverClasses = hoverEffect 
    ? 'glass-card-hover' 
    : '';
    
  const animatedClasses = animated 
    ? 'animate-in' 
    : '';

  const cardClasses = twMerge(
    clsx(baseClasses, paddingClasses, hoverClasses, animatedClasses, className)
  );

  // Wrap the card in a gradient border container
  return (
    <div className="gradient-border-container">
      <div className={cardClasses}>
        {children}
      </div>
    </div>
  );
};