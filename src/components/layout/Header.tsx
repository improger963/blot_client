import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { WalletIcon, UserIcon } from '../icons';
import { Button } from '../ui/Button';

export const Header = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock balance data - in a real app this would come from an API
  const gems = 1250;
  const balance = 5420.75;

  // Determine if we're on a game page to show the subnav
  const isGamePage = location.pathname === '/poker' || 
                     location.pathname === '/blot' || 
                     location.pathname === '/tournaments' ||
                     location.pathname.startsWith('/game-rooms');

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <motion.div
            className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            LUCKY TON
          </motion.div>
        </div>

        {/* Center: Navigation for game pages (desktop) */}
        {isGamePage && (
          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => navigate('/poker')}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/poker'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Покер
            </button>
            <button
              onClick={() => navigate('/blot')}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/blot'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Блот
            </button>
            <button
              onClick={() => navigate('/tournaments')}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/tournaments'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Турниры
            </button>
          </div>
        )}

        {/* Center: Balance indicators (hidden on mobile, shown on non-game pages) */}
        {!isGamePage && (
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-foreground">Гемы: {gems}</span>
            </div>
            <div className="flex items-center space-x-2">
              <WalletIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">${balance.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Right: Action buttons */}
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => navigate('/wallet')}
            className="hidden sm:flex h-8 rounded-lg px-3 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            Депозит
          </Button>
          <Button 
            onClick={() => navigate('/wallet')}
            className="hidden sm:flex h-8 rounded-lg px-3 text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
          >
            Вывести
          </Button>
          <Button 
            onClick={() => navigate('/profile')}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-card hover:bg-surface border border-border/40"
          >
            <UserIcon className="h-4 w-4 text-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
};