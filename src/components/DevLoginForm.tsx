// src/components/DevLoginForm.tsx

import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface IDevFormInput {
    initData: string;
}

interface DevLoginFormProps {
    /**
     * @description Функция обратного вызова, которая будет вызвана с введенными initData.
     */
    onLoginSubmit: (initData: string) => void;
    /**
     * @description Состояние загрузки, которое передается из родительского компонента.
     */
    isLoading: boolean;
}

/**
 * @description Компонент-форма исключительно для разработки и тестирования.
 * Позволяет вручную вводить и отправлять initData для аутентификации.
 */
export const DevLoginForm = ({ onLoginSubmit, isLoading }: DevLoginFormProps) => {
    const { register, handleSubmit } = useForm<IDevFormInput>();

    const onSubmit: SubmitHandler<IDevFormInput> = (data) => {
        onLoginSubmit(data.initData);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-6 shadow-md"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold">Режим Разработки</h2>
                <p className="text-sm text-gray-500">
                    Введите `initData` для имитации входа через Telegram.
                </p>
            </div>
            <div className="space-y-2">
                <Input
                    placeholder="query_id=...user=...auth_date=..."
                    {...register('initData', { required: true })}
                />
                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Войти
                </Button>
            </div>
        </form>
    );
};