// src/components/ui/Button.tsx

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Визуальный стиль кнопки.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Размер кнопки.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Состояние загрузки. Кнопка будет отключена, а её содержимое заменено на спиннер.
   * @default false
   */
  isLoading?: boolean;
}

/**
 * @description Базовый, переиспользуемый компонент кнопки с вариантами стилей и состояний.
 * Обеспечивает консистентный вид и поведение для всех интерактивных элементов.
 * @example
 * <Button variant="primary" size="lg" onClick={() => {}}>
 *   Нажми меня
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    // Базовые стили для всех кнопок: центрирование, скругление, фокус и состояния.
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    // Стили для разных вариантов (variant)
    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-slate-900 text-slate-50 hover:bg-slate-900/90',
      secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-200/80',
      outline: 'border border-slate-300 bg-transparent hover:bg-slate-100',
      ghost: 'hover:bg-slate-100 hover:text-slate-900',
    };

    // Стили для разных размеров (size)
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'h-9 px-3',
      md: 'h-10 px-4',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    };

    const buttonClasses = twMerge(
      clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {/* Во время загрузки показываем только спиннер для чистоты UX */}
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);
Button.displayName = 'Button';

/**
 * @private
 * @description Внутренний компонент спиннера для состояния загрузки.
 */
const Spinner = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 animate-spin" // Убрали лишние классы, twMerge не нужен для статичного компонента
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);