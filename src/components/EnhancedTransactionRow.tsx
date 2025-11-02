import { motion } from 'framer-motion';
import { Card } from './ui/Card';

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'game_fee' | 'game_win';
  description: string;
  amount: string; // String with `+` or `-`
  status: 'completed' | 'pending' | 'failed';
  date: string; // For example, "01 Jan, 12:00"
}

interface EnhancedTransactionRowProps {
  transaction: Transaction;
}

export const EnhancedTransactionRow = ({ transaction }: EnhancedTransactionRowProps) => {
  const getTransactionIcon = (type: string) => {
    const icons: Record<string, string> = {
      'deposit': 'download',
      'withdrawal': 'upload',
      'game_fee': 'sports_esports',
      'game_win': 'emoji_events'
    };
    return icons[type] || 'receipt';
  };

  const getTransactionColor = (type: string) => {
    return type === 'deposit' || type === 'game_win'
      ? 'bg-lime-500/20 text-lime-400'
      : 'bg-red-500/20 text-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Parse amount to determine if it's positive or negative
  const isPositive = transaction.amount.startsWith('+');
  const amountValue = transaction.amount.replace(/[+-]/, '');

  return (
    <Card className="flex items-center justify-between p-4" padding="md" hoverEffect={true}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
          <span className="material-icons-round">
            {getTransactionIcon(transaction.type)}
          </span>
        </div>
        <div>
          <p className="body-1 text-white">{transaction.description}</p>
          <p className="caption text-lime-400/80">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`body-1 font-semibold ${isPositive ? 'text-lime-400' : 'text-red-400'}`}>
          {transaction.amount} TON
        </p>
        <p className={`caption ${transaction.status === 'completed' ? 'text-lime-400' : 'text-amber-400'}`}>
          {transaction.status}
        </p>
      </div>
    </Card>
  );
};