// src/types/api.ts



export interface AuthResponse {
    success: boolean;
    message: string;
    user: {
        id: number;
        username: string;
        referral_code: string;
    };
}

export interface GameRoom {
    id: number;
    name: string;
    game_type: 'poker' | 'blot' | string;
    stake: number | string;
    max_players: number;
    current_players: number;
    status: 'waiting' | 'in_progress' | 'finished';
}

export interface Tournament {
    id: number;
    name: string;
    game_type: string;
    prize_pool: number;
    buy_in: number;
    max_players: number;
    current_players: number;
    registration_opens_at: string;
    starts_at: string;
    status: 'registration_open' | 'running' | 'finished';
    is_joinable: boolean;
}


export type GameRoomsResponse = {
    meta: {
        total_rooms: number;
        available_types: string[];
    };
} & Record<string, GameRoom[]>;

export type TournamentsResponse = Tournament[];

/**
 * @description Структура ответа от /api/wallet/balance.
 */
export interface WalletBalanceResponse {
    balance: number;
    currency: string;
    deposit_address: string;
}

/**
 * @description Структура одной транзакции из истории.
 */
export interface Transaction {
    id: number;
    type: 'deposit' | 'withdrawal' | 'game_fee' | 'game_win';
    description: string;
    amount: string; // Строка с `+` или `-`
    status: 'completed' | 'pending' | 'failed';
    date: string; // Например, "01 Jan, 12:00"
}

/**
 * @description Структура ответа от /api/wallet/history.
 */
export interface WalletHistoryResponse {
    transactions: Transaction[];
    // Добавляем мета-информацию для будущей пагинации
    meta: {
        current_page: number;
        total_pages: number;
        total_transactions: number;
        per_page: number;
    };
}

/**
 * @description Структура одного реферала в ленте активности.
 */
export interface ReferralActivityItem {
    id: number;
    username: string;
    avatar: string | null;
    joined_at: string;
    total_earnings: number;
    formatted_earnings: string;
}

/**
 * @description Полная структура ответа от /api/referral.
 */
export interface ReferralStatsResponse {
    total_earnings: {
        amount: number;
        formatted: string;
    };
    referral_count: number;
    referral_links: {
        telegram: string;
        web: string;
        direct: string;
    };
    activity: ReferralActivityItem[];
}

/**
 * @description Тело запроса для POST /api/wallet/withdraw
 */
export interface CreateWithdrawalPayload {
    amount: number;
    address: string;
    pin: string;
}

/**
 * @description Ответ от POST /api/wallet/withdraw
 */
export interface CreateWithdrawalResponse {
    message: string;
    transaction_id: number;
    amount: number;
    network_fee: number;
    total_deducted: number;
}


/**
 * @description Ответ от /api/profile/security-status
 */
export interface SecurityStatusResponse {
    has_password: boolean;
    has_pin: boolean;
    pin_enabled: boolean;
    email_verified: boolean;
}

/**
 * @description Тело запроса для POST /api/profile/pin
 */
export interface SetPinPayload {
    pin: string;
    pin_confirmation: string;
}

/**
 * @description Тело запроса для POST /api/profile/password
 */
export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}


/**
 * @description Структура ответа от GET /api/wallet/deposit/config (ФИНАЛЬНАЯ ВЕРСИЯ)
 */
export interface DepositConfigResponse {
  min_amount: number;
  max_amount: number;
  payment_methods: {
    id: string;
    name: string;
  }[];
}

/**
 * @description Тело запроса для POST /api/wallet/deposit
 */
export interface CreateDepositPayload {
    amount: number;
    payment_method: string; // ID платежной системы
}

/**
 * @description Ответ от POST /api/wallet/deposit, теперь с адресом
 */
export interface CreateDepositResponse {
    message: string;
    transaction_id: number;
    amount: number;
    status: 'pending';
    // Ключевое поле - уникальный адрес для этой транзакции
    deposit_address: string;
}