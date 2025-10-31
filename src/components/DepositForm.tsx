// src/components/DepositForm.tsx
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepositRequest } from '../services/dataService';
import type { CreateDepositPayload } from '../types/api';
import { Button, Input } from './ui';

interface DepositFormProps {
    onSuccess: () => void; // Функция для закрытия модального окна
}

export const DepositForm = ({ onSuccess }: DepositFormProps) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<CreateDepositPayload>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: (payload: CreateDepositPayload) => createDepositRequest(payload),
        onSuccess: () => {
            // При успехе инвалидируем кэш истории транзакций, чтобы увидеть новый "pending" платеж
            queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
            onSuccess(); // Закрываем модальное окно
        },
    });

    const onSubmit: SubmitHandler<CreateDepositPayload> = (data) => {
        mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-gray-500">
                Укажите сумму, на которую вы хотите пополнить свой баланс.
            </p>
            <div>
                <Input
                    type="number"
                    placeholder="Например, 100"
                    isError={!!errors.amount}
                    {...register('amount', {
                        required: 'Сумма обязательна',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Минимальная сумма - 1' },
                    })}
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
            </div>
            <Button type="submit" className="w-full" isLoading={isPending}>
                Создать заявку
            </Button>
            {error && <p className="text-center text-sm text-red-600">Ошибка: {error.message}</p>}
        </form>
    );
};