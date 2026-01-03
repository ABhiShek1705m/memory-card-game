# Memory Card Game

This repository contains a memory game where players have to turn matching cards by flipping the cards the lowest number of times. This is built on a **Next.js App Router frontend** and an **Express + SQLite backend** for persisting highscores.

## Project Overview

- **Next.js frontend** (located under `client/src/app`) renders the home screen, game board, and leaderboard using React hooks, client components, and shared styles. `CardGrid` handles shuffling cards, tracking turns, detecting wins, and posting results to the backend when a session finishes.
- **Leaderboard page** (`/leaderboard`) fetches `/highscores` from the backend and renders a dynamic table with one row per persisted score, showing player name, score, and timestamp.
- **Express + SQLite backend** (in `backend/src`) exposes `/save-score` and `/highscores`. Scores are stored in `memory_game.db`, and the routes enforce one record per player by updating only when a new result beats the existing best.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 App Router, React hooks, client/server components, Tailwind-inspired utility classes |
| Backend | Express.js, SQLite (via `sqlite3`), helper wrappers in `sql.js` |
| Data | `player_highscores` table with player name, score, and formatted timestamp |

## Local Development

1. **Install dependencies**
	```bash
	cd client
	npm install
	cd ../backend
	npm install
	```
2. **Start the backend** (runs on port 3001)
	```bash
	npm start
	```
3. **Start the Next.js frontend**
	```bash
	cd ../client
	npm run dev
	```
4. **Play the game**
	- Go to `http://localhost:3000`.
	- Finishing a game or using DevMode triggers `PUT /save-score` to store the turn count for the current player.
	- Open `/leaderboard` to view the ranked results pulled from SQLite.

## Notes

- Set `NEXT_PUBLIC_BACKEND_URL` when the frontend needs to call a deployed backend.
- The backend formats timestamps as `Date(YYYY/MM/DD) - Time(HH:MM:SS)` before saving them.
