// src/components/layout/MainLayout.tsx

import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui';

export const MainLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Логотип Проекта</h1>
          <div className="flex items-center gap-4">
            {/* Логика отображения имени пользователя остается прежней */}
            <p>Добро пожаловать, <span className="font-semibold">{user?.name ?? 'Гость'}</span></p>
            {/* Кнопка теперь вызывает асинхронную функцию logout */}
            <Button onClick={() => logout()} variant="outline" size="sm">Выйти</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-white mt-8 py-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Мой Проект.</p>
      </footer>
    </div>
  );
};