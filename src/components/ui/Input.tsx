import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glowEffect?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    fullWidth = true, 
    glowEffect = true,
    variant = 'default',
    ...props 
  }, ref) => {
    // Base input classes with unified border styles
    const baseClasses = 'input-field transition-all duration-200 backdrop-blur-sm rounded-lg';
    
    // Variant classes - using gradient borders instead of standard borders
    const variantClasses = {
      default: '',
      filled: 'bg-[hsl(var(--color-surface)/0.8)]',
      outlined: 'bg-transparent'
    }[variant];
    
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
    const widthClasses = fullWidth ? 'w-full' : '';
    const glowClasses = glowEffect ? 'focus:shadow-glow' : '';

    const inputClasses = twMerge(
      clsx(baseClasses, variantClasses, errorClasses, widthClasses, glowClasses, className)
    );

    // For outlined variant, wrap in gradient border container
    const renderInput = () => (
      <input
        ref={ref}
        className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
        {...props}
      />
    );

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-sm font-semibold text-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">
              {leftIcon}
            </div>
          )}
          {variant === 'outlined' ? (
            <div className="gradient-border-container-input">
              {renderInput()}
            </div>
          ) : (
            renderInput()
          )}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-error mt-1 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';