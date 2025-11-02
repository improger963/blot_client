import { motion } from 'framer-motion';

export const EnhancedLoadingScreen = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-1">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
            >
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                    }}
                    className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-2xl"
                >
                    <span className="material-icons-round">casino</span>
                </motion.div>
                <div>
                    <h1 className="display-2 text-gradient mb-2">Lucky TON</h1>
                    <p className="body-1 text-lime-400/80">Loading premium experience...</p>
                </div>
                <div className="w-32 h-2 mx-auto bg-dark-3 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-lime-500 to-lime-600 rounded-full"
                    />
                </div>
            </motion.div>
        </div>
    );
};