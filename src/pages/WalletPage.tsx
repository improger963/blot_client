// src/pages/WalletPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWalletBalance, fetchWalletHistory, fetchDepositConfig } from '../services/dataService';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionRow } from '../components/TransactionRow';
import { DepositFlow } from '../components/DepositFlow';
import { WithdrawForm } from '../components/WithdrawForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';
import { DollarIcon, ArrowDownLeftIcon, ArrowUpRightIcon } from '../components/icons';
import type { DepositConfigResponse } from '../types/api';

export const WalletPage = () => {
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [isModalOpen, setModalOpen] = useState(false);

    const { data: balanceData, isLoading: isBalanceLoading } = useQuery({
        queryKey: ['walletBalance'],
        queryFn: fetchWalletBalance,
        staleTime: 1000 * 30, // 30 seconds - баланс обновляется чаще
    });

    const { data: historyData, isLoading: isHistoryLoading } = useQuery({
        queryKey: ['walletHistory'],
        queryFn: fetchWalletHistory,
        // Использует глобальный staleTime (5 минут)
    });

    // Запрос конфигурации для депозита на уровне страницы
    const { data: depositConfig, isLoading: isDepositConfigLoading } = useQuery<DepositConfigResponse>({
        queryKey: ['depositConfig'],
        queryFn: fetchDepositConfig,
        staleTime: 1000 * 60 * 60, // 1 hour - конфигурация меняется редко
    });

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <div className="space-y-8 pb-24 relative">
            {/* Декоративные элементы для создания глубины */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
                <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Заголовок страницы */}
            <motion.div 
                className="text-center space-y-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Кошелек
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Управляйте своими средствами и отслеживайте транзакции
                </p>
            </motion.div>

            {/* Баланс - геройский блок */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <BalanceCard
                    balanceData={balanceData}
                    isLoading={isBalanceLoading}
                    onDepositClick={() => {
                        setActiveTab('deposit');
                        setModalOpen(true);
                    }}
                    onWithdrawClick={() => {
                        setActiveTab('withdraw');
                        setModalOpen(true);
                    }}
                />
            </motion.div>

            {/* Кнопки действий */}
            <motion.div 
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        onClick={() => {
                            setActiveTab('deposit');
                            setModalOpen(true);
                        }}
                        className="w-full h-14 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    >
                        <ArrowDownLeftIcon className="h-5 w-5 mr-2" />
                        Пополнить
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        onClick={() => {
                            setActiveTab('withdraw');
                            setModalOpen(true);
                        }}
                        className="w-full h-14 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                    >
                        <ArrowUpRightIcon className="h-5 w-5 mr-2" />
                        Вывести
                    </Button>
                </motion.div>
            </motion.div>

            {/* История транзакций */}
            <motion.section 
                className="space-y-6 deep-glass rounded-2xl p-6 neon-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">История</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Последние транзакции
                        </p>
                    </div>
                    <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
                </div>

                <div className="space-y-3">
                    {isHistoryLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 rounded-xl" />
                        ))
                    ) : historyData?.transactions && historyData.transactions.length > 0 ? (
                        historyData.transactions.map((transaction) => (
                            <TransactionRow key={transaction.id} transaction={transaction} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-surface/30 py-12 text-center">
                            <div className="rounded-full bg-card/50 p-3 mb-3">
                                <DollarIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">Пока нет транзакций</p>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Модальное окно для депозита/вывода */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleModalClose}
                title={activeTab === 'deposit' ? 'Пополнение баланса' : 'Вывод средств'}
            >
                <div className="p-6">
                    {activeTab === 'deposit' ? (
                        <DepositFlow 
                            onSuccess={handleModalClose} 
                            config={depositConfig}
                            isLoadingConfig={isDepositConfigLoading}
                        />
                    ) : (
                        <WithdrawForm onSuccess={handleModalClose} />
                    )}
                </div>
            </Modal>
        </div>
    );
};