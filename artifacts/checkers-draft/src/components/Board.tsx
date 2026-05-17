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
      if (isLegalMove) highlightClass = "bg-emerald-200/70 cursor-pointer animate-pulse";
      else if (isSelected) highlightClass = "bg-amber-200/60";
      else if (gameState.activePowerUp === 'trap' && isDark && !piece) highlightClass = "bg-rose-200/70 cursor-pointer hover:bg-rose-300/80";
      else if (isTrap) highlightClass = "ring-2 ring-inset ring-rose-300/80";

      squares.push(
        <div
          key={`${row}-${col}`}
          className={`relative aspect-square ${isDark ? "bg-violet-200/90" : "bg-orange-50"} ${highlightClass}`}
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
               <svg className="w-1/2 h-1/2 text-rose-400/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
             </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto lg:max-w-none lg:w-[min(36rem,calc(100vh-14rem))] lg:shrink-0">
      <div className="grid grid-cols-8 grid-rows-8 aspect-square w-full border-4 border-violet-300/70 rounded-sm shadow-lg shadow-violet-200/30 bg-orange-100 overflow-hidden relative">
        {squares}
        
        {/* Active power-up targeting overlay */}
        {(gameState.activePowerUp === 'shield' || gameState.activePowerUp === 'freeze') && (
           <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center bg-violet-100/30 backdrop-blur-[1px]">
             <div className="bg-orange-50/95 px-4 py-2 rounded-full border border-violet-300/60 text-violet-800 font-medium tracking-wide shadow-lg animate-pulse">
               Select target piece for {gameState.activePowerUp.toUpperCase()}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
