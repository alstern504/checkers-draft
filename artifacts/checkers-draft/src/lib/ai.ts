import { GameState, PowerUpId } from "./types";
import { getLegalMoves, BOARD_SIZE } from "./game";

export type AIDifficulty = "easy" | "medium" | "hard";

type Move = {
  pieceRow: number;
  pieceCol: number;
  destRow: number;
  destCol: number;
  isCapture: boolean;
  captureSquare?: { row: number; col: number };
};

type Piece = NonNullable<GameState["board"][0][0]>;

function evaluateBoard(board: (Piece | null)[][]): number {
  let score = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (!p) continue;
      const val = p.isKing ? 3 : 1;
      const advancement =
        p.player === 2
          ? r / (BOARD_SIZE - 1)
          : (BOARD_SIZE - 1 - r) / (BOARD_SIZE - 1);
      const pieceScore = val + advancement * 0.3;
      if (p.player === 2) score += pieceScore;
      else score -= pieceScore;
    }
  }
  return score;
}

function countCaptureChain(
  board: (Piece | null)[][],
  row: number,
  col: number,
  player: 1 | 2,
  depth = 0
): number {
  if (depth > 8) return 0;
  const moves = getLegalMoves(board, player, { row, col });
  const captures = moves.filter((m) => m.isCapture);
  if (captures.length === 0) return 0;
  let max = 0;
  for (const cap of captures) {
    const nb = board.map((r) => [...r]);
    const piece = nb[row][col]!;
    nb[row][col] = null;
    nb[cap.destRow][cap.destCol] = {
      ...piece,
      row: cap.destRow,
      col: cap.destCol,
    };
    if (cap.captureSquare)
      nb[cap.captureSquare.row][cap.captureSquare.col] = null;
    const n =
      1 + countCaptureChain(nb, cap.destRow, cap.destCol, player, depth + 1);
    if (n > max) max = n;
  }
  return max;
}

function isSquareSafe(
  board: (Piece | null)[][],
  row: number,
  col: number,
  aiPlayer: 1 | 2
): boolean {
  const opponent = aiPlayer === 2 ? 1 : 2;
  const oppMoves = getLegalMoves(board, opponent);
  return !oppMoves.some(
    (m) => m.isCapture && m.destRow === row && m.destCol === col
  );
}

function applyMove(board: (Piece | null)[][], move: Move): (Piece | null)[][] {
  const nb = board.map((r) => [...r]);
  const piece = nb[move.pieceRow][move.pieceCol]!;
  nb[move.pieceRow][move.pieceCol] = null;
  const isKing =
    piece.isKing ||
    (piece.player === 1 && move.destRow === 0) ||
    (piece.player === 2 && move.destRow === BOARD_SIZE - 1);
  nb[move.destRow][move.destCol] = {
    ...piece,
    row: move.destRow,
    col: move.destCol,
    isKing,
  };
  if (move.isCapture && move.captureSquare) {
    nb[move.captureSquare.row][move.captureSquare.col] = null;
  }
  return nb;
}

function scoreMove(
  board: (Piece | null)[][],
  move: Move,
  aiPlayer: 1 | 2,
  difficulty: AIDifficulty
): number {
  let score = 0;
  const piece = board[move.pieceRow][move.pieceCol]!;
  const nb = applyMove(board, move);

  if (difficulty === "medium" || difficulty === "hard") {
    if (move.isCapture) {
      score += 10;
      const chain = countCaptureChain(nb, move.destRow, move.destCol, aiPlayer);
      score += chain * 8;
    }

    const promotionRow = aiPlayer === 2 ? BOARD_SIZE - 1 : 0;
    if (!piece.isKing && move.destRow === promotionRow) {
      score += 15;
    }

    const advancement =
      aiPlayer === 2
        ? move.destRow - move.pieceRow
        : move.pieceRow - move.destRow;
    score += advancement * 0.5;
  }

  if (difficulty === "hard") {
    if (!isSquareSafe(nb, move.destRow, move.destCol, aiPlayer)) {
      score -= 8;
    }

    score += evaluateBoard(nb) * 0.5;

    const backRow = aiPlayer === 2 ? 0 : BOARD_SIZE - 1;
    if (move.pieceRow === backRow && !piece.isKing) {
      score -= 3;
    }

    const centerDist =
      Math.abs(move.destCol - 3.5) + Math.abs(move.destRow - 3.5);
    score += (7 - centerDist) * 0.2;
  }

  return score;
}

export function getAIMove(
  gameState: GameState,
  difficulty: AIDifficulty,
  aiPlayer: 1 | 2 = 2
): Move | null {
  const moves = getLegalMoves(
    gameState.board,
    aiPlayer,
    gameState.mustContinueJump
  );
  if (moves.length === 0) return null;

  if (difficulty === "easy") {
    const captures = moves.filter((m) => m.isCapture);
    if (captures.length > 0 && Math.random() < 0.55) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const jitter = difficulty === "medium" ? 2.5 : 0.4;
  const scored = moves.map((move) => ({
    move,
    score:
      scoreMove(gameState.board, move, aiPlayer, difficulty) +
      Math.random() * jitter,
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0].move;
}

export function getAIDraft(difficulty: AIDifficulty): PowerUpId[] {
  if (difficulty === "easy") return [];
  if (difficulty === "medium") return ["hint", "freeze"] as PowerUpId[];
  return ["freeze", "double-move"] as PowerUpId[];
}
