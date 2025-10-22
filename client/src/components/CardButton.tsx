import { Button } from '@/components/ui/button';
import { CARD_COLORS } from '@/lib/zenCount';
import { cn } from '@/lib/utils';

interface CardButtonProps {
  card: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function CardButton({ card, onClick, disabled = false, className }: CardButtonProps) {
  const cardColor = CARD_COLORS[card];

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-20 w-16 text-lg font-bold rounded-lg transition-all',
        cardColor?.bg,
        cardColor?.text,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {card}
    </Button>
  );
}

