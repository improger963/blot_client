import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Публичный маршрут для страницы входа */}
      <Route path="/login" element={<LoginPage />} />

      {/* Группа защищенных маршрутов */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* Здесь будут другие защищенные страницы */}
        </Route>
      </Route>
    </Routes>
  );
};