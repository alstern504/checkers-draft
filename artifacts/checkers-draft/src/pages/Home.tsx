import { Link } from "wouter";
import { useGameStats, useMatchHistory } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function Home() {
  const { stats } = useGameStats();
  const { history } = useMatchHistory();

  const winRate = stats.totalGames > 0 ? Math.round((stats.p1Wins / stats.totalGames) * 100) : 0;

  return (
    <div className="container max-w-4xl py-12 space-y-12">
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary">
          CHECKERS DRAFT
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A competitive checkers game where your opening strategy matters. 
          Draft your power-ups and outsmart your opponent.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/draft">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">Start New Game</Button>
          </Link>
          <Link href="/rules">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">How to Play</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{stats.totalGames}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Player 1 Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{stats.p1Wins}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Player 2 Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{stats.p2Wins}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Recent Matches</h2>
        {history.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-dashed border-border bg-card/20 text-muted-foreground">
            No matches played yet. Start a game to see history here!
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 5).map((match, i) => (
              <Card key={match.id || i} className="bg-card/30 border-border/50">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
                  <div>
                    <div className="font-semibold text-lg">{match.winner} won</div>
                    <div className="text-sm text-muted-foreground">{format(new Date(match.date), "MMM d, yyyy 'at' h:mm a")} • {match.turns} turns</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">P1 Draft:</span>{" "}
                      <span className="text-foreground font-medium">{match.p1Powerups.join(", ") || "None"}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">P2 Draft:</span>{" "}
                      <span className="text-foreground font-medium">{match.p2Powerups.join(", ") || "None"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}