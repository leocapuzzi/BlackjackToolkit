/**
 * Zen Count System for Blackjack Card Counting
 * 8-deck shoe with 50% penetration
 */

// Card values in Zen Count system
export const ZEN_COUNT_VALUES: Record<string, number> = {
  '2': 1,
  '3': 1,
  '4': 2,
  '5': 2,
  '6': 2,
  '7': 1,
  '8': 0,
  '9': -1,
  '10': -2,
  'J': -2,
  'Q': -2,
  'K': -2,
  'A': -1,
};

export const CARD_NAMES: Record<string, string> = {
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  'J': 'J',
  'Q': 'Q',
  'K': 'K',
  'A': 'A',
};

// Card colors based on count impact
export const CARD_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  '2': { bg: 'bg-green-500', text: 'text-white', label: 'Good' },
  '3': { bg: 'bg-green-500', text: 'text-white', label: 'Good' },
  '4': { bg: 'bg-green-600', text: 'text-white', label: 'Excellent' },
  '5': { bg: 'bg-green-600', text: 'text-white', label: 'Excellent' },
  '6': { bg: 'bg-green-600', text: 'text-white', label: 'Excellent' },
  '7': { bg: 'bg-green-500', text: 'text-white', label: 'Good' },
  '8': { bg: 'bg-orange-500', text: 'text-white', label: 'Neutral' },
  '9': { bg: 'bg-red-500', text: 'text-white', label: 'Bad' },
  '10': { bg: 'bg-red-600', text: 'text-white', label: 'Very Bad' },
  'J': { bg: 'bg-red-600', text: 'text-white', label: 'Very Bad' },
  'Q': { bg: 'bg-red-600', text: 'text-white', label: 'Very Bad' },
  'K': { bg: 'bg-red-600', text: 'text-white', label: 'Very Bad' },
  'A': { bg: 'bg-red-500', text: 'text-white', label: 'Bad' },
};

export const NUM_DECKS = 8;
export const CARDS_PER_DECK = 52;
export const TOTAL_CARDS = NUM_DECKS * CARDS_PER_DECK;
export const PENETRATION_THRESHOLD = 0.5; // 50% penetration

// Calculate true count from running count
export function calculateTrueCount(runningCount: number, cardsRemaining: number): number {
  if (cardsRemaining <= 0) return 0;
  const decksRemaining = cardsRemaining / CARDS_PER_DECK;
  return Math.round((runningCount / decksRemaining) * 100) / 100;
}

// Calculate deck penetration (percentage of cards used)
export function calculatePenetration(cardsUsed: number): number {
  return cardsUsed / TOTAL_CARDS;
}

// Calculate remaining cards
export function calculateCardsRemaining(cardsUsed: number): number {
  return TOTAL_CARDS - cardsUsed;
}

// Determine if player has edge (positive true count)
export function hasPlayerEdge(trueCount: number): boolean {
  return trueCount > 0;
}

// Calculate expected value (simplified)
export function calculateEV(trueCount: number, baseWinRate: number = 0.5): number {
  // Simplified EV calculation: base win rate adjusted by true count
  // Each point of true count adds approximately 0.5% to player advantage
  return baseWinRate + (trueCount * 0.005);
}

// Suggest bet based on true count (Kelly Criterion simplified)
// Bet values in Brazilian Real
export const BET_VALUES = [5, 10, 15, 20, 25, 50, 100, 200, 500];

export function suggestBet(trueCount: number): number {
  if (trueCount <= 0) return 5; // Minimum bet
  if (trueCount < 1) return 5;
  if (trueCount < 2) return 10;
  if (trueCount < 3) return 25;
  if (trueCount < 4) return 50;
  if (trueCount < 5) return 100;
  return 500; // Maximum bet
}

// Basic strategy matrix (simplified)
// Hard totals
const HARD_STRATEGY: Record<number, Record<string, string>> = {
  5: { '2': 'H', '3': 'H', '4': 'H', '5': 'H', '6': 'H', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  6: { '2': 'H', '3': 'H', '4': 'H', '5': 'H', '6': 'H', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  7: { '2': 'H', '3': 'H', '4': 'H', '5': 'H', '6': 'H', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  8: { '2': 'H', '3': 'H', '4': 'H', '5': 'H', '6': 'H', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  9: { '2': 'H', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  10: { '2': 'D', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'D', '8': 'D', '9': 'D', '10': 'H', 'A': 'H' },
  11: { '2': 'D', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'D', '8': 'D', '9': 'D', '10': 'D', 'A': 'D' },
  12: { '2': 'H', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  13: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  14: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  15: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  16: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  17: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', 'A': 'S' },
  18: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', 'A': 'S' },
  19: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', 'A': 'S' },
  20: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', 'A': 'S' },
  21: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', 'A': 'S' },
};

// Soft totals (with Ace)
const SOFT_STRATEGY: Record<number, Record<string, string>> = {
  13: { '2': 'H', '3': 'H', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  14: { '2': 'H', '3': 'H', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  15: { '2': 'H', '3': 'H', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  16: { '2': 'H', '3': 'H', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  17: { '2': 'H', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  18: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'H', 'A': 'S' },
  19: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', 'A': 'S' },
  20: { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', 'A': 'S' },
};

// Pair splitting strategy
const PAIR_STRATEGY: Record<string, Record<string, string>> = {
  'AA': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'P', '9': 'P', '10': 'P', 'A': 'P' },
  '22': { '2': 'H', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  '33': { '2': 'H', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  '44': { '2': 'H', '3': 'H', '4': 'H', '5': 'P', '6': 'P', '7': 'H', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  '55': { '2': 'D', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'D', '8': 'D', '9': 'D', '10': 'H', 'A': 'H' },
  '66': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  '77': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'H', '9': 'H', '10': 'H', 'A': 'H' },
  '88': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'P', '9': 'P', '10': 'P', 'A': 'P' },
  '99': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'S', '8': 'P', '9': 'P', '10': 'S', 'A': 'S' },
  'TT': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', 'A': 'S' },
};

export interface StrategyAdvice {
  action: string;
  label: string;
  description: string;
  reasoning: string;
}

export function getBasicStrategy(playerHand: string[], dealerCard: string, trueCount: number = 0): StrategyAdvice {
  const advice = getBasicStrategyAction(playerHand, dealerCard);
  const reasoning = getStrategyReasoning(playerHand, dealerCard, advice, trueCount);
  
  return {
    action: advice,
    label: getActionLabel(advice),
    description: getActionDescription(advice),
    reasoning,
  };
}

function getBasicStrategyAction(playerHand: string[], dealerCard: string): string {
  // Normalize dealer card
  let dealerValue = dealerCard;
  if (dealerCard === 'T' || dealerCard === 'J' || dealerCard === 'Q' || dealerCard === 'K') {
    dealerValue = '10';
  }

  // Check for pair
  if (playerHand.length === 2 && playerHand[0] === playerHand[1]) {
    const pairKey = playerHand[0] + playerHand[1];
    const normalizedPair = normalizeCardForPair(playerHand[0]) + normalizeCardForPair(playerHand[1]);
    if (PAIR_STRATEGY[normalizedPair]) {
      return PAIR_STRATEGY[normalizedPair][dealerValue] || 'H';
    }
  }

  // Calculate hand value
  const { value, isSoft } = calculateHandValue(playerHand);

  // Use appropriate strategy table
  const strategyTable = isSoft ? SOFT_STRATEGY : HARD_STRATEGY;
  
  if (strategyTable[value]) {
    return strategyTable[value][dealerValue] || 'H';
  }

  // Default to hit if value not found
  return 'H';
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    'H': 'HIT',
    'S': 'STAND',
    'D': 'DOUBLE DOWN',
    'P': 'SPLIT',
    'I': 'INSURANCE',
  };
  return labels[action] || 'HIT';
}

function getActionDescription(action: string): string {
  const descriptions: Record<string, string> = {
    'H': 'Take another card',
    'S': 'Keep your hand',
    'D': 'Double your bet and take one card',
    'P': 'Split your pair into two hands',
    'I': 'Take insurance against dealer blackjack',
  };
  return descriptions[action] || 'Take another card';
}

function getStrategyReasoning(playerHand: string[], dealerCard: string, action: string, trueCount: number): string {
  const { value, isSoft } = calculateHandValue(playerHand);
  const dealerValue = dealerCard === '10' || dealerCard === 'J' || dealerCard === 'Q' || dealerCard === 'K' ? '10' : dealerCard;
  
  // Insurance logic
  if (dealerCard === 'A' && trueCount > 3) {
    return `Dealer showing Ace with high count (TC: ${trueCount.toFixed(2)}). Insurance is favorable when TC > 3.`;
  }
  
  // Hard hands
  if (!isSoft) {
    if (value <= 8) {
      return `Hand value ${value} is too weak. Always hit.`;
    }
    if (value === 9) {
      return `9 vs ${dealerValue}: Double down against weak dealer cards (2-6).`;
    }
    if (value === 10) {
      return `10 vs ${dealerValue}: Double down against all dealer cards except 10 or Ace.`;
    }
    if (value === 11) {
      return `11 vs ${dealerValue}: Always double down (best doubling opportunity).`;
    }
    if (value === 12) {
      return `12 vs ${dealerValue}: Stand against weak dealer (4-6), hit otherwise.`;
    }
    if (value >= 13 && value <= 16) {
      return `${value} vs ${dealerValue}: Stand against weak dealer (2-6), hit against strong dealer (7+).`;
    }
    if (value >= 17) {
      return `${value} is strong. Always stand.`;
    }
  }
  
  // Soft hands
  if (isSoft) {
    if (value <= 17) {
      return `Soft ${value}: Always hit to improve hand (Ace can become 1).`;
    }
    if (value === 18) {
      return `Soft 18: Stand against weak dealer (2-8), hit against strong (9+).`;
    }
    if (value >= 19) {
      return `Soft ${value} is strong. Always stand.`;
    }
  }
  
  return 'Follow basic strategy.';
}

function normalizeCardForPair(card: string): string {
  if (card === 'T' || card === 'J' || card === 'Q' || card === 'K') return 'T';
  return card;
}

export function calculateHandValue(cards: string[]): { value: number; isSoft: boolean } {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if (card === 'A') {
      aces++;
      value += 11;
    } else if (card === 'K' || card === 'Q' || card === 'J' || card === 'T') {
      value += 10;
    } else {
      value += parseInt(card, 10);
    }
  }

  // Adjust for aces if busting
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return {
    value,
    isSoft: aces > 0 && value <= 21,
  };
}

export interface GameState {
  runningCount: number;
  cardsUsed: number;
  cardsRemaining: number;
  trueCount: number;
  penetration: number;
  playerEdge: boolean;
  ev: number;
  suggestedBet: number;
}

export function calculateGameState(): GameState {
  return {
    runningCount: 0,
    cardsUsed: 0,
    cardsRemaining: TOTAL_CARDS,
    trueCount: 0,
    penetration: 0,
    playerEdge: false,
    ev: 0.5,
    suggestedBet: 10,
  };
}

export function updateGameState(
  state: GameState,
  cards: string[],
  removeCards: boolean = false
): GameState {
  const multiplier = removeCards ? -1 : 1;
  
  let runningCount = state.runningCount;
  let cardsUsed = state.cardsUsed;

  for (const card of cards) {
    runningCount += ZEN_COUNT_VALUES[card] * multiplier;
    cardsUsed += multiplier;
  }

  const cardsRemaining = calculateCardsRemaining(cardsUsed);
  const trueCount = calculateTrueCount(runningCount, cardsRemaining);
  const penetration = calculatePenetration(cardsUsed);
  const playerEdge = hasPlayerEdge(trueCount);
  const ev = calculateEV(trueCount);
  const suggestedBet = suggestBet(trueCount);

  return {
    runningCount,
    cardsUsed,
    cardsRemaining,
    trueCount,
    penetration,
    playerEdge,
    ev,
    suggestedBet,
  };
}



// Probability analysis functions
export interface CardProbability {
  card: string;
  probability: number;
  count: number;
  remaining: number;
}

export function analyzeCardProbabilities(cardCounts: Record<string, number>): CardProbability[] {
  const totalCardsInDeck = 4 * NUM_DECKS; // 4 of each card per deck
  const probabilities: CardProbability[] = [];

  const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  for (const card of CARDS) {
    const seen = cardCounts[card] || 0;
    const remaining = totalCardsInDeck - seen;
    const totalRemaining = Object.values(cardCounts).reduce((sum, count) => sum + count, 0);
    const cardsLeft = TOTAL_CARDS - totalRemaining;
    
    probabilities.push({
      card,
      probability: cardsLeft > 0 ? remaining / cardsLeft : 0,
      count: seen,
      remaining,
    });
  }

  return probabilities.sort((a, b) => b.probability - a.probability);
}

export function checkHighProbabilityAlert(cardCounts: Record<string, number>, trueCount: number): string | null {
  const probs = analyzeCardProbabilities(cardCounts);
  
  // Check for high probability of 7 (side bet opportunity)
  const sevenProb = probs.find(p => p.card === '7');
  if (sevenProb && sevenProb.probability > 0.15 && trueCount > 1) {
    return `High probability of 7 (${(sevenProb.probability * 100).toFixed(1)}%) - Consider side bets!`;
  }

  // Check for high probability of dealer bust (10-value cards)
  const tenProb = probs.find(p => p.card === '10');
  const faceProbs = ['J', 'Q', 'K'].map(c => probs.find(p => p.card === c)?.probability || 0);
  const totalTenProb = (tenProb?.probability || 0) + faceProbs.reduce((a, b) => a + b, 0) / 3;
  
  if (totalTenProb > 0.35 && trueCount > 2) {
    return `High probability of dealer bust (${(totalTenProb * 100).toFixed(1)}%) - Increase bet!`;
  }

  return null;
}

export function calculateDealerBustProbability(dealerCard: string, cardCounts: Record<string, number>): number {
  // Simplified dealer bust probability based on dealer upcard
  const dealerValue = dealerCard === 'A' ? 11 : 
                     (dealerCard === 'K' || dealerCard === 'Q' || dealerCard === 'J' ? 10 : 
                      parseInt(dealerCard, 10));

  if (dealerValue >= 7) return 0.25; // Strong dealer hand
  if (dealerValue === 6) return 0.42; // Weak dealer hand
  if (dealerValue === 5) return 0.37;
  if (dealerValue === 4) return 0.40;
  if (dealerValue === 3) return 0.37;
  if (dealerValue === 2) return 0.35;
  
  return 0.25; // Ace or 10-value
}

export function calculateSevenProbability(cardCounts: Record<string, number>): number {
  const totalCardsInDeck = 4 * NUM_DECKS;
  const sevensSeen = cardCounts['7'] || 0;
  const sevensRemaining = totalCardsInDeck - sevensSeen;
  const totalCardsSeen = Object.values(cardCounts).reduce((sum, count) => sum + count, 0);
  const cardsRemaining = TOTAL_CARDS - totalCardsSeen;
  
  return cardsRemaining > 0 ? sevensRemaining / cardsRemaining : 0;
}

