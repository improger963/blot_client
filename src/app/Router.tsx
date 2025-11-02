// src/app/Router.tsx

import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPageNew } from '../pages/LoginPageNew';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GameRoomPage } from '../pages/GameRoomPage';
import { ProfilePage } from '../pages/ProfilePage';
import { WalletPage } from '../pages/WalletPage';
import { ReferralPage } from '../pages/ReferralPage';
import { PokerPage } from '../pages/PokerPage';
import { BlotPage } from '../pages/BlotPage';
import { TournamentsPage } from '../pages/TournamentsPage';
import { PremiumDemoPage } from '../pages/PremiumDemoPage';
import { EnhancedLoadingScreen } from './EnhancedLoadingScreen';

export const AppRouter = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return <EnhancedLoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPageNew />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/poker" replace />} />
          <Route path="/game-rooms/:id" element={<GameRoomPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/poker" element={<PokerPage />} />
          <Route path="/blot" element={<BlotPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/premium-demo" element={<PremiumDemoPage />} />
        </Route>
      </Route>
    </Routes>
  );
};