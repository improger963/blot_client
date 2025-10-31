import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean;
    variant?: 'default' | 'filled';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, isError = false, variant = 'default', ...props }, ref) => {
        const inputClasses = twMerge(
            clsx(
                // Базовые стили
                'flex h-12 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                'placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',

                // Варианты стилей
                {
                    // Стандартный вариант с границей
                    'default': 'border-2 border-border/60 bg-surface text-foreground focus-visible:border-primary/40',
                    // Заполненный вариант без видимой границы
                    'filled': 'border-2 border-transparent bg-card/50 text-foreground focus-visible:bg-card focus-visible:border-primary/40',
                }[variant],

                // Состояние ошибки
                {
                    'border-red-500/60 focus-visible:border-red-500/60 focus-visible:ring-red-500/40': isError,
                },

                className
            )
        );

        return <input type={type} className={inputClasses} ref={ref} {...props} />;
    }
);
Input.displayName = 'Input';