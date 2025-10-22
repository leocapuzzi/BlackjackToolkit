import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HandResult } from '@/hooks/useGameState';

interface TrueCountStatsProps {
  hands: HandResult[];
}

export function TrueCountStats({ hands }: TrueCountStatsProps) {
  // For now, we'll show basic stats grouped by True Count ranges
  // In a full implementation, we'd store TC with each hand result
  
  const ranges = {
    'TC < 0': { wins: 0, losses: 0, pushes: 0 },
    '0-1': { wins: 0, losses: 0, pushes: 0 },
    '1-2': { wins: 0, losses: 0, pushes: 0 },
    '2+': { wins: 0, losses: 0, pushes: 0 },
  };

  // This would be populated if we stored TC with each hand
  // For now, show overall statistics
  const totalWins = hands.filter((h) => h.result === 'win').length;
  const totalLosses = hands.filter((h) => h.result === 'loss').length;
  const totalPushes = hands.filter((h) => h.result === 'push').length;
  const total = hands.length;

  if (total === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">True Count Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Play hands to see statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">True Count Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Total Hands</p>
              <p className="font-semibold">{total}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Wins</p>
              <p className="font-semibold text-green-500">{totalWins}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Losses</p>
              <p className="font-semibold text-red-500">{totalLosses}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pushes</p>
              <p className="font-semibold text-yellow-600">{totalPushes}</p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
            <p className="font-semibold">
              {total > 0 ? ((totalWins / total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

