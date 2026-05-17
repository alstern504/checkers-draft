export type PowerUpId = "shield" | "double-move" | "hint" | "freeze" | "trap";

export type PowerUp = {
  id: PowerUpId;
  name: string;
  cost: number;
  description: string;
  maxPurchasable: number;
};

export const POWER_UPS: Record<PowerUpId, PowerUp> = {
  shield: { id: "shield", name: "Shield", cost: 30, description: "Protect a piece from capture for one turn.", maxPurchasable: 1 },
  "double-move": { id: "double-move", name: "Double Move", cost: 50, description: "Take two regular moves in one turn.", maxPurchasable: 1 },
  hint: { id: "hint", name: "Hint", cost: 20, description: "Highlight the best legal move available.", maxPurchasable: 1 },
  freeze: { id: "freeze", name: "Freeze", cost: 40, description: "Prevent an opponent's piece from moving next turn.", maxPurchasable: 1 },
  trap: { id: "trap", name: "Trap", cost: 40, description: "Place a hidden trap on a square. Instantly destroys any opponent piece that lands there.", maxPurchasable: 1 },
};

export type PlayerDraft = {
  playerId: 1 | 2;
  budget: number;
  selectedPowerUps: PowerUpId[];
};

export type Piece = {
  id: number;
  player: 1 | 2;
  isKing: boolean;
  row: number;
  col: number;
  isShielded?: boolean;
  isFrozen?: boolean;
};

export type GameState = {
  board: (Piece | null)[][];
  currentTurn: 1 | 2;
  selectedPiece: { row: number; col: number } | null;
  legalMoves: { pieceRow: number; pieceCol: number; destRow: number; destCol: number; isCapture: boolean; captureSquare?: { row: number; col: number } }[];
  winner: 1 | 2 | null;
  p1PowerUps: Record<PowerUpId, { remaining: number }>;
  p2PowerUps: Record<PowerUpId, { remaining: number }>;
  activePowerUp: PowerUpId | null;
  doubleMovePending: boolean;
  turnCount: number;
  startTime: number;
  trapSquare: { row: number; col: number } | null; // For simplicity, only 1 trap at a time
  trapOwner: 1 | 2 | null;
  trapTurnsLeft: number;
  mustContinueJump: { row: number; col: number } | null;
};

export type MatchHistoryEntry = {
  id: string;
  date: string;
  winner: "Player 1" | "Player 2" | "Draw";
  p1Powerups: PowerUpId[];
  p2Powerups: PowerUpId[];
  duration: number;
  turns: number;
};

export type GameStats = {
  totalGames: number;
  p1Wins: number;
  p2Wins: number;
  draws: number;
};
