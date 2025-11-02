import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import type { Tournament } from '../types/api';

interface EnhancedTournamentCardProps {
  tournament: Tournament;
  onRegister: (tournament: Tournament) => void;
}

export const EnhancedTournamentCard = ({ tournament, onRegister }: EnhancedTournamentCardProps) => {
  const formatTimeUntil = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();

    if (diff <= 0) return 'Starting now';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `Starts in ${hours}h ${minutes}m`;
  };

  const getStatusClass = (status: string) => {
    return status === 'registration_open' 
      ? 'bg-lime-500/20 text-lime-400'
      : 'bg-amber-500/20 text-amber-400';
  };

  const getStatusText = (status: string) => {
    return status === 'registration_open' ? 'Registration Open' : 'Starting Soon';
  };

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6" padding="lg" hoverEffect={true}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="title text-white">{tournament.name}</h3>
          <span className={`px-3 py-1 rounded-full caption font-medium ${getStatusClass(tournament.status)}`}>
            {getStatusText(tournament.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="caption text-lime-400/80">Buy-in</p>
            <p className="body-1 text-lime-400">{tournament.buy_in} TON</p>
          </div>
          <div>
            <p className="caption text-lime-400/80">Prize Pool</p>
            <p className="body-1 text-white">{tournament.prize_pool.toLocaleString()} TON</p>
          </div>
          <div>
            <p className="caption text-lime-400/80">Players</p>
            <p className="body-1 text-white">{tournament.current_players}/{tournament.max_players}</p>
          </div>
          <div>
            <p className="caption text-lime-400/80">Game Type</p>
            <p className="body-1 text-white">{tournament.game_type}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-w-[200px]">
        <p className="body-2 text-lime-400 text-center">
          {formatTimeUntil(tournament.starts_at)}
        </p>
        <button
          className="btn-primary py-3 rounded-2xl"
          onClick={() => onRegister(tournament)}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-icons-round text-lg">emoji_events</span>
            Register Now
          </span>
        </button>
      </div>
    </Card>
  );
};