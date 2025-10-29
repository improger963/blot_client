// src/pages/LoginPage.tsx

import { useMutation } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { loginWithTelegram, getCsrfCookie } from '../services/authService';
import { useTelegram } from '../hooks/useTelegram';
import { DevLoginForm } from '../components/DevLoginForm';

/**
 * @description Страница аутентификации.
 * Автоматически определяет окружение (Telegram или браузер) и выполняет
 * соответствующий сценарий входа.
 */
export const LoginPage = () => {
  const { setUser, isAuthenticated, status } = useAuthStore();
  const { isTelegramEnv, initData, user: telegramUser } = useTelegram();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (dataToLogin: string) => {
      await getCsrfCookie();
      return loginWithTelegram(dataToLogin);
    },
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  // Эффект для автоматического входа, если мы находимся в окружении Telegram
  useEffect(() => {
    // Запускаем мутацию только если мы в Telegram, есть initData и мы еще не в процессе логина
    if (isTelegramEnv && initData && !isPending && !isAuthenticated) {
      mutate(initData);
    }
  }, [isTelegramEnv, initData, isPending, isAuthenticated, mutate]);

  // Если пользователь уже аутентифицирован, немедленно перенаправляем его
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // --- Рендеринг в зависимости от окружения ---

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {/* Сценарий №1: Мы в окружении Telegram (ПРОДАКШЕН) */}
      {isTelegramEnv && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">Аутентификация</h1>
          <p className="mt-2 text-gray-600">
            Добро пожаловать, {telegramUser?.first_name}! Выполняется вход...
          </p>
          {/* Можно добавить спиннер для наглядности */}
        </div>
      )}

      {/* Сценарий №2: Мы в обычном браузере (РАЗРАБОТКА) */}
      {!isTelegramEnv && (
        <DevLoginForm onLoginSubmit={(manualInitData) => mutate(manualInitData)} isLoading={isPending} />
      )}

      {/* Отображение ошибки в обоих случаях */}
      {(error || status === 'unauthenticated') && (
        <p className="mt-4 text-center text-red-500">
          {error ? `Ошибка входа: ${error.message}` : 'Не удалось войти. Попробуйте снова.'}
        </p>
      )}
    </div>
  );
};