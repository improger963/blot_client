// src/components/ui/types.ts

export interface TabOption {
    value: string;
    label: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean;
    variant?: 'default' | 'filled';
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    lines?: number;
}

// Типы для уведомлений
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
}

// Типы для форм
export interface FormState {
    isSubmitting: boolean;
    isSuccess: boolean;
    error?: string;
}

// Общие типы для API ответов
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
    meta: {
        current_page: number;
        total_pages: number;
        total_count: number;
        per_page: number;
    };
}

// Типы для игровых компонентов
export interface GameAction {
    type: 'fold' | 'call' | 'raise' | 'check' | 'all-in';
    amount?: number;
}

export interface PlayerInfo {
    id: number;
    name: string;
    balance: number;
    isActive: boolean;
    isCurrentPlayer?: boolean;
}

// Типы для навигации
export interface NavItem {
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isCentral?: boolean;
}

// Типы для темы
export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    foreground: string;
    mutedForeground: string;
    border: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;