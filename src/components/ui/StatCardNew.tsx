import type { ReactNode } from 'react';
import { Card } from './Card';

interface StatCardNewProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCardNew = ({ 
  title, 
  value, 
  icon, 
  change,
  className = '' 
}: StatCardNewProps) => {
  return (
    <Card 
      className={`flex flex-col ${className}`}
      padding="lg"
      hoverEffect={true}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted mb-1 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-[hsl(var(--color-primary)/0.1)] text-[hsl(var(--color-primary))]">
            {icon}
          </div>
        )}
      </div>
      
      {change && (
        <div className={`mt-4 flex items-center text-sm ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span>{change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%</span>
          <span className="ml-2 text-muted">vs last period</span>
        </div>
      )}
    </Card>
  );
};