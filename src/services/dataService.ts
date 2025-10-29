import { api } from './api';
import type { GameRoomsResponse, TournamentsResponse } from '../types/api';

/**
 * @description Запрашивает с сервера список игровых комнат.
 * Этот запрос будет автоматически включать httpOnly cookie, если пользователь авторизован.
 * @returns {Promise<GameRoomsResponse>} Промис, который разрешается объектом с игровыми комнатами.
 */
export const fetchGameRooms = async (): Promise<GameRoomsResponse> => {
  const { data } = await api.get('/game-rooms');
  return data;
};

/**
 * @description Запрашивает с сервера список турниров.
 * @returns {Promise<TournamentsResponse>} Промис, который разрешается объектом с турнирами.
 */
export const fetchTournaments = async (): Promise<TournamentsResponse> => {
  const { data } = await api.get('/tournaments');
  return data;
};