/**
 * Migrasi data dari file JSON lama (data/*.json) ke Supabase.
 *
 * Jalankan: npm run migrate
 *
 * Idempotent — memakai upsert, jadi aman dijalankan berulang.
 * Password plaintext akan di-hash bcrypt sebelum disimpan.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  upsertUsers,
  insertAuditLogs,
  upsertStats,
  type ServerUser,
  type UserAuditLog,
  type VisitorStats,
} from '../db';

const SALT_ROUNDS = 10;
const DATA_DIR = path.join(process.cwd(), 'data');

function readJson<T>(file: string): T | null {
  const full = path.join(DATA_DIR, file);
  try {
    if (!fs.existsSync(full)) return null;
    return JSON.parse(fs.readFileSync(full, 'utf-8')) as T;
  } catch (err) {
    console.error(`Gagal membaca ${file}:`, err);
    return null;
  }
}

function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$/.test(value);
}

async function migrateUsers() {
  const users = readJson<ServerUser[]>('users.json');
  if (!users || !Array.isArray(users) || users.length === 0) {
    console.log('• users.json kosong / tidak ada — dilewati.');
    return;
  }
  const prepared: ServerUser[] = [];
  for (const u of users) {
    const password = isBcryptHash(u.password) ? u.password : await bcrypt.hash(String(u.password), SALT_ROUNDS);
    prepared.push({ ...u, password });
  }
  await upsertUsers(prepared);
  console.log(`✓ ${prepared.length} user berhasil dimigrasi (password ter-hash).`);
}

async function migrateAuditLogs() {
  const logs = readJson<UserAuditLog[]>('user-audit-logs.json');
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    console.log('• user-audit-logs.json kosong / tidak ada — dilewati.');
    return;
  }
  await insertAuditLogs(logs);
  console.log(`✓ ${logs.length} audit log berhasil dimigrasi.`);
}

async function migrateStats() {
  const stats = readJson<VisitorStats>('visitor-stats.json');
  if (!stats) {
    console.log('• visitor-stats.json tidak ada — dilewati.');
    return;
  }
  await upsertStats({
    totalVisits: stats.totalVisits ?? 0,
    uniqueVisitorIds: Array.isArray(stats.uniqueVisitorIds) ? stats.uniqueVisitorIds : [],
    todayDate: stats.todayDate ?? new Date().toISOString().slice(0, 10),
    todayVisits: stats.todayVisits ?? 0,
    lastUpdated: stats.lastUpdated ?? new Date().toISOString(),
  });
  console.log('✓ Statistik pengunjung berhasil dimigrasi.');
}

async function main() {
  console.log('Memulai migrasi data ke Supabase...\n');
  await migrateUsers();
  await migrateAuditLogs();
  await migrateStats();
  console.log('\nMigrasi selesai. 🎉');
}

main().catch(err => {
  console.error('\nMigrasi gagal:', err);
  process.exit(1);
});
