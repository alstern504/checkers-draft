# Checkers Draft

**Classic checkers, reimagined with strategic pre-match drafting.**

---

## The Problem

Traditional checkers is a solved game for most players. Once you learn the basic tactics, matches start to feel repetitive. There is no meta, no variance, and no reason to play differently from one game to the next. The game has depth, but nothing surfaces it.

---

## The Solution

Checkers Draft adds a **pre-match drafting phase** before every game. Each player spends a limited coin budget to choose power-ups that change how they play. No two matches feel the same. Every draft decision carries consequence, and every power-up creates a new layer of tension on the board.

---

## Key Features

- Full playable checkers with legal moves, forced captures, multi-jump chains, king promotion, and win detection
- Pre-game draft system — each player gets 100 coins to spend on power-ups before the match
- Five distinct power-ups, each with a different strategic role
- Single-player mode against an AI opponent with three difficulty levels (Easy, Medium, Hard)
- Local two-player mode on the same device
- Match history saved to LocalStorage — no account or backend required
- Win/loss tracking across sessions
- Dark and light mode with persistent preference
- Fully responsive, mobile-friendly layout

---

## How the Draft System Works

Before every match, each player goes through a drafting phase:

1. Each player receives **100 coins** as their budget
2. Players browse five available power-ups and select any combination they can afford
3. Selections are private — opponents do not see your choices until the game begins
4. Once both players confirm their draft, the game starts

Power-ups are one-time use per match. Managing when to use them is as important as choosing them.

### Power-Ups

| Power-Up | Cost | Effect |
|---|---|---|
| Shield | 30 | Protect one of your pieces from capture for one turn |
| Double Move | 50 | Take two moves in a single turn (non-capture moves only) |
| Hint | 20 | Highlights the strongest available move for three seconds |
| Freeze | 40 | Lock one opponent piece in place for their next turn |
| Trap | 40 | Place a hidden tile on any empty square — any opponent piece that lands there is removed |

### Example Draft Combinations

- **Aggressive (90 coins):** Double Move + Hint — push hard and get guidance when the board gets complex
- **Defensive (70 coins):** Shield + Freeze — protect a key piece and neutralize a threat
- **Control (80 coins):** Freeze + Trap — lock down movement and punish retreats

---

## Tech Stack

- **Framework:** React with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion
- **Routing:** Wouter
- **Persistence:** LocalStorage (no backend required)
- **AI:** Custom rule-based engine with board evaluation (no external APIs)

---

## Running Locally

**Prerequisites:** Node.js 18+ and pnpm

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm --filter @workspace/checkers-draft run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — mode selection, stats, recent match history |
| `/draft` | Draft screen — spend your 100 coins before the match |
| `/game` | Game board — play with power-up panel and turn controls |
| `/rules` | How to Play — full rules for checkers and the draft system |

---

## Future Improvements

- **Online multiplayer** — real-time matches against other players via WebSockets
- **Ranked system** — ELO-based matchmaking with seasonal ladders
- **Expanded power-up pool** — more options to increase draft variety
- **Improved AI** — minimax search with alpha-beta pruning for stronger Hard difficulty
- **Draft bans** — players can ban one power-up before the draft, adding a competitive meta layer
- **Cosmetics** — board themes, piece skins, unlockable win animations
- **Replay system** — review completed matches move by move

---

## Why Checkers Draft Is Different

Most checkers apps are faithful recreations of the original game. Checkers Draft treats the original as a foundation, not a ceiling.

The draft system introduces **asymmetric starting conditions** — each player enters the match with different tools. This means the game is never just about who plays the best checkers. It is also about who prepared better, who deploys their power-ups at the right moment, and who can adapt to an opponent's strategy mid-game.

This shifts Checkers Draft from a pure abstract strategy game into something closer to a **competitive card game layered on top of a board game** — familiar enough to pick up in seconds, deep enough to warrant genuine study.

---

## Note

I saw this opportunity very late in the process, so the implementation may not be fully polished in all areas, but the core concept and gameplay loop are complete.
