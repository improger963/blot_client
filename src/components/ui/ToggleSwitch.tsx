import { motion } from 'framer-motion';

interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

export const ToggleSwitch = ({ isOn, onToggle, disabled = false }: ToggleSwitchProps) => {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={!disabled ? onToggle : undefined}
            disabled={disabled}
            className={`relative inline-flex h-8 w-14 items-center rounded-2xl p-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isOn
                    ? 'bg-gradient-to-r from-primary to-primary-glow shadow-lg shadow-primary/30'
                    : 'bg-surface shadow-inner'
                } ${disabled ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer'}`}
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                className={`h-6 w-6 rounded-xl shadow-lg flex items-center justify-center ${isOn
                        ? 'bg-white shadow-black/20'
                        : 'bg-foreground/80 shadow-black/30'
                    }`}
            >
                {/* Иконка внутри переключателя */}
                {isOn ? (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-primary text-xs font-bold"
                    >
                        ✓
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-background text-xs"
                    >
                        ●
                    </motion.div>
                )}
            </motion.div>

            {/* Свечение для активного состояния */}
            {isOn && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-2xl bg-primary/20 blur-sm -z-10"
                />
            )}
        </motion.button>
    );
};