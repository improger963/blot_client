// src/pages/TournamentsPage.tsx

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchTournaments, registerForTournament } from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnhancedTournamentCard } from '../components/EnhancedTournamentCard';
import { Card } from '../components/ui';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EnhancedStatsCard } from '../components/EnhancedStatsCard';
import { showError, showSuccess } from '../lib/notifications';
import type { Tournament } from '../types/api';

export const TournamentsPage = () => {
    const [activeFilter, setActiveFilter] = useState<'poker' | 'blot'>('poker');
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const navigate = useNavigate();

    const { data: tournamentsData, isLoading } = useQuery({
        queryKey: ['tournaments'],
        queryFn: fetchTournaments,
        refetchInterval: 30000, // 30 seconds
    });

    // Mutation for registering for a tournament
    const { mutate: registerTournament, isPending: isRegistering } = useMutation({
        mutationFn: (tournamentId: number) => registerForTournament(tournamentId),
        onSuccess: (data) => {
            showSuccess('Successfully registered for the tournament!');
            // Navigate to tournament or handle registration logic
            navigate(`/tournaments/${data.tournament.id}`);
        },
        onError: (error: any) => {
            // Handle specific error cases
            if (error?.response?.status === 400) {
                showError(error?.response?.data?.error || 'Failed to register for tournament');
            } else if (error?.response?.status === 401) {
                showError('You must be logged in to register for a tournament');
                navigate('/login');
            } else {
                showError('Failed to register for tournament. Please try again.');
            }
        },
    });

    // Apply filters
    const filteredTournaments = tournamentsData?.filter(tournament => {
        return tournament.game_type === activeFilter;
    }) || [];

    const filterTabs = [
        { id: 'poker', label: 'Poker', icon: 'sports_esports' },
        { id: 'blot', label: 'Blot', icon: 'cards' }
    ];

    const handleRegisterTournament = (tournament: Tournament) => {
        setSelectedTournament(tournament);
    };

    const handleConfirmRegistration = () => {
        if (selectedTournament) {
            // Register for the tournament using mutation
            registerTournament(selectedTournament.id);
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
                <h1 className="display-2 text-white">Tournaments</h1>
                <p className="body-1 text-lime-400/80 max-w-2xl mx-auto">
                    Compete in exciting poker tournaments with massive prize pools.
                    Prove your skills and climb the leaderboards.
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
                            onClick={() => setActiveFilter(filterItem.id as 'poker' | 'blot')}
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

            {/* Tournaments list */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                {isLoading ? (
                    <LoadingSkeleton type="card" count={3} />
                ) : filteredTournaments.length > 0 ? (
                    filteredTournaments.map((tournament, index) => (
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
                    ))
                ) : (
                    <Card className="text-center p-6" padding="lg" hoverEffect={true}>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl mb-4">
                            <span className="material-icons-round">emoji_events</span>
                        </div>
                        <h3 className="headline text-white mb-2">No Tournaments Available</h3>
                        <p className="body-2 text-lime-400/80">
                            No tournaments match your current filter. Try selecting a different category.
                        </p>
                    </Card>
                )}
            </motion.div>

            {/* Registration Modal */}
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
                                    disabled={isRegistering}
                                >
                                    {isRegistering ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="material-icons-round text-lg animate-spin">autorenew</span>
                                            Registering...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="material-icons-round text-lg">check</span>
                                            Confirm Registration
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};