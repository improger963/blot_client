import { useState } from 'react';
import { Card } from './ui';
import { InputField } from './ui';
import { Button } from './ui';

interface DevLoginFormProps {
  onLogin: (initData: string) => void;
  isPending?: boolean;
}

export const DevLoginForm = ({ onLogin, isPending = false }: DevLoginFormProps) => {
  const [initData, setInitData] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simple validation
      if (!initData) {
        setError('Please enter initData');
        return;
      }

      // Call the onLogin callback with the initData
      onLogin(initData);
    } catch (err) {
      setError('Invalid initData');
    }
  };

  return (
    <Card className="text-center space-y-6 rounded-2xl p-8 glass-card glass-card-hover">
      <div className="space-y-2">
        <h1 className="display-2 text-gradient">LUCKY TON</h1>
        <p className="body-2 text-lime-400/80">Developer Login</p>
      </div>

      <Card className="space-y-2 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="InitData"
            placeholder="Enter Telegram initData"
            value={initData}
            onChange={(e) => setInitData(e.target.value)}
            disabled={isPending}
          />
          
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          
          <Button 
            variant="primary" 
            className="w-full"
            type="submit"
            isLoading={isPending}
            disabled={isPending}
          >
            {isPending ? 'Authenticating...' : 'Login with InitData'}
          </Button>
        </form>
      </Card>

      <Card className="rounded-xl p-4">
        <p className="caption text-lime-400/80">
          Enter Telegram WebApp initData for testing
        </p>
      </Card>

      <Card className="rounded-xl p-3">
        <p className="caption text-gray-500">
          This is a development login for testing purposes only
        </p>
      </Card>
    </Card>
  );
};