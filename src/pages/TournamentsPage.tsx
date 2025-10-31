// src/pages/TournamentsPage.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTournaments } from '../services/dataService';

import { motion } from 'framer-motion';
import { CardSkeleton } from '../components/ui/Skeleton';
import { TournamentCard } from '../components/TournamentCard';
import { GameTabs } from '../components/ui';

export const TournamentsPage = () => {
    const [activeFilter, setActiveFilter] = useState<'all' | 'poker' | 'blot'>('all');

    const { data: tournamentsData, isLoading } = useQuery({
        queryKey: ['tournaments'],
        queryFn: fetchTournaments,
        refetchInterval: 30000, // 30 seconds
    });

    // Apply filters
    const filteredTournaments = tournamentsData?.filter(tournament => {
        if (activeFilter === 'all') return true;
        return tournament.game_type === activeFilter;
    }) || [];

    const filterTabs = [
        { id: 'all', label: 'Все' },
        { id: 'poker', label: 'Покер' },
        { id: 'blot', label: 'Блот' }
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
                    Турниры
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Присоединяйтесь к турнирам с крупными призами
                </p>
            </motion.div>

            {/* Filters section */}
            <section className="space-y-6 deep-glass rounded-2xl p-6 neon-border">
                {/* Filters */}
                <motion.div 
                    className="pb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <GameTabs 
                        tabs={filterTabs} 
                        activeTab={activeFilter} 
                        onTabChange={(tabId) => setActiveFilter(tabId as 'all' | 'poker' | 'blot')} 
                    />
                </motion.div>

                {/* Tournaments grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <CardSkeleton key={i} className="h-[200px]" />
                            ))}
                        </div>
                    ) : filteredTournaments.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTournaments.map((tournament) => (
                                <TournamentCard key={tournament.id} tournament={tournament} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/40 bg-surface/50 py-16 text-center">
                            <div className="rounded-full bg-card p-4 mb-4">
                                <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Турниров не найдено</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                В этой категории пока нет доступных турниров. Попробуйте выбрать другую категорию или проверьте позже.
                            </p>
                        </div>
                    )}
                </motion.div>
            </section>
        </div>
    );
};