// src/lib/notifications.ts

import { toast } from 'react-hot-toast';

/**
 * @description Отображает стандартное уведомление об успехе.
 * @param message - Текст сообщения.
 */
export const showSuccess = (message: string) => {
    toast.success(message);
};

/**
 * @description Отображает стандартное уведомление об ошибке.
 * @param message - Текст сообщения.
 */
export const showError = (message: string) => {
    toast.error(message);
};

// В будущем можно добавить другие типы, например, showLoading, showInfo и т.д.