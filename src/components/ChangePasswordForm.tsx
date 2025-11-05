// src/components/ChangePasswordForm.tsx
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changePasswordRequest } from '../services/dataService';
import { Button, Input } from './ui';
import { showSuccess, showError } from '../lib/notifications';
import { motion } from 'framer-motion';
import { LockIcon, KeyIcon } from './icons';

interface ChangePasswordFormData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export const ChangePasswordForm = () => {
    const qc = useQueryClient();
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ChangePasswordFormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: changePasswordRequest,
        onSuccess: (data) => {
            showSuccess(data.message);
            reset(); // Reset form on success
            qc.invalidateQueries({ queryKey: ['securityStatus'] });
        },
        onError: (err: any) => {
            // Handle validation errors (422)
            if (err?.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                if (validationErrors) {
                    // Set errors for each field
                    Object.keys(validationErrors).forEach((field) => {
                        setError(field as keyof ChangePasswordFormData, {
                            type: 'manual',
                            message: validationErrors[field][0]
                        });
                    });
                } else {
                    showError('Validation failed. Please check your inputs.');
                }
            } else {
                showError(err?.response?.data?.message || err.message || 'Failed to change password');
            }
        },
    });

    const newPassword = watch('new_password');

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
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
                        whileHover={{ 
                            scale: 1.1,
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <KeyIcon className="h-6 w-6 text-primary" />
                    </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Смена пароля</h3>
                <p className="text-sm text-muted-foreground">
                    Измените ваш текущий пароль для дополнительной безопасности
                </p>
            </div>

            {/* Поле текущего пароля */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <LockIcon className="h-4 w-4 text-muted-foreground" />
                    Текущий пароль
                </label>
                <Input
                    type="password"
                    placeholder="Введите текущий пароль"
                    variant="filled"
                    isError={!!errors.current_password}
                    {...register('current_password', {
                        required: 'Текущий пароль обязателен'
                    })}
                />
                {errors.current_password && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1"
                    >
                        ⚠️ {errors.current_password.message as string}
                    </motion.p>
                )}
            </div>

            {/* Поле нового пароля */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <LockIcon className="h-4 w-4 text-muted-foreground" />
                    Новый пароль
                </label>
                <Input
                    type="password"
                    placeholder="Введите новый пароль"
                    variant="filled"
                    isError={!!errors.new_password}
                    {...register('new_password', {
                        required: 'Новый пароль обязателен',
                        minLength: { value: 8, message: 'Пароль должен содержать минимум 8 символов' }
                    })}
                />
                {errors.new_password && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1"
                    >
                        ⚠️ {errors.new_password.message as string}
                    </motion.p>
                )}
            </div>

            {/* Поле подтверждения нового пароля */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <LockIcon className="h-4 w-4 text-muted-foreground" />
                    Подтвердите новый пароль
                </label>
                <Input
                    type="password"
                    placeholder="Повторите новый пароль"
                    variant="filled"
                    isError={!!errors.new_password_confirmation}
                    {...register('new_password_confirmation', {
                        required: 'Подтверждение пароля обязательно',
                        validate: (val) => val === newPassword || 'Пароли не совпадают'
                    })}
                />
                {errors.new_password_confirmation && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1"
                    >
                        ⚠️ {errors.new_password_confirmation.message as string}
                    </motion.p>
                )}
            </div>

            {/* Кнопка отправки */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold shadow-lg"
                    isLoading={isPending}
                >
                    {isPending ? 'Смена пароля...' : '🔒 Сменить пароль'}
                </Button>
            </motion.div>

            {/* Предупреждение о безопасности */}
            <div className="rounded-lg bg-card/30 p-3">
                <p className="text-xs text-muted-foreground text-center">
                    ⚠️ После смены пароля вам потребуется войти в систему заново
                </p>
            </div>
        </motion.form>
    );
};