import { Piece, GameState, PowerUpId } from "./types";

export const BOARD_SIZE = 8;

export function initializeBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  let pieceId = 1;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        if (row <= 2) {
          board[row][col] = { id: pieceId++, player: 2, isKing: false, row, col };
        } else if (row >= 5) {
          board[row][col] = { id: pieceId++, player: 1, isKing: false, row, col };
        }
      }
    }
  }

  return board;
}

export function createInitialGameState(p1Powerups: PowerUpId[], p2Powerups: PowerUpId[]): GameState {
  return {
    board: initializeBoard(),
    currentTurn: 1,
    selectedPiece: null,
    legalMoves: [],
    winner: null,
    p1PowerUps: p1Powerups.reduce((acc, id) => ({ ...acc, [id]: { remaining: 1 } }), {} as Record<PowerUpId, { remaining: number }>),
    p2PowerUps: p2Powerups.reduce((acc, id) => ({ ...acc, [id]: { remaining: 1 } }), {} as Record<PowerUpId, { remaining: number }>),
    activePowerUp: null,
    doubleMovePending: false,
    turnCount: 1,
    startTime: Date.now(),
    trapSquare: null,
    trapOwner: null,
    trapTurnsLeft: 0,
    mustContinueJump: null,
  };
}

export function isValidPosition(row: number, col: number) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getLegalMoves(board: (Piece | null)[][], player: 1 | 2, mustContinueJump?: { row: number; col: number } | null): { pieceRow: number; pieceCol: number; destRow: number; destCol: number; isCapture: boolean; captureSquare?: { row: number; col: number } }[] {
  let moves: { pieceRow: number; pieceCol: number; destRow: number; destCol: number; isCapture: boolean; captureSquare?: { row: number; col: number } }[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.player === player && !piece.isFrozen) {
        if (mustContinueJump && (row !== mustContinueJump.row || col !== mustContinueJump.col)) {
          continue;
        }

        const directions = piece.isKing ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : (player === 1 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]);

        for (const [dRow, dCol] of directions) {
          // Regular move
          const nRow = row + dRow;
          const nCol = col + dCol;
          if (isValidPosition(nRow, nCol) && !board[nRow][nCol]) {
            moves.push({ pieceRow: row, pieceCol: col, destRow: nRow, destCol: nCol, isCapture: false });
          }

          // Capture move
          const jRow = row + dRow * 2;
          const jCol = col + dCol * 2;
          if (isValidPosition(jRow, jCol) && isValidPosition(nRow, nCol)) {
            const jumped = board[nRow][nCol];
            if (jumped && jumped.player !== player && !jumped.isShielded && !board[jRow][jCol]) {
              moves.push({ pieceRow: row, pieceCol: col, destRow: jRow, destCol: jCol, isCapture: true, captureSquare: { row: nRow, col: nCol } });
            }
          }
        }
      }
    }
  }

  const hasCaptures = moves.some(m => m.isCapture);
  if (hasCaptures) {
    moves = moves.filter(m => m.isCapture);
  } else if (mustContinueJump) {
    return []; // If we must continue jump but no captures available, return empty
  }

  return moves;
}

export function checkWinCondition(board: (Piece | null)[][], currentTurn: 1 | 2): 1 | 2 | null {
  let p1Count = 0;
  let p2Count = 0;
  let p1CanMove = false;
  let p2CanMove = false;

  const p1Moves = getLegalMoves(board, 1);
  const p2Moves = getLegalMoves(board, 2);

  if (p1Moves.length > 0) p1CanMove = true;
  if (p2Moves.length > 0) p2CanMove = true;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]?.player === 1) p1Count++;
      if (board[r][c]?.player === 2) p2Count++;
    }
  }

  if (p1Count === 0 || !p1CanMove) return 2;
  if (p2Count === 0 || !p2CanMove) return 1;

  return null;
}
