// src/pages/PokerPage.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGameRooms } from '../services/dataService';

import { motion } from 'framer-motion';
import { CardSkeleton } from '../components/ui/Skeleton';
import { PokerTableRow } from '../components/PokerTableRow';
import { GameTabs } from '../components/ui';

export const PokerPage = () => {
    const [activeTab, setActiveTab] = useState<'holdem' | 'omaha'>('holdem');
    const [activeFilter, setActiveFilter] = useState<'all' | 'low' | 'mid' | 'vip'>('all');

    const { data: gameRoomsData, isLoading } = useQuery({
        queryKey: ['gameRooms'],
        queryFn: fetchGameRooms,
        refetchInterval: 30000, // 30 seconds
    });

    // Filter rooms for poker game type
    const pokerRooms = gameRoomsData?.poker || [];

    // Apply filters
    const filteredRooms = pokerRooms.filter(room => {
        // Filter by game variant
        if (activeTab === 'holdem' && !room.name.toLowerCase().includes('holdem')) return false;
        if (activeTab === 'omaha' && !room.name.toLowerCase().includes('omaha')) return false;

        // Filter by stakes
        const stake = Number(room.stake);
        if (activeFilter === 'low' && stake > 10) return false;
        if (activeFilter === 'mid' && (stake <= 10 || stake > 50)) return false;
        if (activeFilter === 'vip' && stake <= 50) return false;

        return true;
    });

    const gameTabs = [
        { id: 'holdem', label: 'Техасский Холдем' },
        { id: 'omaha', label: 'Пот Лимит Омаха' }
    ];

    const filterTabs = [
        { id: 'all', label: 'Все' },
        { id: 'low', label: 'Low ($10 и ниже)'},
        { id: 'mid', label: 'Mid ($10 - $50)'},
        { id: 'vip', label: 'VIP ($50+)'}
    ];

    return (
        <div className="space-y-8 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
            </div>

            {/* Page header */}
            <motion.div 
                className="text-center space-y-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Покер
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Присоединяйтесь к столам техасского холдема или пот лимит омахи
                </p>
            </motion.div>

            {/* Submenu with tabs */}
            <section className="space-y-6 deep-glass rounded-2xl p-6 neon-border">
                {/* Game variant tabs */}
                <motion.div 
                    className="pb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <GameTabs 
                        tabs={gameTabs} 
                        activeTab={activeTab} 
                        onTabChange={(tabId) => setActiveTab(tabId as 'holdem' | 'omaha')} 
                    />
                </motion.div>

                {/* Filters */}
                <motion.div 
                    className="pb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex flex-wrap gap-2">
                        {filterTabs.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id as 'all' | 'low' | 'mid' | 'vip')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                                    activeFilter === filter.id
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                                        : 'bg-card text-foreground hover:bg-surface'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Game rooms table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
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
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/40 bg-surface/50 py-16 text-center">
                            <div className="rounded-full bg-card p-4 mb-4">
                                <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Столов не найдено</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                В этой категории пока нет доступных столов. Попробуйте выбрать другую категорию или проверьте позже.
                            </p>
                        </div>
                    )}
                </motion.div>
            </section>
        </div>
    );
};