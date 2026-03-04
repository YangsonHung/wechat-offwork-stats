import mysql, { type RowDataPacket } from "mysql2/promise";
import type { CheckoutEntry } from "../shared/types.js";

type CheckoutEntryRow = RowDataPacket & {
  id: string;
  stat_date: string | Date;
  off_work_at: string;
  off_work_minutes_extended: number;
  submitted_at: string;
  client_id: string;
  alias_code: string;
  ip_hash: string;
  user_agent_hash: string;
  source: "manual_web";
  timezone: "Asia/Shanghai";
};

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "offwork_stats",
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let schemaReady: Promise<void> | null = null;

async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS checkout_entries (
          id VARCHAR(36) PRIMARY KEY,
          stat_date DATE NOT NULL,
          off_work_at VARCHAR(40) NOT NULL,
          off_work_minutes_extended INT NOT NULL,
          submitted_at VARCHAR(40) NOT NULL,
          client_id VARCHAR(64) NOT NULL,
          alias_code VARCHAR(20) NOT NULL,
          ip_hash VARCHAR(64) NOT NULL,
          user_agent_hash VARCHAR(64) NOT NULL,
          source VARCHAR(20) NOT NULL,
          timezone VARCHAR(32) NOT NULL,
          KEY idx_stat_date (stat_date),
          KEY idx_client_stat_date (client_id, stat_date),
          KEY idx_submitted_at (submitted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
      `);
    })();
  }

  await schemaReady;
}

export async function initializeStore(): Promise<void> {
  await ensureSchema();
}

function mapRowToEntry(row: CheckoutEntryRow): CheckoutEntry {
  return {
    id: row.id,
    statDate: String(row.stat_date).slice(0, 10),
    offWorkAt: row.off_work_at,
    offWorkMinutesExtended: row.off_work_minutes_extended,
    submittedAt: row.submitted_at,
    clientId: row.client_id,
    aliasCode: row.alias_code,
    ipHash: row.ip_hash,
    userAgentHash: row.user_agent_hash,
    source: row.source,
    timezone: row.timezone,
  };
}

async function queryEntries(whereClause = "", values: unknown[] = []): Promise<CheckoutEntry[]> {
  await ensureSchema();
  const [rows] = await pool.query<CheckoutEntryRow[]>(
    `
      SELECT
        id,
        stat_date,
        off_work_at,
        off_work_minutes_extended,
        submitted_at,
        client_id,
        alias_code,
        ip_hash,
        user_agent_hash,
        source,
        timezone
      FROM checkout_entries
      ${whereClause}
      ORDER BY submitted_at ASC
    `,
    values
  );

  return rows.map(mapRowToEntry);
}

export async function readEntriesByStatDate(statDate: string): Promise<CheckoutEntry[]> {
  return queryEntries("WHERE stat_date = ?", [statDate]);
}

export async function readEntriesByClientAndStatDate(
  clientId: string,
  statDate: string
): Promise<CheckoutEntry[]> {
  return queryEntries("WHERE client_id = ? AND stat_date = ?", [clientId, statDate]);
}

export async function readEntriesByStatDates(statDates: string[]): Promise<CheckoutEntry[]> {
  if (statDates.length === 0) {
    return [];
  }

  const placeholders = statDates.map(() => "?").join(", ");
  return queryEntries(`WHERE stat_date IN (${placeholders})`, statDates);
}

export async function insertEntry(entry: CheckoutEntry): Promise<void> {
  await ensureSchema();

  await pool.execute(
    `
      INSERT INTO checkout_entries (
        id,
        stat_date,
        off_work_at,
        off_work_minutes_extended,
        submitted_at,
        client_id,
        alias_code,
        ip_hash,
        user_agent_hash,
        source,
        timezone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      entry.id,
      entry.statDate,
      entry.offWorkAt,
      entry.offWorkMinutesExtended,
      entry.submittedAt,
      entry.clientId,
      entry.aliasCode,
      entry.ipHash,
      entry.userAgentHash,
      entry.source,
      entry.timezone,
    ]
  );
}
