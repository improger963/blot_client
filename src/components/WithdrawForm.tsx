// src/components/WithdrawForm.tsx
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWithdrawalRequest } from '../services/dataService';
import type { CreateWithdrawalPayload } from '../types/api';
import { Button, Input } from './ui';
import { motion } from 'framer-motion';
import { SendIcon, ShieldIcon } from './icons';
import { showError, showSuccess } from '../lib/notifications';
import { useAuthStore } from '../store/authStore';

interface WithdrawFormProps {
    onSuccess: () => void;
}

export const WithdrawForm = ({ onSuccess }: WithdrawFormProps) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm<CreateWithdrawalPayload>();
    const { user } = useAuthStore();

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: CreateWithdrawalPayload) => createWithdrawalRequest(payload),
        onSuccess: (data) => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
            queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            
            showSuccess(data.message || 'Withdrawal request created successfully!');
            onSuccess();
        },
        onError: (error: any) => {
            // Handle validation errors (422)
            if (error?.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                if (validationErrors) {
                    // Set errors for each field
                    Object.keys(validationErrors).forEach((field) => {
                        setError(field as keyof CreateWithdrawalPayload, {
                            type: 'manual',
                            message: validationErrors[field][0]
                        });
                    });
                } else {
                    showError('Validation failed. Please check your inputs.');
                }
            } else {
                showError(error?.response?.data?.message || error.message || 'Failed to create withdrawal request');
            }
        },
    });

    const onSubmit: SubmitHandler<CreateWithdrawalPayload> = (data) => {
        // Clear previous errors
        clearErrors();
        mutate({ ...data, amount: Number(data.amount) });
    };

    const amountValue = watch('amount');
    const pinValue = watch('pin');

    // Get wallet balance from authStore
    const walletBalance = user?.wallet?.balance ? parseFloat(user.wallet.balance) : 0;

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
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
                        whileHover={{ 
                            scale: 1.1,
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <SendIcon className="h-6 w-6 text-primary" />
                    </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Withdraw Funds</h3>
                <p className="text-sm text-muted-foreground">
                    Fill in the details to withdraw funds from your account
                </p>
            </div>

            {/* Current Balance Display */}
            <div className="rounded-lg bg-card/30 p-3 space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Current Balance:</span>
                    <span className="font-semibold text-foreground">{walletBalance.toFixed(2)} TON</span>
                </div>
            </div>

            {/* Поле для суммы */}
            <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-foreground flex items-center gap-2">
                    💰 Withdrawal Amount
                </label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    variant="filled"
                    isError={!!errors.amount}
                    placeholder="e.g., 50.50"
                    {...register('amount', {
                        required: 'Amount is required',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Minimum amount is 1 TON' },
                        max: { value: walletBalance, message: `Insufficient balance. Max: ${walletBalance.toFixed(2)} TON` },
                        validate: {
                            format: (value) => /^\d+(\.\d{1,2})?$/.test(value.toString()) || 'Format: 10 or 10.50'
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
                    🏦 Wallet Address
                </label>
                <Input
                    id="address"
                    variant="filled"
                    isError={!!errors.address}
                    placeholder="TXWITHDRAWALADDRESS123456..."
                    {...register('address', {
                        required: 'Wallet address is required',
                        minLength: { value: 10, message: 'Address is too short' }
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
                    Security PIN
                </label>
                <Input
                    id="pin"
                    type="password"
                    maxLength={4}
                    variant="filled"
                    isError={!!errors.pin}
                    placeholder="Enter 4 digits"
                    {...register('pin', {
                        required: 'PIN is required',
                        minLength: { value: 4, message: 'PIN must be 4 digits' },
                        maxLength: { value: 4, message: 'PIN must be 4 digits' },
                        pattern: { value: /^\d+$/, message: 'PIN must contain only digits' }
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
                        <span>{pinValue.length === 4 ? '✓ Ready' : `${pinValue.length}/4 digits`}</span>
                    </motion.div>
                )}
            </div>

            {/* Информация о комиссиях */}
            <div className="rounded-lg bg-card/30 p-3 space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Minimum Amount:</span>
                    <span className="font-semibold text-foreground">1 TON</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Network Fee:</span>
                    <span className="font-semibold text-foreground">~0.1 TON</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span className="font-semibold text-foreground">1-24 hours</span>
                </div>
            </div>

            {/* Кнопка отправки */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold shadow-lg"
                    isLoading={isPending}
                    disabled={!amountValue || !pinValue || pinValue.length !== 4 || isPending}
                >
                    {isPending ? '⏳ Processing...' : '🚀 Confirm Withdrawal'}
                </Button>
            </motion.div>

            {/* Предупреждение о безопасности */}
            <div className="rounded-lg bg-yellow-500/10 p-3">
                <p className="text-xs text-yellow-600 text-center">
                    🔒 Please verify the wallet address before confirming. Transactions are irreversible.
                </p>
            </div>
        </motion.form>
    );
};