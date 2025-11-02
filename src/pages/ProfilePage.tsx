// src/pages/ProfilePage.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchSecurityStatus } from '../services/dataService';
import { useAuthStore } from '../store/authStore';
import { SecuritySettings } from '../components/SecuritySettings';
import { EnhancedProfileHeader } from '../components/EnhancedProfileHeader';
import { Button } from '../components/ui';
import { motion } from 'framer-motion';
import { ShieldIcon, LogOutIcon } from '../components/icons';
import { Card } from '../components/ui';
import { EnhancedStatsCard } from '../components/EnhancedStatsCard';

export const ProfilePage = () => {
    const { user, logout } = useAuthStore();
    const { data: securityStatus, isLoading: isSecurityLoading } = useQuery({
        queryKey: ['securityStatus'],
        queryFn: fetchSecurityStatus,
    });

    return (
        <div className="space-y-8 pb-24 relative">
            {/* Page header */}
            <motion.div 
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="display-2 text-white">Profile</h1>
                <p className="body-1 text-lime-400/80">
                    Manage your account and track your gaming statistics
                </p>
            </motion.div>

            {/* Enhanced Profile Header */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <EnhancedProfileHeader />
            </motion.section>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <EnhancedStatsCard
                    icon="sports_esports"
                    label="Games Played"
                    value="127"
                />
                <EnhancedStatsCard
                    icon="emoji_events"
                    label="Total Winnings"
                    value="2,450 TON"
                />
                <EnhancedStatsCard
                    icon="trending_up"
                    label="Win Rate"
                    value="64%"
                />
                <EnhancedStatsCard
                    icon="leaderboard"
                    label="Current Rank"
                    value="#42"
                />
            </motion.div>

            {/* Security Settings */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <SecuritySettings />
            </motion.section>

            {/* Account Status */}
            <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <ShieldIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="title text-white">Account Status</h2>
                        <p className="body-2 text-gray-400 mt-1">Information about your account protection</p>
                    </div>
                </div>

                {isSecurityLoading ? (
                    <div className="space-y-3">
                        <div className="skeleton h-12 rounded-xl"></div>
                        <div className="skeleton h-12 rounded-xl"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex items-center justify-between rounded-lg bg-card/30 p-4 glass-hover">
                            <span className="body-2 text-gray-400">Password</span>
                            <span className={`body-2 font-semibold ${securityStatus?.has_password ? 'text-green-400' : 'text-yellow-400'}`}>
                                {securityStatus?.has_password ? '✓ Set' : '○ Not set'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-card/30 p-4 glass-hover">
                            <span className="body-2 text-gray-400">Email</span>
                            <span className={`body-2 font-semibold ${securityStatus?.email_verified ? 'text-green-400' : 'text-yellow-400'}`}>
                                {securityStatus?.email_verified ? '✓ Verified' : '○ Not verified'}
                            </span>
                        </div>
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <Card className="p-6">
                    <h4 className="title text-white mb-4">Account Settings</h4>
                    <div className="space-y-3">
                        {[
                            { icon: 'person', label: 'Edit Profile', action: () => { } },
                            { icon: 'security', label: 'Privacy & Security', action: () => { } },
                            { icon: 'notifications', label: 'Notification Settings', action: () => { } },
                            { icon: 'help', label: 'Help & Support', action: () => { } }
                        ].map((item, index) => (
                            <motion.button
                                key={item.label}
                                whileHover={{ x: 4 }}
                                onClick={item.action}
                                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-lime-500/5 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-lime-500/20 flex items-center justify-center text-lime-400">
                                    <span className="material-icons-round">{item.icon}</span>
                                </div>
                                <span className="body-1 text-white text-left flex-1">{item.label}</span>
                                <span className="material-icons-round text-lime-400">chevron_right</span>
                            </motion.button>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h4 className="title text-white mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                        <Button
                            leftIcon={<span className="material-icons-round">account_balance_wallet</span>}
                            className="w-full"
                            variant="secondary"
                        >
                            Deposit Funds
                        </Button>
                        <Button
                            leftIcon={<span className="material-icons-round">groups</span>}
                            className="w-full"
                            variant="secondary"
                        >
                            Invite Friends
                        </Button>
                        <Button
                            leftIcon={<span className="material-icons-round">history</span>}
                            className="w-full"
                            variant="secondary"
                        >
                            Game History
                        </Button>
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-transparent text-lime-400 hover:bg-lime-500/10"
                        >
                            <LogOutIcon className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};