import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Card } from './ui/Card';

export const EnhancedProfileHeader = () => {
    const { user } = useAuthStore();

    // Determine user status badges
    const getStatusBadges = () => {
        const badges = [];
        if (user?.is_premium) {
            badges.push({ label: 'Premium', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600' });
        }
        if (user?.banned_at) {
            badges.push({ label: 'Banned', color: 'bg-gradient-to-r from-red-500 to-red-600' });
        }
        return badges;
    };

    const statusBadges = getStatusBadges();

    return (
        <Card className="text-center p-8" padding="lg" hoverEffect={true}>
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h3 className="headline text-white mb-2">{user?.username || 'User'}</h3>
            <p className="body-2 text-lime-400/80 mb-6">Poker Enthusiast</p>
            
            {/* Status badges */}
            {statusBadges.length > 0 && (
                <div className="flex justify-center gap-2 mb-6">
                    {statusBadges.map((badge, index) => (
                        <span 
                            key={index} 
                            className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${badge.color}`}
                        >
                            {badge.label}
                        </span>
                    ))}
                </div>
            )}
        </Card>
    );
};