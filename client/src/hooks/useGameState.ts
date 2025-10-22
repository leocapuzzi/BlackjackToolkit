import { useState, useCallback } from 'react';
import {
  GameState,
  calculateGameState,
  updateGameState,
  TOTAL_CARDS,
  PENETRATION_THRESHOLD,
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
  const [otherPlayersCards, setOtherPlayersCards] = useState<string[][]>([]);
  const [handHistory, setHandHistory] = useState<HandResult[]>([]);
  const [currentBet, setCurrentBet] = useState<number>(5);
  const [cardHistory, setCardHistory] = useState<string[]>([]);
  const [splitHands, setSplitHands] = useState<SplitHand[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [splitMode, setSplitMode] = useState<'none' | 'split1' | 'split2'>('none');
  const [originalSplitCards, setOriginalSplitCards] = useState<string[]>([]);

  // Add a card to the game state
  const addCard = useCallback(
    (card: string, owner: 'player' | 'dealer' | 'other', otherPlayerIndex?: number) => {
      const newState = updateGameState(gameState, [card], false);
      setGameState(newState);
      setCardHistory((prev) => [...prev, card]);
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
          const index = updated[otherPlayerIndex].lastIndexOf(card);
          if (index > -1) {
            updated[otherPlayerIndex] = updated[otherPlayerIndex].filter((_, i) => i !== index);
          }
          return updated;
        });
      }

      // Remove from card history
      setCardHistory((prev) => {
        const index = prev.lastIndexOf(card);
        if (index > -1) {
          return prev.filter((_, i) => i !== index);
        }
        return prev;
      });
    },
    [gameState, splitMode]
  );

  // Undo the last card
  const undoLastCard = useCallback(() => {
    if (cardHistory.length === 0) return;

    const lastCard = cardHistory[cardHistory.length - 1];
    
    if (splitMode === 'split1' && splitHands[0]?.cards.length > 0) {
      removeCard(lastCard, 'player');
    } else if (splitMode === 'split2' && splitHands[1]?.cards.length > 0) {
      removeCard(lastCard, 'player');
    } else if (splitMode === 'none' && playerCards.length > 0) {
      removeCard(lastCard, 'player');
    } else if (dealerCards.length > 0) {
      removeCard(lastCard, 'dealer');
    } else if (otherPlayersCards.length > 0) {
      removeCard(lastCard, 'other', otherPlayersCards.length - 1);
    }
  }, [cardHistory, removeCard, splitMode, splitHands, playerCards, dealerCards, otherPlayersCards]);

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
    setOtherPlayersCards([]);
    setCardHistory([]);
    setHandHistory([]);
    setSplitHands([]);
    setCardCounts({});
    setSplitMode('none');
    setOriginalSplitCards([]);
  }, []);

  // End the hand and record result
  const endHand = useCallback(
    (result: 'win' | 'loss' | 'push') => {
      const handResult: HandResult = {
        id: `hand-${Date.now()}`,
        playerCards: splitMode === 'none' ? [...playerCards] : [...originalSplitCards],
        dealerCards: [...dealerCards],
        otherPlayersCards: [...otherPlayersCards],
        result,
        bet: currentBet,
        timestamp: Date.now(),
        trueCount: gameState.trueCount,
      };

      setHandHistory((prev) => [...prev, handResult]);

      // Reset for next hand
      setPlayerCards([]);
      setDealerCards([]);
      setOtherPlayersCards([]);
      setCardHistory([]);
      setSplitHands([]);
      setSplitMode('none');
      setOriginalSplitCards([]);
    },
    [playerCards, dealerCards, otherPlayersCards, currentBet, gameState.trueCount, splitMode, originalSplitCards]
  );

  // Add other player
  const addOtherPlayer = useCallback(() => {
    setOtherPlayersCards((prev) => [...prev, []]);
  }, []);

  // Remove other player
  const removeOtherPlayer = useCallback((index: number) => {
    setOtherPlayersCards((prev) => prev.filter((_, i) => i !== index));
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
    const totalWinnings = wins * 10 - losses * 10; // Simplified

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

