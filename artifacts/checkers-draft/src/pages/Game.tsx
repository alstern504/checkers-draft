import { useState } from "react";
import { Link } from "wouter";
import { useDraft } from "@/lib/DraftContext";
import { useCheckersGame } from "@/hooks/useCheckersGame";
import { Board } from "@/components/Board";
import { PowerUpPanel } from "@/components/PowerUpPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function Game() {
  const { p1Powerups, p2Powerups, gameMode, aiDifficulty } = useDraft();
  const isAIGame = gameMode === "pve";

  const [showWinner, setShowWinner] = useState(false);

  const { gameState, selectPiece, selectSquare, activatePowerUp, isAIThinking } =
    useCheckersGame(p1Powerups, p2Powerups, () => setShowWinner(true), isAIGame, aiDifficulty);

  const difficultyColor =
    aiDifficulty === "easy"
      ? "bg-green-500/20 text-green-400 border-green-500/40"
      : aiDifficulty === "medium"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
      : "bg-red-500/20 text-red-400 border-red-500/40";

  const winnerLabel =
    gameState.winner === 1
      ? "Player 1"
      : isAIGame
      ? "AI"
      : "Player 2";

  return (
    <div className="container py-8 flex flex-col items-center max-w-6xl gap-8 animate-in fade-in duration-700">

      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Match in Progress
          </h1>
          {isAIGame && (
            <Badge
              className={`text-xs font-semibold border capitalize ${difficultyColor}`}
              data-testid="badge-game-mode"
            >
              vs AI &bull; {aiDifficulty}
            </Badge>
          )}
        </div>
        <div className="flex gap-4">
          <Link href="/draft">
            <Button variant="outline" size="sm" data-testid="button-restart-draft">
              Restart Draft
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-quit">
              Quit
            </Button>
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
          <div className="mb-4 text-center space-y-1">
            <span className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
              Turn {gameState.turnCount}
            </span>
            <div className="flex items-center justify-center gap-2 h-6">
              {gameState.doubleMovePending && (
                <div
                  className="text-primary font-bold animate-pulse text-sm"
                  data-testid="status-double-move"
                >
                  Double Move Active!
                </div>
              )}
              {isAIThinking && (
                <div
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  data-testid="status-ai-thinking"
                >
                  <span className="inline-flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                  </span>
                  AI is thinking...
                </div>
              )}
              {!isAIThinking && !gameState.doubleMovePending && (
                <div className="text-sm text-muted-foreground" data-testid="status-turn">
                  {gameState.currentTurn === 1
                    ? "Player 1's turn"
                    : isAIGame
                    ? "AI's turn"
                    : "Player 2's turn"}
                </div>
              )}
            </div>
          </div>
          <Board
            gameState={gameState}
            onSelectPiece={selectPiece}
            onSelectSquare={selectSquare}
          />
        </div>

        {/* Player 2 / AI Panel */}
        <div className="w-full lg:w-auto flex-1 flex justify-start">
          <PowerUpPanel
            player={2}
            gameState={gameState}
            onActivate={isAIGame ? () => {} : activatePowerUp}
            label={isAIGame ? "AI" : undefined}
            disabled={isAIGame}
          />
        </div>

      </div>

      {/* Winner Dialog */}
      <Dialog open={showWinner} onOpenChange={setShowWinner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center pb-2">
              Game Over!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-2xl mb-2">
              <span className="font-bold text-primary">{winnerLabel}</span> wins!
            </div>
            <p className="text-muted-foreground">
              Match completed in {gameState.turnCount} turns.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-2">
            <Link href="/draft">
              <Button size="lg" className="w-full" data-testid="button-play-again">
                Play Again
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full" data-testid="button-home">
                Home
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
