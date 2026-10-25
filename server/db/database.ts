import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { config } from '../config';

// Ensure data directory exists
const dbPath = path.resolve(process.cwd(), config.databaseUrl);
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database instance
export const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for performance and data integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  // Read and apply migration SQL
  const migrationPath = path.resolve(process.cwd(), 'server/db/migrations.sql');
  if (fs.existsSync(migrationPath)) {
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    db.exec(migrationSql);
  }

  // Ensure default admin user exists
  ensureAdminUser();
}

function ensureAdminUser() {
  const checkStmt = db.prepare('SELECT id FROM users WHERE username = ?');
  const existing = checkStmt.get(config.adminUsername);

  if (!existing) {
    const hash = bcrypt.hashSync(config.adminPassword, 10);
    const insertStmt = db.prepare(`
      INSERT INTO users (id, username, password_hash, role, created_at)
      VALUES (?, ?, ?, 'admin', ?)
    `);
    insertStmt.run(`usr-${Date.now()}`, config.adminUsername, hash, new Date().toISOString());
    console.log(`[DB] Created default admin user: "${config.adminUsername}"`);
  }
}
