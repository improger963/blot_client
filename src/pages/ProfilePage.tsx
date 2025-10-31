// src/pages/ProfilePage.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchSecurityStatus } from '../services/dataService';
import { useAuthStore } from '../store/authStore';
import { SecuritySettings } from '../components/SecuritySettings';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ShieldIcon, LogOutIcon } from '../components/icons';

export const ProfilePage = () => {
    const { user, logout } = useAuthStore();
    const { data: securityStatus } = useQuery({
        queryKey: ['securityStatus'],
        queryFn: fetchSecurityStatus,
    });

    return (
        <div className="space-y-8 pb-24 relative">
            {/* Декоративные элементы для создания глубины */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
            </div>

            {/* Заголовок страницы */}
            <motion.div 
                className="text-center space-y-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center">
                    <motion.div 
                        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg shadow-primary/25"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20,
                            delay: 0.2
                        }}
                        whileHover={{ 
                            scale: 1.1,
                            rotate: [0, 5, -5, 0]
                        }}
                    >
                        <span className="text-2xl font-bold text-white">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </motion.div>
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground">{user?.username || 'Пользователь'}</h1>
                    <p className="text-muted-foreground">ID: {user?.id || 'N/A'}</p>
                </div>
            </motion.div>

            {/* Секция безопасности */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <SecuritySettings />
            </motion.section>

            {/* Статус аккаунта */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-surface/50 border border-border/40 p-6 space-y-4 glass border-gradient"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                        <ShieldIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Статус аккаунта</h2>
                        <p className="text-sm text-muted-foreground">Информация о защите вашего аккаунта</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-xl bg-card/30 p-4 glass-hover">
                        <span className="text-sm text-muted-foreground">Пароль</span>
                        <span className={`text-sm font-semibold ${securityStatus?.has_password ? 'text-green-400' : 'text-yellow-400'}`}>
                            {securityStatus?.has_password ? '✓ Установлен' : '○ Отсутствует'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-card/30 p-4 glass-hover">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className={`text-sm font-semibold ${securityStatus?.email_verified ? 'text-green-400' : 'text-yellow-400'}`}>
                            {securityStatus?.email_verified ? '✓ Подтвержден' : '○ Не подтвержден'}
                        </span>
                    </div>
                </div>
            </motion.section>

            {/* Кнопка выхода */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4"
            >
                <Button
                    onClick={() => logout()}
                    variant="secondary"
                    className="w-full h-12 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 border-gradient"
                >
                    <LogOutIcon className="h-4 w-4" />
                    Выйти из аккаунта
                </Button>
            </motion.div>
        </div>
    );
};