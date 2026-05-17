import { GameState, PowerUpId, POWER_UPS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PowerUpPanelProps {
  player: 1 | 2;
  gameState: GameState;
  onActivate: (id: PowerUpId) => void;
}

export function PowerUpPanel({ player, gameState, onActivate }: PowerUpPanelProps) {
  const isCurrentTurn = gameState.currentTurn === player;
  const powerUpsState = player === 1 ? gameState.p1PowerUps : gameState.p2PowerUps;
  
  const powerUpIds = Object.keys(powerUpsState) as PowerUpId[];
  const hasPowerUps = powerUpIds.length > 0;

  // Calculate pieces
  let piecesLeft = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (gameState.board[r][c]?.player === player) {
        piecesLeft++;
      }
    }
  }

  return (
    <Card className={`w-full max-w-sm transition-colors duration-300 ${isCurrentTurn ? "border-primary shadow-[0_0_20px_rgba(255,180,0,0.15)]" : "border-border/50 opacity-80"}`}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          Player {player} 
          {isCurrentTurn && <Badge variant="default" className="animate-pulse">Active Turn</Badge>}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className={`w-3 h-3 rounded-full ${player === 1 ? "bg-red-600" : "bg-zinc-700"}`} />
          {piecesLeft} pieces
        </div>
      </CardHeader>
      <CardContent>
        {hasPowerUps ? (
          <div className="grid grid-cols-2 gap-2">
            {powerUpIds.map(id => {
              const pu = POWER_UPS[id];
              const remaining = powerUpsState[id].remaining;
              const isUsed = remaining <= 0;
              const isActive = gameState.activePowerUp === id && isCurrentTurn;

              return (
                <Button
                  key={id}
                  variant={isActive ? "default" : isUsed ? "secondary" : "outline"}
                  className={`w-full justify-start ${isUsed ? "opacity-50" : ""}`}
                  disabled={!isCurrentTurn || isUsed}
                  onClick={() => onActivate(id)}
                >
                  <span className="truncate">{pu.name}</span>
                  {!isUsed && <Badge variant="secondary" className="ml-auto text-xs px-1">1</Badge>}
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic text-center py-4">
            No power-ups drafted.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
