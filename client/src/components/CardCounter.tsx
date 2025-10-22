import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CARD_COLORS } from '@/lib/zenCount';

interface CardCounterProps {
  cardCounts: Record<string, number>;
}

const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function CardCounter({ cardCounts }: CardCounterProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Cards Seen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {CARDS.map((card) => {
            const count = cardCounts[card] || 0;
            const color = CARD_COLORS[card];
            return (
              <div key={card} className="text-center">
                <Badge
                  className={`${color.bg} ${color.text} w-full justify-center font-semibold mb-1`}
                >
                  {card}
                </Badge>
                <p className="text-xs font-semibold text-foreground">{count}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

