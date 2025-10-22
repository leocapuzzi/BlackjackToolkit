import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HandResult } from '@/hooks/useGameState';

interface HandHistoryProps {
  hands: HandResult[];
}

export function HandHistory({ hands }: HandHistoryProps) {
  const recentHands = hands.slice(-10).reverse();

  if (recentHands.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Hands</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No hands recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Hands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentHands.map((hand, index) => (
            <div key={hand.id} className="flex items-center justify-between text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <div className="flex-1">
                <p className="font-semibold">Hand {recentHands.length - index}</p>
                <p className="text-xs text-muted-foreground">
                  {hand.playerCards.join(', ')} vs {hand.dealerCards.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">R${hand.bet}</span>
                <Badge
                  className={
                    hand.result === 'win'
                      ? 'bg-green-500'
                      : hand.result === 'loss'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                  }
                >
                  {hand.result.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

