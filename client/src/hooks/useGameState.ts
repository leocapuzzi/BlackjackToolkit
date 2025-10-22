import { useState, useCallback } from 'react';
import {
  GameState,
  calculateGameState,
  updateGameState,
  PENETRATION_THRESHOLD,
  calculateHandValue,
} from '@/lib/zenCount';

export interface HandResult {
  id: string;
  playerCards: string[];
  dealerCards: string[];
  otherPlayersCards: string[][];
  result: 'win' | 'loss' | 'push';
  bet: number;
  timestamp: number;
  trueCount?: number;
  playerBlackjack?: boolean;
  dealerBlackjack?: boolean;
}

interface CardEvent {
  card: string;
  owner: 'player' | 'dealer' | 'other';
  otherPlayerIndex?: number;
}

export interface SplitHand {
  id: string;
  cards: string[];
  result?: 'win' | 'loss' | 'push';
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(calculateGameState());
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [otherPlayersCards, setOtherPlayersCards] = useState<string[][]>([[]]);
  const [handHistory, setHandHistory] = useState<HandResult[]>([]);
  const [currentBet, setCurrentBet] = useState<number>(0);
  const [cardHistory, setCardHistory] = useState<CardEvent[]>([]);
  const [splitHands, setSplitHands] = useState<SplitHand[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [splitMode, setSplitMode] = useState<'none' | 'split1' | 'split2'>('none');
  const [originalSplitCards, setOriginalSplitCards] = useState<string[]>([]);

  // Add a card to the game state
  const addCard = useCallback(
    (card: string, owner: 'player' | 'dealer' | 'other', otherPlayerIndex?: number) => {
      const newState = updateGameState(gameState, [card], false);
      setGameState(newState);
      setCardHistory((prev) => [...prev, { card, owner, otherPlayerIndex }]);
      setCardCounts((prev) => ({
        ...prev,
        [card]: (prev[card] || 0) + 1,
      }));

      if (owner === 'player') {
        if (splitMode === 'none') {
          setPlayerCards((prev) => [...prev, card]);
        } else if (splitMode === 'split1') {
          setSplitHands((prev) => {
            const updated = [...prev];
            if (updated[0]) {
              updated[0] = { ...updated[0], cards: [...updated[0].cards, card] };
            }
            return updated;
          });
        } else if (splitMode === 'split2') {
          setSplitHands((prev) => {
            const updated = [...prev];
            if (updated[1]) {
              updated[1] = { ...updated[1], cards: [...updated[1].cards, card] };
            }
            return updated;
          });
        }
      } else if (owner === 'dealer') {
        setDealerCards((prev) => [...prev, card]);
      } else if (owner === 'other' && otherPlayerIndex !== undefined) {
        setOtherPlayersCards((prev) => {
          const updated = [...prev];
          if (!updated[otherPlayerIndex]) {
            updated[otherPlayerIndex] = [];
          }
          updated[otherPlayerIndex] = [...updated[otherPlayerIndex], card];
          return updated;
        });
      }
    },
    [gameState, splitMode]
  );

  // Remove a specific card from a hand
  const removeCard = useCallback(
    (card: string, owner: 'player' | 'dealer' | 'other', otherPlayerIndex?: number) => {
      const newState = updateGameState(gameState, [card], true);
      setGameState(newState);
      setCardCounts((prev) => ({
        ...prev,
        [card]: Math.max(0, (prev[card] || 0) - 1),
      }));

      if (owner === 'player') {
        if (splitMode === 'none') {
          setPlayerCards((prev) => {
            const index = prev.lastIndexOf(card);
            if (index > -1) {
              return prev.filter((_, i) => i !== index);
            }
            return prev;
          });
        } else if (splitMode === 'split1') {
          setSplitHands((prev) => {
            const updated = [...prev];
            if (updated[0]) {
              const index = updated[0].cards.lastIndexOf(card);
              if (index > -1) {
                updated[0] = {
                  ...updated[0],
                  cards: updated[0].cards.filter((_, i) => i !== index),
                };
              }
            }
            return updated;
          });
        } else if (splitMode === 'split2') {
          setSplitHands((prev) => {
            const updated = [...prev];
            if (updated[1]) {
              const index = updated[1].cards.lastIndexOf(card);
              if (index > -1) {
                updated[1] = {
                  ...updated[1],
                  cards: updated[1].cards.filter((_, i) => i !== index),
                };
              }
            }
            return updated;
          });
        }
      } else if (owner === 'dealer') {
        setDealerCards((prev) => {
          const index = prev.lastIndexOf(card);
          if (index > -1) {
            return prev.filter((_, i) => i !== index);
          }
          return prev;
        });
      } else if (owner === 'other' && otherPlayerIndex !== undefined) {
        setOtherPlayersCards((prev) => {
          const updated = [...prev];
          const playerHand = updated[otherPlayerIndex];
          if (!playerHand) {
            return prev;
          }
          const index = playerHand.lastIndexOf(card);
          if (index > -1) {
            updated[otherPlayerIndex] = playerHand.filter((_, i) => i !== index);
          }
          return updated;
        });
      }

      // Remove from card history
      setCardHistory((prev) => {
        for (let i = prev.length - 1; i >= 0; i--) {
          const entry = prev[i];
          if (
            entry.card === card &&
            entry.owner === owner &&
            (owner !== 'other' || entry.otherPlayerIndex === otherPlayerIndex)
          ) {
            return prev.filter((_, idx) => idx !== i);
          }
        }
        return prev;
      });
    },
    [gameState, splitMode]
  );

  // Undo the last card
  const undoLastCard = useCallback(() => {
    if (cardHistory.length === 0) return;

    const lastEvent = cardHistory[cardHistory.length - 1];
    removeCard(lastEvent.card, lastEvent.owner, lastEvent.otherPlayerIndex);
  }, [cardHistory, removeCard]);

  // Split the current hand
  const splitHand = useCallback(() => {
    if (playerCards.length !== 2 || playerCards[0] !== playerCards[1]) {
      return; // Can only split pairs
    }

    // Create two split hands with the original cards
    const hand1: SplitHand = {
      id: `split-${Date.now()}-1`,
      cards: [playerCards[0]],
    };
    const hand2: SplitHand = {
      id: `split-${Date.now()}-2`,
      cards: [playerCards[1]],
    };

    setSplitHands([hand1, hand2]);
    setOriginalSplitCards([...playerCards]);
    setPlayerCards([]); // Clear main hand
    setSplitMode('split1'); // Start with first hand
  }, [playerCards]);

  // Switch to next split hand
  const switchToNextSplitHand = useCallback(() => {
    if (splitMode === 'split1') {
      setSplitMode('split2');
    }
  }, [splitMode]);

  // End split mode and return to normal
  const endSplitMode = useCallback(() => {
    setSplitMode('none');
    setOriginalSplitCards([]);
  }, []);

  // Reset the shoe
  const resetShoe = useCallback(() => {
    setGameState(calculateGameState());
    setPlayerCards([]);
    setDealerCards([]);
    setOtherPlayersCards([[]]);
    setCardHistory([]);
    setHandHistory([]);
    setSplitHands([]);
    setCardCounts({});
    setSplitMode('none');
    setOriginalSplitCards([]);
    setCurrentBet(0);
  }, []);

  // End the hand and record result
  const endHand = useCallback(
    (result: 'win' | 'loss' | 'push') => {
      const recordedPlayerCards = splitMode === 'none' ? [...playerCards] : [...originalSplitCards];
      const handResult: HandResult = {
        id: `hand-${Date.now()}`,
        playerCards: recordedPlayerCards,
        dealerCards: [...dealerCards],
        otherPlayersCards: otherPlayersCards
          .filter((hand) => hand.length > 0)
          .map((hand) => [...hand]),
        result,
        bet: currentBet,
        timestamp: Date.now(),
        trueCount: gameState.trueCount,
        playerBlackjack:
          recordedPlayerCards.length === 2 && calculateHandValue(recordedPlayerCards).value === 21,
        dealerBlackjack:
          dealerCards.length === 2 && calculateHandValue(dealerCards).value === 21,
      };

      setHandHistory((prev) => [...prev, handResult]);

      // Reset for next hand
      setPlayerCards([]);
      setDealerCards([]);
      setOtherPlayersCards([[]]);
      setCardHistory([]);
      setSplitHands([]);
      setSplitMode('none');
      setOriginalSplitCards([]);
      setCurrentBet(0);
    },
    [playerCards, dealerCards, otherPlayersCards, currentBet, gameState.trueCount, splitMode, originalSplitCards]
  );

  // Add other player
  const addOtherPlayer = useCallback(() => {
    setOtherPlayersCards((prev) => [...prev, []]);
  }, []);

  // Remove other player
  const removeOtherPlayer = useCallback((index: number) => {
    setOtherPlayersCards((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Check if shoe penetration is reached
  const isPenetrationReached = gameState.penetration >= PENETRATION_THRESHOLD;

  // Calculate session statistics
  const getSessionStats = useCallback(() => {
    const wins = handHistory.filter((h) => h.result === 'win').length;
    const losses = handHistory.filter((h) => h.result === 'loss').length;
    const pushes = handHistory.filter((h) => h.result === 'push').length;
    const totalHands = handHistory.length;
    const totalBet = handHistory.reduce((sum, h) => sum + h.bet, 0);
    const totalWinnings = handHistory.reduce((sum, hand) => {
      const baseBet = hand.bet;
      if (hand.result === 'win') {
        const blackjackWin = hand.playerBlackjack ? baseBet * 1.5 : baseBet;
        return sum + blackjackWin;
      }
      if (hand.result === 'loss') {
        return sum - baseBet;
      }
      return sum;
    }, 0);

    return {
      wins,
      losses,
      pushes,
      totalHands,
      totalBet,
      totalWinnings,
      winRate: totalHands > 0 ? wins / totalHands : 0,
    };
  }, [handHistory]);

  return {
    gameState,
    playerCards,
    dealerCards,
    otherPlayersCards,
    handHistory,
    currentBet,
    setCurrentBet,
    addCard,
    removeCard,
    undoLastCard,
    resetShoe,
    endHand,
    splitHand,
    splitHands,
    splitMode,
    switchToNextSplitHand,
    endSplitMode,
    addOtherPlayer,
    removeOtherPlayer,
    isPenetrationReached,
    getSessionStats,
    cardCounts,
  };
}

