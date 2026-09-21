import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import {
  fetchUsers,
  upsertUsers,
  deleteUserById,
  fetchAuditLogs,
  insertAuditLog,
  insertAuditLogs,
  fetchStats,
  upsertStats,
  type ServerUser,
  type UserAuditLog,
  type VisitorStats,
} from './db';

const SALT_ROUNDS = 10;

const DEFAULT_USERS: ServerUser[] = [
  {
    id: 'user-superadmin-yusuf',
    name: 'Yusuf Wisnubrata (Super Admin)',
    email: 'yusufwisnubrata26@gmail.com',
    password: 'admin123',
    role: 'super_admin',
    status: 'approved',
    phone: '081234567890',
    kloterOrAgency: 'Pusat Manajemen Manasik RI',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastLogin: new Date().toISOString(),
    notes: 'Akun Super Admin Utama'
  },
  {
    id: 'user-superadmin-1',
    name: 'KH. Abdullah Syukri (Super Admin)',
    email: 'superadmin@manasik.id',
    password: 'admin123',
    role: 'super_admin',
    status: 'approved',
    phone: '081234567890',
    kloterOrAgency: 'Pusat Manajemen Manasik RI',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastLogin: new Date().toISOString(),
    notes: 'Akun Super Admin Utama dengan hak akses penuh'
  },
  {
    id: 'user-admin-1',
    name: 'Ustadz Hilman Fawzi, M.Ag',
    email: 'ustadz@manasik.id',
    password: 'ustadz123',
    role: 'admin',
    status: 'approved',
    phone: '081987654321',
    kloterOrAgency: 'KBIHU Al-Mabroor Jakarta',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    lastLogin: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: 'Pembimbing Ibadah Haji & Umroh Resmi'
  },
  {
    id: 'user-jamaah-1',
    name: 'Hj. Siti Aminah',
    email: 'siti.aminah@gmail.com',
    password: 'jamaah123',
    role: 'jamaah',
    status: 'approved',
    phone: '081345678912',
    kloterOrAgency: 'Kloter 12 JKS - Jawa Barat',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastLogin: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'user-pending-1',
    name: 'Bpk. Hendra Kusuma',
    email: 'hendra.kusuma@gmail.com',
    password: 'jamaah123',
    role: 'jamaah',
    status: 'pending',
    phone: '085234567899',
    kloterOrAgency: 'Kloter 05 SUB - Jawa Timur',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    notes: 'Mendaftar mandiri via web, berkas KTP terlampir'
  },
  {
    id: 'user-pending-2',
    name: 'Ibu Nur Hidayati',
    email: 'nur.hidayati@yahoo.com',
    password: 'jamaah123',
    role: 'jamaah',
    status: 'pending',
    phone: '082198765432',
    kloterOrAgency: 'KBIHU Nurul Iman Semarang',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    notes: 'Menunggu konfirmasi pendaftaran kloter khusus'
  },
  {
    id: 'user-suspended-1',
    name: 'Farhan Maulana',
    email: 'farhan.suspended@gmail.com',
    password: 'jamaah123',
    role: 'jamaah',
    status: 'suspended',
    suspendReason: 'Pemeriksaan validasi dokumen paspor & klarifikasi data porsi haji bermasalah.',
    phone: '087812345678',
    kloterOrAgency: 'Biro Swasta Umroh Mandiri',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastLogin: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Ditangguhkan sementara oleh Super Admin per 14 September'
  }
];

const DEFAULT_AUDIT_LOGS: UserAuditLog[] = [
  {
    id: 'log-1',
    action: 'APPROVAL_GRANTED',
    targetUserId: 'user-jamaah-1',
    targetUserName: 'Hj. Siti Aminah',
    performedBy: 'KH. Abdullah Syukri (Super Admin)',
    details: 'Menyetujui pendaftaran jamaah Kloter 12 JKS',
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'log-2',
    action: 'ACCOUNT_SUSPENDED',
    targetUserId: 'user-suspended-1',
    targetUserName: 'Farhan Maulana',
    performedBy: 'KH. Abdullah Syukri (Super Admin)',
    details: 'Menangguhkan akun: Pemeriksaan validasi dokumen paspor',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

function sanitizeUser(u: ServerUser) {
  const { password, ...safe } = u;
  return safe;
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

// In-memory caches — hydrated from Supabase in hydrateCaches() before the server listens.
let usersCache: ServerUser[] = [];
let auditLogsCache: UserAuditLog[] = [];
let statsCache: VisitorStats = {
  totalVisits: 0,
  uniqueVisitorIds: [],
  todayDate: getTodayString(),
  todayVisits: 0,
  lastUpdated: new Date().toISOString(),
};

// Write-through: persist the full user set to Supabase (fire-and-forget).
function saveUsers(users: ServerUser[]) {
  upsertUsers(users).catch(err => console.error('Error saving users to Supabase:', err));
}

// Persist a single audit log to Supabase (fire-and-forget).
function addAuditLog(action: string, targetUserId: string, targetUserName: string, performedBy: string, details?: string) {
  const logItem: UserAuditLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    action,
    targetUserId,
    targetUserName,
    performedBy: performedBy || 'Super Admin',
    details,
    timestamp: new Date().toISOString()
  };
  auditLogsCache.unshift(logItem);
  if (auditLogsCache.length > 200) auditLogsCache = auditLogsCache.slice(0, 200);
  insertAuditLog(logItem).catch(err => console.error('Error saving audit log to Supabase:', err));
}

function saveStats() {
  statsCache.lastUpdated = new Date().toISOString();
  upsertStats(statsCache).catch(err => console.error('Error saving stats to Supabase:', err));
}

// Load all data from Supabase into the in-memory caches. Seeds defaults if empty.
async function hydrateCaches() {
  // Users — seed defaults (with hashed passwords) if the table is empty.
  let users = await fetchUsers();
  if (users.length === 0) {
    users = await Promise.all(
      DEFAULT_USERS.map(async u => ({ ...u, password: await bcrypt.hash(u.password, SALT_ROUNDS) }))
    );
    await upsertUsers(users);
  } else {
    // Ensure the primary super admin always exists.
    const hasYusuf = users.some(u => u.email.toLowerCase() === 'yusufwisnubrata26@gmail.com');
    if (!hasYusuf) {
      const yusuf: ServerUser = {
        ...DEFAULT_USERS[0],
        password: await bcrypt.hash(DEFAULT_USERS[0].password, SALT_ROUNDS),
      };
      await upsertUsers([yusuf]);
      users.unshift(yusuf);
    }
  }
  usersCache = users;

  auditLogsCache = await fetchAuditLogs(200);
  if (auditLogsCache.length === 0) {
    await insertAuditLogs(DEFAULT_AUDIT_LOGS);
    auditLogsCache = [...DEFAULT_AUDIT_LOGS];
  }

  const stats = await fetchStats();
  const today = getTodayString();
  if (stats) {
    if (stats.todayDate !== today) {
      stats.todayDate = today;
      stats.todayVisits = 0;
    }
    statsCache = stats;
  } else {
    statsCache = {
      totalVisits: 0,
      uniqueVisitorIds: [],
      todayDate: today,
      todayVisits: 0,
      lastUpdated: new Date().toISOString(),
    };
    await upsertStats(statsCache);
  }
}

// In-memory active visitors map: visitorId -> lastSeen timestamp
const activeVisitors = new Map<string, number>();

// Clean up stale active visitors every 30 seconds (active if seen in last 75 seconds)
setInterval(() => {
  const now = Date.now();
  const threshold = 75 * 1000;
  for (const [id, lastSeen] of activeVisitors.entries()) {
    if (now - lastSeen > threshold) {
      activeVisitors.delete(id);
    }
  }
}, 30000);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Load all persisted data from Supabase before accepting requests.
  await hydrateCaches();

  app.use(express.json());

  // API Routes
  app.get('/api/stats', (req, res) => {
    const today = getTodayString();
    if (statsCache.todayDate !== today) {
      statsCache.todayDate = today;
      statsCache.todayVisits = 0;
      saveStats();
    }

    const activeCount = Math.max(1, activeVisitors.size);

    res.json({
      totalVisits: statsCache.totalVisits,
      uniqueVisitors: statsCache.uniqueVisitorIds.length,
      todayVisits: statsCache.todayVisits,
      activeNow: activeCount,
      lastUpdated: statsCache.lastUpdated,
    });
  });

  app.post('/api/stats/visit', (req, res) => {
    const { visitorId, isNewSession } = req.body || {};
    const now = Date.now();
    const today = getTodayString();

    if (statsCache.todayDate !== today) {
      statsCache.todayDate = today;
      statsCache.todayVisits = 0;
    }

    // Always track in active visitors
    if (visitorId) {
      activeVisitors.set(visitorId, now);

      // Record unique visitor
      if (!statsCache.uniqueVisitorIds.includes(visitorId)) {
        // Keep unique visitor ids reasonable in memory/file (cap at 20,000)
        if (statsCache.uniqueVisitorIds.length < 20000) {
          statsCache.uniqueVisitorIds.push(visitorId);
        }
      }
    }

    // If new session or initial page load
    if (isNewSession) {
      statsCache.totalVisits += 1;
      statsCache.todayVisits += 1;
      saveStats();
    }

    const activeCount = Math.max(1, activeVisitors.size);

    res.json({
      success: true,
      totalVisits: statsCache.totalVisits,
      uniqueVisitors: statsCache.uniqueVisitorIds.length,
      todayVisits: statsCache.todayVisits,
      activeNow: activeCount,
    });
  });

  app.post('/api/stats/heartbeat', (req, res) => {
    const { visitorId } = req.body || {};
    if (visitorId) {
      activeVisitors.set(visitorId, Date.now());
    }
    res.json({
      success: true,
      activeNow: Math.max(1, activeVisitors.size),
    });
  });

  app.post('/api/stats/reset', (req, res) => {
    statsCache = {
      totalVisits: 0,
      uniqueVisitorIds: [],
      todayDate: getTodayString(),
      todayVisits: 0,
      lastUpdated: new Date().toISOString(),
    };
    activeVisitors.clear();
    saveStats();
    res.json({
      success: true,
      message: 'Statistik kunjungan berhasil direset.',
      totalVisits: 0,
      uniqueVisitors: 0,
      todayVisits: 0,
      activeNow: 1,
    });
  });

  // =================== AUTHENTICATION & USER MANAGEMENT API ===================

  // 1. User Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = usersCache.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Kombinasi email atau password salah. Silakan periksa kembali.'
      });
    }

    // Check account status
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        status: 'suspended',
        suspendReason: user.suspendReason || 'Akun dinonaktifkan sementara oleh pengelola.',
        message: 'Akun Anda sedang ditangguhkan (SUSPENDED).'
      });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        status: 'pending',
        message: 'Akun Anda masih dalam status Menunggu Persetujuan (Pending Approval) dari Super Admin. Mohon tunggu proses verifikasi.'
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        status: 'rejected',
        message: 'Pendaftaran akun Anda belum disetujui / ditolak oleh Super Admin.'
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsers(usersCache);

    res.json({
      success: true,
      user: sanitizeUser(user),
      message: `Selamat datang kembali, ${user.name}!`
    });
  });

  // 2. User Self-Registration
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone, kloterOrAgency, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = usersCache.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
    }

    const newUser: ServerUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      name: String(name).trim(),
      email: cleanEmail,
      password: await bcrypt.hash(String(password), SALT_ROUNDS),
      role: (role === 'admin' || role === 'jamaah') ? role : 'jamaah',
      status: 'pending', // Self-registered accounts require Super Admin approval!
      phone: phone ? String(phone).trim() : undefined,
      kloterOrAgency: kloterOrAgency ? String(kloterOrAgency).trim() : undefined,
      createdAt: new Date().toISOString(),
      notes: 'Pendaftaran mandiri via form registrasi'
    };

    usersCache.push(newUser);
    saveUsers(usersCache);

    addAuditLog('USER_REGISTERED', newUser.id, newUser.name, 'Sistem Mandiri', `Pendaftaran akun jamaah baru (${newUser.email}), status: PENDING APPROVAL`);

    res.status(201).json({
      success: true,
      user: sanitizeUser(newUser),
      message: 'Pendaftaran akun berhasil diajukan! Akun Anda kini berstatus MENUNGGU PERSETUJUAN (Pending Approval) oleh Super Admin sebelum dapat digunakan untuk login.'
    });
  });

  // 3. Get All Users (Super Admin & Admin)
  app.get('/api/users', (req, res) => {
    const safeUsers = usersCache.map(sanitizeUser);
    res.json({
      success: true,
      users: safeUsers,
      total: safeUsers.length,
      pendingCount: safeUsers.filter(u => u.status === 'pending').length,
      approvedCount: safeUsers.filter(u => u.status === 'approved').length,
      suspendedCount: safeUsers.filter(u => u.status === 'suspended').length
    });
  });

  // 4. Create User Directly (by Super Admin)
  app.post('/api/users', async (req, res) => {
    const { name, email, password, role, status, phone, kloterOrAgency, notes, performedBy } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (usersCache.some(u => u.email.toLowerCase() === cleanEmail)) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    const newUser: ServerUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      name: String(name).trim(),
      email: cleanEmail,
      password: await bcrypt.hash(String(password), SALT_ROUNDS),
      role: role || 'jamaah',
      status: status || 'approved',
      phone: phone ? String(phone).trim() : undefined,
      kloterOrAgency: kloterOrAgency ? String(kloterOrAgency).trim() : undefined,
      createdAt: new Date().toISOString(),
      notes: notes ? String(notes).trim() : 'Dibuat langsung oleh Super Admin'
    };

    usersCache.push(newUser);
    saveUsers(usersCache);

    addAuditLog('USER_CREATED', newUser.id, newUser.name, performedBy || 'Super Admin', `Membuat akun baru role: ${newUser.role}, status: ${newUser.status}`);

    res.status(201).json({
      success: true,
      user: sanitizeUser(newUser),
      message: `Pengguna ${newUser.name} berhasil ditambahkan.`
    });
  });

  // 5. Update User Details
  app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, kloterOrAgency, notes, role, performedBy } = req.body || {};

    const user = usersCache.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    if (name) user.name = String(name).trim();
    if (email) user.email = String(email).trim().toLowerCase();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (kloterOrAgency !== undefined) user.kloterOrAgency = String(kloterOrAgency).trim();
    if (notes !== undefined) user.notes = String(notes).trim();
    if (role && ['super_admin', 'admin', 'jamaah'].includes(role)) {
      user.role = role;
    }

    saveUsers(usersCache);
    addAuditLog('USER_UPDATED', user.id, user.name, performedBy || 'Super Admin', 'Memperbarui data profil pengguna');

    res.json({
      success: true,
      user: sanitizeUser(user),
      message: 'Data pengguna berhasil diperbarui.'
    });
  });

  // 6. Update User Status (Approval & Suspend Management)
  app.patch('/api/users/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, reason, performedBy } = req.body || {};

    const validStatuses = ['approved', 'pending', 'suspended', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    const user = usersCache.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    // Safety: prevent suspending the primary super admin
    if (user.role === 'super_admin' && status === 'suspended') {
      const otherSuperAdmins = usersCache.filter(u => u.role === 'super_admin' && u.id !== id && u.status === 'approved');
      if (otherSuperAdmins.length === 0) {
        return res.status(400).json({ success: false, message: 'Tidak dapat menangguhkan satu-satunya Super Admin aktif.' });
      }
    }

    const oldStatus = user.status;
    user.status = status;

    if (status === 'suspended') {
      user.suspendReason = reason || 'Ditangguhkan oleh Super Admin untuk verifikasi data.';
    } else if (status === 'approved') {
      user.suspendReason = undefined;
    }

    saveUsers(usersCache);

    let actionLabel = 'STATUS_CHANGED';
    let detailMsg = `Mengubah status dari ${oldStatus} menjadi ${status}`;
    if (status === 'approved') {
      actionLabel = 'APPROVAL_GRANTED';
      detailMsg = `Menyetujui pendaftaran akun (Approved)`;
    } else if (status === 'suspended') {
      actionLabel = 'ACCOUNT_SUSPENDED';
      detailMsg = `Menangguhkan akun (Suspended). Alasan: ${user.suspendReason}`;
    } else if (status === 'rejected') {
      actionLabel = 'APPROVAL_REJECTED';
      detailMsg = `Menolak pendaftaran akun (Rejected)`;
    }

    addAuditLog(actionLabel, user.id, user.name, performedBy || 'Super Admin', detailMsg);

    res.json({
      success: true,
      user: sanitizeUser(user),
      message: `Status akun ${user.name} berhasil diubah menjadi ${status.toUpperCase()}.`
    });
  });

  // 7. Change User Role
  app.patch('/api/users/:id/role', (req, res) => {
    const { id } = req.params;
    const { role, performedBy } = req.body || {};

    if (!['super_admin', 'admin', 'jamaah'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role tidak valid.' });
    }

    const user = usersCache.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    const oldRole = user.role;
    user.role = role;
    saveUsers(usersCache);

    addAuditLog('ROLE_CHANGED', user.id, user.name, performedBy || 'Super Admin', `Mengubah hak akses dari ${oldRole} menjadi ${role}`);

    res.json({
      success: true,
      user: sanitizeUser(user),
      message: `Role pengguna ${user.name} berhasil diubah menjadi ${role}.`
    });
  });

  // 8. Delete User
  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { performedBy } = req.body || {};

    const index = usersCache.findIndex(u => u.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    const user = usersCache[index];
    if (user.role === 'super_admin') {
      const otherSuperAdmins = usersCache.filter(u => u.role === 'super_admin' && u.id !== id);
      if (otherSuperAdmins.length === 0) {
        return res.status(400).json({ success: false, message: 'Tidak dapat menghapus satu-satunya Super Admin di sistem.' });
      }
    }

    usersCache.splice(index, 1);
    deleteUserById(id).catch(err => console.error('Error deleting user from Supabase:', err));

    addAuditLog('USER_DELETED', id, user.name, performedBy || 'Super Admin', `Menghapus akun pengguna (${user.email})`);

    res.json({
      success: true,
      message: `Akun ${user.name} berhasil dihapus dari sistem.`
    });
  });

  // 9. Get Audit Logs
  app.get('/api/users/audit-logs', (req, res) => {
    res.json({
      success: true,
      logs: auditLogsCache
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Gagal memulai server:', err);
  process.exit(1);
});
