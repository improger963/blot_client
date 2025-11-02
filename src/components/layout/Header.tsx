import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

export const Header = () => {
    const { user } = useAuthStore();
    
    // Get balance from user wallet
    const balance = user?.wallet?.balance ? parseFloat(user.wallet.balance) : 0;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 mb-8 relative z-20"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                    >
                        <span className="material-icons-round">casino</span>
                    </motion.div>
                    <div>
                        <h1 className="display-2 text-gradient">Lucky TON</h1>
                        <p className="body-2 text-lime-400/80">Premium Gaming Experience</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="hidden md:flex items-center gap-3 glass-card px-4 py-3 rounded-2xl"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white">
                            <span className="material-icons-round">account_balance_wallet</span>
                        </div>
                        <div>
                            <p className="caption text-lime-400/80">Balance</p>
                            <p className="title text-white">{balance.toFixed(2)} TON</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 rounded-2xl bg-dark-3 flex items-center justify-center text-lime-400 font-bold cursor-pointer relative"
                    >
                        {user?.username?.charAt(0) || 'U'}
                        <div className="status-dot online bg-lime-400 absolute -top-1 -right-1"></div>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
};