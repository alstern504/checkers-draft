import { useState, useCallback, useEffect } from "react";
import { GameState, Piece, PowerUpId } from "@/lib/types";
import { createInitialGameState, getLegalMoves, checkWinCondition, BOARD_SIZE } from "@/lib/game";
import { useMatchHistory, useGameStats } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export function useCheckersGame(p1Powerups: PowerUpId[], p2Powerups: PowerUpId[], onGameOver: () => void) {
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialGameState(p1Powerups, p2Powerups)
  );
  
  const { history, setHistory } = useMatchHistory();
  const { stats, setStats } = useGameStats();
  const { toast } = useToast();

  const handleEndTurn = useCallback((nextState: GameState) => {
    let currentTurn = nextState.currentTurn;
    let doubleMovePending = nextState.doubleMovePending;
    let turnCount = nextState.turnCount;
    let trapTurnsLeft = nextState.trapTurnsLeft;
    let trapSquare = nextState.trapSquare;
    let trapOwner = nextState.trapOwner;
    const newBoard = nextState.board.map(row => row.map(p => p ? { ...p } : null));

    if (doubleMovePending) {
      doubleMovePending = false;
    } else {
      // Clear shielded/frozen for the NEXT player (they expire after one turn)
      // Actually, if I shielded my piece on my turn, it expires after the OPPONENT's turn.
      // So when the opponent's turn ends, my shield expires.
      // Let's clear shields and freezes that are active on the NEW player's pieces, because they were applied previously.
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const p = newBoard[r][c];
          if (p && p.player !== currentTurn) {
            p.isShielded = false;
          }
          if (p && p.player === currentTurn) { // if it's my turn now, my freeze wears off at end of this turn? Freeze prevents moving next turn.
            p.isFrozen = false;
          }
        }
      }

      currentTurn = currentTurn === 1 ? 2 : 1;
      turnCount++;

      if (trapTurnsLeft > 0) {
        trapTurnsLeft--;
        if (trapTurnsLeft === 0) {
          trapSquare = null;
          trapOwner = null;
        }
      }
    }

    const winner = checkWinCondition(newBoard, currentTurn);

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentTurn,
      doubleMovePending,
      turnCount,
      trapTurnsLeft,
      trapSquare,
      trapOwner,
      selectedPiece: null,
      legalMoves: [],
      mustContinueJump: null,
      winner
    }));

    if (winner) {
      handleGameOver(winner, turnCount, nextState.startTime, p1Powerups, p2Powerups);
    }
  }, []);

  const handleGameOver = (winner: 1 | 2, turns: number, startTime: number, p1Pups: PowerUpId[], p2Pups: PowerUpId[]) => {
    const duration = Date.now() - startTime;
    const winnerName = winner === 1 ? "Player 1" : "Player 2";
    
    setHistory([...history, {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      winner: winnerName,
      p1Powerups: p1Pups,
      p2Powerups: p2Pups,
      duration,
      turns
    }]);

    setStats({
      ...stats,
      totalGames: stats.totalGames + 1,
      p1Wins: stats.p1Wins + (winner === 1 ? 1 : 0),
      p2Wins: stats.p2Wins + (winner === 2 ? 1 : 0),
    });

    onGameOver();
  };

  const selectPiece = (row: number, col: number) => {
    if (gameState.winner) return;

    if (gameState.activePowerUp === 'shield') {
      const piece = gameState.board[row][col];
      if (piece && piece.player === gameState.currentTurn) {
        applyPowerUp('shield', { row, col });
      }
      return;
    }

    if (gameState.activePowerUp === 'freeze') {
      const piece = gameState.board[row][col];
      if (piece && piece.player !== gameState.currentTurn) {
        applyPowerUp('freeze', { row, col });
      }
      return;
    }

    if (gameState.activePowerUp === 'trap') {
      // trap handled separately in selectSquare
      return;
    }

    const piece = gameState.board[row][col];
    if (!piece || piece.player !== gameState.currentTurn || piece.isFrozen) {
      if (!gameState.mustContinueJump) {
         setGameState(prev => ({ ...prev, selectedPiece: null, legalMoves: [] }));
      }
      return;
    }

    if (gameState.mustContinueJump && (row !== gameState.mustContinueJump.row || col !== gameState.mustContinueJump.col)) {
      return; // Can't select other pieces during multi-jump
    }

    const moves = getLegalMoves(gameState.board, gameState.currentTurn, gameState.mustContinueJump);
    const pieceMoves = moves.filter(m => m.pieceRow === row && m.pieceCol === col);

    setGameState(prev => ({
      ...prev,
      selectedPiece: { row, col },
      legalMoves: pieceMoves
    }));
  };

  const selectSquare = (row: number, col: number) => {
    if (gameState.winner) return;

    if (gameState.activePowerUp === 'trap') {
      if (!gameState.board[row][col]) {
        applyPowerUp('trap', { row, col });
      }
      return;
    }

    if (!gameState.selectedPiece) return;

    const move = gameState.legalMoves.find(m => m.destRow === row && m.destCol === col);
    if (!move) {
      // Clicked invalid square, deselect if not forced
      if (!gameState.mustContinueJump) {
        setGameState(prev => ({ ...prev, selectedPiece: null, legalMoves: [] }));
      }
      return;
    }

    // Execute Move
    const newBoard = gameState.board.map(r => [...r]);
    const piece = newBoard[gameState.selectedPiece.row][gameState.selectedPiece.col]!;
    
    newBoard[gameState.selectedPiece.row][gameState.selectedPiece.col] = null;
    newBoard[row][col] = { ...piece, row, col };

    // King promotion
    let promoted = false;
    if (!piece.isKing && ((piece.player === 1 && row === 0) || (piece.player === 2 && row === BOARD_SIZE - 1))) {
      newBoard[row][col]!.isKing = true;
      promoted = true;
    }

    let nextState = { ...gameState, board: newBoard };

    if (move.isCapture && move.captureSquare) {
      newBoard[move.captureSquare.row][move.captureSquare.col] = null;
      
      // Check multi-jump
      const furtherMoves = getLegalMoves(newBoard, gameState.currentTurn, { row, col });
      if (furtherMoves.length > 0 && furtherMoves.some(m => m.isCapture) && !promoted) {
        setGameState({
          ...nextState,
          selectedPiece: { row, col },
          legalMoves: furtherMoves.filter(m => m.isCapture),
          mustContinueJump: { row, col }
        });
        return;
      }
    }

    // Trap trigger
    if (gameState.trapSquare && row === gameState.trapSquare.row && col === gameState.trapSquare.col) {
      if (piece.player !== gameState.trapOwner && !piece.isShielded) {
        newBoard[row][col] = null;
        toast({ title: "Trap Triggered!", description: "A piece was destroyed by a trap.", variant: "destructive" });
      }
      nextState.trapSquare = null;
      nextState.trapOwner = null;
    }

    handleEndTurn(nextState);
  };

  const activatePowerUp = (id: PowerUpId) => {
    if (gameState.activePowerUp === id) {
      setGameState(prev => ({ ...prev, activePowerUp: null }));
      return;
    }

    if (id === 'double-move') {
      applyPowerUp('double-move');
    } else if (id === 'hint') {
      applyPowerUp('hint');
    } else {
      // For shield, freeze, trap we wait for next click
      setGameState(prev => ({ ...prev, activePowerUp: id, selectedPiece: null, legalMoves: [] }));
    }
  };

  const applyPowerUp = (id: PowerUpId, target?: { row: number; col: number }) => {
    let nextState = { ...gameState };
    const powerUps = gameState.currentTurn === 1 ? nextState.p1PowerUps : nextState.p2PowerUps;
    
    if (!powerUps[id] || powerUps[id].remaining <= 0) return;
    powerUps[id].remaining--;

    nextState.activePowerUp = null;

    if (id === 'double-move') {
      nextState.doubleMovePending = true;
      toast({ title: "Double Move Activated", description: "You get an extra move this turn!" });
    } else if (id === 'hint') {
      const moves = getLegalMoves(gameState.board, gameState.currentTurn);
      if (moves.length > 0) {
        const bestMove = moves.find(m => m.isCapture) || moves[0];
        toast({ title: "Hint", description: `Try moving piece at row ${bestMove.pieceRow+1}, col ${bestMove.pieceCol+1}` });
      }
    } else if (id === 'shield' && target) {
      const newBoard = nextState.board.map(r => [...r]);
      const p = newBoard[target.row][target.col];
      if (p) {
        p.isShielded = true;
        nextState.board = newBoard;
      }
    } else if (id === 'freeze' && target) {
      const newBoard = nextState.board.map(r => [...r]);
      const p = newBoard[target.row][target.col];
      if (p) {
        p.isFrozen = true;
        nextState.board = newBoard;
      }
    } else if (id === 'trap' && target) {
      nextState.trapSquare = target;
      nextState.trapOwner = gameState.currentTurn;
      nextState.trapTurnsLeft = 3;
    }

    setGameState(nextState);
  };

  return {
    gameState,
    selectPiece,
    selectSquare,
    activatePowerUp
  };
}
