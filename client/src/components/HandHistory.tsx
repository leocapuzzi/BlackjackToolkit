import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HandResult } from '@/hooks/useGameState';
import { Download } from 'lucide-react';

interface HandHistoryProps {
  hands: HandResult[];
}

export function HandHistory({ hands }: HandHistoryProps) {
  const recentHands = hands.slice(-10).reverse();

  const exportToCSV = () => {
    if (hands.length === 0) return;

    const headers = [
      'Timestamp',
      'Result',
      'Bet',
      'Player Cards',
      'Dealer Cards',
      'True Count',
      'Player Blackjack',
      'Dealer Blackjack',
    ];

    const rows = hands.map((hand) => [
      new Date(hand.timestamp).toISOString(),
      hand.result,
      hand.bet,
      hand.playerCards.join(' '),
      hand.dealerCards.join(' '),
      hand.trueCount?.toFixed(2) ?? '',
      hand.playerBlackjack ? 'Yes' : 'No',
      hand.dealerBlackjack ? 'Yes' : 'No',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hand-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

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
      <CardHeader className="pb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-sm font-medium">Recent Hands</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={exportToCSV}
          className="gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentHands.map((hand, index) => (
            <div key={hand.id} className="flex flex-col gap-2 text-sm p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Hand {recentHands.length - index}</p>
                <span className="text-xs text-muted-foreground">TC: {hand.trueCount?.toFixed(2) ?? '—'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Player: {hand.playerCards.join(', ') || '—'}</span>
                <span>Dealer: {hand.dealerCards.join(', ') || '—'}</span>
                <span>Bet: R${hand.bet}</span>
                {hand.playerBlackjack && <Badge className="bg-purple-600">Blackjack</Badge>}
                {hand.dealerBlackjack && <Badge className="bg-blue-600">Dealer BJ</Badge>}
              </div>
              <div className="flex items-center gap-2">
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

