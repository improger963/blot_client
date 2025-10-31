import type { TabOption } from './types';

interface TabsProps {
  options: TabOption[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const Tabs = ({ options, activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            activeTab === tab.value
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg neon-shadow-primary'
              : 'bg-card text-foreground hover:bg-surface'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};