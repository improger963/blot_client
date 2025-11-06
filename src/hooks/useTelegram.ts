// src/hooks/useTelegram.ts

import { useEffect, useState } from 'react';
import type { ITelegramWebApp } from '../types/telegram';

/**
 * @description Кастомный хук для инкапсуляции работы с объектом Telegram Web App.
 * Корректно обрабатывает асинхронную инициализацию скрипта Telegram.
 * @returns {object} Объект с данными и флагами Telegram.
 */
export const useTelegram = () => {
    // Используем состояние, чтобы хранить объект webApp, когда он станет доступен.
    const [webApp, setWebApp] = useState<ITelegramWebApp | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Function to initialize Telegram Web App
        const initTelegram = () => {
            if (window.Telegram?.WebApp) {
                const app = window.Telegram.WebApp;
                setWebApp(app);
                setIsInitialized(true);
                // Уведомляем Telegram, что приложение готово.
                app.ready();
            }
        };

        // Проверяем наличие window.Telegram.WebApp при монтировании компонента.
        // Скрипт может загрузиться до того, как React начнет рендеринг.
        initTelegram();

        // If Telegram is not immediately available, set up a timeout to check again
        if (!window.Telegram?.WebApp && !isInitialized) {
            const timeoutId = setTimeout(() => {
                initTelegram();
            }, 1000); // Check again after 1 second

            // Also listen for Telegram Web App script loading
            const checkInterval = setInterval(() => {
                if (window.Telegram?.WebApp) {
                    initTelegram();
                    clearInterval(checkInterval);
                }
            }, 500);

            // Clean up timeouts and intervals
            return () => {
                clearTimeout(timeoutId);
                clearInterval(checkInterval);
            };
        }
    }, [isInitialized]); // Пустой массив зависимостей гарантирует, что эффект выполнится один раз.

    const isTelegramEnv = !!webApp?.initData;

    return {
        /**
         * @description Объект Telegram Web App. Будет `null` до инициализации.
         */
        webApp,
        /**
         * @description Флаг, указывающий, запущено ли приложение внутри Telegram.
         */
        isTelegramEnv,
        /**
         * @description Данные для инициализации. Будут `undefined` до инициализации.
         */
        initData: webApp?.initData,
        /**
         * @description "Небезопасные" данные пользователя.
         */
        user: webApp?.initDataUnsafe.user,
        /**
         * @description Флаг, показывающий, что хук все еще ожидает инициализации webApp.
         */
        isReady: webApp !== null || isInitialized,
    };
};