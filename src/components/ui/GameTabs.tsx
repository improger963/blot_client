import { motion } from 'framer-motion';

interface GameTab {
  id: string;
  label: string;
}

interface GameTabsProps {
  tabs: GameTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const GameTabs = ({ tabs, activeTab, onTabChange }: GameTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg neon-shadow-primary'
              : 'bg-card text-foreground hover:bg-surface'
          }`}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};