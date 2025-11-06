import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  glowEffect?: boolean;
  borderGlow?: boolean;
  elevation?: 'low' | 'medium' | 'high';
}

export const Card = ({ 
  children, 
  className = '', 
  animate = true,
  hoverEffect = true,
  padding = 'md',
  glowEffect = true,
  borderGlow = true,
  elevation = 'medium'
}: CardProps) => {
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

  // Base glass card classes with premium effects
  const baseClasses = `glass-card rounded-xl relative z-10 ${paddingClasses} ${elevationClasses}`;
  
  // Hover effect class
  const hoverClass = hoverEffect ? 'glass-card-hover' : '';
  
  // Glow effect class
  const glowClass = glowEffect ? 'transition-all duration-300' : '';
  
  // Gradient border effect - replacing standard border with gradient border
  const borderGlowClass = borderGlow ? 'gradient-border' : '';

  const cardClasses = `${baseClasses} ${hoverClass} ${glowClass} ${borderGlowClass} ${className}`;

  // Animation styles
  const animationStyle = animate ? {
    animation: 'fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
  } : {};

  // If borderGlow is enabled, wrap the card in a gradient border container
  if (borderGlow) {
    return (
      <div className="gradient-border-container">
        <div
          className={cardClasses}
          style={animationStyle}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cardClasses}
      style={animationStyle}
    >
      {children}
    </div>
  );
};