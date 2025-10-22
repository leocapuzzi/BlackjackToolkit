import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateHandValue, CARD_COLORS } from '@/lib/zenCount';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface HandDisplayProps {
  title: string;
  cards: string[];
  showValue?: boolean;
  isDealer?: boolean;
  onRemoveCard?: (card: string, index: number) => void;
}

export function HandDisplay({ title, cards, showValue = true, isDealer = false, onRemoveCard }: HandDisplayProps) {
  const { value } = calculateHandValue(cards);
  const isBust = value > 21;
  const isBlackjack = cards.length === 2 && value === 21;

  return (
    <Card className={`${isBust ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''} h-[220px]`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex flex-wrap gap-2">
          {cards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No cards</p>
          ) : (
            cards.map((card, index) => {
              const color = CARD_COLORS[card];
              return (
                <div key={index} className="relative group">
                  <Badge
                    className={`${color.bg} ${color.text} text-lg font-bold py-1 px-3 cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => onRemoveCard?.(card, index)}
                  >
                    {card}
                  </Badge>
                  {onRemoveCard && (
                    <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              );
            })
          )}
          </div>
        </div>
        {showValue && cards.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">Value:</span>
            <Badge className={isBust ? 'bg-red-500' : 'bg-green-500'}>
              {value}
            </Badge>
            {isBust && <Badge className="bg-red-600">BUST</Badge>}
            {isBlackjack && !isDealer && <Badge className="bg-yellow-500 text-black">Blackjack</Badge>}
            {isBlackjack && isDealer && <Badge className="bg-blue-500 text-white">Dealer Blackjack</Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

