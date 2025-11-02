import { Outlet, useLocation } from 'react-router-dom';
import { Header, BottomNav, DesktopMenu, ResponsiveContainer } from './';
import { useIsMobile } from '../../hooks/useDeviceDetection';

export const MainLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Determine if we're on a game page
  const isGamePage = location.pathname === '/poker' || 
                     location.pathname === '/blot' || 
                     location.pathname === '/tournaments' ||
                     location.pathname.startsWith('/game-rooms');

  return (
    <div className="min-h-screen bg-grid font-sans text-foreground relative">
      <div className="flex flex-col items-center w-full">
        {/* Header */}
        <div className="w-full max-w-6xl px-4 z-20 relative">
          <Header />
        </div>

        {/* Desktop menu (only shown on desktop) */}
        {!isMobile && (
          <div className="w-full max-w-6xl px-4 z-20 relative">
            <DesktopMenu />
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="relative z-10 pb-24 lg:pb-8 w-full">
        <ResponsiveContainer padding="sm" className="w-full max-w-6xl mx-auto">
          <Outlet />
        </ResponsiveContainer>
      </main>

      {/* Bottom navigation (only on mobile) */}
      <BottomNav />
    </div>
  );
};