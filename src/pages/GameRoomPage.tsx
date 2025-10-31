// src/pages/GameRoomPage.tsx

import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, UserIcon, MessageCircleIcon, CardsIcon } from '../components/icons';

/**
 * @description Страница игровой комнаты с адаптивным дизайном для мобильных и десктопных экранов.
 */
export const GameRoomPage = () => {
    const { id } = useParams<{ id: string }>();

    const players = [
        { id: 1, name: 'Alex Pro', balance: 1200, isActive: true },
        { id: 2, name: 'Maria Win', balance: 850, isActive: true },
        { id: 3, name: 'John Poker', balance: 2100, isActive: false },
        { id: 4, name: 'Sarah Queen', balance: 1500, isActive: true },
        { id: 5, name: 'Mike Bluff', balance: 950, isActive: true },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-surface/30 flex flex-col relative overflow-hidden">
            {/* Декоративные элементы для создания глубины */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-border/40 bg-surface/50 backdrop-blur-sm"
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link to="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                                <span className="font-medium">В лобби</span>
                            </motion.div>
                        </Link>

                        <div className="text-center">
                            <h1 className="text-lg font-bold text-foreground">Игровой стол #{id}</h1>
                            <p className="text-xs text-muted-foreground">Texas Hold'em • $10/$20</p>
                        </div>

                        <div className="w-20"></div> {/* Spacer for balance */}
                    </div>
                </div>
            </motion.header>

            {/* Mobile Layout */}
            <div className="lg:hidden flex-1 flex flex-col p-4 space-y-4">
                {/* Opponent Player */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                        y: -2,
                        boxShadow: "0 4px 20px hsl(var(--color-background) / 0.3)"
                    }}
                    className="rounded-2xl bg-surface/50 border border-border/40 p-4 glass border-gradient material-depth-1"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                                    <UserIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-surface bg-green-400"></div>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Alex Pro</p>
                                <p className="text-xs text-muted-foreground">Ходит...</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Баланс</p>
                            <p className="font-bold text-primary">1200 USD</p>
                        </div>
                    </div>
                </motion.div>

                {/* Game Table */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 20px 50px hsl(var(--color-background) / 0.5)"
                    }}
                    className="flex-1 flex items-center justify-center"
                >
                    <div className="relative w-full h-64 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 flex items-center justify-center shadow-lg glass border-gradient material-depth-3">
                        {/* Community Cards */}
                        <div className="flex gap-2 mb-16">
                            {[1, 2, 3, 4, 5].map((card) => (
                                <motion.div
                                    key={card}
                                    initial={{ rotateY: 90 }}
                                    animate={{ rotateY: 0 }}
                                    transition={{ delay: card * 0.1 }}
                                    whileHover={{ 
                                        y: -10,
                                        scale: 1.1
                                    }}
                                    className="w-12 h-16 bg-white rounded-lg border-2 border-border shadow-lg flex items-center justify-center"
                                >
                                    <CardsIcon className="h-6 w-6 text-foreground" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Pot */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
                                <p className="text-sm font-bold text-yellow-400">Банк: $450</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Current Player */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ 
                        y: -2,
                        boxShadow: "0 4px 20px hsl(var(--color-background) / 0.3)"
                    }}
                    className="rounded-2xl bg-surface/50 border border-border/40 p-4 glass border-gradient material-depth-1"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
                                    <UserIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-surface bg-green-400"></div>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Вы</p>
                                <p className="text-xs text-muted-foreground">Ваш ход</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Баланс</p>
                            <p className="font-bold text-primary">1000 USD</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-gradient">
                                Пас
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="secondary" className="w-full h-12 rounded-xl font-semibold border-gradient">
                                Колл $20
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="w-full h-12 rounded-xl font-semibold shadow-lg border-gradient">
                                Рейз $40
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-1 p-6 gap-6">
                {/* Left Sidebar - Players */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-80 flex flex-col space-y-6"
                >
                    {/* Players List */}
                    <div className="rounded-2xl bg-surface/50 border border-border/40 p-6 flex-1 glass border-gradient material-depth-2">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-primary" />
                            Игроки онлайн
                        </h3>
                        <div className="space-y-3">
                            <AnimatePresence>
                                {players.map((player, index) => (
                                    <motion.div
                                        key={player.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ 
                                            x: 5,
                                            boxShadow: "0 4px 20px hsl(var(--color-background) / 0.3)"
                                        }}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 glass-hover ${
                                            player.isActive
                                                ? 'bg-primary/5 border-primary/20'
                                                : 'bg-card/30 border-border/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                                                    <UserIcon className="h-4 w-4 text-primary" />
                                                </div>
                                                {player.isActive && (
                                                    <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border-2 border-surface bg-green-400"></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{player.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {player.isActive ? 'В игре' : 'Вышел'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary text-sm">{player.balance} USD</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="rounded-2xl bg-surface/50 border border-border/40 p-6 flex-1 flex flex-col glass border-gradient material-depth-2">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <MessageCircleIcon className="h-5 w-5 text-primary" />
                            Чат стола
                        </h3>
                        <div className="bg-card/30 border border-border/40 rounded-xl p-3 flex-1 mb-3 overflow-y-auto glass">
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground text-center py-8">
                                    Сообщения появятся здесь...
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Введите сообщение..."
                                className="flex-1 rounded-xl border border-border/40 bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="sm" className="rounded-xl border-gradient">
                                    Отпр
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Table Center */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col"
                >
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="relative w-full h-96 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 shadow-2xl flex items-center justify-center glass border-gradient material-depth-3">
                            {/* Community Cards */}
                            <div className="flex gap-3 mb-24">
                                {[1, 2, 3, 4, 5].map((card) => (
                                    <motion.div
                                        key={card}
                                        initial={{ rotateY: 90 }}
                                        animate={{ rotateY: 0 }}
                                        transition={{ delay: card * 0.1 }}
                                        whileHover={{ 
                                            y: -15,
                                            scale: 1.1
                                        }}
                                        className="w-16 h-24 bg-white rounded-xl border-2 border-border shadow-xl flex items-center justify-center"
                                    >
                                        <CardsIcon className="h-8 w-8 text-foreground" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pot */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-3">
                                    <p className="text-lg font-bold text-yellow-400">Банк: $450</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Player Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ 
                            y: -2,
                            boxShadow: "0 4px 20px hsl(var(--color-background) / 0.3)"
                        }}
                        className="rounded-2xl bg-surface/50 border border-border/40 p-6 mx-8 mb-6 glass border-gradient material-depth-2"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
                                        <UserIcon className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-surface bg-green-400"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-lg">Вы</p>
                                    <p className="text-sm text-muted-foreground">Ваш ход - сделайте ставку</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Ваш баланс</p>
                                <p className="font-bold text-primary text-xl">1000 USD</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-4 gap-3">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" className="w-full h-14 rounded-xl font-semibold text-base border-gradient">
                                    Пас
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="secondary" className="w-full h-14 rounded-xl font-semibold text-base border-gradient">
                                    Колл $20
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="w-full h-14 rounded-xl font-semibold text-base shadow-lg border-gradient">
                                    Рейз $40
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="primary" className="w-full h-14 rounded-xl font-semibold text-base shadow-lg bg-gradient-to-r from-primary to-primary/80 border-gradient">
                                    Все-ин $1000
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};