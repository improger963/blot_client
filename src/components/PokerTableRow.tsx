// src/components/PokerTableRow.tsx

import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { joinGameRoom } from '../services/dataService';
import { Button } from './ui';
import { UserIcon } from './icons';
import { getStakeAsNumber } from '../utils/game';
import type { GameRoom } from '../types/api';

export const PokerTableRow = ({ room }: { room: GameRoom }) => {
    const stakeValue = getStakeAsNumber(room.stake);
    
    const { mutate, isPending } = useMutation({
        mutationFn: () => joinGameRoom(room.id),
        onSuccess: () => {
            // Handle success - maybe show a notification or redirect
            console.log('Successfully joined room');
        },
        onError: (error) => {
            // Handle error - show notification
            console.error('Failed to join room:', error);
        }
    });

    const isFull = room.current_players >= room.max_players;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{
                y: -2,
                transition: { duration: 0.2 }
            }}
            className="flex items-center justify-between rounded-xl glass-card p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
            {/* Room info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">{room.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        room.status === 'waiting'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                    }`}>
                        {room.status === 'waiting' ? '🕐 Ожидание' : '🎮 В игре'}
                    </span>
                </div>
                
                <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-gray-400 flex-wrap">
                    <span>Блайнды: ${stakeValue}</span>
                    <span>Бай-ин: ${stakeValue * 20}</span>
                    <span className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {room.current_players}/{room.max_players}
                    </span>
                </div>
            </div>

            {/* Action button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    onClick={() => mutate()}
                    disabled={isFull || isPending}
                    isLoading={isPending}
                    className="ml-4 h-10 rounded-lg font-semibold glass-button text-white hover:translate-y-[-2px]"
                >
                    {isFull ? 'Полон' : 'Играть'}
                </Button>
            </motion.div>
        </motion.div>
    );
};