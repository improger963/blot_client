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

    useEffect(() => {
        // Проверяем наличие window.Telegram.WebApp при монтировании компонента.
        // Скрипт может загрузиться до того, как React начнет рендеринг.
        if (window.Telegram?.WebApp) {
            const app = window.Telegram.WebApp;
            setWebApp(app);
            // Уведомляем Telegram, что приложение готово.
            app.ready();
        }
        // В некоторых редких случаях может потребоваться небольшая задержка,
        // но обычно прямой проверки достаточно.
    }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится один раз.

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
        isReady: webApp !== null,
    };
};