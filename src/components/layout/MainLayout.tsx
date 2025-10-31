import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { SubNav } from './SubNav';
import { BottomNav } from './BottomNav';

export const MainLayout = () => {
  const location = useLocation();
  
  // Determine if we're on a game page
  const isGamePage = location.pathname === '/poker' || 
                     location.pathname === '/blot' || 
                     location.pathname === '/tournaments' ||
                     location.pathname.startsWith('/game-rooms');

  return (
    <div className="min-h-screen bg-background font-sans text-foreground relative overflow-hidden">
      {/* Анимированный градиентный фон */}
      <div className="absolute inset-0 z-0 bg-main-gradient"></div>
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/20 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Верхняя шапка */}
      <Header />

      {/* Поднавигация (только на десктопе и только на игровых страницах) */}
      {isGamePage && <SubNav />}

      {/* Основной контент */}
      <main className="container mx-auto p-4 relative z-10 pb-24 lg:pb-8">
        <Outlet />
      </main>

      {/* Нижняя навигация (только на мобильных) */}
      <BottomNav />
    </div>
  );
};