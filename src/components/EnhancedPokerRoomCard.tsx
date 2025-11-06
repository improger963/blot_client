import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { GameRoom } from '../types/api';
import { getStakeAsNumber, getStakeLevel } from '../utils/game';

interface EnhancedPokerRoomCardProps {
  room: GameRoom;
  onJoin: (room: GameRoom) => void;
}

export const EnhancedPokerRoomCard = ({ room, onJoin }: EnhancedPokerRoomCardProps) => {
  const stakeValue = getStakeAsNumber(room.stake);
  const stakeLevel = getStakeLevel(room.stake);

  const getStakeColor = (stake: string) => {
    const colors: Record<string, string> = {
      low: 'from-lime-500 to-lime-600',
      mid: 'from-lime-400 to-lime-500',
      vip: 'from-lime-600 to-lime-700'
    };
    return colors[stake] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status: string) => {
    // Map API status to UI status
    const statusMap: Record<string, string> = {
      'waiting': 'waiting',
      'in_progress': 'in-game',
      'finished': 'finished'
    };
    
    const uiStatus = statusMap[status] || status;
    return uiStatus === 'waiting' ? 'text-lime-400' : 'text-amber-400';
  };

  // Map API status to UI status
  const mapStatus = (status: string): 'waiting' | 'in-game' => {
    return status === 'waiting' ? 'waiting' : 'in-game';
  };

  const uiStatus = mapStatus(room.status);

  return (
    <Card className="h-full" padding="lg" hoverEffect={true}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="title text-white mb-2">{room.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getStakeColor(stakeLevel)} text-white caption font-medium`}>
              {stakeLevel.toUpperCase()}
            </span>
            <span className={`flex items-center gap-1 ${getStatusColor(room.status)} caption`}>
              <div className={`status-dot ${uiStatus === 'waiting' ? 'online bg-lime-400' : 'bg-amber-400'}`}></div>
              {uiStatus === 'waiting' ? 'Waiting' : 'In Game'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="headline text-lime-400">{stakeValue} TON</p>
          <p className="caption text-lime-400/80">Stake</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="body-2 text-gray-400">Players</span>
          <span className="body-1 text-white">
            {room.current_players}/{room.max_players}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="body-2 text-gray-400">Game Type</span>
          <span className="body-1 text-white">{room.game_type}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="caption text-lime-400/80">Room Capacity</span>
          <span className="caption text-lime-400/80">{Math.round((room.current_players / room.max_players) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(room.current_players / room.max_players) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="progress-fill"
          />
        </div>
      </div>

      <Button
        onClick={() => onJoin(room)}
        variant="primary"
        className="w-full"
        disabled={room.current_players >= room.max_players}
      >
        {room.current_players >= room.max_players ? (
          <>
            <span className="material-icons-round text-lg">lock</span>
            Room Full
          </>
        ) : (
          <>
            <span className="material-icons-round text-lg">login</span>
            Join Game
          </>
        )}
      </Button>
    </Card>
  );
};