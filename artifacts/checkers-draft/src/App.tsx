import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DraftProvider } from "@/lib/DraftContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Home from "@/pages/Home";
import Draft from "@/pages/Draft";
import Game from "@/pages/Game";
import Rules from "@/pages/Rules";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-xl text-primary hover:opacity-80 transition-opacity">
            Checkers Draft
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/draft" className="transition-colors hover:text-primary">Play</Link>
            <Link href="/rules" className="transition-colors hover:text-primary">Rules</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/draft" component={Draft} />
        <Route path="/game" component={Game} />
        <Route path="/rules" component={Rules} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="checkers-draft:theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DraftProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </DraftProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;