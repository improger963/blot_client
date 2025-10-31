// src/components/SecuritySettings.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSecurityStatus, togglePinRequest } from '../services/dataService';
import { Button } from './ui';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { SetPinForm } from './SetPinForm';
import { showSuccess, showError } from '../lib/notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldIcon, LockIcon, XIcon } from './icons';
import { TextSkeleton, InputSkeleton } from './ui';

export const SecuritySettings = () => {
    const [isPinModalOpen, setPinModalOpen] = useState(false);
    const qc = useQueryClient();

    const { data: status, isLoading } = useQuery({
        queryKey: ['securityStatus'],
        queryFn: fetchSecurityStatus,
    });

    const { mutate: togglePin, isPending: isToggling } = useMutation({
        mutationFn: () => togglePinRequest(!status?.pin_enabled),
        onSuccess: (data) => {
            showSuccess(data.message);
            qc.invalidateQueries({ queryKey: ['securityStatus'] });
        },
        onError: (err) => showError(err.message),
    });

    if (isLoading) {
        return (
            <div className="space-y-4 rounded-2xl bg-surface/50 border border-border/40 p-6 glass border-gradient">
                <TextSkeleton className="w-1/3 h-6" />
                <InputSkeleton />
                <InputSkeleton />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
                y: -2,
                transition: { duration: 0.2 }
            }}
            className="rounded-2xl bg-surface/50 border border-border/40 overflow-hidden glass border-gradient material-depth-2"
        >
            {/* Заголовок секции */}
            <div className="p-6 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                        <ShieldIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Настройки безопасности</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Управление защитой вашего аккаунта и средств
                        </p>
                    </div>
                </div>
            </div>

            {/* Управление PIN-кодом */}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card/50 border border-border/40">
                            <LockIcon className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">PIN-код для вывода</p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {status?.has_pin
                                    ? (status.pin_enabled ? '🔒 PIN активен' : '🔓 PIN отключен')
                                    : 'PIN не установлен'
                                }
                            </p>
                        </div>
                    </div>

                    {status?.has_pin ? (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <ToggleSwitch
                                isOn={!!status.pin_enabled}
                                onToggle={togglePin}
                                disabled={isToggling}
                            />
                        </motion.div>
                    ) : (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="primary"
                                onClick={() => setPinModalOpen(true)}
                                className="rounded-xl font-semibold shadow-lg border-gradient"
                            >
                                Установить PIN
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Модальное окно для установки PIN */}
            <AnimatePresence>
                {isPinModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md rounded-2xl bg-surface border border-border/40 shadow-xl glass border-gradient"
                        >
                            {/* Заголовок модалки */}
                            <div className="flex items-center justify-between p-6 border-b border-border/40">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <LockIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground">Установка PIN-кода</h2>
                                </div>
                                <button
                                    onClick={() => setPinModalOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Форма установки PIN */}
                            <div className="p-6">
                                <SetPinForm onSuccess={() => setPinModalOpen(false)} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};