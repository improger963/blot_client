// src/pages/LoginPage.tsx

import { useMutation } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { loginWithTelegram, getCsrfCookie } from '../services/authService';
import { useTelegram } from '../hooks/useTelegram';
import { DevLoginForm } from '../components/DevLoginForm';
import { motion } from 'framer-motion';
import { TextSkeleton, AvatarSkeleton, InputSkeleton } from '../components/ui';

/**
 * @description Страница аутентификации.
 * Автоматически определяет окружение (Telegram или браузер) и выполняет
 * соответствующий сценарий входа. Использует полную перезагрузку страницы
 * после успешного логина для надежной установки cookie.
 */
export const LoginPage = () => {
  const { isAuthenticated } = useAuthStore();
  const { isReady, isTelegramEnv, initData, user: telegramUser } = useTelegram();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (dataToLogin: string) => {
      await getCsrfCookie();
      return loginWithTelegram(dataToLogin);
    },
    onSuccess: () => {
      window.location.href = '/';
    },
  });

  // Эффект для автоматического входа, если мы находимся в окружении Telegram.
  useEffect(() => {
    if (isReady && isTelegramEnv && initData && !isPending && !isAuthenticated) {
      mutate(initData);
    }
  }, [isReady, isTelegramEnv, initData, isPending, isAuthenticated, mutate]);

  // Если пользователь уже аутентифицирован, перенаправляем на главную.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Пока хук `useTelegram` не определил окружение, показываем скелетон.
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <AvatarSkeleton className="h-16 w-16 mx-auto" />
            <TextSkeleton className="w-48 h-8 mx-auto" />
            <TextSkeleton className="w-64 h-4 mx-auto" />
          </div>
          <InputSkeleton />
          <InputSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Сценарий №1: Мы в окружении Telegram (ПРОДАКШЕН) */}
        {isTelegramEnv && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            {/* Анимированный логотип */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg shadow-primary/25"
              >
                <span className="text-2xl font-bold text-white">L</span>
              </motion.div>
            </div>

            {/* Приветствие */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Добро пожаловать!
              </h1>
              <p className="text-muted-foreground">
                Привет, <span className="font-semibold text-foreground">{telegramUser?.first_name}</span>!
                Выполняется вход в систему...
              </p>
            </div>

            {/* Анимированный спиннер */}
            <div className="flex justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-primary/20 border-t-primary"
              />
            </div>

            {/* Информационный блок */}
            <div className="rounded-2xl bg-surface/50 border border-border/40 p-4">
              <p className="text-sm text-muted-foreground">
                🔒 Авторизация через Telegram Web App
              </p>
            </div>
          </motion.div>
        )}

        {/* Сценарий №2: Мы в обычном браузере (РАЗРАБОТКА) */}
        {!isTelegramEnv && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Заголовок для девелоперского входа */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg shadow-primary/25">
                  <span className="text-xl font-bold text-white">L</span>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Lucky TON
                </h1>
                <p className="text-muted-foreground">
                  Войдите в систему для доступа к играм
                </p>
              </div>
            </div>

            {/* Девелоперская форма входа */}
            <DevLoginForm
              onLoginSubmit={(manualInitData) => mutate(manualInitData)}
              isLoading={isPending}
            />
          </motion.div>
        )}

        {/* Отображение ошибки входа */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4"
          >
            <p className="text-sm text-red-400 text-center">
              ❌ Ошибка входа: {error.message}
            </p>
          </motion.div>
        )}

        {/* Декоративные элементы */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-secondary/5 blur-3xl" />
      </motion.div>
    </div>
  );
};