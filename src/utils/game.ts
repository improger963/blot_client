// src/utils/game.ts
// Utility functions for game-related operations

import type { GameRoom } from '../types/api';

/**
 * @description Converts a GameRoom's stake to a number, handling both number and string formats
 * @param stake The stake value which can be a number or string
 * @returns The stake as a number
 */
export const getStakeAsNumber = (stake: number | string): number => {
  if (typeof stake === 'number') {
    return stake;
  }
  return Number(stake);
};

/**
 * @description Gets the stake level based on the stake amount
 * @param stake The stake value which can be a number or string
 * @returns The stake level ('low' | 'mid' | 'vip')
 */
export const getStakeLevel = (stake: number | string): 'low' | 'mid' | 'vip' => {
  const stakeValue = getStakeAsNumber(stake);
  if (stakeValue <= 10) return 'low';
  if (stakeValue > 10 && stakeValue <= 50) return 'mid';
  return 'vip';
};