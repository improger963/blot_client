import type { ReactNode } from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export const StatCard = ({ 
  label, 
  value, 
  icon,
  trend,
  className = '' 
}: StatCardProps) => {
  const isPositive = trend ? trend.value >= 0 : true;
  
  return (
    <Card className={`text-center ${className}`} padding="md">
      {icon && (
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white text-xl mb-3">
          {icon}
        </div>
      )}
      <p className="body-2 text-gray-400 mb-1">{label}</p>
      <p className="headline text-white mb-1">{value}</p>
      {trend && (
        <p className={`caption ${isPositive ? 'text-lime-400' : 'text-red-400'}`}>
          {isPositive ? '↗' : '↘'} {Math.abs(trend.value)} {trend.label}
        </p>
      )}
    </Card>
  );
};