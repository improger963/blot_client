import { Button } from './ui/Button';
import { Skeleton } from './ui/Skeleton';
import type { WalletBalanceResponse } from '../types/api';
import { motion } from 'framer-motion';
import { DollarIcon } from './icons';

interface BalanceCardProps {
    balanceData?: WalletBalanceResponse;
    isLoading: boolean;
    onDepositClick: () => void;
    onWithdrawClick: () => void;
}

export const BalanceCard = ({ balanceData, isLoading, onDepositClick, onWithdrawClick }: BalanceCardProps) => {
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative overflow-hidden rounded-2xl deep-glass p-8 neon-border"
            >
                <Skeleton className="h-8 w-40 mx-auto bg-surface/60" />
                <Skeleton className="h-12 w-48 mx-auto mt-4 bg-surface/60" />
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 rounded-xl bg-surface/60" />
                    <Skeleton className="h-12 rounded-xl bg-surface/60" />
                </div>
            </motion.div>
        );
    }

    const balance = parseFloat(String(balanceData?.balance ?? 0)).toFixed(2);
    const currency = balanceData?.currency || 'USD';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
            }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-card border border-border/40 shadow-xl neon-border"
        >
            {/* Фоновые градиентные элементы */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl animate-float" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl animate-float" />

            {/* Декоративные акценты */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-2xl" />

            <div className="relative z-10 p-8">
                {/* Заголовок */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <motion.div 
                            className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse"
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.6, 1, 0.6]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity 
                            }}
                        />
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Premium Card
                        </p>
                    </div>
                    <DollarIcon className="h-6 w-6 text-cyan-400" />
                </div>

                {/* Сумма баланса - геройский блок с анимированными цифрами */}
                <div className="mb-8">
                    <motion.p
                        key={balance}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20 
                        }}
                        className="text-5xl font-bold tracking-tight text-foreground"
                    >
                        {balance}
                        <span className="ml-3 text-2xl font-semibold text-cyan-400 animate-pulse-glow">
                            {currency}
                        </span>
                    </motion.p>
                    <p className="text-sm text-muted-foreground mt-2">Доступный баланс</p>
                </div>

                {/* Номер карты и другая информация */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Номер карты</p>
                        <p className="text-lg font-mono text-foreground">**** **** **** 5678</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Срок</p>
                        <p className="text-lg text-foreground">12/25</p>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={onDepositClick}
                            className="w-full h-12 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                        >
                            Пополнить
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={onWithdrawClick}
                            className="w-full h-12 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                        >
                            Вывести
                        </Button>
                    </motion.div>
                </div>
            </div>
            
            {/* Декоративный элемент для тактильного удовольствия */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-border/20" />
        </motion.div>
    );
};