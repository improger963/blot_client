// src/pages/PokerPage.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGameRooms } from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnhancedPokerRoomCard } from '../components/EnhancedPokerRoomCard';
import { Card, StatCard } from '../components/ui';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ResponsiveGrid } from '../components/layout';
import { getStakeAsNumber } from '../utils/game';
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
            // Navigate to game room or handle join logic
            navigate(`/game-rooms/${selectedRoom.id}`);
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="tab-container flex gap-1 p-1 glass-card rounded-2xl max-w-md mx-auto border border-lime-500/20"
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

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <ResponsiveGrid 
                    cols={{ xs: 2, sm: 2, md: 4 }} 
                    gap="sm"
                >
                    <StatCard
                        icon={<span className="material-icons-round">groups</span>}
                        label="Active Players"
                        value="2.4K"
                        trend={{ value: 12, label: '24h' }}
                    />
                    <StatCard
                        icon={<span className="material-icons-round">payments</span>}
                        label="Total Prize"
                        value="45.2K TON"
                        trend={{ value: 8, label: '24h' }}
                    />
                    <StatCard
                        icon={<span className="material-icons-round">schedule</span>}
                        label="Avg. Wait Time"
                        value="45s"
                        trend={{ value: -15, label: '24h' }}
                    />
                    <StatCard
                        icon={<span className="material-icons-round">casino</span>}
                        label="Active Tables"
                        value="127"
                        trend={{ value: 5, label: '24h' }}
                    />
                </ResponsiveGrid>
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
                                    onClick={handleConfirmJoin}
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
        </div>
    );
};