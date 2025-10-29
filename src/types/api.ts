// src/types/api.ts

import type { User } from './user';

/**
 * @description Описывает структуру ответа от эндпоинта `/api/auth/telegram/callback`.
 * В новой, безопасной архитектуре с httpOnly cookie, ответ содержит только пользователя.
 */
export interface AuthResponse {
    user: User;
}

// Определим базовые типы для игровых сущностей для большей ясности,
// чем просто `unknown[]`. В будущем их можно будет расширить.
interface GameRoom {
    id: number;
    name: string;
    // ... другие поля комнаты
}

interface Tournament {
    id: number;
    name: string;
    // ... другие поля турнира
}

/**
 * @description Описывает структуру ответа от эндпоинта `/api/game-rooms`.
 */
export interface GameRoomsResponse {
    game_rooms: GameRoom[];
}

/**
 * @description Описывает структуру ответа от эндпоинта `/api/tournaments`.
 */
export interface TournamentsResponse {
    tournaments: Tournament[];
}