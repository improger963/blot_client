// src/components/ui/Button.tsx

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
    // Базовые стили для всех кнопок
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-95';

    // Стили для разных вариантов (variant)
    const variantStyles: Record<ButtonVariant, string> = {
      // Основная кнопка с градиентом циан-синий
      primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl',

      // Вторичная кнопка с фиолетово-розовым градиентом
      secondary: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:from-purple-600 hover:to-pink-700 hover:shadow-xl',

      // Outline вариант с прозрачным фоном
      outline: 'border-2 border-primary/40 bg-transparent text-primary hover:bg-primary/10 hover:border-primary/60',

      // Ghost вариант без рамки
      ghost: 'text-foreground hover:bg-card/50 hover:shadow-sm',

      // Danger вариант для деструктивных действий
      danger: 'bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl'
    };

    // Стили для разных размеров (size)
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-11 px-5 text-sm gap-2 rounded-xl',
      lg: 'h-14 px-8 text-base gap-2.5 rounded-2xl font-bold',
      icon: 'h-11 w-11 rounded-xl',
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
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span>Загрузка...</span>
          </div>
        ) : (
          children
        )}
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