// src/pages/ReferralPage.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchReferralStats, fetchReferralActivity } from '../services/dataService';
import { ReferralLinksCard } from '../components/ReferralLinksCard';
import { ActivityRow } from '../components/ActivityRow';
import { motion } from 'framer-motion';
import { UsersIcon, DollarIcon, ShareIcon } from '../components/icons';
import { CardSkeleton } from '../components/ui/Skeleton';
import { StatCard, Card } from '../components/ui';
import type { ReferralActivityItem } from '../types/api';
import { useAuthStore } from '../store/authStore';

export const ReferralPage = () => {
    const { user } = useAuthStore();
    
    // Fetch referral statistics
    const { data: referralData, isLoading: isStatsLoading } = useQuery({
        queryKey: ['referralStats'],
        queryFn: fetchReferralStats,
        staleTime: 1000 * 60 * 30, // 30 minutes - данные рефералов меняются нечасто
    });

    // Fetch referral activity
    const { data: activityData, isLoading: isActivityLoading } = useQuery({
        queryKey: ['referralActivity'],
        queryFn: fetchReferralActivity,
        staleTime: 1000 * 60 * 5, // 5 minutes - активность обновляется чаще
    });

    return (
        <div className="space-y-8 pb-24 relative">
            {/* Заголовок страницы */}
            <motion.div 
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="display-2 text-white">Referral Program</h1>
                <p className="body-1 text-lime-400/80 max-w-2xl mx-auto">
                    Invite friends and earn bonuses for their activity
                </p>
                {user && (
                    <div className="mt-4">
                        <p className="caption text-lime-400/80">
                            Your referral code: <span className="font-mono font-bold">{user.referral_code}</span>
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Статистика */}
            <motion.div 
                className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <StatCard
                    label="Invited"
                    value={referralData?.referral_count.toString() || '0'}
                    icon={<UsersIcon className="h-5 w-5" />}
                />
                <StatCard
                    label="Earned"
                    value={referralData?.total_earnings.formatted || '$0.00'}
                    icon={<DollarIcon className="h-5 w-5" />}
                />
                <StatCard
                    label="Bonus"
                    value="+10%"
                    icon={<ShareIcon className="h-5 w-5" />}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="p-6" padding="lg" hoverEffect={true}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="headline text-white">Activity</h2>
                            <p className="body-2 text-lime-400/80 mt-1">
                                Recent invited friends
                            </p>
                        </div>
                        <div className="h-1 w-12 bg-lime-400 rounded-full"></div>
                    </div>

                    <div className="space-y-3">
                        {isActivityLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <CardSkeleton key={i} className="h-16" />
                            ))
                        ) : activityData?.activity && activityData.activity.length > 0 ? (
                            activityData.activity.map((item: ReferralActivityItem) => (
                                <ActivityRow key={item.id} activity={item} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-2xl py-12 text-center">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl mb-4">
                                    <UsersIcon className="h-8 w-8" />
                                </div>
                                <h3 className="headline text-white mb-2">No Referrals Yet</h3>
                                <p className="body-2 text-lime-400/80">
                                    No invited friends yet. Share your referral link to earn bonuses!
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.section>
        </div>
    );
};