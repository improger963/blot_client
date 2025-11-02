import { motion } from 'framer-motion';
import { Card } from './ui/Card';

interface EnhancedStatsCardProps {
  icon: string;
  label: string;
  value: string;
  trend?: {
    value: number;
    period: string;
  };
  className?: string;
}

export const EnhancedStatsCard = ({ 
  icon, 
  label, 
  value, 
  trend, 
  className = '' 
}: EnhancedStatsCardProps) => {
  return (
    <Card className={`text-center ${className}`} padding="md">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-xl mb-3">
        <span className="material-icons-round text-xl">{icon}</span>
      </div>
      <p className="body-2 text-gray-400 mb-1">{label}</p>
      <p className="headline text-white mb-1">{value}</p>
      {trend && (
        <p className={`caption ${trend.value > 0 ? 'text-lime-400' : 'text-red-400'}`}>
          {trend.value > 0 ? '↗' : '↘'} {Math.abs(trend.value)}% {trend.period}
        </p>
      )}
    </Card>
  );
};