import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GameState, BET_VALUES } from '@/lib/zenCount';
import { Trash2 } from 'lucide-react';

interface BetSuggestionProps {
  gameState: GameState;
  currentBet: number;
  onBetChange: (bet: number) => void;
}

export function BetSuggestion({ gameState, currentBet, onBetChange }: BetSuggestionProps) {
  const getBetRampUpLevel = (trueCount: number): string => {
    if (trueCount <= 0) return 'Minimum - Negative Count';
    if (trueCount < 1) return 'Level 1 - Neutral';
    if (trueCount < 2) return 'Level 2 - Slight Advantage';
    if (trueCount < 3) return 'Level 3 - Good Advantage';
    if (trueCount < 4) return 'Level 4 - Strong Advantage';
    if (trueCount < 5) return 'Level 5 - Very Strong';
    return 'Level 6 - Maximum Advantage';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Bet Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Current Bet</p>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500 text-white text-lg py-2 px-4">
              R${currentBet}
            </Badge>
            {gameState.trueCount > 0 && (
              <Badge className="bg-green-500 text-white">
                +{(gameState.trueCount * 0.5).toFixed(1)}%
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onBetChange(0)}
              title="Reset bet"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Suggested Bet: <span className="font-semibold text-foreground">R${gameState.suggestedBet}</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {BET_VALUES.map((bet) => (
              <button
                key={bet}
                onClick={() => onBetChange(currentBet + bet)}
                className={`py-2 px-2 rounded text-sm font-semibold transition-all bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 ${
                  currentBet >= bet && currentBet !== 0 ? 'border-2 border-blue-500' : ''
                }`}
              >
                R${bet}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-1">Ramp-Up Level</p>
          <p className="text-sm font-semibold">{getBetRampUpLevel(gameState.trueCount)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {gameState.trueCount <= 0 ? (
              <span className="text-red-500">Negative - Minimum bet recommended</span>
            ) : gameState.trueCount < 2 ? (
              <span className="text-yellow-600">Low - Standard bet</span>
            ) : (
              <span className="text-green-500">High - Increase bet</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

