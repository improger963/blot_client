import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Card } from './ui/Card';

export const EnhancedProfileHeader = () => {
    const { user } = useAuthStore();

    const stats = [
        { label: 'Games Played', value: '127', icon: 'sports_esports' },
        { label: 'Total Winnings', value: '2,450 TON', icon: 'emoji_events' },
        { label: 'Win Rate', value: '64%', icon: 'trending_up' },
        { label: 'Current Rank', value: '#42', icon: 'leaderboard' }
    ];

    return (
        <Card className="text-center p-8" padding="lg" hoverEffect={true}>
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h3 className="headline text-white mb-2">{user?.username || 'User'}</h3>
            <p className="body-2 text-lime-400/80 mb-6">Poker Enthusiast</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="glass-card p-4 rounded-2xl text-center"
                    >
                        <div className="w-10 h-10 mx-auto rounded-xl bg-lime-500/20 flex items-center justify-center text-lime-400 mb-2">
                            <span className="material-icons-round">{stat.icon}</span>
                        </div>
                        <p className="caption text-lime-400/80">{stat.label}</p>
                        <p className="title text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
};