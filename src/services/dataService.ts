import { api } from './api';
import type {
  GameRoomsResponse,
  TournamentsResponse,
  WalletBalanceResponse,
  WalletHistoryResponse,
  ReferralStatsResponse,
  CreateWithdrawalPayload,
  CreateWithdrawalResponse,
  SecurityStatusResponse,
  SetPinPayload,
  ChangePasswordPayload,
  DepositConfigResponse,
  CreateDepositPayload,
  CreateDepositResponse,
} from '../types/api';


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

/**
 * @description Отправляет запрос на присоединение к игровой комнате.
 * @param roomId - ID комнаты, к которой нужно присоединиться.
 */
export const joinGameRoom = async (roomId: number | string): Promise<any> => {
  // API ожидает POST /api/game-rooms/{room}/join
  const { data } = await api.post(`/game-rooms/${roomId}/join`);
  return data;
};


/**
@description Запрашивает с сервера баланс кошелька пользователя.
*/
export const fetchWalletBalance = async (): Promise<WalletBalanceResponse> => {
  const { data } = await api.get('/wallet/balance');
  return data;
};


/**
@description Запрашивает с сервера историю транзакций.
*/
export const fetchWalletHistory = async (): Promise<WalletHistoryResponse> => {
  const { data } = await api.get('/wallet/history');
  return data;
};

/**
 * @description Запрашивает с сервера статистику по реферальной программе.
 */
export const fetchReferralStats = async (): Promise<ReferralStatsResponse> => {
  const { data } = await api.get('/referral');
  return data;
};


/**
 * @description Создает запрос на вывод средств.
 */
export const createWithdrawalRequest = async (payload: CreateWithdrawalPayload): Promise<CreateWithdrawalResponse> => {
  const { data } = await api.post('/wallet/withdraw', payload);
  return data;
};

/**
 * @description Запрашивает текущий статус безопасности пользователя.
 */
export const fetchSecurityStatus = async (): Promise<SecurityStatusResponse> => {
  const { data } = await api.get('/profile/security-status');
  return data;
};

/**
 * @description Устанавливает PIN-код для пользователя.
 */
export const setPinRequest = async (payload: SetPinPayload): Promise<{ message: string }> => {
  const { data } = await api.post('/profile/pin', payload);
  return data;
};

/**
 * @description Включает или выключает требование PIN-кода.
 */
export const togglePinRequest = async (enabled: boolean): Promise<{ message: string }> => {
  const { data } = await api.put('/profile/pin/toggle', { enabled });
  return data;
};

/**
 * @description Меняет пароль пользователя.
 */
export const changePasswordRequest = async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
  const { data } = await api.post('/profile/password', payload);
  return data;
};

/**
 * @description Запрашивает конфигурацию для создания депозита.
 */
export const fetchDepositConfig = async (): Promise<DepositConfigResponse> => {
  const { data } = await api.get('/wallet/deposit/config');
  return data;
};

/**
 * @description Создает запрос на пополнение, возвращает адрес для оплаты.
 */
export const createDepositRequest = async (payload: CreateDepositPayload): Promise<CreateDepositResponse> => {
  const { data } = await api.post('/wallet/deposit', payload);
  return data;
};