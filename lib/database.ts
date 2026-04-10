import * as SQLite from 'expo-sqlite';
import { toLocalDateStr } from './utils';

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  // Prevent concurrent open calls — reuse the same pending promise
  if (!dbPromise) {
    dbPromise = (async () => {
      const instance = await SQLite.openDatabaseAsync('semillita.db');
      await initDatabase(instance);
      db = instance;
      return instance;
    })();
  }
  return dbPromise;
}

async function initDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      categories TEXT NOT NULL,
      note TEXT,
      plant_type TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL REFERENCES entries(id),
      plant_type TEXT NOT NULL,
      position_x REAL NOT NULL,
      position_y REAL NOT NULL,
      planted_at TEXT NOT NULL,
      stage TEXT NOT NULL DEFAULT 'seed'
    );

    CREATE TABLE IF NOT EXISTS unlocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      unlocked_at TEXT NOT NULL,
      source TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
    CREATE INDEX IF NOT EXISTS idx_plants_entry_id ON plants(entry_id);
  `);
}

// ─── KV Store ──────────────────────────────────────────────

export async function kvGet(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM kv_store WHERE key = ?',
    [key]
  );
  return row?.value ?? null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)',
    [key, value]
  );
}

export async function kvGetBool(key: string): Promise<boolean> {
  const val = await kvGet(key);
  return val === 'true';
}

export async function kvSetBool(key: string, value: boolean): Promise<void> {
  await kvSet(key, value ? 'true' : 'false');
}

// ─── Entries ───────────────────────────────────────────────

export interface EntryRow {
  id: number;
  date: string;
  categories: string; // JSON array
  note: string | null;
  plant_type: string;
  created_at: string;
}

export async function createEntry(
  date: string,
  categories: string[],
  plantType: string,
  note?: string
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO entries (date, categories, note, plant_type) VALUES (?, ?, ?, ?)',
    [date, JSON.stringify(categories), note ?? null, plantType]
  );
  return result.lastInsertRowId;
}

export async function getEntryByDate(date: string): Promise<EntryRow | null> {
  const db = await getDatabase();
  return db.getFirstAsync<EntryRow>(
    'SELECT * FROM entries WHERE date = ?',
    [date]
  );
}

export async function getEntriesForMonth(yearMonth: string): Promise<EntryRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<EntryRow>(
    "SELECT * FROM entries WHERE date >= ? AND date < ? ORDER BY date ASC",
    [`${yearMonth}-01`, `${yearMonth}-32`]
  );
}

export async function getEntryCount(): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM entries'
  );
  return row?.count ?? 0;
}

// ─── Plants ────────────────────────────────────────────────

export interface PlantRow {
  id: number;
  entry_id: number;
  plant_type: string;
  position_x: number;
  position_y: number;
  planted_at: string;
  stage: string;
}

export async function createPlant(
  entryId: number,
  plantType: string,
  posX: number,
  posY: number
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO plants (entry_id, plant_type, position_x, position_y, planted_at) VALUES (?, ?, ?, ?, datetime("now"))',
    [entryId, plantType, posX, posY]
  );
  return result.lastInsertRowId;
}

export async function getAllPlants(): Promise<PlantRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<PlantRow>('SELECT * FROM plants ORDER BY planted_at ASC');
}

// ─── Streaks ───────────────────────────────────────────────

/** Subtract N days from a YYYY-MM-DD string without allocating Date objects */
function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - days);
  return toLocalDateStr(d);
}

export async function getCurrentStreak(): Promise<number> {
  const db = await getDatabase();
  const entries = await db.getAllAsync<{ date: string }>(
    'SELECT date FROM entries ORDER BY date DESC LIMIT 365'
  );

  if (entries.length === 0) return 0;

  let streak = 0;
  const todayStr = toLocalDateStr(new Date());
  let offset = 0;

  // If today's entry is missing, start checking from yesterday
  if (entries[0].date !== todayStr) {
    const yesterdayStr = subtractDays(todayStr, 1);
    if (entries[0].date === yesterdayStr) {
      offset = 1;
    } else {
      return 0;
    }
  }

  for (let i = 0; i < entries.length; i++) {
    const expectedStr = subtractDays(todayStr, i + offset);
    if (entries[i].date === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
