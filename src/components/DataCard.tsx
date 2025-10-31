// src/components/DataCard.tsx
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui';
import { joinGameRoom } from '../services/dataService';
import type { GameRoom } from '../types/api';
import { showError } from '../lib/notifications';
import { UserIcon } from './icons';
import { CardSkeleton } from './ui/Skeleton';

interface DataCardProps {
    room: GameRoom;
}

const gameImageMap = {
    blot: '/images/blot-bg.jpg',
    poker: '/images/poker-bg.jpg',
    default: '/images/default-bg.jpg',
} as const;

// Define the game types explicitly
type GameType = keyof typeof gameImageMap;

export const DataCard = ({ room }: DataCardProps) => {
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: () => joinGameRoom(room.id),
        onSuccess: () => navigate(`/game-rooms/${room.id}`),
        onError: (error) => showError(`Ошибка входа: ${error.message}`),
    });

    const isFull = room.current_players >= room.max_players;
    // Fix the indexing error by casting to GameType
    const gameType = (room.game_type in gameImageMap) ? room.game_type as GameType : 'default';
    const imageUrl = gameImageMap[gameType];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="group relative overflow-hidden rounded-2xl bg-card border-b border-border/60 shadow-lg hover:shadow-xl hover:shadow-black/20 transition-all duration-300 parallax-layer"
        >
            {/* Верхняя часть с фоном и градиентом */}
            <div className="relative h-32 w-full bg-cover bg-center parallax-element" style={{ backgroundImage: `url(${imageUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

                {/* Заголовок комнаты */}
                <div className="absolute bottom-4 left-4 right-4">
                    <motion.h3 
                        className="text-lg font-bold text-foreground line-clamp-1"
                        whileHover={{ scale: 1.05 }}
                    >
                        {room.name}
                    </motion.h3>
                    <div className="flex items-center justify-between mt-2">
                        <motion.span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                room.status === 'waiting'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-blue-500/20 text-blue-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                        >
                            {room.status === 'waiting' ? '🕐 Ожидание' : '🎮 В игре'}
                        </motion.span>
                        <motion.span 
                            className="text-xs text-muted-foreground font-medium capitalize"
                            whileHover={{ scale: 1.1 }}
                        >
                            {room.game_type}
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* Нижняя часть с информацией */}
            <div className="p-5 space-y-4">
                {/* Статистика комнаты */}
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                            Ставка
                        </p>
                        <motion.p 
                            className="text-sm font-bold text-foreground bg-surface rounded-lg py-1"
                            whileHover={{ scale: 1.05 }}
                        >
                            ${room.stake}
                        </motion.p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                            Игроки
                        </p>
                        <motion.p 
                            className="text-sm font-bold text-foreground flex items-center justify-center gap-1 bg-surface rounded-lg py-1"
                            whileHover={{ scale: 1.05 }}
                        >
                            <UserIcon className="h-3.5 w-3.5 text-primary" />
                            {room.current_players}/{room.max_players}
                        </motion.p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                            Уровень
                        </p>
                        <motion.p 
                            className="text-sm font-bold text-foreground bg-surface rounded-lg py-1"
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Fix the comparison by converting stake to number */}
                            {Number(room.stake) > 100 ? 'PRO' : 'MED'}
                        </motion.p>
                    </div>
                </div>

                {/* Прогресс-бар заполненности */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Заполненность</span>
                        <span className="font-medium text-foreground">
                            {Math.round((room.current_players / room.max_players) * 100)}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(room.current_players / room.max_players) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                                }`}
                        />
                    </div>
                </div>

                {/* Кнопка присоединения */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        onClick={() => mutate()}
                        disabled={isFull || isPending}
                        isLoading={isPending}
                        className="w-full h-11 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    >
                        {isFull ? '🚫 Комната полна' :
                            isPending ? '⏳ Входим...' :
                                '🎯 Присоединиться'}
                    </Button>
                </motion.div>
            </div>

            {/* Акцентная полоса сверху */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-2xl" />
            
            {/* Декоративные элементы для тактильного удовольствия */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />
        </motion.div>
    );
};

export { CardSkeleton };