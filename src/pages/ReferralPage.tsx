// src/pages/ReferralPage.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchReferralStats } from '../services/dataService';
import { ReferralLinksCard } from '../components/ReferralLinksCard';
import { StatCard } from '../components/StatCard';
import { ActivityRow } from '../components/ActivityRow';
import { motion } from 'framer-motion';
import { UsersIcon, DollarIcon, ShareIcon } from '../components/icons';
import { CardSkeleton } from '../components/ui/Skeleton';
import type { ReferralActivityItem } from '../types/api';

export const ReferralPage = () => {
    const { data: referralData, isLoading } = useQuery({
        queryKey: ['referralStats'],
        queryFn: fetchReferralStats,
        staleTime: 1000 * 60 * 30, // 30 minutes - данные рефералов меняются нечасто
    });

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
                    Реферальная программа
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Приглашайте друзей и получайте бонусы за их активность
                </p>
            </motion.div>

            {/* Статистика */}
            <motion.div 
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <StatCard
                    label="Приглашено"
                    value={referralData?.referral_count.toString() || '0'}
                    icon={<UsersIcon className="h-4 w-4" />}
                />
                <StatCard
                    label="Заработано"
                    value={referralData?.total_earnings.formatted || '$0.00'}
                    icon={<DollarIcon className="h-4 w-4" />}
                />
                <StatCard
                    label="Бонус"
                    value="+10%"
                    icon={<ShareIcon className="h-4 w-4" />}
                />
            </motion.div>

            {/* Ссылки для приглашения */}
            {referralData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <ReferralLinksCard links={referralData.referral_links} />
                </motion.div>
            )}

            {/* Активность рефералов */}
            <motion.section 
                className="space-y-6 glass rounded-2xl p-6 border-gradient"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Активность</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Последние приглашенные друзья
                        </p>
                    </div>
                    <div className="h-1 w-12 bg-primary rounded-full"></div>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <CardSkeleton key={i} className="h-16" />
                        ))
                    ) : referralData?.activity && referralData.activity.length > 0 ? (
                        referralData.activity.map((item: ReferralActivityItem) => (
                            <ActivityRow key={item.id} activity={item} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-surface/30 py-12 text-center">
                            <div className="rounded-full bg-card/50 p-3 mb-3">
                                <UsersIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">Пока нет приглашенных друзей</p>
                        </div>
                    )}
                </div>
            </motion.section>
        </div>
    );
};