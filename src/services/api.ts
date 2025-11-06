// src/services/api.ts

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * @private
 * @description Вспомогательная функция для чтения значения конкретного cookie по имени.
 * @param name - Имя cookie (например, 'XSRF-TOKEN').
 * @returns {string | null} Значение cookie или null, если не найден.
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    // Sanitize the cookie value to prevent XSS
    const cookieValue = parts.pop()?.split(';').shift() || null;
    if (cookieValue) {
      // Basic sanitization - remove potentially dangerous characters
      return cookieValue.replace(/[<>'"&]/g, '');
    }
  }
  return null;
}

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/**
 * @description Интерцептор для всех ИСХОДЯЩИХ запросов.
 * Теперь он также отвечает за добавление X-XSRF-TOKEN заголовка.
 */
api.interceptors.request.use(
  (config) => {
    // Читаем XSRF-TOKEN из cookie. Важно! Laravel декодирует URL-encoded символы.
    // Поэтому мы должны декодировать его перед отправкой в заголовке.
    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
      // Additional validation to ensure the token is safe
      if (xsrfToken.length <= 1000) { // Reasonable limit for a CSRF token
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * @description Интерцептор для всех ВХОДЯЩИХ ответов.
 * Его задача остается прежней - отлавливать 401 ошибку.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().setUnauthenticated();
      console.error("401 Unauthorized! Сессия завершена.");
      // Only redirect to login if we're not already on the login page
      // This prevents infinite redirect loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Добавим обработку 419 ошибки для более ясного логгирования
    if (error.response?.status === 419) {
      console.error("419 CSRF Token Mismatch! Проверьте логику получения CSRF-cookie.");
      // Only redirect to login if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);