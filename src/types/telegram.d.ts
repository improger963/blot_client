// Расширяем глобальный интерфейс Window, добавляя в него объект Telegram
declare global {
    interface Window {
        Telegram?: {
            WebApp: ITelegramWebApp;
        };
    }
}

// Описываем только те поля, которые нам нужны для работы
export interface ITelegramWebApp {
    /**
     * @description Строка с данными инициализации, используется для валидации на бэкенде.
     */
    initData: string;
    initDataUnsafe: {
        user?: ITelegramUser;
    };
    /**
     * @description Уведомляет родительское окно Telegram, что приложение готово к отображению.
     */
    ready: () => void;
}

export interface ITelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}