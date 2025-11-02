import type { ReferralActivityItem } from '../types/api';
import { motion } from 'framer-motion';
import { UserIcon, CalendarIcon, DollarIcon } from '../components/icons';

export const ActivityRow = ({ activity }: { activity: ReferralActivityItem }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ 
            x: 4, 
            transition: { duration: 0.2 },
            boxShadow: "0 4px 20px hsl(var(--color-background) / 0.3)"
        }}
        className="flex items-center gap-4 rounded-xl bg-surface/30 p-4 hover:bg-surface/50 transition-all duration-200 group material-depth-1"
    >
        {/* Аватар пользователя - "чип" с градиентной иконкой */}
        <motion.div 
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:scale-110 transition-transform duration-200"
            whileHover={{ 
                rotate: [0, 5, -5, 0],
                scale: 1.1
            }}
            transition={{ duration: 0.5 }}
        >
            <UserIcon className="h-5 w-5 text-primary" />
        </motion.div>

        {/* Основная информация */}
        <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <motion.p 
                    className="font-semibold text-foreground truncate"
                    whileHover={{ scale: 1.02 }}
                >
                    {activity.username}
                </motion.p>
                <motion.span 
                    className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400"
                    whileHover={{ scale: 1.1 }}
                >
                    Активен
                </motion.span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>{activity.joined_at}</span>
            </div>
        </div>

        {/* Заработок */}
        <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 mb-1">
                <DollarIcon className="h-4 w-4 text-green-400" />
                <motion.p 
                    className="text-lg font-bold text-green-400"
                    whileHover={{ scale: 1.05 }}
                >
                    +{activity.formatted_earnings}
                </motion.p>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
                Ваш бонус
            </p>
        </div>

        {/* Декоративный акцент */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-6 w-1 bg-gradient-to-b from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.div>
);