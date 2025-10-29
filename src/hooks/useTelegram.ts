// src/hooks/useTelegram.ts

import { useMemo } from 'react';

/**
 * @description Кастомный хук для инкапсуляции работы с объектом Telegram Web App.
 * Предоставляет безопасный доступ к данным и определяет окружение.
 * @returns {object} Объект с данными и флагами Telegram.
 */
export const useTelegram = () => {
    // Получаем объект WebApp один раз и мемоизируем его, чтобы избежать лишних обращений к window
    const webApp = useMemo(() => window.Telegram?.WebApp, []);

    // Определяем, находимся ли мы в окружении Telegram
    const isTelegramEnv = !!webApp?.initData;

    // Уведомляем Telegram, что наше приложение готово к работе, если мы в его окружении
    if (isTelegramEnv) {
        webApp.ready();
    }

    return {
        /**
         * @description Объект Telegram Web App.
         */
        webApp,
        /**
         * @description Флаг, указывающий, запущено ли приложение внутри Telegram.
         */
        isTelegramEnv,
        /**
         * @description Данные для инициализации, используемые для аутентификации.
         */
        initData: webApp?.initData,
        /**
         * @description "Небезопасные" данные, включая объект пользователя, для отображения в UI.
         */
        user: webApp?.initDataUnsafe.user,
    };
};