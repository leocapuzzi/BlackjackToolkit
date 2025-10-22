import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameState } from '@/lib/zenCount';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface GameStatsProps {
  gameState: GameState;
  isPenetrationReached: boolean;
}

export function GameStats({ gameState, isPenetrationReached }: GameStatsProps) {
  const penetrationPercent = (gameState.penetration * 100).toFixed(1);
  const evPercent = ((gameState.ev - 0.5) * 100).toFixed(2);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Running Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{gameState.runningCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Cards: {gameState.cardsUsed}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">True Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{gameState.trueCount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Decks: {(gameState.cardsRemaining / 52).toFixed(1)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Penetration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{penetrationPercent}%</div>
          <p className={`text-xs mt-1 ${isPenetrationReached ? 'text-orange-500 font-semibold' : 'text-muted-foreground'}`}>
            {isPenetrationReached ? '⚠️ 50% Reached' : 'Remaining'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Player Edge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {gameState.playerEdge ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500" />
            )}
            <div>
              <div className="text-2xl font-bold">{evPercent}%</div>
              <p className="text-xs text-muted-foreground">EV</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

