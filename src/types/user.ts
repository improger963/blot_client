// src/types/user.ts

/**
 * @description Описывает структуру кошелька пользователя.
 */
export interface Wallet {
    id: number;
    user_id: number;
    balance: string; // Суммы часто приходят строками для точности
    deposit_address: string | null;
}

/**
 * @description Описывает структуру социального аккаунта (например, Telegram).
 */
export interface SocialAccount {
    id: number;
    user_id: number;
    provider_name: 'telegram' | string;
    provider_id: string;
}

/**
 * @description Полная структура объекта "Пользователь", получаемая с эндпоинта /api/user.
 */
export interface User {
    id: number;
    username: string;
    avatar: string;
    email: string | null;
    referral_code: string;
    is_premium: boolean;
    referrer_id: number | null;
    is_pin_enabled: boolean;
    banned_at: string | null;
    wallet: Wallet;
    socialAccounts: SocialAccount[];
}