// src/app/Router.tsx

import { Route, Routes, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GameRoomPage } from '../pages/GameRoomPage';
import { ProfilePage } from '../pages/ProfilePage';
import { WalletPage } from '../pages/WalletPage';
import { ReferralPage } from '../pages/ReferralPage';
import { PokerPage } from '../pages/PokerPage';
import { BlotPage } from '../pages/BlotPage';
import { TournamentsPage } from '../pages/TournamentsPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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
        </Route>
      </Route>
    </Routes>
  );
};