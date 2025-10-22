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

  return (
    <Card className={isBust ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
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
        {showValue && cards.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Value:</span>
            <Badge className={isBust ? 'bg-red-500' : 'bg-green-500'}>
              {isBust ? 'BUST' : value}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

