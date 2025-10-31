// src/components/TournamentCard.tsx

import type { Tournament } from '../types/api';
import { Button } from './ui';
import { motion } from 'framer-motion';
import { CalendarIcon } from './icons';
import { CardSkeleton } from './ui/Skeleton';

interface TournamentCardProps {
  tournament: Tournament;
}

/**
 * @description Красивая, информативная карточка для отображения информации о турнире.
 */
export const TournamentCard = ({ tournament }: TournamentCardProps) => {
  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = new Date(tournament.starts_at) > new Date();
  const isRegistrationOpen = tournament.is_joinable && isUpcoming;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4, 
        transition: { duration: 0.2 },
        boxShadow: "0 10px 30px hsl(var(--color-background) / 0.4)"
      }}
      className="group relative overflow-hidden rounded-2xl bg-surface border border-border/40 shadow-lg hover:shadow-xl hover:shadow-black/20 transition-all duration-300 parallax-layer material-depth-2"
    >
      {/* Акцентная полоса сверху */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isRegistrationOpen
          ? 'bg-gradient-to-r from-primary to-secondary'
          : 'bg-muted-foreground/40'
        } rounded-t-2xl`} />

      {/* Основной контент */}
      <div className="p-6 space-y-4">
        {/* Заголовок и тип игры */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <motion.span 
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide border-gradient ${
                tournament.game_type === 'poker'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {tournament.game_type}
            </motion.span>
            {isUpcoming && (
              <div className="flex h-2 w-2">
                <motion.div 
                  className="absolute h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.75, 0.3, 0.75]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity 
                  }}
                />
                <div className="relative h-2 w-2 rounded-full bg-green-500" />
              </div>
            )}
          </div>

          <motion.h3 
            className="font-bold text-foreground line-clamp-2 leading-tight"
            whileHover={{ scale: 1.02 }}
          >
            {tournament.name}
          </motion.h3>
        </div>

        {/* Призовые и взнос */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
              Призовые
            </p>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <motion.p 
                className="text-sm font-bold text-foreground"
                whileHover={{ scale: 1.05 }}
              >
                ${tournament.prize_pool.toLocaleString()}
              </motion.p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
              Взнос
            </p>
            <motion.p 
              className="text-sm font-bold text-foreground"
              whileHover={{ scale: 1.05 }}
            >
              ${tournament.buy_in}
            </motion.p>
          </div>
        </div>

        {/* Прогресс регистрации */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Регистрация</span>
            <span className="font-medium text-foreground">
              {Math.round((tournament.current_players / tournament.max_players) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-card rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(tournament.current_players / tournament.max_players) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${isRegistrationOpen
                  ? 'bg-gradient-to-r from-primary to-secondary'
                  : 'bg-muted-foreground/60'
                }`}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {tournament.current_players} из {tournament.max_players}
            </span>
            <span className="text-muted-foreground">
              {tournament.current_players === tournament.max_players ? 'Полный' : 'Открыт'}
            </span>
          </div>
        </div>

        {/* Дата и время */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>Начало: {formatDate(tournament.starts_at)}</span>
        </div>

        {/* Кнопка регистрации */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            disabled={!isRegistrationOpen}
            variant={isRegistrationOpen ? 'primary' : 'secondary'}
            className="w-full h-11 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-gradient"
          >
            {isRegistrationOpen ? '🎯 Зарегистрироваться' :
              tournament.current_players >= tournament.max_players ? '🚫 Турнир полон' :
                '⏳ Регистрация закрыта'}
          </Button>
        </motion.div>
      </div>

      {/* Декоративный элемент */}
      <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
      
      {/* Дополнительные декоративные элементы для тактильного удовольствия */}
      <div className="absolute -left-4 -bottom-4 h-12 w-12 rounded-full bg-secondary/10 blur-xl" />
    </motion.div>
  );
};

export { CardSkeleton };