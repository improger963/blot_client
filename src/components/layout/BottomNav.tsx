import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, WalletIcon, ShareIcon, UserIcon, PlayIcon } from '../icons';

export const BottomNav = () => {
    const location = useLocation();
    
    const navItems = [
        { path: '/', icon: HomeIcon, label: 'Лобби' },
        { path: '/wallet', icon: WalletIcon, label: 'Кошелек' },
        { path: '/profile', icon: UserIcon, label: 'Профиль' },
        { path: '/referral', icon: ShareIcon, label: 'Пригласить' },
    ];

    // Determine if we're on a game page to show the play button
    const isGamePage = location.pathname === '/poker' || 
                       location.pathname === '/blot' || 
                       location.pathname === '/tournaments' ||
                       location.pathname.startsWith('/game-rooms');

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-24 justify-center px-4 pb-4">
            {/* Основной контейнер с профессиональным дизайном */}
            <motion.div 
                className="relative mx-auto flex items-center gap-1 rounded-2xl deep-glass px-2 py-2 shadow-2xl"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    delay: 0.5
                }}
            >
                {navItems.map((item) => {
                    // Show Play button for game pages
                    if (item.path === '/' && isGamePage) {
                        return (
                            // Центральная кнопка "Play" с акцентом
                            <NavLink
                                key="play"
                                to="/"
                                end
                                className="relative -mt-8 mx-1"
                            >
                                {({ isActive }) => (
                                    <motion.div
                                        whileHover={{ 
                                            scale: 1.1,
                                            y: -5
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg ${
                                            isActive
                                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-primary/40 glow-primary'
                                                : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-black/30'
                                        } border border-border/50 pulse-glow`}
                                        animate={isActive ? { 
                                            boxShadow: [
                                                "0 0 15px hsl(var(--primary) / 0.4)",
                                                "0 0 35px hsl(var(--primary) / 0.7)",
                                                "0 0 15px hsl(var(--primary) / 0.4)"
                                            ]
                                        } : {}}
                                        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                                    >
                                        <PlayIcon className="h-8 w-8 text-white" />
                                        {/* Активный индикатор */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ 
                                                    type: "spring", 
                                                    stiffness: 500, 
                                                    damping: 30 
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </NavLink>
                        );
                    }

                    // For non-game pages, show the regular home button
                    if (item.path === '/' && !isGamePage) {
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className="relative flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[60px]"
                            >
                                {({ isActive }) => (
                                    <>
                                        <motion.div
                                            whileHover={{ 
                                                scale: 1.1,
                                                y: -2
                                            }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                                                isActive
                                                    ? 'text-cyan-400 glow-primary'
                                                    : 'text-gray-400 hover:text-foreground'
                                            }`}
                                        >
                                            <item.icon className="h-6 w-6" />
                                        </motion.div>

                                        {/* Активный индикатор */}
                                        {isActive && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -bottom-1 w-1 h-1 rounded-full bg-cyan-400"
                                            />
                                        )}

                                        {/* Подпись для десктопа */}
                                        <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-cyan-400' : 'text-gray-400'
                                            } hidden sm:block`}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    }

                    // Обычные навигационные кнопки
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="relative flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[60px]"
                        >
                            {({ isActive }) => (
                                <>
                                    <motion.div
                                        whileHover={{ 
                                            scale: 1.1,
                                            y: -2
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                                            isActive
                                                ? 'text-cyan-400 glow-primary'
                                                : 'text-gray-400 hover:text-foreground'
                                        }`}
                                    >
                                        <item.icon className="h-6 w-6" />
                                    </motion.div>

                                    {/* Активный индикатор */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -bottom-1 w-1 h-1 rounded-full bg-cyan-400"
                                        />
                                    )}

                                    {/* Подпись для десктопа */}
                                    <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-cyan-400' : 'text-gray-400'
                                        } hidden sm:block`}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </motion.div>
        </div>
    );
};