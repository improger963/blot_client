// src/components/GameTableRow.tsx
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui';
import { joinGameRoom } from '../services/dataService';
import type { GameRoom } from '../types/api';
import { showError } from '../lib/notifications';
import { motion } from 'framer-motion';
import { PlayIcon, ClockIcon, UsersIcon } from './icons';

interface GameTableRowProps {
    room: GameRoom;
}

export const GameTableRow = ({ room }: GameTableRowProps) => {
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: () => joinGameRoom(room.id),
        onSuccess: () => {
            navigate(`/game-rooms/${room.id}`);
        },
        onError: (error) => {
            showError(`Ошибка входа: ${error.message}`);
        },
    });

    const isFull = room.current_players >= room.max_players;
    const isWaiting = room.status === 'waiting';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
                x: 4, 
                transition: { duration: 0.2 },
                boxShadow: "0 4px 20px hsl(var(--color-background) / 0.3)"
            }}
            className="flex items-center justify-between rounded-xl bg-surface/30 p-4 border border-border/20 hover:border-border/40 hover:bg-surface/50 transition-all duration-200 group material-depth-1"
        >
            {/* Левая часть - информация о комнате */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Статус комнаты - "чип" с градиентной иконкой */}
                <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ 
                        scale: 1.1,
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 ${
                        isWaiting
                            ? 'bg-green-500/10 border-green-500/20'
                            : 'bg-blue-500/10 border-blue-500/20'
                    } border-gradient`}>
                        {isWaiting ? (
                            <ClockIcon className="h-5 w-5 text-green-400" />
                        ) : (
                            <PlayIcon className="h-5 w-5 text-blue-400" />
                        )}
                    </div>
                </motion.div>

                {/* Детали комнаты */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <motion.h3 
                            className="font-semibold text-foreground truncate"
                            whileHover={{ scale: 1.02 }}
                        >
                            {room.name}
                        </motion.h3>
                        <motion.span 
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border border-gradient ${
                                isWaiting
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}
                            whileHover={{ scale: 1.1 }}
                        >
                            {isWaiting ? '🕐 Ожидание' : '🎮 В игре'}
                        </motion.span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <UsersIcon className="h-3.5 w-3.5" />
                            <span>
                                {room.current_players}/{room.max_players}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs">•</span>
                            <span className="capitalize">{room.game_type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs">•</span>
                            <span>${room.stake}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Правая часть - ставка и кнопка */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {/* Ставка */}
                <div className="text-right">
                    <motion.p 
                        className="font-bold text-primary text-lg"
                        whileHover={{ scale: 1.05 }}
                    >
                        ${room.stake}
                    </motion.p>
                    <p className="text-xs text-muted-foreground">
                        ставка
                    </p>
                </div>

                {/* Кнопка входа */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            mutate();
                        }}
                        disabled={isFull || isPending}
                        isLoading={isPending}
                        size="sm"
                        className={`rounded-xl font-semibold min-w-20 border-gradient ${
                            isFull ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20' : ''
                        }`}
                    >
                        {isFull ? (
                            <>🚫 Полна</>
                        ) : isPending ? (
                            <>⏳ Вход...</>
                        ) : (
                            <>🎯 Войти</>
                        )}
                    </Button>
                </motion.div>
            </div>

            {/* Прогресс-бар заполненности (только на десктопе) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-card rounded-b-xl overflow-hidden hidden sm:block">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(room.current_players / room.max_players) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${isFull
                            ? 'bg-red-500'
                            : 'bg-gradient-to-r from-primary to-secondary'
                        }`}
                />
            </div>
        </motion.div>
    );
};