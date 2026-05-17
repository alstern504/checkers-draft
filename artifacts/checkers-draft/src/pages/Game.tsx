import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useDraft } from "@/lib/DraftContext";
import { useCheckersGame } from "@/hooks/useCheckersGame";
import { Board } from "@/components/Board";
import { PowerUpPanel } from "@/components/PowerUpPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Game() {
  const [, setLocation] = useLocation();
  const { p1Powerups, p2Powerups } = useDraft();
  
  const [showWinner, setShowWinner] = useState(false);

  const { gameState, selectPiece, selectSquare, activatePowerUp } = useCheckersGame(
    p1Powerups,
    p2Powerups,
    () => setShowWinner(true)
  );

  // If directly navigated to /game without drafting, you might want to redirect.
  // But let's allow it for testing, defaulting to [] powerups if empty.

  return (
    <div className="container py-8 flex flex-col items-center max-w-6xl gap-8 animate-in fade-in duration-700">
      
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Match in Progress</h1>
        <div className="flex gap-4">
          <Link href="/draft">
            <Button variant="outline" size="sm">Restart Draft</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Quit</Button>
          </Link>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Player 1 Panel */}
        <div className="w-full lg:w-auto flex-1 flex justify-end">
          <PowerUpPanel 
            player={1} 
            gameState={gameState} 
            onActivate={activatePowerUp} 
          />
        </div>

        {/* Board */}
        <div className="w-full lg:w-auto flex-none">
          <div className="mb-4 text-center">
            <span className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
              Turn {gameState.turnCount}
            </span>
            {gameState.doubleMovePending && (
              <div className="text-primary font-bold animate-pulse mt-1">Double Move Active!</div>
            )}
          </div>
          <Board 
            gameState={gameState}
            onSelectPiece={selectPiece}
            onSelectSquare={selectSquare}
          />
        </div>

        {/* Player 2 Panel */}
        <div className="w-full lg:w-auto flex-1 flex justify-start">
          <PowerUpPanel 
            player={2} 
            gameState={gameState} 
            onActivate={activatePowerUp} 
          />
        </div>

      </div>

      {/* Winner Dialog */}
      <Dialog open={showWinner} onOpenChange={setShowWinner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center pb-2">Game Over!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-2xl mb-2">
              <span className="font-bold text-primary">Player {gameState.winner}</span> wins!
            </div>
            <p className="text-muted-foreground">
              Match completed in {gameState.turnCount} turns.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-2">
            <Link href="/draft">
              <Button size="lg" className="w-full">Play Again</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full">Home</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}