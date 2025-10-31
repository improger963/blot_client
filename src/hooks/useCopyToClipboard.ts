// src/hooks/useCopyToClipboard.ts
import { useState } from 'react';
import { showSuccess } from '../lib/notifications';

interface UseCopyToClipboardProps {
    timeout?: number;
    successMessage?: string;
}

export const useCopyToClipboard = ({
    timeout = 2000,
    successMessage = 'Скопировано в буфер обмена!'
}: UseCopyToClipboardProps = {}) => {
    const [isCopied, setIsCopied] = useState(false);
    const [copiedText, setCopiedText] = useState<string>('');

    const copy = async (text: string) => {
        try {
            // Проверяем поддержку Clipboard API
            if (!navigator.clipboard) {
                throw new Error('Clipboard API не поддерживается');
            }

            await navigator.clipboard.writeText(text);

            setIsCopied(true);
            setCopiedText(text);

            // Показываем уведомление об успехе
            showSuccess(successMessage);

            // Сбрасываем состояние через timeout
            setTimeout(() => {
                setIsCopied(false);
                setCopiedText('');
            }, timeout);

        } catch (error) {
            console.error('Ошибка копирования:', error);

            // Fallback для старых браузеров
            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                setIsCopied(true);
                showSuccess(successMessage);

                setTimeout(() => setIsCopied(false), timeout);
            } catch (fallbackError) {
                console.error('Fallback копирование также не удалось:', fallbackError);
                showSuccess('Не удалось скопировать текст');
            }
        }
    };

    const reset = () => {
        setIsCopied(false);
        setCopiedText('');
    };

    return {
        isCopied,
        copiedText,
        copy,
        reset
    };
};

// Специализированные хуки для разных типов контента
export const useCopyLink = () => {
    return useCopyToClipboard({
        successMessage: 'Ссылка скопирована!'
    });
};

export const useCopyAddress = () => {
    return useCopyToClipboard({
        successMessage: 'Адрес скопирован!'
    });
};

export const useCopyCode = () => {
    return useCopyToClipboard({
        successMessage: 'Код скопирован!'
    });
};