import { motion } from "framer-motion";
import { Piece as PieceType } from "@/lib/types";

interface PieceProps {
  piece: PieceType;
  isSelected: boolean;
  onClick: () => void;
}

export function Piece({ piece, isSelected, onClick }: PieceProps) {
  return (
    <motion.div
      layout
      initial={false}
      className={`
        absolute inset-1 rounded-full cursor-pointer
        flex items-center justify-center
        ${piece.player === 1 ? "bg-red-600 shadow-[inset_0_-4px_0_rgba(0,0,0,0.4)]" : "bg-zinc-800 shadow-[inset_0_-4px_0_rgba(0,0,0,0.6)]"}
        ${isSelected ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""}
        ${piece.isShielded ? "ring-4 ring-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.5)]" : ""}
        ${piece.isFrozen ? "opacity-70 saturate-50 mix-blend-luminosity border-2 border-cyan-200 bg-cyan-900/50" : ""}
        transition-all duration-200 z-10
      `}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-[15%] rounded-full border-2 border-black/20 opacity-50 pointer-events-none" />
      {piece.isKing && (
        <div className="text-white/80 pointer-events-none drop-shadow-md">
          <svg xmlns="http://www.000.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21h14"/><path d="M4 17l2-10 4 4 2-6 2 6 4-4 2 10Z"/></svg>
        </div>
      )}
      
      {piece.isFrozen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="text-cyan-200 w-8 h-8 opacity-60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 20-3-3 3-3"/><path d="m14 20 3-3-3-3"/><path d="M12 22V2"/><path d="m20 10-3-3 3-3"/><path d="m4 10 3-3-3-3"/><path d="M22 12H2"/></svg>
        </div>
      )}
    </motion.div>
  );
}
