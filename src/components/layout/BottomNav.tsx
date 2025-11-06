import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useDeviceDetection';
import { CardsIcon, TrophyIcon, WalletIcon, UserIcon } from '../icons';

export const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // Only render on mobile devices
    if (!isMobile) {
        return null;
    }

    const navItems = [
        { id: 'poker', label: 'Poker', icon: <CardsIcon className="w-6 h-6" /> },
        { id: 'tournaments', label: 'Events', icon: <TrophyIcon className="w-6 h-6" /> },
        { id: 'wallet', label: 'Wallet', icon: <WalletIcon className="w-6 h-6" /> },
        { id: 'profile', label: 'Profile', icon: <UserIcon className="w-6 h-6" /> }
    ];

    const getCurrentPath = () => {
        const path = location.pathname;
        if (path === '/') return 'poker';
        if (path.startsWith('/poker')) return 'poker';
        if (path.startsWith('/tournaments')) return 'tournaments';
        if (path.startsWith('/wallet')) return 'wallet';
        if (path.startsWith('/profile')) return 'profile';
        return 'poker';
    };

    const currentPath = getCurrentPath();

    const handleNavigate = (path: string) => {
        switch (path) {
            case 'poker':
                navigate('/poker');
                break;
            case 'tournaments':
                navigate('/tournaments');
                break;
            case 'wallet':
                navigate('/wallet');
                break;
            case 'profile':
                navigate('/profile');
                break;
            default:
                navigate('/poker');
        }
    };

    return (
      <div className="gradient-border-container-bottom-nav">
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 glass-card p-3 z-50 mini-app-container"
            style={{ 
                paddingBottom: 'max(var(--spacing-sm), env(safe-area-inset-bottom))',
                height: 'var(--nav-height)'
            }}
        >
            <div className="flex justify-around items-center h-full">
                {navItems.map(item => (
                    <motion.button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        whileTap={{ scale: 0.9 }}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                            currentPath === item.id
                                ? 'text-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.1)] shadow-glow'
                                : 'text-muted hover:text-[hsl(var(--color-primary))]'
                        }`}
                        style={{ 
                            minWidth: '44px',
                            minHeight: '44px'
                        }}
                    >
                        <div className={`${currentPath === item.id ? 'text-[hsl(var(--color-primary))]' : 'text-muted'}`}>
                            {item.icon}
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                    </motion.button>
                ))}
            </div>
        </motion.nav>
      </div>
    );
};