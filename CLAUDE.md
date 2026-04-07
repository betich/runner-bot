# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run build      # compile TypeScript → dist/
bun run start      # run compiled output (production)
bun run dev        # run src/index.ts directly with hot reload
./deploy.sh        # rsync + build + restart on Pi (default host: rpi)
./deploy.sh --setup  # first-time: also installs the systemd service on Pi
```

The project runs under **Bun** (not Node). `bun:sqlite` is used for the database — it's a Bun built-in and won't work if the process is run with `node`.

## Architecture

Express webhook server that handles LINE Messaging API events. Entry point is `src/index.ts`, which starts the server and initialises the Tesseract OCR worker in the background.

**Event routing** (`src/webhook.ts`) — all events filtered to group/room sources only. Text messages are dispatched by regex priority:
1. Self-bid (`ผมบิด` / `หนูบิด` / `ฉันบิด`) and @mention bid
2. KM text logging (`name +5.2`)
3. Leaderboard commands (`/km`, `วิ่ง`, `/บิด`, `นักบิด`, `นักบิดตัวยง`)
4. Image messages go directly to the OCR handler

**Handlers** (`src/handlers/`) — one file per feature. `bidHandler.ts` exports two functions: `selfBidHandler` (self-report, skeptical tone) and `bidHandler` (reported by others, disappointed/encouraging tone). The reason feature parses any text after `บิด`/`บิดคับ`.

**Database** (`src/services/database.ts`) — `bun:sqlite`, two tables: `km_entries` and `bid_entries`. Month scoping is done inline with `strftime('%Y-%m', logged_at) = strftime('%Y-%m', 'now')`.

**OCR** (`src/services/ocr.ts`) — Tesseract.js with `eng`+`tha` languages. `extractDistanceKm` uses three strategies: inline `number + unit`, unit on adjacent line, then single-number fallback. Unit pattern covers `km`, `กม`, `กม.`, `ก.ม.`, `ก.ม`. If km cannot be extracted, the handler returns silently (no reply).

**Messages** (`src/messages/randomMessages.ts`) — all bot reply strings live here as typed arrays of functions. `pickRandom` selects one at call time. Bid messages are split into `BID_SELF_MESSAGES` and `BID_REPORTED_MESSAGES`.

## Environment

Required env vars (`.env` at project root, loaded by `dotenv`):
```
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
PORT=3000          # optional, default 3000
DB_PATH=./data/bot.db  # optional
```

## Deployment

Target is a Raspberry Pi (host alias `rpi`). Bun is installed via nvm on the Pi at `~/.nvm/versions/node/<version>/bin/bun`. The deploy script resolves the path dynamically via a login shell.

The bot runs as a systemd template service `line-runner-bot@<user>.service`. After `--setup`, use `sudo systemctl restart line-runner-bot@betich` to restart manually, or just re-run `./deploy.sh`.

Logs: `ssh rpi 'journalctl -u line-runner-bot@betich -f'`

## Type notes

`@line/bot-sdk` v9 uses a dual-type world — import types from `@line/bot-sdk` directly (not sub-paths) to avoid TS errors. `bun:sqlite` types come from a local `src/bun-sqlite.d.ts` declaration file (no `@types/bun` dependency needed).
