// src/pages/LoginPageNew.tsx

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginWithTelegram, getCsrfCookie } from '../services/authService';
import { useTelegram } from '../hooks/useTelegram';
import { DevLoginForm } from '../components/DevLoginForm';
import { motion } from 'framer-motion';
import { TextSkeleton, AvatarSkeleton, InputSkeleton } from '../components/ui';
import { Card } from '../components/ui';
import { Preloader } from '../components/ui/Preloader';

/**
 * @description Страница аутентификации в новом дизайне.
 * Автоматически определяет окружение (Telegram или браузер) и выполняет
 * соответствующий сценарий входа. Использует полную перезагрузку страницы
 * после успешного логина для надежной установки cookie.
 */
export const LoginPageNew = () => {
  const { isAuthenticated } = useAuthStore();
  const { isReady, isTelegramEnv, initData, user: telegramUser } = useTelegram();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (dataToLogin: string) => {
      await getCsrfCookie();
      return loginWithTelegram(dataToLogin);
    },
    onSuccess: (data) => {
      // Set user in auth store instead of full page reload
      useAuthStore.getState().setUser(data.user);
    },
  });

  // Handle dev login
  const handleDevLogin = (initData: string) => {
    mutate(initData);
  };

  // Автоматически инициируем вход через Telegram, если мы в Telegram окружении
  useEffect(() => {
    if (isTelegramEnv && initData && !isAuthenticated) {
      mutate(initData);
    }
  }, [isTelegramEnv, initData, isAuthenticated, mutate]);

  // Если пользователь уже аутентифицирован, перенаправляем на главную.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Пока хук `useTelegram` не определил окружение, показываем скелетон.
  if (!isReady) {
    return <Preloader />;
  }

  // Show loading state during authentication
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden grid-bg noise-bg">
        <div className="w-full max-w-md">
          <Card className="text-center space-y-6 rounded-2xl p-8 glass-card glass-card-hover">
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl"
              >
                <span className="text-4xl">🎰</span>
              </motion.div>
            </div>

            <div className="flex justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-lime-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <h1 className="display-2 text-gradient mb-2">Authenticating</h1>
              <p className="body-2 text-lime-400/80">
                Please wait while we authenticate your session...
              </p>
            </div>
            
            <div className="glass-card p-4 rounded-xl">
              <p className="body-2 text-lime-400/80 text-center">🔒 Secure authentication in progress</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden grid-bg noise-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Сценарий №1: Мы в окружении Telegram (ПРОДАКШЕН) */}
        {isTelegramEnv && (
          <Card className="text-center space-y-6 rounded-2xl p-8 glass-card glass-card-hover">
            {/* Анимированный логотип */}
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl"
              >
                <span className="text-4xl">🎰</span>
              </motion.div>
            </div>

            {/* Приветствие */}
            <div className="space-y-2">
              <h1 className="display-2 text-gradient mb-2">Welcome Back</h1>
              <p className="body-2 text-lime-400/80">
                Привет, <span className="font-semibold text-white">{telegramUser?.first_name}</span>!
                Выполняется вход в систему...
              </p>
            </div>

            {/* Анимированный спиннер */}
            <div className="flex justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-lime-500/20"
              />
            </div>

            {/* Информационный блок */}
            <div className="glass-card p-4 rounded-xl">
              <p className="body-2 text-lime-400/80 text-center">🎮 Авторизация через Telegram Web App</p>
            </div>
          </Card>
        )}

        {/* Сценарий №2: Мы в обычном браузере (РАЗРАБОТКА) */}
        {!isTelegramEnv && (
          <DevLoginForm onLogin={handleDevLogin} isPending={isPending} />
        )}

        {/* Отображение ошибки входа */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl bg-red-500/10 p-4"
          >
            <p className="body-2 text-red-400 text-center">
              ❌ Ошибка входа: {error.message}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};