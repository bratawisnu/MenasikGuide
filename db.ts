import { createClient } from '@supabase/supabase-js';

// =================== Shared Server Data Types ===================

export interface ServerUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'jamaah';
  status: 'approved' | 'pending' | 'suspended' | 'rejected';
  phone?: string;
  kloterOrAgency?: string;
  createdAt: string;
  lastLogin?: string;
  suspendReason?: string;
  notes?: string;
}

export interface UserAuditLog {
  id: string;
  action: string;
  targetUserId: string;
  targetUserName: string;
  performedBy: string;
  details?: string;
  timestamp: string;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitorIds: string[];
  todayDate: string;
  todayVisits: number;
  lastUpdated: string;
}

// =================== Supabase Client ===================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env. ' +
    'Lihat .env.example dan supabase/schema.sql untuk setup.'
  );
}

// service_role key mem-bypass RLS. HANYA dipakai di server, tidak pernah ke browser.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// =================== Row <-> Domain Mappers ===================

/* eslint-disable @typescript-eslint/no-explicit-any */

function rowToUser(r: any): ServerUser {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    password: r.password,
    role: r.role,
    status: r.status,
    phone: r.phone ?? undefined,
    kloterOrAgency: r.kloter_or_agency ?? undefined,
    createdAt: r.created_at,
    lastLogin: r.last_login ?? undefined,
    suspendReason: r.suspend_reason ?? undefined,
    notes: r.notes ?? undefined,
  };
}

function userToRow(u: ServerUser): Record<string, any> {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    status: u.status,
    phone: u.phone ?? null,
    kloter_or_agency: u.kloterOrAgency ?? null,
    created_at: u.createdAt,
    last_login: u.lastLogin ?? null,
    suspend_reason: u.suspendReason ?? null,
    notes: u.notes ?? null,
  };
}

function rowToLog(r: any): UserAuditLog {
  return {
    id: r.id,
    action: r.action,
    targetUserId: r.target_user_id,
    targetUserName: r.target_user_name,
    performedBy: r.performed_by,
    details: r.details ?? undefined,
    timestamp: r.timestamp,
  };
}

function logToRow(l: UserAuditLog): Record<string, any> {
  return {
    id: l.id,
    action: l.action,
    target_user_id: l.targetUserId,
    target_user_name: l.targetUserName,
    performed_by: l.performedBy,
    details: l.details ?? null,
    timestamp: l.timestamp,
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// =================== Users ===================

export async function fetchUsers(): Promise<ServerUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToUser);
}

export async function upsertUser(user: ServerUser): Promise<void> {
  const { error } = await supabase.from('users').upsert(userToRow(user), { onConflict: 'id' });
  if (error) throw error;
}

export async function upsertUsers(users: ServerUser[]): Promise<void> {
  if (users.length === 0) return;
  const { error } = await supabase.from('users').upsert(users.map(userToRow), { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteUserById(id: string): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
}

// =================== Audit Logs ===================

export async function fetchAuditLogs(limit = 200): Promise<UserAuditLog[]> {
  const { data, error } = await supabase
    .from('user_audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(rowToLog);
}

export async function insertAuditLog(log: UserAuditLog): Promise<void> {
  const { error } = await supabase.from('user_audit_logs').insert(logToRow(log));
  if (error) throw error;
}

export async function insertAuditLogs(logs: UserAuditLog[]): Promise<void> {
  if (logs.length === 0) return;
  const { error } = await supabase.from('user_audit_logs').upsert(logs.map(logToRow), { onConflict: 'id' });
  if (error) throw error;
}

// =================== Visitor Stats (single row, id = 1) ===================

export async function fetchStats(): Promise<VisitorStats | null> {
  const { data, error } = await supabase.from('visitor_stats').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    totalVisits: data.total_visits ?? 0,
    uniqueVisitorIds: Array.isArray(data.unique_visitor_ids) ? data.unique_visitor_ids : [],
    todayDate: data.today_date ?? '',
    todayVisits: data.today_visits ?? 0,
    lastUpdated: data.last_updated ?? new Date().toISOString(),
  };
}

export async function upsertStats(stats: VisitorStats): Promise<void> {
  const { error } = await supabase.from('visitor_stats').upsert(
    {
      id: 1,
      total_visits: stats.totalVisits,
      unique_visitor_ids: stats.uniqueVisitorIds,
      today_date: stats.todayDate,
      today_visits: stats.todayVisits,
      last_updated: stats.lastUpdated,
    },
    { onConflict: 'id' }
  );
  if (error) throw error;
}
