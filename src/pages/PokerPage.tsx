// src/pages/PokerPage.tsx

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchGameRooms, joinGameRoom } from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnhancedPokerRoomCard } from '../components/EnhancedPokerRoomCard';
import { Button, Card, StatCard } from '../components/ui';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ResponsiveGrid } from '../components/layout';
import { getStakeAsNumber } from '../utils/game';
import { showError, showSuccess } from '../lib/notifications';
import type { GameRoom } from '../types/api';

export const PokerPage = () => {
    const [activeFilter, setActiveFilter] = useState<'low' | 'mid' | 'vip'>('low');
    const navigate = useNavigate();
    const [selectedRoom, setSelectedRoom] = useState<GameRoom | null>(null);

    const { data: gameRoomsData, isLoading } = useQuery({
        queryKey: ['gameRooms'],
        queryFn: fetchGameRooms,
        refetchInterval: 30000, // 30 seconds
    });

    // Mutation for joining a game room
    const { mutate: joinRoom, isPending: isJoining } = useMutation({
        mutationFn: (roomId: number) => joinGameRoom(roomId),
        onSuccess: (data) => {
            showSuccess('Successfully joined the room!');
            // Navigate to game room
            navigate(`/game-rooms/${data.room.id}`);
        },
        onError: (error: any) => {
            // Handle specific error cases
            if (error?.response?.status === 400) {
                showError(error?.response?.data?.error || 'Failed to join room');
            } else if (error?.response?.status === 401) {
                showError('You must be logged in to join a room');
                navigate('/login');
            } else {
                showError('Failed to join room. Please try again.');
            }
        },
    });

    // Filter rooms for poker game type
    const pokerRooms = gameRoomsData?.poker || [];

    // Apply filters
    const filteredRooms = pokerRooms.filter(room => {
        // Filter by stakes
        const stake = getStakeAsNumber(room.stake);
        if (activeFilter === 'low' && stake > 10) return false;
        if (activeFilter === 'mid' && (stake <= 10 || stake > 50)) return false;
        if (activeFilter === 'vip' && stake <= 50) return false;

        return true;
    });

    const filterTabs = [
        { id: 'low', label: 'Beginner', icon: 'rocket_launch' },
        { id: 'mid', label: 'Professional', icon: 'star' },
        { id: 'vip', label: 'VIP', icon: 'diamond' }
    ];

    const handleJoinRoom = (room: GameRoom) => {
        setSelectedRoom(room);
    };

    const handleConfirmJoin = () => {
        if (selectedRoom) {
            // Join the room using mutation
            joinRoom(selectedRoom.id);
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
                <h1 className="display-2 text-white">Poker Rooms</h1>
                <p className="body-1 text-lime-400/80 max-w-2xl mx-auto">
                    Join premium poker tables with players from around the world.
                    Real stakes, real excitement.
                </p>
            </motion.div>

            {/* Filter Tabs */}
            <div className="gradient-border-container-tab max-w-md mx-auto rounded-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="tab-container flex gap-1 p-1 glass-card rounded-2xl max-w-md mx-auto"
                >
                    {filterTabs.map(filterItem => (
                        <button
                            key={filterItem.id}
                            onClick={() => setActiveFilter(filterItem.id as 'low' | 'mid' | 'vip')}
                            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                                activeFilter === filterItem.id
                                    ? 'tab-active text-white'
                                    : 'tab-button text-gray-400'
                            }`}
                        >
                            <span className="material-icons-round text-lg">
                                {filterItem.icon}
                            </span>
                            <span className="caption hidden sm:block">{filterItem.label}</span>
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Game rooms grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {isLoading ? (
                    <LoadingSkeleton type="card" count={6} />
                ) : filteredRooms.length > 0 ? (
                    <ResponsiveGrid 
                        cols={{ xs: 1, sm: 1, md: 2, lg: 3 }} 
                        gap="md"
                    >
                        {filteredRooms.map((room, index) => (
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
                            No poker rooms match your current filter. Try selecting a different category.
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
                              <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setSelectedRoom(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                className="flex-1"
                                onClick={handleConfirmJoin}
                                disabled={isJoining}
                              >
                                {isJoining ? (
                                  <>
                                    <span className="material-icons-round text-lg animate-spin">autorenew</span>
                                    Joining...
                                  </>
                                ) : (
                                  <>
                                    <span className="material-icons-round text-lg">login</span>
                                    Join Game
                                  </>
                                )}
                              </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};