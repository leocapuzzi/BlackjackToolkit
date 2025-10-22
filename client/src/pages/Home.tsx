import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameStats } from '@/components/GameStats';
import { HandDisplay } from '@/components/HandDisplay';
import { StrategyAdvisor } from '@/components/StrategyAdvisor';
import { BetSuggestion } from '@/components/BetSuggestion';
import CardButtonGroup from '@/components/CardButtonGroup';
import { CardCounter } from '@/components/CardCounter';
import { HandHistory } from '@/components/HandHistory';
import { TrueCountStats } from '@/components/TrueCountStats';
import { DrillMode } from '@/components/DrillMode';
import { useGameState } from '@/hooks/useGameState';
import {
  RotateCcw,
  Undo2,
  CheckCircle,
  XCircle,
  Minus,
  Zap,
  BookOpen,
  TrendingUp,
  ChevronRight,
  UserPlus,
  Eraser,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { checkHighProbabilityAlert, calculateHandValue } from '@/lib/zenCount';

export default function Home() {
  const game = useGameState();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showHandResult, setShowHandResult] = useState(false);
  const [showDrillMode, setShowDrillMode] = useState(false);
  const [selectedOtherPlayer, setSelectedOtherPlayer] = useState(0);

  const otherPlayerCount = game.otherPlayersCards.length;

  useEffect(() => {
    if (selectedOtherPlayer >= otherPlayerCount) {
      setSelectedOtherPlayer(Math.max(0, otherPlayerCount - 1));
    }
  }, [otherPlayerCount, selectedOtherPlayer]);

  const handleCardClick = (card: string, owner: 'player' | 'dealer' | 'others'): void => {
    if (owner === 'others') {
      const targetIndex = Math.max(0, Math.min(selectedOtherPlayer, otherPlayerCount - 1));
      game.addCard(card, 'other', targetIndex);
    } else {
      game.addCard(card, owner);
    }
  };

  const handleRemoveCard = (card: string, owner: 'player' | 'dealer' | 'other', otherPlayerIndex?: number): void => {
    game.removeCard(card, owner, otherPlayerIndex);
  };

  const handleResetShoe = () => {
    game.resetShoe();
    setShowResetConfirm(false);
  };

  const handleSplit = () => {
    if (game.playerCards.length === 2 && game.playerCards[0] === game.playerCards[1]) {
      game.splitHand();
    }
  };

  const handleEndHand = (result: 'win' | 'loss' | 'push') => {
    game.endHand(result);
    setShowHandResult(false);
  };

  const handleSwitchToNextSplit = () => {
    game.switchToNextSplitHand();
  };

  const handleEndSplit = () => {
    game.endSplitMode();
  };

  const stats = game.getSessionStats();
  const isFavorableSituation = game.gameState.trueCount > 2;
  const canSplit = game.playerCards.length === 2 && game.playerCards[0] === game.playerCards[1];
  const probabilityAlert = checkHighProbabilityAlert(game.cardCounts, game.gameState.trueCount);
  const inSplitMode = game.splitMode !== 'none';
  const otherHands = game.otherPlayersCards;
  const selectedOtherHand = otherHands[selectedOtherPlayer] || [];

  const handleSelectOtherPlayer = (value: string) => {
    setSelectedOtherPlayer(parseInt(value, 10));
  };

  const handleAddOtherPlayer = () => {
    game.addOtherPlayer();
    setSelectedOtherPlayer(game.otherPlayersCards.length);
  };

  const handleClearOtherPlayer = () => {
    const cardsToRemove = [...selectedOtherHand];
    cardsToRemove.forEach((card) => {
      game.removeCard(card, 'other', selectedOtherPlayer);
    });
  };

  // Get current hand for strategy
  const currentPlayerCards = inSplitMode
    ? (game.splitMode === 'split1' ? game.splitHands[0]?.cards || [] : game.splitHands[1]?.cards || [])
    : game.playerCards;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🎰 Blackjack Card Counter</h1>
            <p className="text-purple-300">Zen Count System | 8 Decks | 50% Penetration</p>
          </div>
          <Button
            onClick={() => setShowDrillMode(true)}
            variant="outline"
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
          >
            <BookOpen className="w-4 h-4" />
            Drill Mode
          </Button>
        </div>

        {/* Favorable Situation Alert */}
        {isFavorableSituation && (
          <div className="glass p-6 border-pink-500/50">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-pink-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-pink-300">
                  Favorable Situation!
                </p>
                <p className="text-sm text-pink-200">
                  True Count is {game.gameState.trueCount.toFixed(2)} - Player has strong advantage. Increase your bet!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Probability Alert */}
        {probabilityAlert && (
          <div className="glass p-6 border-amber-500/50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-300">
                  Probability Alert
                </p>
                <p className="text-sm text-amber-200">
                  {probabilityAlert}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game Stats */}
        <GameStats gameState={game.gameState} isPenetrationReached={game.isPenetrationReached} />

        {/* Main Content - Reorganized Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] gap-6">
          {/* Left/Center Column - Hands Display and Card Buttons */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="game" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-purple-800/50">
                <TabsTrigger value="game">Game</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>

              <TabsContent value="game" className="space-y-6">
                {/* Hands Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-6">
                    <HandDisplay
                      title="Player Hand"
                      cards={game.playerCards}
                      onRemoveCard={(card: string) => handleRemoveCard(card, 'player')}
                    />
                  </div>
                  <div className="glass p-6">
                    <HandDisplay
                      title="Dealer Hand"
                      cards={game.dealerCards}
                      isDealer
                      onRemoveCard={(card: string) => handleRemoveCard(card, 'dealer')}
                    />
                  </div>
                </div>

                {/* Split Hands Display */}
                {game.splitMode !== 'none' && game.splitHands.length > 0 && (
                  <div className="glass p-6 border-pink-500/50">
                    <h3 className="text-lg font-semibold text-pink-300 mb-4">Split Hands</h3>
                    <div className="space-y-3">
                      {game.splitHands.map((hand, index) => {
                        const { value } = calculateHandValue(hand.cards);
                        const isActive = (game.splitMode === 'split1' && index === 0) || (game.splitMode === 'split2' && index === 1);
                        return (
                          <div key={hand.id} className={`glass-sm p-4 border-2 ${isActive ? 'border-pink-500' : 'border-purple-500/30'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-purple-200">Hand {index + 1}</h4>
                                <p className="text-sm text-purple-300">Value: {value}</p>
                              </div>
                              {isActive && (
                                <div className="flex gap-2">
                                  {index === 0 && game.splitHands.length > 1 && (
                                    <Button
                                      size="sm"
                                      onClick={handleSwitchToNextSplit}
                                      className="gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs"
                                    >
                                      Next <ChevronRight className="w-3 h-3" />
                                    </Button>
                                  )}
                                  {index === 1 && (
                                    <Button
                                      size="sm"
                                      onClick={handleEndSplit}
                                      className="gap-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                                    >
                                      Done
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {hand.cards.map((card, idx) => (
                                <div
                                  key={idx}
                                  className="w-12 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition"
                                  onClick={() => {
                                    if (isActive) {
                                      game.removeCard(card, 'player');
                                    }
                                  }}
                                  title={isActive ? 'Click to remove' : ''}
                                >
                                  {card}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Card Button Groups */}
                <div className="space-y-4">
                  <CardButtonGroup owner="player" onCardClick={(card) => handleCardClick(card, 'player')} />
                  <CardButtonGroup owner="dealer" onCardClick={(card) => handleCardClick(card, 'dealer')} />
                  <div className="space-y-3">
                    <CardButtonGroup owner="others" onCardClick={(card) => handleCardClick(card, 'others')} />
                    {otherHands.length > 0 && (
                      <div className="glass-sm p-4 rounded-lg border border-purple-500/40 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-purple-200">Other Players Hands</h4>
                          <div className="flex items-center gap-2">
                            <Select value={String(selectedOtherPlayer)} onValueChange={handleSelectOtherPlayer}>
                              <SelectTrigger size="sm" className="bg-purple-900/40 text-purple-100 border-purple-500/60">
                                <SelectValue placeholder="Select player" />
                              </SelectTrigger>
                              <SelectContent className="bg-purple-950/95 text-purple-100 border-purple-600">
                                {otherHands.map((_, index) => (
                                  <SelectItem key={`other-player-${index}`} value={String(index)}>
                                    Player {index + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-purple-800/50 text-purple-100 border border-purple-500/60 hover:bg-purple-700"
                              onClick={handleAddOtherPlayer}
                              title="Add other player"
                            >
                              <UserPlus className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-purple-800/50 text-purple-100 border border-purple-500/60 hover:bg-purple-700 disabled:opacity-40"
                              onClick={handleClearOtherPlayer}
                              disabled={selectedOtherHand.length === 0}
                              title="Clear selected player"
                            >
                              <Eraser className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {otherHands.map((cards, index) => (
                            <div
                              key={`other-hand-${index}`}
                              className={`space-y-2 rounded-md p-3 transition border ${
                                index === selectedOtherPlayer
                                  ? 'border-purple-400/80 bg-purple-800/40'
                                  : 'border-transparent bg-purple-900/20'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs text-purple-300">
                                <span>Player {index + 1}</span>
                                <span className="italic">Click a card to remove</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {cards.map((card, cardIndex) => (
                                  <div
                                    key={`${card}-${cardIndex}`}
                                    className="w-10 h-14 bg-purple-600/80 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:bg-purple-500 transition"
                                    onClick={() => handleRemoveCard(card, 'other', index)}
                                    title="Remove card"
                                  >
                                    {card}
                                  </div>
                                ))}
                                {cards.length === 0 && (
                                  <span className="text-xs text-purple-300">No cards yet</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="glass p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-purple-200 mb-4">Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={game.undoLastCard}
                      variant="outline"
                      className="gap-2 bg-purple-800/50 hover:bg-purple-700 border-purple-600 text-purple-200"
                    >
                      <Undo2 className="w-4 h-4" />
                      Undo Last Card
                    </Button>
                    <Button
                      onClick={handleSplit}
                      disabled={!canSplit || inSplitMode}
                      variant="outline"
                      className="gap-2 bg-purple-800/50 hover:bg-purple-700 border-purple-600 text-purple-200 disabled:opacity-50"
                    >
                      Split Hand
                    </Button>
                  </div>
                  <Dialog open={showHandResult} onOpenChange={setShowHandResult}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold">
                        End Hand
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-purple-500/50">
                      <DialogHeader>
                        <DialogTitle className="text-purple-200">Hand Result</DialogTitle>
                        <DialogDescription className="text-purple-300">
                          Select the outcome of this hand
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          onClick={() => handleEndHand('win')}
                          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Win
                        </Button>
                        <Button
                          onClick={() => handleEndHand('loss')}
                          className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="w-4 h-4" />
                          Loss
                        </Button>
                        <Button
                          onClick={() => handleEndHand('push')}
                          className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          <Minus className="w-4 h-4" />
                          Push
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset Shoe
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-red-500/50">
                      <DialogHeader>
                        <DialogTitle className="text-red-300">Reset Shoe</DialogTitle>
                        <DialogDescription className="text-red-200">
                          Are you sure you want to reset the shoe? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setShowResetConfirm(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleResetShoe}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          Reset
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="glass p-6">
                  <HandHistory hands={game.handHistory} />
                </div>
              </TabsContent>

              <TabsContent value="stats">
                <div className="glass p-6">
                  <TrueCountStats hands={game.handHistory} />
                </div>
              </TabsContent>

              <TabsContent value="cards">
                <div className="glass p-6">
                  <CardCounter cardCounts={game.cardCounts} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Strategy and Bet Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Strategy - Compact */}
            <div className="glass p-6">
              <h3 className="text-lg font-semibold text-purple-200 mb-4">Basic Strategy</h3>
              <StrategyAdvisor
                playerCards={currentPlayerCards}
                dealerCard={game.dealerCards[0]}
                trueCount={game.gameState.trueCount}
              />
            </div>

            {/* Bet Management */}
            <div className="glass p-6">
              <BetSuggestion
                gameState={game.gameState}
                currentBet={game.currentBet}
                onBetChange={game.setCurrentBet}
              />
            </div>
          </div>
        </div>

        {/* Session Statistics */}
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Session Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div>
              <p className="text-purple-400 text-sm">Total Hands</p>
              <p className="text-2xl font-bold text-white">{stats.totalHands}</p>
            </div>
            <div>
              <p className="text-green-400 text-sm">Wins</p>
              <p className="text-2xl font-bold text-green-400">{stats.wins}</p>
            </div>
            <div>
              <p className="text-red-400 text-sm">Losses</p>
              <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
            </div>
            <div>
              <p className="text-yellow-400 text-sm">Pushes</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pushes}</p>
            </div>
            <div>
              <p className="text-purple-400 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-purple-300">{(stats.winRate * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-purple-400 text-sm">Total Bet</p>
              <p className="text-2xl font-bold text-purple-300">R${stats.totalBet}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Drill Mode Dialog */}
      <Dialog open={showDrillMode} onOpenChange={setShowDrillMode}>
        <DialogContent className="glass border-purple-500/50 max-w-2xl">
          <DrillMode isOpen={showDrillMode} onOpenChange={setShowDrillMode} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

