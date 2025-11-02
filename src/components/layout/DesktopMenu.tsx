import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardsIcon, HomeIcon, TrophyIcon, WalletIcon, UserIcon, ShareIcon } from '../icons';

export const DesktopMenu = () => {
  const navItems = [
    { path: '/poker', label: 'Poker', icon: <CardsIcon className="w-5 h-5" /> },
    { path: '/blot', label: 'Blot', icon: <HomeIcon className="w-5 h-5" /> },
    { path: '/tournaments', label: 'Tournaments', icon: <TrophyIcon className="w-5 h-5" /> },
    { path: '/wallet', label: 'Wallet', icon: <WalletIcon className="w-5 h-5" /> },
    { path: '/referral', label: 'Referral', icon: <ShareIcon className="w-5 h-5" /> },
    { path: '/profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="hidden lg:flex glass-card rounded-2xl p-2 my-4 sm:my-6 md:my-8 mx-2 sm:mx-4 container mx-auto w-full relative z-20 border border-[hsl(var(--color-primary)/0.1)]"
    >
      <div className="flex justify-center flex-wrap gap-1 sm:gap-2 w-full px-4 py-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 tracking-wide uppercase ${
                  isActive
                    ? 'text-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.1)] shadow-glow'
                    : 'text-muted hover:text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary)/0.05)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={isActive ? "text-[hsl(var(--color-primary))]" : "text-muted"}>
                    {item.icon}
                  </div>
                  <span className="hidden sm:inline">{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};