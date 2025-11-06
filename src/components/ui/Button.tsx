// src/components/ui/Button.tsx

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Button size.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Loading state. Button will be disabled and content replaced with spinner.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Icon to the left of button text.
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to the right of button text.
   */
  rightIcon?: React.ReactNode;
  /**
   * Glow effect on hover.
   * @default true
   */
  glowEffect?: boolean;
  /**
   * Uppercase text transformation.
   * @default true
   */
  uppercase?: boolean;
}

/**
 * @description Base, reusable button component with style variants and states.
 * Ensures consistent appearance and behavior for all interactive elements.
 * @example
 * <Button variant="primary" size="lg" onClick={() => {}}>
 *   Click me
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      glowEffect = true,
      uppercase = true,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles for all buttons
    const baseStyles = 'btn focus-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative overflow-hidden';

    // Styles for different variants - updated for premium design
    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      danger: 'btn-danger',
      success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    };

    // Styles for different sizes - responsive with unified border radius
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-[0.65rem] sm:text-xs gap-1.5 rounded-lg font-semibold',
      md: 'h-11 px-5 text-[0.65rem] sm:text-xs gap-2 rounded-lg font-semibold',
      lg: 'h-14 px-8 text-[0.65rem] sm:text-xs gap-2.5 rounded-xl font-bold',
      icon: 'h-11 w-11 rounded-lg',
    };

    // Glow effect class
    const glowClass = glowEffect ? 'transition-all duration-300 hover:shadow-glow' : '';

    const buttonClasses = twMerge(
      clsx(baseStyles, variantStyles[variant], sizeStyles[size], glowClass, className)
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span>Loading...</span>
          </div>
        ) : (
          <>
            {leftIcon && <span className="flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * @private
 * @description Internal spinner component for loading state.
 */
const Spinner = () => (
  <div className="flex items-center justify-center">
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);