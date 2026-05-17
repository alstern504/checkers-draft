import { useState } from "react";
import { useLocation } from "wouter";
import { useDraft } from "@/lib/DraftContext";
import { POWER_UPS, PowerUpId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const BUDGET = 100;

export default function Draft() {
  const [, setLocation] = useLocation();
  const { setP1Powerups, setP2Powerups } = useDraft();
  
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<PowerUpId[]>([]);

  const totalCost = selected.reduce((sum, id) => sum + POWER_UPS[id].cost, 0);
  const remaining = BUDGET - totalCost;

  const togglePowerUp = (id: PowerUpId) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      if (POWER_UPS[id].cost <= remaining) {
        setSelected([...selected, id]);
      }
    }
  };

  const confirmDraft = () => {
    if (currentPlayer === 1) {
      setP1Powerups(selected);
      setSelected([]);
      setCurrentPlayer(2);
    } else {
      setP2Powerups(selected);
      setLocation("/game");
    }
  };

  return (
    <div className="container max-w-4xl py-12 flex flex-col items-center">
      <div className="w-full text-center space-y-4 mb-10 animate-in fade-in slide-in-from-top-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Player {currentPlayer}'s Draft
        </h1>
        <p className="text-muted-foreground">
          Select your power-ups. You have a budget of <span className="font-mono text-primary">{BUDGET}</span> coins.
        </p>
      </div>

      <div className="w-full bg-card border border-border p-4 rounded-xl flex items-center justify-between mb-8 sticky top-4 z-10 shadow-lg">
        <div className="text-lg font-medium">Remaining Budget</div>
        <div className={`text-3xl font-mono font-bold ${remaining === 0 ? "text-destructive" : "text-primary"}`}>
          {remaining}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {Object.values(POWER_UPS).map((pu) => {
          const isSelected = selected.includes(pu.id);
          const canAfford = pu.cost <= remaining;
          const disabled = !isSelected && !canAfford;

          return (
            <Card 
              key={pu.id}
              className={`cursor-pointer transition-all duration-200 border-2 ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'} ${disabled ? 'opacity-50 grayscale' : ''}`}
              onClick={() => { if (!disabled) togglePowerUp(pu.id); }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">{pu.name}</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg font-bold text-primary">{pu.cost}</div>
                  <Checkbox 
                    checked={isSelected} 
                    onCheckedChange={() => { if (!disabled) togglePowerUp(pu.id); }}
                    className="h-6 w-6"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-foreground/80">{pu.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 w-full flex justify-end">
        <Button size="lg" className="w-full sm:w-auto px-12 py-6 text-lg" onClick={confirmDraft}>
          {currentPlayer === 1 ? "Confirm Player 1 Draft" : "Start Game"}
        </Button>
      </div>
    </div>
  );
}