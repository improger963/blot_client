// src/components/StatCard.tsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    className?: string;
}

export const StatCard = ({ label, value, icon, trend, trendValue, className = '' }: StatCardProps) => {
    const getTrendColor = () => {
        switch (trend) {
            case 'up': return 'text-green-400';
            case 'down': return 'text-red-400';
            default: return 'text-muted-foreground';
        }
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'up': return '↗';
            case 'down': return '↘';
            default: return '→';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
                y: -2, 
                transition: { duration: 0.2 },
                boxShadow: "0 10px 30px hsl(var(--color-background) / 0.4)"
            }}
            className={`rounded-2xl bg-surface/50 border border-border/40 p-6 group hover:bg-surface/70 transition-all duration-200 glass border-gradient material-depth-2 ${className}`}
        >
            {/* Верхняя часть - лейбл и иконка */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </p>
                {icon && (
                    <motion.div
                        whileHover={{ 
                            scale: 1.1, 
                            rotate: [0, 5, -5, 0] 
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary"
                    >
                        {icon}
                    </motion.div>
                )}
            </div>

            {/* Основное значение */}
            <div className="flex items-end justify-between">
                <motion.p
                    key={value}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-3xl font-bold text-foreground"
                >
                    {value}
                </motion.p>

                {/* Тренд (если есть) */}
                {trend && trendValue && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}
                    >
                        <span>{getTrendIcon()}</span>
                        <span>{trendValue}</span>
                    </motion.div>
                )}
            </div>

            {/* Декоративный акцент снизу */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Декоративные элементы для тактильного удовольствия */}
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary/10 blur-sm" />
        </motion.div>
    );
};