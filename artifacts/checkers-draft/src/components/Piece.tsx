import { motion } from "framer-motion";
import { Piece as PieceType } from "@/lib/types";

interface PieceProps {
  piece: PieceType;
  isSelected: boolean;
  onClick: () => void;
}

export function Piece({ piece, isSelected, onClick }: PieceProps) {
  const isPlayer1 = piece.player === 1;

  return (
    <motion.div
      layout
      initial={false}
      className={`
        absolute inset-1 rounded-full cursor-pointer
        flex items-center justify-center border-2
        ${isPlayer1
          ? "bg-rose-300 border-rose-400/90 shadow-[inset_0_-3px_0_rgba(190,90,90,0.35)]"
          : "bg-sky-400 border-sky-500/90 shadow-[inset_0_-3px_0_rgba(70,130,190,0.35)]"}
        ${isSelected ? "ring-4 ring-amber-300 ring-offset-2 ring-offset-orange-50" : ""}
        ${piece.isShielded ? "ring-4 ring-blue-300/80 shadow-[0_0_12px_rgba(147,197,253,0.6)]" : ""}
        ${piece.isFrozen ? "opacity-80 saturate-75 border-cyan-300 bg-cyan-200/80" : ""}
        transition-all duration-200 z-10
      `}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`absolute inset-[15%] rounded-full border-2 opacity-40 pointer-events-none ${isPlayer1 ? "border-rose-500/40" : "border-sky-600/40"}`} />
      {piece.isKing && (
        <div className={`pointer-events-none drop-shadow-sm ${isPlayer1 ? "text-rose-800/75" : "text-sky-900/75"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21h14"/><path d="M4 17l2-10 4 4 2-6 2 6 4-4 2 10Z"/></svg>
        </div>
      )}

      {piece.isFrozen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="text-cyan-600 w-8 h-8 opacity-70" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 20-3-3 3-3"/><path d="m14 20 3-3-3-3"/><path d="M12 22V2"/><path d="m20 10-3-3 3-3"/><path d="m4 10 3-3-3-3"/><path d="M22 12H2"/></svg>
        </div>
      )}
    </motion.div>
  );
}
