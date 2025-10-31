// src/components/PokerTableRow.tsx

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui';
import { joinGameRoom } from '../services/dataService';
import type { GameRoom } from '../types/api';
import { showError } from '../lib/notifications';
import { UserIcon } from './icons';

interface PokerTableRowProps {
    room: GameRoom;
}

export const PokerTableRow = ({ room }: PokerTableRowProps) => {
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: () => joinGameRoom(room.id),
        onSuccess: () => navigate(`/game-rooms/${room.id}`),
        onError: (error) => showError(`Ошибка входа: ${error.message}`),
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
            className="flex items-center justify-between rounded-xl bg-card border border-border/60 p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
            {/* Room info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">{room.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        room.status === 'waiting'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                    }`}>
                        {room.status === 'waiting' ? '🕐 Ожидание' : '🎮 В игре'}
                    </span>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Блайнды: ${room.stake}</span>
                    <span>Бай-ин: ${Number(room.stake) * 20}</span>
                    <span className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
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
                    className="ml-4 h-10 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                    {isFull ? 'Полон' : 'Играть'}
                </Button>
            </motion.div>
        </motion.div>
    );
};