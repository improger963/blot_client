import { useState } from 'react';
import { 
  Button, 
  Card as PremiumCard, 
  InputField, 
  Toggle, 
  StatCardNew 
} from '../components/ui';
import { 
  WalletIcon, 
  TrophyIcon, 
  UserIcon, 
  ClockIcon 
} from '../components/icons';

export const PremiumDemoPage = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="mini-app-container bg-background min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="display-1 text-gradient mb-4">Premium UI Components</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Showcase of enhanced components with glassmorphism, glow effects, and micro-interactions
          </p>
        </header>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="headline mb-6">Premium Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Button variant="primary" size="md">
              Primary
            </Button>
            <Button variant="secondary" size="md">
              Secondary
            </Button>
            <Button variant="ghost" size="md">
              Ghost
            </Button>
            <Button variant="success" size="md">
              Success
            </Button>
            <Button variant="danger" size="md">
              Danger
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="headline mb-6">Premium Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumCard padding="lg" hoverEffect={true}>
              <h3 className="title mb-2">Glass Card</h3>
              <p className="text-muted mb-4">
                This card features glassmorphism effects with a subtle border and hover animation.
              </p>
              <Button variant="primary" size="sm">
                Action
              </Button>
            </PremiumCard>
            
            <PremiumCard padding="lg" hoverEffect={true} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="title">Stats Card</h3>
                <div className="p-2 rounded-lg bg-[hsl(var(--color-primary)/0.1)]">
                  <TrophyIcon className="text-[hsl(var(--color-primary))]" />
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-3xl font-bold mb-1">1,234</p>
                <p className="text-muted text-sm">Total Points</p>
              </div>
            </PremiumCard>
          </div>
        </section>

        {/* Stat Cards Section */}
        <section className="mb-12">
          <h2 className="headline mb-6">Stat Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardNew 
              title="Total Balance" 
              value="$12,345.67" 
              icon={<WalletIcon />}
              change={{ value: 12.5, isPositive: true }}
            />
            <StatCardNew 
              title="Games Played" 
              value="1,234" 
              icon={<TrophyIcon />}
              change={{ value: 5.2, isPositive: true }}
            />
            <StatCardNew 
              title="Active Users" 
              value="56,789" 
              icon={<UserIcon />}
              change={{ value: 3.1, isPositive: false }}
            />
            <StatCardNew 
              title="Avg. Session" 
              value="24m" 
              icon={<ClockIcon />}
              change={{ value: 8.7, isPositive: true }}
            />
          </div>
        </section>

        {/* Inputs Section */}
        <section className="mb-12">
          <h2 className="headline mb-6">Premium Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumCard padding="lg">
              <h3 className="title mb-4">Form Elements</h3>
              <div className="space-y-4">
                <InputField 
                  label="Username" 
                  placeholder="Enter your username" 
                  value={inputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                />
                <InputField 
                  label="Email" 
                  placeholder="Enter your email" 
                  type="email"
                />
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Enable Notifications</span>
                  <Toggle 
                    enabled={isToggled} 
                    onChange={setIsToggled} 
                    size="md"
                  />
                </div>
                <Button variant="primary" className="w-full">
                  Submit
                </Button>
              </div>
            </PremiumCard>
            
            <PremiumCard padding="lg">
              <h3 className="title mb-4">Input States</h3>
              <div className="space-y-4">
                <InputField 
                  label="Normal Input" 
                  placeholder="Normal state" 
                />
                <InputField 
                  label="Focused Input" 
                  placeholder="Focus state" 
                  className="focus:shadow-glow"
                />
                <InputField 
                  label="Error Input" 
                  placeholder="Error state" 
                  error="This field is required"
                />
                <InputField 
                  label="With Icon" 
                  placeholder="Input with icon" 
                  icon={<UserIcon />}
                />
              </div>
            </PremiumCard>
          </div>
        </section>

        {/* Toggle Section */}
        <section className="mb-12">
          <h2 className="headline mb-6">Toggle Switches</h2>
          <PremiumCard padding="lg">
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col items-center">
                <span className="text-muted mb-2">Small</span>
                <Toggle 
                  enabled={isToggled} 
                  onChange={setIsToggled} 
                  size="sm"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted mb-2">Medium</span>
                <Toggle 
                  enabled={isToggled} 
                  onChange={setIsToggled} 
                  size="md"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-muted mb-2">Large</span>
                <Toggle 
                  enabled={isToggled} 
                  onChange={setIsToggled} 
                  size="lg"
                />
              </div>
            </div>
          </PremiumCard>
        </section>
      </div>
    </div>
  );
};