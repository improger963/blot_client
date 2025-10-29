import { type InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /**
     * @description Наличие ошибки валидации для стилизации поля.
     * @default false
     */
    isError?: boolean;
}

/**
 * @description Базовый, переиспользуемый компонент для полей ввода.
 * Поддерживает все стандартные атрибуты <input> и интеграцию с react-hook-form.
 * @example
 * <Input type="text" placeholder="Ваше имя" {...register('name')} />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, isError = false, ...props }, ref) => {

        const inputClasses = twMerge(
            clsx(
                'flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                {
                    // Добавляем красную рамку, если есть ошибка
                    'border-red-500 focus-visible:ring-red-500': isError,
                },
                className
            )
        );

        return (
            <input
                type={type}
                className={inputClasses}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';