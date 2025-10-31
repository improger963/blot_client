// src/app/App.tsx

import { useEffect } from 'react'; // <-- ШАГ 1: Импортируем useEffect
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppRouter } from './Router';
import { useAuthStore } from '../store/authStore'; // <-- ШАГ 2: Импортируем наш стор
import { Toaster } from 'react-hot-toast'; // Импортируем Toaster


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes - данные считаются "свежими" в течение 5 минут
        },
    },
});

/**
 * @description Корневой компонент приложения.
 * Теперь он также отвечает за запуск первоначальной проверки аутентификации.
 * @returns {JSX.Element}
 */
function App() {
    // ШАГ 3: Получаем функцию для проверки статуса из стора.
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

    // ШАГ 4: Используем useEffect для вызова функции ОДИН РАЗ при первой загрузке приложения.
    // Пустой массив зависимостей [] гарантирует, что эффект сработает только один раз.
    // Мы используем [checkAuthStatus], чтобы удовлетворить линтер, функция стабильна.
    useEffect(() => {
        // Это и есть тот самый "ключ зажигания".
        // Мы запускаем процесс проверки сессии.
        checkAuthStatus();
    }, [checkAuthStatus]);

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster
                position="top-center" // Уведомления будут появляться сверху по центру
                reverseOrder={false}
                toastOptions={{
                    // Стили по умолчанию
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            <AppRouter />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;