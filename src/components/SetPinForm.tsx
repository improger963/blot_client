// src/components/SetPinForm.tsx
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setPinRequest } from '../services/dataService';
import { Button, Input } from './ui';
import { showSuccess, showError } from '../lib/notifications';
import { motion } from 'framer-motion';
import { LockIcon, ShieldIcon } from './icons';

interface SetPinFormData {
    pin: string;
    pin_confirmation: string;
}

export const SetPinForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const qc = useQueryClient();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<SetPinFormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: setPinRequest,
        onSuccess: (data) => {
            showSuccess(data.message);
            qc.invalidateQueries({ queryKey: ['securityStatus'] });
            onSuccess();
        },
        onError: (err) => showError(err.message),
    });

    const pinValue = watch('pin');

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit((data) => mutate(data))}
            className="space-y-6"
        >
            {/* Заголовок и описание */}
            <div className="text-center space-y-2">
                <div className="flex justify-center">
                    <motion.div 
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20"
                        whileHover={{ 
                            scale: 1.1,
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <ShieldIcon className="h-6 w-6 text-primary" />
                    </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Создание PIN-кода</h3>
                <p className="text-sm text-muted-foreground">
                    Установите 4-значный PIN-код для подтверждения вывода средств
                </p>
            </div>

            {/* Поле ввода PIN */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <LockIcon className="h-4 w-4 text-muted-foreground" />
                    Новый PIN-код
                </label>
                <Input
                    type="password"
                    placeholder="Введите 4 цифры"
                    maxLength={4}
                    variant="filled"
                    isError={!!errors.pin}
                    {...register('pin', {
                        required: 'PIN-код обязателен',
                        minLength: { value: 4, message: 'PIN должен содержать 4 цифры' },
                        maxLength: { value: 4, message: 'PIN должен содержать 4 цифры' },
                        pattern: { value: /^\d+$/, message: 'PIN должен содержать только цифры' }
                    })}
                />
                {errors.pin && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1"
                    >
                        ⚠️ {errors.pin.message as string}
                    </motion.p>
                )}
            </div>

            {/* Поле подтверждения PIN */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <LockIcon className="h-4 w-4 text-muted-foreground" />
                    Подтвердите PIN-код
                </label>
                <Input
                    type="password"
                    placeholder="Повторите 4 цифры"
                    maxLength={4}
                    variant="filled"
                    isError={!!errors.pin_confirmation}
                    {...register('pin_confirmation', {
                        required: 'Подтверждение PIN обязательно',
                        validate: (val) => val === pinValue || 'PIN-коды не совпадают'
                    })}
                />
                {errors.pin_confirmation && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1"
                    >
                        ⚠️ {errors.pin_confirmation.message as string}
                    </motion.p>
                )}
            </div>

            {/* Индикатор сложности */}
            {pinValue && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                    <div className={`h-1 flex-1 rounded-full ${pinValue.length === 4 ? 'bg-green-400' : 'bg-yellow-400'
                        }`} />
                    <span>{pinValue.length === 4 ? '✓ Готово' : `${pinValue.length}/4 цифр`}</span>
                </motion.div>
            )}

            {/* Кнопка отправки */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold shadow-lg border-gradient"
                    isLoading={isPending}
                    disabled={!pinValue || pinValue.length !== 4}
                >
                    {isPending ? 'Установка...' : '🔒 Установить PIN'}
                </Button>
            </motion.div>

            {/* Предупреждение о безопасности */}
            <div className="rounded-lg bg-card/30 border border-border/40 p-3">
                <p className="text-xs text-muted-foreground text-center">
                    ⚠️ Не сообщайте PIN-код третьим лицам. Он используется только для подтверждения вывода средств.
                </p>
            </div>
        </motion.form>
    );
};