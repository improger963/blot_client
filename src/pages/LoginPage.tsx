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
  const { isTelegramEnv, initData, user: telegramUser, isReady } = useTelegram();

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
    // Теперь запускаем мутацию, только когда хук готов и все данные на месте
    if (isReady && isTelegramEnv && initData && !isPending && !isAuthenticated) {
      mutate(initData);
    }
  }, [isReady, isTelegramEnv, initData, isPending, isAuthenticated, mutate]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Пока хук не готов, показываем общую заглушку
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Инициализация приложения...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {isTelegramEnv && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">Аутентификация</h1>
          <p className="mt-2 text-gray-600">
            Добро пожаловать, {telegramUser?.first_name}! Выполняется вход...
          </p>
        </div>
      )}
      {!isTelegramEnv && (
        <DevLoginForm onLoginSubmit={(manualInitData) => mutate(manualInitData)} isLoading={isPending} />
      )}
      {(error || status === 'unauthenticated') && (
        <p className="mt-4 text-center text-red-500">
          {error ? `Ошибка входа: ${error.message}` : 'Не удалось войти. Попробуйте снова.'}
        </p>
      )}
    </div>
  );
};