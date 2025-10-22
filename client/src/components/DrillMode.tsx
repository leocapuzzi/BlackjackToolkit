import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { calculateHandValue, getBasicStrategy, CARD_COLORS } from '@/lib/zenCount';
import { Play, RotateCcw } from 'lucide-react';

const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

interface DrillModeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DrillMode({ isOpen, onOpenChange }: DrillModeProps) {
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCard, setDealerCard] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateHand = () => {
    const randomPlayer = [
      CARDS[Math.floor(Math.random() * CARDS.length)],
      CARDS[Math.floor(Math.random() * CARDS.length)],
    ];
    const randomDealer = CARDS[Math.floor(Math.random() * CARDS.length)];
    setPlayerCards(randomPlayer);
    setDealerCard(randomDealer);
    setUserAnswer('');
    setShowResult(false);
  };

  const checkAnswer = () => {
    const strategy = getBasicStrategy(playerCards, dealerCard);
    const isCorrect = userAnswer === strategy.action;
    setShowResult(true);
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const resetDrill = () => {
    setPlayerCards([]);
    setDealerCard('');
    setUserAnswer('');
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
  };

  const { value, isSoft } = calculateHandValue(playerCards);
  const strategy = getBasicStrategy(playerCards, dealerCard);
  const isAnswerCorrect = userAnswer === strategy.action;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Drill Mode - Strategy Training</DialogTitle>
          <DialogDescription>
            Practice your basic strategy knowledge. Guess the correct action for each hand.
          </DialogDescription>
        </DialogHeader>

        {score.total > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
            <p className="text-sm font-semibold">
              Score: {score.correct}/{score.total} ({((score.correct / score.total) * 100).toFixed(0)}%)
            </p>
          </div>
        )}

        {playerCards.length === 0 ? (
          <div className="text-center py-8">
            <Button onClick={generateHand} size="lg" className="gap-2">
              <Play className="w-4 h-4" />
              Start Drill
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hand Display */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your Hand</p>
                <div className="flex gap-2">
                  {playerCards.map((card, i) => {
                    const color = CARD_COLORS[card];
                    return (
                      <Badge key={i} className={`${color.bg} ${color.text} text-lg py-2 px-3`}>
                        {card}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-sm font-semibold mt-2">
                  {isSoft ? 'Soft ' : ''}{value}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Dealer Upcard</p>
                <Badge className={`${CARD_COLORS[dealerCard].bg} ${CARD_COLORS[dealerCard].text} text-lg py-2 px-3`}>
                  {dealerCard}
                </Badge>
              </div>
            </div>

            {/* Answer Selection */}
            {!showResult && (
              <div>
                <p className="text-sm font-semibold mb-2">What should you do?</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setUserAnswer('H')}
                    variant={userAnswer === 'H' ? 'default' : 'outline'}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    HIT
                  </Button>
                  <Button
                    onClick={() => setUserAnswer('S')}
                    variant={userAnswer === 'S' ? 'default' : 'outline'}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    STAND
                  </Button>
                  <Button
                    onClick={() => setUserAnswer('D')}
                    variant={userAnswer === 'D' ? 'default' : 'outline'}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    DOUBLE
                  </Button>
                  <Button
                    onClick={() => setUserAnswer('P')}
                    variant={userAnswer === 'P' ? 'default' : 'outline'}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    SPLIT
                  </Button>
                </div>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className={`p-4 rounded ${isAnswerCorrect ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                <p className={`font-semibold ${isAnswerCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {isAnswerCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="text-sm mt-2">
                  The correct answer is: <span className="font-semibold">{strategy.label}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{strategy.reasoning}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {!showResult && userAnswer && (
                <Button onClick={checkAnswer} className="flex-1">
                  Check Answer
                </Button>
              )}
              {showResult && (
                <Button onClick={generateHand} className="flex-1">
                  Next Hand
                </Button>
              )}
              <Button onClick={resetDrill} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

