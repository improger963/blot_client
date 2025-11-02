// src/components/ReferralLinksCard.tsx
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { Button } from './ui';
import { motion } from 'framer-motion';
import { CopyIcon, CheckIcon, ShareIcon, LinkIcon, TelegramIcon } from './icons';

interface ReferralLinksCardProps {
  links: { telegram: string; web: string; direct: string };
}

export const ReferralLinksCard = ({ links }: ReferralLinksCardProps) => {
  const { isCopied, copy } = useCopyToClipboard();

  const handleCopyLink = (link: string) => {
    copy(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Присоединяйся к Lucky TON!',
          text: 'Играй и выигрывай вместе со мной!',
          url: links.web,
        });
      } catch (err) {
        // Пользователь отменил шаринг
      }
    } else {
      handleCopyLink(links.web);
    }
  };

  const LinkItem = ({ icon: Icon, label, value }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }) => (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 4px 20px hsl(var(--color-background) / 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 rounded-xl bg-surface/50 p-4 group hover:bg-surface/70 transition-all duration-200 glass material-depth-1"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
        <div className="relative">
          <input
            readOnly
            value={value}
            className="w-full bg-transparent text-xs text-muted-foreground font-mono truncate pr-8 focus:outline-none"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleCopyLink(value)}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-card text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors"
      >
        {isCopied ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className="rounded-2xl bg-gradient-to-br from-surface/50 to-surface/30 p-6 space-y-6 glass material-depth-2"
    >
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <ShareIcon className="h-6 w-6 text-primary" />
          </motion.div>
        </div>
        <h3 className="text-lg font-bold text-foreground">Реферальные ссылки</h3>
        <p className="text-sm text-muted-foreground">
          Делитесь разными ссылками для максимального охвата
        </p>
      </div>

      {/* Ссылки */}
      <div className="space-y-3">
        <LinkItem
          icon={LinkIcon}
          label="Основная ссылка"
          value={links.web}
        />

        <LinkItem
          icon={TelegramIcon}
          label="Telegram ссылка"
          value={links.telegram}
        />

        {links.direct && (
          <LinkItem
            icon={LinkIcon}
            label="Прямая ссылка"
            value={links.direct}
          />
        )}
      </div>

      {/* Кнопка шаринга */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleShare}
          variant="primary"
          className="w-full h-11 rounded-xl font-semibold shadow-lg"
        >
          <ShareIcon className="h-4 w-4 mr-2" />
          Поделиться со всеми
        </Button>
      </motion.div>

      {/* Информация о бонусах */}
      <div className="rounded-lg bg-primary/5 p-3">
        <p className="text-xs text-primary text-center">
          💰 Вы получаете бонусы за каждого активного приглашенного друга
        </p>
      </div>
      
      {/* Декоративные элементы для тактильного удовольствия */}
      <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-secondary/10 blur-xl" />
    </motion.div>
  );
};