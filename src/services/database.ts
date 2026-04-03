import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { config } from '../config';

const dbPath = path.resolve(config.dbPath);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS km_entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id    TEXT NOT NULL,
    user_name   TEXT NOT NULL,
    user_id     TEXT,
    km          REAL NOT NULL,
    source      TEXT NOT NULL DEFAULT 'text',
    logged_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bid_entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id    TEXT NOT NULL,
    target_name TEXT NOT NULL,
    target_id   TEXT,
    reporter_id TEXT,
    logged_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_km_group_month
    ON km_entries (group_id, logged_at);

  CREATE INDEX IF NOT EXISTS idx_bid_group_month
    ON bid_entries (group_id, logged_at);
`);

// ── KM ──────────────────────────────────────────────────────────────────────

export function addKmEntry(
  groupId: string,
  userName: string,
  km: number,
  source: 'text' | 'ocr',
  userId?: string
): void {
  db.prepare(
    `INSERT INTO km_entries (group_id, user_name, user_id, km, source)
     VALUES (?, ?, ?, ?, ?)`
  ).run(groupId, userName, userId ?? null, km, source);
}

export interface KmLeaderboardRow {
  user_name: string;
  total_km: number;
  runs: number;
}

export function getKmLeaderboard(groupId: string): KmLeaderboardRow[] {
  return db.prepare(
    `SELECT user_name, ROUND(SUM(km), 2) as total_km, COUNT(*) as runs
     FROM km_entries
     WHERE group_id = ?
       AND strftime('%Y-%m', logged_at) = strftime('%Y-%m', 'now')
     GROUP BY user_name
     ORDER BY total_km DESC
     LIMIT 20`
  ).all(groupId) as KmLeaderboardRow[];
}

// ── BID ─────────────────────────────────────────────────────────────────────

export function addBidEntry(
  groupId: string,
  targetName: string,
  targetId: string,
  reporterId: string
): void {
  db.prepare(
    `INSERT INTO bid_entries (group_id, target_name, target_id, reporter_id)
     VALUES (?, ?, ?, ?)`
  ).run(groupId, targetName, targetId, reporterId);
}

export interface BidLeaderboardRow {
  target_name: string;
  bid_count: number;
}

/** Removes the most recent bid entry for a target in the current month. Returns true if one was deleted. */
export function removeBidEntry(groupId: string, targetId: string): boolean {
  const result = db.prepare(
    `DELETE FROM bid_entries
     WHERE id = (
       SELECT id FROM bid_entries
       WHERE group_id = ?
         AND target_id = ?
         AND strftime('%Y-%m', logged_at) = strftime('%Y-%m', 'now')
       ORDER BY logged_at DESC
       LIMIT 1
     )`
  ).run(groupId, targetId);
  return result.changes > 0;
}

export function getBidLeaderboard(groupId: string): BidLeaderboardRow[] {
  return db.prepare(
    `SELECT target_name, COUNT(*) as bid_count
     FROM bid_entries
     WHERE group_id = ?
       AND strftime('%Y-%m', logged_at) = strftime('%Y-%m', 'now')
     GROUP BY target_name
     ORDER BY bid_count DESC
     LIMIT 20`
  ).all(groupId) as BidLeaderboardRow[];
}

export function getBidLeaderboardAllTime(groupId: string): BidLeaderboardRow[] {
  return db.prepare(
    `SELECT target_name, COUNT(*) as bid_count
     FROM bid_entries
     WHERE group_id = ?
     GROUP BY target_name
     ORDER BY bid_count DESC
     LIMIT 20`
  ).all(groupId) as BidLeaderboardRow[];
}
