import { create } from 'zustand';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';
import { getMe, logoutUser } from '../services/authService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
    setUser: (user: User) => void;
    logout: () => Promise<void>;
    setUnauthenticated: () => void;
    checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    status: 'idle',

    /**
     * @description Устанавливает пользователя в состояние и меняет статус на "аутентифицирован".
     */
    setUser: (user) => {
        set({ user, isAuthenticated: true, status: 'authenticated' });
    },

    /**
     * @description Устанавливает статус "не аутентифицирован".
     */
    setUnauthenticated: () => {
        set({ user: null, isAuthenticated: false, status: 'unauthenticated' });
    },

    /**
     * @description Выполняет полный цикл выхода пользователя.
     */
    logout: async () => {
        try {
            // 1. Отправляем запрос на бэкенд, чтобы он очистил cookie.
            await logoutUser();
        } catch (error) {
            console.error("Ошибка при выходе с сервера:", error);
        } finally {
            // 2. Вне зависимости от ответа сервера, очищаем состояние на клиенте.
            get().setUnauthenticated();
            // 3. Перенаправляем на страницу входа
            window.location.href = '/login';
        }
    },

    /**
     * @description Проверяет статус аутентификации через запрос к API.
     * Успешный запрос к /user означает, что у пользователя валидная сессия (cookie).
     */
    checkAuthStatus: async () => {
        set({ status: 'loading' });
        try {
            const user = await getMe();
            get().setUser(user);
        } catch (error: any) {
            // Если запрос провалился (скорее всего, с ошибкой 401),
            // значит валидного cookie нет.
            get().setUnauthenticated();
            // Если ошибка 401, перенаправляем на страницу входа
            if (error?.response?.status === 401) {
                window.location.href = '/login';
            }
        }
    },
}));