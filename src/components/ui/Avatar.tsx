// src/components/ui/Avatar.tsx

import { useState, useEffect } from 'react';

interface AvatarProps {
  /**
   * @description URL изображения аватара. Может быть null или undefined.
   */
  src?: string | null;
  /**
   * @description Текст для генерации инициалов, если изображение отсутствует или не загрузилось. Обычно это имя пользователя.
   */
  fallbackText: string;
  /**
   * @description Дополнительные классы для кастомизации размера и т.д.
   */
  className?: string;
}

/**
 * @description Надежный компонент для отображения аватара пользователя.
 * Автоматически показывает инициалы, если изображение отсутствует или не удалось его загрузить.
 */
export const Avatar = ({ src, fallbackText, className }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);

  // Сбрасываем состояние ошибки, если URL изображения меняется
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const handleError = () => {
    setHasError(true);
  };

  // Получаем инициалы из имени
  const initials = fallbackText?.charAt(0).toUpperCase() ?? '?';

  // Если есть ссылка на аватар и не было ошибки загрузки, показываем изображение
  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={`Аватар ${fallbackText}`}
        className={`h-12 w-12 rounded-full object-cover ${className}`}
        onError={handleError}
      />
    );
  }

  // В противном случае, показываем запасной вариант с инициалами на градиентном фоне
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xl font-bold shadow-lg ${className}`}
      title={fallbackText} // Добавляем title для подсказки при наведении
    >
      <span className="text-white drop-shadow-md">{initials}</span>
    </div>
  );
};