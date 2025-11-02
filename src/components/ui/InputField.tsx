import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  className?: string;
  glowEffect?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

export const InputField = ({ 
  label, 
  icon, 
  className = '', 
  glowEffect = true,
  error,
  variant = 'default',
  ...props 
}: InputFieldProps) => {
  // Base input classes with premium styling
  const baseClasses = `w-full glass-card text-white rounded-xl transition-all duration-300 focus:outline-none backdrop-blur-sm`;
  
  // Variant classes
  const variantClasses = {
    default: 'bg-[hsl(var(--color-surface)/0.8)] border-2',
    filled: 'bg-[hsl(var(--color-surface)/0.8)]',
    outlined: 'bg-transparent border-2'
  }[variant];
  
  // Glow effect class
  const glowClass = glowEffect ? 'focus:shadow-glow' : '';
  
  // Error state classes
  const errorClass = error ? 'border-red-500 focus:ring-red-500' : '';
  
  // Combined input classes
  const inputClasses = `${baseClasses} ${variantClasses} ${glowClass} ${errorClass} ${className}`;

  return (
    <div className="w-full">
      {label && <label className="block text-sm text-gray-300 mb-2 font-semibold uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-[hsl(var(--color-primary))]">
            {icon}
          </div>
        )}
        <input
          className={`${inputClasses} ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-[hsl(var(--color-primary)/0.25)] focus:border-[hsl(var(--color-primary))] focus:bg-[hsl(var(--color-surface)/0.9)]`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-error mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};