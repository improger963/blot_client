// src/pages/WalletPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWalletBalance, fetchWalletHistory, fetchDepositConfig } from '../services/dataService';
import { EnhancedTransactionRow } from '../components/EnhancedTransactionRow';
import { DepositFlow } from '../components/DepositFlow';
import { WithdrawForm } from '../components/WithdrawForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui';
import { Card } from '../components/ui';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EnhancedStatsCard } from '../components/EnhancedStatsCard';
import { motion } from 'framer-motion';
import { DollarIcon, ArrowDownLeftIcon, ArrowUpRightIcon } from '../components/icons';
import type { DepositConfigResponse, WalletBalanceResponse, WalletHistoryResponse } from '../types/api';

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
            {/* Page header */}
            <motion.div 
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="display-2 text-white">Wallet</h1>
                <p className="body-1 text-lime-400/80">
                    Manage your TON balance and track your transactions
                </p>
            </motion.div>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="text-center p-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl mb-4">
                        <span className="material-icons-round">account_balance_wallet</span>
                    </div>
                    <p className="caption text-lime-400/80 mb-2">Current Balance</p>
                    <p className="display-1 text-gradient mb-6">
                        {isBalanceLoading ? (
                            <span className="skeleton h-12 w-32 inline-block rounded-xl"></span>
                        ) : (
                            `${balanceData?.balance.toFixed(2) || '0.00'} TON`
                        )}
                    </p>

                    <div className="flex gap-4 max-w-md mx-auto">
                        <Button
                            onClick={() => {
                                setActiveTab('deposit');
                                setModalOpen(true);
                            }}
                            leftIcon={<ArrowDownLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                            className="flex-1 text-sm sm:text-base py-3"
                        >
                            Deposit
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setActiveTab('withdraw');
                                setModalOpen(true);
                            }}
                            leftIcon={<ArrowUpRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                            className="flex-1 text-sm sm:text-base py-3"
                        >
                            Withdraw
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <EnhancedStatsCard
                    icon="account_balance"
                    label="Total Deposits"
                    value="1,245 TON"
                    trend={{ value: 12, period: '24h' }}
                />
                <EnhancedStatsCard
                    icon="trending_down"
                    label="Total Withdrawals"
                    value="850 TON"
                    trend={{ value: -5, period: '24h' }}
                />
                <EnhancedStatsCard
                    icon="sports_esports"
                    label="Games Played"
                    value="127"
                    trend={{ value: 8, period: '24h' }}
                />
                <EnhancedStatsCard
                    icon="emoji_events"
                    label="Tournaments Won"
                    value="5"
                    trend={{ value: 2, period: '24h' }}
                />
            </motion.div>

            {/* Transaction History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <h3 className="headline text-white mb-6">Recent Transactions</h3>

                <div className="space-y-3">
                    {isHistoryLoading ? (
                        <LoadingSkeleton type="list" count={5} />
                    ) : historyData?.transactions && historyData.transactions.length > 0 ? (
                        historyData.transactions.map((transaction) => (
                            <EnhancedTransactionRow key={transaction.id} transaction={transaction} />
                        ))
                    ) : (
                        <Card className="flex flex-col items-center justify-center rounded-2xl bg-surface/30 py-12 text-center">
                            <div className="rounded-full bg-card/50 p-3 mb-3">
                                <DollarIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No transactions yet</p>
                        </Card>
                    )}
                </div>
            </motion.div>

            {/* Модальное окно для депозита/вывода */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleModalClose}
                title={activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
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