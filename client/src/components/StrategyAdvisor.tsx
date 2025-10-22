import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBasicStrategy, calculateHandValue } from '@/lib/zenCount';

interface StrategyAdvisorProps {
  playerCards: string[];
  dealerCard: string;
  trueCount?: number;
}

const ACTION_COLORS: Record<string, string> = {
  H: 'bg-blue-500',
  S: 'bg-green-500',
  D: 'bg-purple-500',
  P: 'bg-orange-500',
  I: 'bg-yellow-500',
};

export function StrategyAdvisor({ playerCards, dealerCard, trueCount = 0 }: StrategyAdvisorProps) {
  if (playerCards.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Basic Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add player cards to see strategy recommendation</p>
        </CardContent>
      </Card>
    );
  }

  const strategy = getBasicStrategy(playerCards, dealerCard, trueCount);
  const { value, isSoft } = calculateHandValue(playerCards);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Basic Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Your Hand</p>
            <p className="text-sm font-semibold">
              {isSoft ? 'Soft ' : ''}{value} ({playerCards.join(', ')})
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Dealer Upcard</p>
            <p className="text-sm font-semibold">{dealerCard}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Recommended Action</p>
            <Badge className={`${ACTION_COLORS[strategy.action] || 'bg-blue-500'} text-white text-lg py-2 px-3`}>
              {strategy.label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">{strategy.description}</p>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Why?</p>
            <p className="text-xs text-foreground leading-relaxed">{strategy.reasoning}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

