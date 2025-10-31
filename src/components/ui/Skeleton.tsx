// src/components/ui/Skeleton.tsx

import { twMerge } from 'tailwind-merge';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface SkeletonProps extends Omit<HTMLMotionProps<"div">, "children" | "onDrag"> {
    /**
     * @description Вариант скелетона для разных типов контента
     */
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    /**
     * @description Количество строк для текстового варианта
     */
    lines?: number;
}

/**
 * @description Компонент-заглушка (скелетон) для имитации загрузки контента.
 * Использует анимацию пульсации для создания эффекта "живого" интерфейса.
 */
function Skeleton({ className, variant = 'rounded', lines = 1, ...props }: SkeletonProps) {
    const baseClasses = 'animate-pulse bg-card/60 border border-border/40';

    const variantClasses = {
        text: 'rounded-lg',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-2xl'
    };

    // Для текстового варианта с несколькими строками
    if (variant === 'text' && lines > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={twMerge(
                            baseClasses,
                            variantClasses[variant],
                            'h-4',
                            index === lines - 1 ? 'w-3/4' : 'w-full',
                            className
                        )}
                        {...props as any}
                    />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={twMerge(baseClasses, variantClasses[variant], className)}
            {...props}
        />
    );
}

// Специализированные компоненты скелетонов
interface BasicSkeletonProps extends Omit<HTMLMotionProps<"div">, "children" | "onDrag"> {
    className?: string;
}

export const CardSkeleton = ({ className, ...props }: BasicSkeletonProps) => (
    <Skeleton
        variant="rounded"
        className={twMerge('h-48 w-full', className)}
        {...props}
    />
);

export const AvatarSkeleton = ({ className, ...props }: BasicSkeletonProps) => (
    <Skeleton
        variant="circular"
        className={twMerge('h-12 w-12', className)}
        {...props}
    />
);

export const TextSkeleton = ({ lines = 1, className, ...props }: SkeletonProps) => (
    <Skeleton
        variant="text"
        lines={lines}
        className={className}
        {...props}
    />
);

export const ButtonSkeleton = ({ className, ...props }: BasicSkeletonProps) => (
    <Skeleton
        variant="rounded"
        className={twMerge('h-10 w-24', className)}
        {...props}
    />
);

export const InputSkeleton = ({ className, ...props }: BasicSkeletonProps) => (
    <Skeleton
        variant="rounded"
        className={twMerge('h-12 w-full', className)}
        {...props}
    />
);

export { Skeleton };