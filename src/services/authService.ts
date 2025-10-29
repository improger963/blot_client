// src/services/authService.ts

import { api } from './api';
import type { User } from '../types/user';

interface LoginResponse {
    user: User;
}

/**
 * @description Запрашивает у сервера CSRF-токен.
 * Сервер в ответ должен установить XSRF-TOKEN cookie.
 */
export const getCsrfCookie = async (): Promise<void> => {
    // Мы ожидаем, что этот эндпоинт настроен на бэкенде.
    // Laravel Sanctum использует `/sanctum/csrf-cookie`.
    // Если у вас другой, замените его здесь.
    await api.get('/sanctum/csrf-cookie');
};

/**
 * @description Отправляет initData на сервер для аутентификации.
 */
export const loginWithTelegram = async (initData: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/telegram/callback', { initData });
    return data;
};

// ... функция getMe остается без изменений ...
export const getMe = async (): Promise<User> => {
    const { data } = await api.get<User>('/user');
    return data;
};

// ... функция logoutUser остается без изменений ...
export const logoutUser = async (): Promise<void> => {
    await api.post('/auth/logout');
};