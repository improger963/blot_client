import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchGameRooms, fetchTournaments } from '../services/dataService';
import { motion } from 'framer-motion';
import { EnhancedPokerRoomCard } from '../components/EnhancedPokerRoomCard';
import { EnhancedTournamentCard } from '../components/EnhancedTournamentCard';
import { Card, StatCard } from '../components/ui';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ResponsiveGrid } from '../components/layout';
import { getStakeAsNumber } from '../utils/game';
import type { GameRoom, Tournament } from '../types/api';

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<GameRoom | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // Fetch both game rooms and tournaments simultaneously
  const { data: gameRoomsData, isLoading: isRoomsLoading } = useQuery({
    queryKey: ['gameRooms'],
    queryFn: fetchGameRooms,
    refetchInterval: 30000, // 30 seconds
  });

  const { data: tournamentsData, isLoading: isTournamentsLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
    refetchInterval: 30000, // 30 seconds
  });

  // Filter rooms for poker game type
  const pokerRooms = gameRoomsData?.poker || [];

  // Get first 3 poker rooms for display
  const featuredRooms = pokerRooms.slice(0, 3);

  // Get first 3 tournaments for display
  const featuredTournaments = tournamentsData?.slice(0, 3) || [];

  const handleJoinRoom = (room: GameRoom) => {
    setSelectedRoom(room);
  };

  const handleConfirmJoinRoom = () => {
    if (selectedRoom) {
      // Navigate to game room or handle join logic
      navigate(`/game-rooms/${selectedRoom.id}`);
    }
  };

  const handleRegisterTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
  };

  const handleConfirmRegistration = () => {
    if (selectedTournament) {
      // Navigate to tournament or handle registration logic
      navigate(`/tournaments/${selectedTournament.id}`);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Page header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="display-2 text-white">Game Lobby</h1>
        <p className="body-1 text-lime-400/80 max-w-2xl mx-auto">
          Join premium poker tables or compete in exciting tournaments with massive prize pools.
        </p>
      </motion.div>

      {/* Featured Poker Rooms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="headline text-white">Featured Poker Rooms</h2>
          <button 
            onClick={() => navigate('/poker')}
            className="text-lime-400 hover:text-lime-300 flex items-center gap-1 caption font-medium"
          >
            View All
            <span className="material-icons-round text-sm">chevron_right</span>
          </button>
        </div>

        {isRoomsLoading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : featuredRooms.length > 0 ? (
          <ResponsiveGrid 
            cols={{ xs: 1, sm: 1, md: 3 }} 
            gap="md"
          >
            {featuredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedPokerRoomCard 
                  room={room} 
                  onJoin={handleJoinRoom} 
                />
              </motion.div>
            ))}
          </ResponsiveGrid>
        ) : (
          <Card className="text-center p-6" padding="lg" hoverEffect={true}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl mb-4">
              <span className="material-icons-round">sports_esports</span>
            </div>
            <h3 className="headline text-white mb-2">No Rooms Available</h3>
            <p className="body-2 text-lime-400/80">
              No poker rooms are currently available. Please check back later.
            </p>
          </Card>
        )}
      </motion.div>

      {/* Featured Tournaments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="headline text-white">Featured Tournaments</h2>
          <button 
            onClick={() => navigate('/tournaments')}
            className="text-lime-400 hover:text-lime-300 flex items-center gap-1 caption font-medium"
          >
            View All
            <span className="material-icons-round text-sm">chevron_right</span>
          </button>
        </div>

        {isTournamentsLoading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : featuredTournaments.length > 0 ? (
          <div className="space-y-4">
            {featuredTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedTournamentCard 
                  tournament={tournament} 
                  onRegister={handleRegisterTournament} 
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="text-center p-6" padding="lg" hoverEffect={true}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl mb-4">
              <span className="material-icons-round">emoji_events</span>
            </div>
            <h3 className="headline text-white mb-2">No Tournaments Available</h3>
            <p className="body-2 text-lime-400/80">
              No tournaments are currently available. Please check back later.
            </p>
          </Card>
        )}
      </motion.div>

      {/* Room Join Modal */}
      {selectedRoom && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRoom(null)}
        >
          <div 
            className="glass-panel max-w-md w-full p-6 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl">
                <span className="material-icons-round">sports_esports</span>
              </div>

              <div>
                <h3 className="headline text-white mb-2">Join {selectedRoom.name}</h3>
                <p className="body-2 text-lime-400/80">
                  Ready to play {selectedRoom.game_type}?
                </p>
              </div>

              <div className="space-y-3 glass-card p-4 rounded-2xl">
                <div className="flex justify-between">
                  <span className="body-2 text-gray-400">Stake</span>
                  <span className="body-1 text-lime-400">{getStakeAsNumber(selectedRoom.stake)} TON</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-2 text-gray-400">Current Players</span>
                  <span className="body-1 text-white">{selectedRoom.current_players}/{selectedRoom.max_players}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-2 text-gray-400">Game Type</span>
                  <span className="body-1 text-white">{selectedRoom.game_type}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="btn-secondary flex-1 py-3 rounded-xl"
                  onClick={() => setSelectedRoom(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary flex-1 py-3 rounded-xl"
                  onClick={handleConfirmJoinRoom}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-icons-round text-lg">login</span>
                    Join Game
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Registration Modal */}
      {selectedTournament && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTournament(null)}
        >
          <div 
            className="glass-panel max-w-md w-full p-6 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl">
                <span className="material-icons-round">emoji_events</span>
              </div>

              <div>
                <h3 className="headline text-white mb-2">Register for {selectedTournament.name}</h3>
                <p className="body-2 text-lime-400/80">
                  Confirm your registration for this tournament
                </p>
              </div>

              <div className="space-y-3 glass-card p-4 rounded-2xl">
                <div className="flex justify-between">
                  <span className="body-2 text-gray-400">Buy-in</span>
                  <span className="body-1 text-lime-400">{selectedTournament.buy_in} TON</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-2 text-gray-400">Prize Pool</span>
                  <span className="body-1 text-white">{selectedTournament.prize_pool.toLocaleString()} TON</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-2 text-gray-400">Current Players</span>
                  <span className="body-1 text-white">{selectedTournament.current_players}/{selectedTournament.max_players}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="btn-secondary flex-1 py-3 rounded-xl"
                  onClick={() => setSelectedTournament(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary flex-1 py-3 rounded-xl"
                  onClick={handleConfirmRegistration}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-icons-round text-lg">check</span>
                    Confirm Registration
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};