// src/components/WithdrawForm.tsx
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWithdrawalRequest } from '../services/dataService';
import type { CreateWithdrawalPayload } from '../types/api';
import { Button, Input } from './ui';
import { motion } from 'framer-motion';
import { SendIcon, ShieldIcon } from './icons';
import { showError, showSuccess } from '../lib/notifications';

interface WithdrawFormProps {
    onSuccess: () => void;
}

export const WithdrawForm = ({ onSuccess }: WithdrawFormProps) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateWithdrawalPayload>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: (payload: CreateWithdrawalPayload) => createWithdrawalRequest(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
            queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
            showSuccess('Запрос на вывод средств успешно создан!');
            onSuccess();
        },
        onError: (err) => showError(err.message),
    });

    const onSubmit: SubmitHandler<CreateWithdrawalPayload> = (data) => {
        mutate({ ...data, amount: Number(data.amount) });
    };

    const amountValue = watch('amount');
    const pinValue = watch('pin');

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* Заголовок формы */}
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
                        <SendIcon className="h-6 w-6 text-primary" />
                    </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Вывод средств</h3>
                <p className="text-sm text-muted-foreground">
                    Заполните данные для вывода средств с вашего счета
                </p>
            </div>

            {/* Поле для суммы */}
            <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-foreground flex items-center gap-2">
                    💰 Сумма вывода
                </label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    variant="filled"
                    isError={!!errors.amount}
                    placeholder="Например: 50.50"
                    {...register('amount', {
                        required: 'Сумма обязательна',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Минимальная сумма - 1 USD' },
                        validate: {
                            format: (value) => /^\d+(\.\d{1,2})?$/.test(value.toString()) || 'Формат: 10 или 10.50'
                        }
                    })}
                />
                {errors.amount && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1"
                    >
                        ⚠️ {errors.amount.message}
                    </motion.p>
                )}
            </div>

            {/* Поле для адреса */}
            <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
                    🏦 Адрес кошелька
                </label>
                <Input
                    id="address"
                    variant="filled"
                    isError={!!errors.address}
                    placeholder="TXWITHDRAWALADDRESS123456..."
                    {...register('address', {
                        required: 'Адрес для вывода обязателен',
                        minLength: { value: 10, message: 'Адрес слишком короткий' }
                    })}
                />
                {errors.address && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1"
                    >
                        ⚠️ {errors.address.message}
                    </motion.p>
                )}
            </div>

            {/* Поле для PIN-кода */}
            <div className="space-y-2">
                <label htmlFor="pin" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ShieldIcon className="h-4 w-4 text-muted-foreground" />
                    PIN-код безопасности
                </label>
                <Input
                    id="pin"
                    type="password"
                    maxLength={4}
                    variant="filled"
                    isError={!!errors.pin}
                    placeholder="Введите 4 цифры"
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
                        ⚠️ {errors.pin.message}
                    </motion.p>
                )}

                {/* Индикатор ввода PIN */}
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
            </div>

            {/* Информация о комиссиях */}
            <div className="rounded-lg bg-card/30 border border-border/40 p-3 space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Минимальная сумма:</span>
                    <span className="font-semibold text-foreground">1 USD</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Комиссия сети:</span>
                    <span className="font-semibold text-foreground">~0.1 USD</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Время обработки:</span>
                    <span className="font-semibold text-foreground">1-24 часа</span>
                </div>
            </div>

            {/* Кнопка отправки */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold shadow-lg border-gradient"
                    isLoading={isPending}
                    disabled={!amountValue || !pinValue || pinValue.length !== 4}
                >
                    {isPending ? '⏳ Отправка...' : '🚀 Подтвердить вывод'}
                </Button>
            </motion.div>

            {/* Предупреждение о безопасности */}
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                <p className="text-xs text-yellow-600 text-center">
                    🔒 Проверьте адрес кошелька перед подтверждением. Транзакции необратимы.
                </p>
            </div>

            {/* Отображение ошибки API */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg bg-red-500/10 border border-red-500/20 p-3"
                >
                    <p className="text-sm text-red-400 text-center">
                        ❌ {error.message}
                    </p>
                </motion.div>
            )}
        </motion.form>
    );
};