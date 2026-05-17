import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { POWER_UPS } from "@/lib/types";

export default function Rules() {
  return (
    <div className="container max-w-3xl py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">How to Play</h1>
        <p className="text-xl text-muted-foreground">
          Checkers Draft combines classic Checkers with modern power-ups.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">The Draft</h2>
        <p className="text-foreground/80 leading-relaxed">
          Before every match, both players get a budget of <strong>100 coins</strong>. 
          Players take turns secretly selecting power-ups to bring into the match. 
          You can only purchase one of each power-up type.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.values(POWER_UPS).map(pu => (
            <Card key={pu.id} className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  {pu.name} <span className="text-primary font-mono">{pu.cost}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{pu.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Basic Checkers Rules</h2>
        <ul className="space-y-4 text-foreground/80 list-disc list-inside pl-4 leading-relaxed">
          <li><strong>Movement:</strong> Pieces only move diagonally forward on dark squares.</li>
          <li><strong>Capturing:</strong> If you can jump over an opponent's piece to an empty square, you <strong>must</strong> do so. The captured piece is removed.</li>
          <li><strong>Multi-jumps:</strong> If another jump is available from your landing square with the same piece, you must continue the jump.</li>
          <li><strong>Kings:</strong> Reaching the opposite end of the board turns a piece into a King. Kings can move and jump diagonally backwards as well as forwards.</li>
          <li><strong>Winning:</strong> You win if the opponent has no pieces left, or if they have no legal moves available on their turn.</li>
        </ul>
      </section>

    </div>
  );
}