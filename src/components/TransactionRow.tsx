// src/components/TransactionRow.tsx
import clsx from 'clsx';
import type { Transaction } from '../types/api';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from './icons';
import { motion } from 'framer-motion';

// Add the missing 'game_fee' type to the typeConfig
const typeConfig = {
    deposit: {
        icon: ArrowDownLeftIcon,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        label: 'Пополнение'
    },
    game_win: {
        icon: ArrowDownLeftIcon,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        label: 'Выигрыш'
    },
    withdrawal: {
        icon: ArrowUpRightIcon,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        label: 'Вывод'
    },
    game_fee: {
        icon: ArrowUpRightIcon,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        label: 'Комиссия'
    },
    game_stake: {
        icon: ArrowUpRightIcon,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        label: 'Ставка'
    },
} as const;

// Define the TransactionType type
type TransactionType = keyof typeof typeConfig;



export const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
    // Fix the indexing error by casting to TransactionType
    const transactionType = (transaction.type in typeConfig) ? transaction.type as TransactionType : 'withdrawal';
    const config = typeConfig[transactionType];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ 
                x: 4, 
                transition: { duration: 0.2 }
            }}
            className="flex items-center gap-4 rounded-xl bg-surface p-4 border border-border/40 hover:bg-surface/50 transition-all duration-200 group"
        >
            {/* Иконка типа транзакции - "чип" с градиентной иконкой */}
            <motion.div 
                className={clsx(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                    config.bg,
                    config.color
                )}
                whileHover={{ 
                    scale: 1.1
                }}
                transition={{ duration: 0.5 }}
            >
                <Icon className="h-5 w-5" />
            </motion.div>

            {/* Основная информация */}
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <motion.p 
                        className="font-medium text-foreground truncate"
                        whileHover={{ scale: 1.02 }}
                    >
                        {transaction.description}
                    </motion.p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{transaction.date}</span>
                </div>
            </div>

            {/* Сумма и дополнительная информация */}
            <div className="text-right flex-shrink-0">
                <motion.p 
                    className={clsx(
                        "text-lg font-bold",
                        config.color
                    )}
                    whileHover={{ scale: 1.05 }}
                >
                    {transaction.amount}
                </motion.p>
            </div>
        </motion.div>
    );
};