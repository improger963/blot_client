// src/components/DevLoginForm.tsx

import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { motion } from 'framer-motion';
import { CodeIcon, KeyIcon, UserIcon } from './icons';

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
    const { register, handleSubmit, formState: { errors } } = useForm<IDevFormInput>();

    const onSubmit: SubmitHandler<IDevFormInput> = (data) => {
        onLoginSubmit(data.initData);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-6 rounded-2xl bg-surface/50 border border-border/40 p-6 shadow-lg glass border-gradient material-depth-2"
        >
            {/* Заголовок формы */}
            <div className="text-center space-y-3">
                <div className="flex justify-center">
                    <motion.div 
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                        whileHover={{ 
                            scale: 1.1,
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <CodeIcon className="h-6 w-6 text-yellow-400" />
                    </motion.div>
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-foreground">Режим Разработки</h2>
                    <p className="text-sm text-muted-foreground">
                        Введите initData для тестирования авторизации
                    </p>
                </div>
            </div>

            {/* Поле ввода initData */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <KeyIcon className="h-4 w-4 text-muted-foreground" />
                    Init Data строка
                </label>
                <Input
                    placeholder="query_id=AAHdF6IQAAAAAN0XohDhr8cJ&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22Doe%22%2C%22username%22%3A%22johndoe%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1678901234&hash=abc123..."
                    variant="filled"
                    isError={!!errors.initData}
                    {...register('initData', {
                        required: 'Init Data обязателен для входа',
                        minLength: { value: 10, message: 'Init Data слишком короткий' }
                    })}
                />
                {errors.initData && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400 flex items-center gap-1"
                    >
                        ⚠️ {errors.initData.message}
                    </motion.p>
                )}
            </div>

            {/* Пример данных для тестирования */}
            <div className="rounded-xl bg-card/30 border border-border/40 p-4">
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <UserIcon className="h-3.5 w-3.5" />
                    Пример для тестирования:
                </h4>
                <code className="text-xs text-muted-foreground break-all">
                    query_id=AAHdF6IQAAAAAN0XohDhr8cJ&user=&#123;"id":123456789,"first_name":"John","username":"johndoe"&#125;&auth_date=1678901234&hash=abc123...
                </code>
            </div>

            {/* Кнопка входа */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 border-yellow-500/20 border-gradient"
                    isLoading={isLoading}
                >
                    {isLoading ? '⏳ Вход...' : '🚀 Войти в режиме разработки'}
                </Button>
            </motion.div>

            {/* Предупреждение */}
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-3">
                <p className="text-xs text-yellow-600 text-center">
                    ⚠️ Эта форма предназначена только для разработки и тестирования
                </p>
            </div>
        </motion.form>
    );
};