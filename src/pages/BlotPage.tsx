// src/pages/BlotPage.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGameRooms } from '../services/dataService';
import { motion } from 'framer-motion';
import { PokerTableRow } from '../components/PokerTableRow';
import { Card, CardSkeleton } from '../components/ui';
import { EnhancedStatsCard } from '../components/EnhancedStatsCard';
import { getStakeAsNumber } from '../utils/game';
import type { GameRoom } from '../types/api';

export const BlotPage = () => {
    const [activeFilter, setActiveFilter] = useState<'low' | 'mid' | 'vip'>('low');

    const { data: gameRoomsData, isLoading } = useQuery({
        queryKey: ['gameRooms'],
        queryFn: fetchGameRooms,
        refetchInterval: 30000, // 30 seconds
    });

    // Filter rooms for blot game type
    const blotRooms = gameRoomsData?.blot || [];

    // Apply filters
    const filteredRooms = blotRooms.filter(room => {
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

    return (
        <div className="space-y-8 relative">
            {/* Page header */}
            <motion.div 
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="display-2 text-white">Blot Rooms</h1>
                <p className="body-1 text-lime-400/80 max-w-2xl mx-auto">
                    Join premium blot tables with players from around the world.
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

            {/* Game rooms table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="p-6">
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <CardSkeleton key={i} className="h-16 rounded-xl" />
                            ))}
                        </div>
                    ) : filteredRooms.length > 0 ? (
                        <div className="space-y-3">
                            {filteredRooms.map((room) => (
                                <PokerTableRow key={room.id} room={room} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl py-12 text-center">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl mb-4">
                                <span className="material-icons-round">sports_esports</span>
                            </div>
                            <h3 className="headline text-white mb-2">No Rooms Available</h3>
                            <p className="body-2 text-lime-400/80">
                                No blot rooms match your current filter. Try selecting a different category.
                            </p>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};