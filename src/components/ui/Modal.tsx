// src/components/ui/Modal.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from '../icons/XIcon';
import { useEffect } from 'react';

interface ModalProps {
  /**
   * @description Флаг, управляющий видимостью модального окна.
   */
  isOpen: boolean;
  /**
   * @description Функция обратного вызова для закрытия окна.
   */
  onClose: () => void;
  /**
   * @description Заголовок модального окна.
   */
  title: string;
  /**
   * @description Дочерние элементы, которые будут отображаться внутри окна.
   */
  children: React.ReactNode;
  /**
   * @description Размер модального окна.
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  // Блокировка скролла при открытии модалки
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{
              type: 'spring',
              bounce: 0.2,
              duration: 0.4
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${sizeClasses[size]} rounded-xl`}
          >
            {/* Gradient border container for the modal */}
            <div className="gradient-border-container-modal rounded-xl">
              <div className="glass-card rounded-xl">
                {/* Заголовок модалки */}
                <div className="flex items-center justify-between p-6">
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-card/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <XIcon className="h-4 w-4" />
                  </motion.button>
                </div>

                {/* Контент модалки */}
                <div className="max-h-[70vh] overflow-y-auto">
                  <div className="p-6">
                    {children}
                  </div>
                </div>

                {/* Декоративный акцент */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-xl" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};