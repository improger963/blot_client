import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SubNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/poker', label: 'Покер' },
    { path: '/blot', label: 'Блот' },
    { path: '/tournaments', label: 'Турниры' },
  ];

  // Determine if we're on a game page to show the subnav
  const isGamePage = location.pathname === '/poker' || 
                     location.pathname === '/blot' || 
                     location.pathname === '/tournaments' ||
                     location.pathname.startsWith('/game-rooms');

  if (!isGamePage) {
    return null;
  }

  return (
    <nav className="hidden lg:flex sticky top-16 z-30 bg-surface/60 backdrop-blur-lg border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="subNavIndicator"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};