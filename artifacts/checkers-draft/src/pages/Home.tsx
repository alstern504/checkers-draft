import { Link, useLocation } from "wouter";
import { useGameStats, useMatchHistory } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useDraft } from "@/lib/DraftContext";
import { AIDifficulty } from "@/lib/ai";

export default function Home() {
  const { stats } = useGameStats();
  const { history } = useMatchHistory();
  const { gameMode, setGameMode, aiDifficulty, setAIDifficulty } = useDraft();
  const [, setLocation] = useLocation();

  const handleStart = () => {
    setLocation("/draft");
  };

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

        {/* Mode Selection */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="inline-flex rounded-xl border border-border bg-card/50 p-1 gap-1" data-testid="mode-selector">
            <button
              data-testid="mode-pvp"
              onClick={() => setGameMode("pvp")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                gameMode === "pvp"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Player vs Player
            </button>
            <button
              data-testid="mode-pve"
              onClick={() => setGameMode("pve")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                gameMode === "pve"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Player vs AI
            </button>
          </div>

          {gameMode === "pve" && (
            <div
              className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
              data-testid="difficulty-selector"
            >
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Difficulty:
              </span>
              {(["easy", "medium", "hard"] as AIDifficulty[]).map((d) => (
                <button
                  key={d}
                  data-testid={`difficulty-${d}`}
                  onClick={() => setAIDifficulty(d)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize border transition-all duration-200 ${
                    aiDifficulty === d
                      ? d === "easy"
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : d === "medium"
                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                        : "bg-red-500/20 border-red-500 text-red-400"
                      : "border-border/50 text-muted-foreground hover:border-border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={handleStart}
              data-testid="button-start-game"
            >
              {gameMode === "pve" ? "Play vs AI" : "Start New Game"}
            </Button>
            <Link href="/rules">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
                data-testid="link-rules"
              >
                How to Play
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground" data-testid="stat-total-games">
              {stats.totalGames}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Player 1 Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground" data-testid="stat-p1-wins">
              {stats.p1Wins}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Player 2 Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground" data-testid="stat-p2-wins">
              {stats.p2Wins}
            </div>
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
            {history
              .slice()
              .reverse()
              .slice(0, 5)
              .map((match, i) => (
                <Card
                  key={match.id || i}
                  className="bg-card/30 border-border/50"
                  data-testid={`card-match-${i}`}
                >
                  <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
                    <div>
                      <div className="font-semibold text-lg">
                        {match.winner} won
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(
                          new Date(match.date),
                          "MMM d, yyyy 'at' h:mm a"
                        )}{" "}
                        &bull; {match.turns} turns
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">P1 Draft:</span>{" "}
                        <span className="text-foreground font-medium">
                          {match.p1Powerups.join(", ") || "None"}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">P2 Draft:</span>{" "}
                        <span className="text-foreground font-medium">
                          {match.p2Powerups.join(", ") || "None"}
                        </span>
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
