import { GameState, PowerUpId } from "@/lib/types";
import { BOARD_SIZE } from "@/lib/game";
import { Piece } from "./Piece";
import { motion, AnimatePresence } from "framer-motion";

interface BoardProps {
  gameState: GameState;
  onSelectPiece: (row: number, col: number) => void;
  onSelectSquare: (row: number, col: number) => void;
}

export function Board({ gameState, onSelectPiece, onSelectSquare }: BoardProps) {
  const isDarkSquare = (row: number, col: number) => (row + col) % 2 === 1;

  const squares = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = gameState.board[row][col];
      const isDark = isDarkSquare(row, col);
      const isLegalMove = gameState.legalMoves.some(m => m.destRow === row && m.destCol === col);
      const isSelected = gameState.selectedPiece?.row === row && gameState.selectedPiece?.col === col;
      
      const isTrap = gameState.trapSquare?.row === row && gameState.trapSquare?.col === col;
      
      let highlightClass = "";
      if (isLegalMove) highlightClass = "bg-primary/40 cursor-pointer animate-pulse";
      else if (isSelected) highlightClass = "bg-primary/20";
      else if (gameState.activePowerUp === 'trap' && isDark && !piece) highlightClass = "bg-destructive/30 cursor-pointer hover:bg-destructive/50";
      else if (isTrap) highlightClass = "ring-2 ring-inset ring-destructive/50";

      squares.push(
        <div
          key={`${row}-${col}`}
          className={`relative aspect-square ${isDark ? "bg-amber-900/40" : "bg-amber-100/10"} ${highlightClass}`}
          onClick={() => onSelectSquare(row, col)}
        >
          {/* Coordinates overlay for debugging/hint */}
          {/* <div className="absolute inset-0 p-1 text-[8px] text-white/20 pointer-events-none">{row},{col}</div> */}
          
          <AnimatePresence>
            {piece && (
              <Piece
                key={piece.id}
                piece={piece}
                isSelected={isSelected}
                onClick={() => onSelectPiece(row, col)}
              />
            )}
          </AnimatePresence>

          {isTrap && gameState.trapOwner === gameState.currentTurn && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
               <svg className="w-1/2 h-1/2 text-destructive/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
             </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-8 grid-rows-8 border-4 border-amber-900/60 rounded-sm shadow-2xl bg-black overflow-hidden relative">
        {squares}
        
        {/* Active power-up targeting overlay */}
        {(gameState.activePowerUp === 'shield' || gameState.activePowerUp === 'freeze') && (
           <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center bg-background/20 backdrop-blur-[1px]">
             <div className="bg-background/80 px-4 py-2 rounded-full border border-primary/50 text-primary font-medium tracking-wide shadow-xl animate-pulse">
               Select target piece for {gameState.activePowerUp.toUpperCase()}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
