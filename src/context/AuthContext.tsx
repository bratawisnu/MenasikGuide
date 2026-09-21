import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppUser, UserRole, UserApprovalStatus, UserAuditLog } from '../types';

interface AuthContextType {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  users: AppUser[];
  auditLogs: UserAuditLog[];
  loading: boolean;
  pendingUsersCount: number;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; status?: string; suspendReason?: string; user?: AppUser }>;
  register: (data: { name: string; email: string; password: string; phone?: string; kloterOrAgency?: string; role?: UserRole }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  approveUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  rejectUser: (userId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  suspendUser: (userId: string, reason: string) => Promise<{ success: boolean; message: string }>;
  unsuspendUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  updateUserRole: (userId: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  createUser: (userData: { name: string; email: string; password: string; role: UserRole; status?: UserApprovalStatus; phone?: string; kloterOrAgency?: string; notes?: string }) => Promise<{ success: boolean; message: string }>;
  updateUser: (userId: string, userData: { name?: string; email?: string; phone?: string; kloterOrAgency?: string; notes?: string; role?: UserRole }) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  refreshUsers: () => Promise<void>;
  refreshLogs: () => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  initialRegisterMode: boolean;
  openLoginModal: (isRegister?: boolean) => void;
}

const STORAGE_KEY_AUTH_USER = 'manasik_auth_user_v1';
const STORAGE_KEY_LOCAL_USERS = 'manasik_users_db_v2';
const STORAGE_KEY_LOCAL_LOGS = 'manasik_audit_logs_v2';

interface StoredUserWithPassword extends AppUser {
  password?: string;
}

const SEED_USERS: StoredUserWithPassword[] = [
  {
    id: 'user-superadmin-yusuf',
    name: 'Yusuf Wisnubrata',
    email: 'yusufwisnubrata26@gmail.com',
    password: 'admin123',
    role: 'super_admin',
    status: 'approved',
    phone: '081234567890',
    kloterOrAgency: 'Pusat Manajemen Manasik RI',
    createdAt: '2026-08-01T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
    notes: 'Akun Super Admin Utama Sistem'
  },
  {
    id: 'user-superadmin-1',
    name: 'KH. Abdullah Syukri',
    email: 'superadmin@manasik.id',
    password: 'admin123',
    role: 'super_admin',
    status: 'approved',
    phone: '081234567890',
    kloterOrAgency: 'Pusat Manajemen Manasik RI',
    createdAt: '2026-08-17T05:21:56.730Z',
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
    createdAt: '2026-09-02T05:21:56.731Z',
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
    createdAt: '2026-09-09T05:21:56.731Z',
    lastLogin: new Date(Date.now() - 3600000 * 12).toISOString()
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
    createdAt: '2026-09-16T02:21:56.731Z',
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
    createdAt: '2026-09-16T02:50:00.731Z',
    notes: 'Menunggu konfirmasi verifikasi porsi haji'
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
    createdAt: '2026-09-06T05:21:56.731Z',
    notes: 'Ditangguhkan sementara oleh KH. Abdullah Syukri'
  }
];

const SEED_LOGS: UserAuditLog[] = [
  {
    id: 'log-seed-1',
    action: 'APPROVAL_GRANTED',
    targetUserId: 'user-jamaah-1',
    targetUserName: 'Hj. Siti Aminah',
    performedBy: 'Yusuf Wisnubrata',
    details: 'Pendaftaran disetujui, akun jamaah aktif.',
    timestamp: '2026-09-09T08:00:00.000Z'
  },
  {
    id: 'log-seed-2',
    action: 'ACCOUNT_SUSPENDED',
    targetUserId: 'user-suspended-1',
    targetUserName: 'Farhan Maulana',
    performedBy: 'Yusuf Wisnubrata',
    details: 'Alasan: Pemeriksaan validasi dokumen paspor bermasalah.',
    timestamp: '2026-09-12T14:30:00.000Z'
  }
];

function getStoredLocalUsers(): StoredUserWithPassword[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Clean any lingering (Super Admin) labels from user names
        let modified = false;
        parsed.forEach((u: StoredUserWithPassword) => {
          if (u.name && u.name.includes('(Super Admin)')) {
            u.name = u.name.replace(/\s*\(Super Admin\)/gi, '').trim();
            modified = true;
          }
        });
        // Ensure Yusuf Wisnubrata and superadmin are present
        const hasYusuf = parsed.some((u: StoredUserWithPassword) => u.email?.toLowerCase() === 'yusufwisnubrata26@gmail.com');
        if (!hasYusuf) {
          parsed.unshift(SEED_USERS[0]);
          modified = true;
        }
        if (modified) {
          saveStoredLocalUsers(parsed);
        }
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  saveStoredLocalUsers(SEED_USERS);
  return SEED_USERS;
}

function saveStoredLocalUsers(users: StoredUserWithPassword[]) {
  try {
    localStorage.setItem(STORAGE_KEY_LOCAL_USERS, JSON.stringify(users));
  } catch {
    // ignore
  }
}

function getStoredLocalLogs(): UserAuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  saveStoredLocalLogs(SEED_LOGS);
  return SEED_LOGS;
}

function saveStoredLocalLogs(logs: UserAuditLog[]) {
  try {
    localStorage.setItem(STORAGE_KEY_LOCAL_LOGS, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

function sanitizeUser(user: StoredUserWithPassword): AppUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _p, ...safe } = user;
  return safe;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name.includes('(Super Admin)')) {
          parsed.name = parsed.name.replace(/\s*\(Super Admin\)/gi, '').trim();
          try {
            localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(parsed));
          } catch {
            // ignore
          }
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
    return getStoredLocalUsers().map(sanitizeUser);
  });
  const [auditLogs, setAuditLogs] = useState<UserAuditLog[]>(() => {
    return getStoredLocalLogs();
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [initialRegisterMode, setInitialRegisterMode] = useState<boolean>(false);
  const currentUserRef = useRef<AppUser | null>(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const openLoginModal = (isRegister = false) => {
    setInitialRegisterMode(isRegister);
    setIsLoginModalOpen(true);
  };

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Fetch users from server (with local storage synchronization)
  const refreshUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
          // Sync server users into local storage cache
          const localUsers = getStoredLocalUsers();
          const merged = [...localUsers];
          data.users.forEach((srvUser: AppUser) => {
            const idx = merged.findIndex(u => u.id === srvUser.id || u.email.toLowerCase() === srvUser.email.toLowerCase());
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...srvUser };
            } else {
              merged.push(srvUser);
            }
          });
          saveStoredLocalUsers(merged);

          // If current logged-in user exists, update their profile
          if (currentUserRef.current) {
            const updatedSelf = data.users.find((u: AppUser) => u.id === currentUserRef.current?.id);
            if (updatedSelf) {
              if (updatedSelf.status === 'suspended') {
                currentUserRef.current = null;
                setCurrentUser(null);
                try {
                  localStorage.removeItem(STORAGE_KEY_AUTH_USER);
                } catch {
                  // ignore
                }
              } else {
                setCurrentUser(updatedSelf);
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Could not refresh users from server, relying on local store:', err);
      // Ensure local state matches local store
      setUsers(getStoredLocalUsers().map(sanitizeUser));
    }
  }, []);

  // Fetch audit logs
  const refreshLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/users/audit-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setAuditLogs(data.logs);
          saveStoredLocalLogs(data.logs);
        }
      }
    } catch (err) {
      console.warn('Could not refresh audit logs from server, relying on local store:', err);
      setAuditLogs(getStoredLocalLogs());
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshUsers();
    refreshLogs();
  }, [refreshUsers, refreshLogs]);

  // Robust, fail-safe Login handler
  const login = async (email: string, password: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    setLoading(true);

    try {
      // 1. Attempt server authentication first
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();

          if (res.ok && data.success && data.user) {
            setCurrentUser(data.user);
            setIsLoginModalOpen(false);
            refreshUsers();
            refreshLogs();
            return { success: true, message: data.message, user: data.user };
          } else if (data && (data.status || data.message)) {
            // Explicit rejection from server (e.g. wrong password, pending approval, suspended)
            return {
              success: false,
              status: data.status,
              suspendReason: data.suspendReason,
              message: data.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.'
            };
          }
        }
      } catch (serverErr) {
        console.warn('Server endpoint unreachable or timed out. Engaging client-side authentication fallback:', serverErr);
      }

      // 2. Client-Side Fallback Authentication Engine
      const localUsers = getStoredLocalUsers();
      let matchedUser = localUsers.find(u => u.email?.toLowerCase() === cleanEmail);

      // Special auto-provisioning for owner's email if not found
      if (!matchedUser && cleanEmail === 'yusufwisnubrata26@gmail.com') {
        matchedUser = {
          id: 'user-superadmin-yusuf',
          name: 'Yusuf Wisnubrata',
          email: 'yusufwisnubrata26@gmail.com',
          password: 'admin123',
          role: 'super_admin',
          status: 'approved',
          phone: '081234567890',
          kloterOrAgency: 'Pusat Manajemen Manasik RI',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          notes: 'Akun Super Admin Utama'
        };
        localUsers.unshift(matchedUser);
        saveStoredLocalUsers(localUsers);
      }

      if (!matchedUser) {
        return {
          success: false,
          message: 'Email belum terdaftar. Silakan periksa kembali email Anda atau lakukan pendaftaran akun baru.'
        };
      }

      // Check approval and suspended status
      if (matchedUser.status === 'suspended') {
        return {
          success: false,
          status: 'suspended',
          suspendReason: matchedUser.suspendReason,
          message: `Akun Anda sedang ditangguhkan (SUSPENDED). Alasan: ${matchedUser.suspendReason || 'Hubungi Super Admin untuk informasi lebih lanjut.'}`
        };
      }

      if (matchedUser.status === 'pending') {
        return {
          success: false,
          status: 'pending',
          message: 'Akun Anda masih dalam status MENUNGGU PERSETUJUAN (Pending Approval) dari Super Admin. Silakan hubungi admin atau login sebagai Super Admin untuk menyetujuinya.'
        };
      }

      if (matchedUser.status === 'rejected') {
        return {
          success: false,
          status: 'rejected',
          message: 'Pendaftaran akun Anda belum disetujui atau ditolak oleh Super Admin.'
        };
      }

      // Verify Password (allow default demo passwords, or if Yusuf Wisnubrata entered any password)
      const isValidPassword =
        matchedUser.password === cleanPassword ||
        (cleanEmail === 'yusufwisnubrata26@gmail.com' && (cleanPassword === 'admin123' || cleanPassword.length >= 4)) ||
        (matchedUser.role === 'super_admin' && cleanPassword === 'admin123') ||
        (matchedUser.role === 'admin' && cleanPassword === 'ustadz123') ||
        (matchedUser.role === 'jamaah' && cleanPassword === 'jamaah123');

      if (!isValidPassword) {
        return {
          success: false,
          message: 'Kata sandi salah. Silakan periksa kembali kata sandi Anda.'
        };
      }

      // Successful Login
      matchedUser.lastLogin = new Date().toISOString();
      saveStoredLocalUsers(localUsers);

      const safeUser = sanitizeUser(matchedUser);
      setCurrentUser(safeUser);
      setIsLoginModalOpen(false);
      setUsers(localUsers.map(sanitizeUser));

      // Add local audit log
      const newLog: UserAuditLog = {
        id: 'log-' + Date.now(),
        action: 'ROLE_CHANGED',
        targetUserId: safeUser.id,
        targetUserName: safeUser.name,
        performedBy: safeUser.name,
        details: `Login berhasil sebagai ${safeUser.role}.`,
        timestamp: new Date().toISOString()
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      saveStoredLocalLogs(updatedLogs);

      return {
        success: true,
        message: `Selamat datang kembali, ${safeUser.name}!`,
        user: safeUser
      };
    } catch (err) {
      console.error('Unexpected login handler error:', err);
      return { success: false, message: 'Terjadi kendala saat memproses login. Silakan coba kembali.' };
    } finally {
      setLoading(false);
    }
  };

  // Register handler (hybrid server + local fallback)
  const register = async (userData: { name: string; email: string; password: string; phone?: string; kloterOrAgency?: string; role?: UserRole }) => {
    setLoading(true);
    const cleanEmail = userData.email.trim().toLowerCase();

    try {
      const selectedRole = userData.role === 'admin' ? 'admin' : 'jamaah';
      // Try server first
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...userData, email: cleanEmail, role: selectedRole })
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.success) {
            refreshUsers();
            refreshLogs();
            return { success: true, message: data.message };
          } else if (data && data.message) {
            return { success: false, message: data.message };
          }
        }
      } catch (serverErr) {
        console.warn('Server registration endpoint unavailable, storing locally:', serverErr);
      }

      // Local register fallback
      const localUsers = getStoredLocalUsers();
      if (localUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' };
      }

      const newUser: StoredUserWithPassword = {
        id: 'user-' + Date.now(),
        name: userData.name.trim(),
        email: cleanEmail,
        password: userData.password,
        role: selectedRole,
        status: 'pending', // all public registrations require super admin approval
        phone: userData.phone,
        kloterOrAgency: userData.kloterOrAgency,
        createdAt: new Date().toISOString(),
        notes: `Pendaftaran mandiri sebagai ${selectedRole === 'admin' ? 'Pembimbing' : 'Jamaah'} (menunggu approval Super Admin)`
      };

      const updatedUsers = [newUser, ...localUsers];
      saveStoredLocalUsers(updatedUsers);
      setUsers(updatedUsers.map(sanitizeUser));

      const newLog: UserAuditLog = {
        id: 'log-' + Date.now(),
        action: 'REGISTRATION_SUBMITTED',
        targetUserId: newUser.id,
        targetUserName: newUser.name,
        performedBy: newUser.name,
        details: 'Pendaftaran akun baru menunggu verifikasi Super Admin.',
        timestamp: new Date().toISOString()
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      saveStoredLocalLogs(updatedLogs);

      return {
        success: true,
        message: 'Pendaftaran berhasil dikirim! Akun Anda sedang menunggu persetujuan (Approval) dari Super Admin.'
      };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, message: 'Gagal mengajukan pendaftaran akun.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    currentUserRef.current = null;
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      sessionStorage.removeItem(STORAGE_KEY_AUTH_USER);
    } catch {
      // ignore
    }
  };

  // Helper to record audit log locally and notify server
  const recordAudit = (action: UserAuditLog['action'], targetUser: AppUser, details?: string) => {
    const newLog: UserAuditLog = {
      id: 'log-' + Date.now(),
      action,
      targetUserId: targetUser.id,
      targetUserName: targetUser.name,
      performedBy: currentUser?.name || 'Super Admin',
      details,
      timestamp: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveStoredLocalLogs(updatedLogs);
  };

  // Approve user
  const approveUser = async (userId: string) => {
    // 1. Optimistic Local Update
    const localUsers = getStoredLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userId);
    if (idx >= 0) {
      localUsers[idx].status = 'approved';
      localUsers[idx].suspendReason = undefined;
      saveStoredLocalUsers(localUsers);
      setUsers(localUsers.map(sanitizeUser));
      recordAudit('APPROVAL_GRANTED', localUsers[idx], 'Akun disetujui, hak akses aktif.');
    }

    // 2. Sync to Server
    try {
      await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          performedBy: currentUser?.name || 'Super Admin'
        })
      });
      refreshUsers();
      refreshLogs();
    } catch (err) {
      console.warn('Server sync error in approveUser, local state maintained:', err);
    }

    return { success: true, message: 'Pengguna berhasil disetujui (Approved) dan dapat segera login!' };
  };

  // Reject user
  const rejectUser = async (userId: string, reason?: string) => {
    const localUsers = getStoredLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userId);
    if (idx >= 0) {
      localUsers[idx].status = 'rejected';
      localUsers[idx].notes = reason || 'Pendaftaran ditolak oleh Super Admin.';
      saveStoredLocalUsers(localUsers);
      setUsers(localUsers.map(sanitizeUser));
      recordAudit('APPROVAL_REJECTED', localUsers[idx], reason || 'Pendaftaran ditolak.');
    }

    try {
      await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          reason,
          performedBy: currentUser?.name || 'Super Admin'
        })
      });
      refreshUsers();
      refreshLogs();
    } catch (err) {
      console.warn('Server sync error in rejectUser, local state maintained:', err);
    }

    return { success: true, message: 'Pendaftaran pengguna telah ditolak.' };
  };

  // Suspend user
  const suspendUser = async (userId: string, reason: string) => {
    const localUsers = getStoredLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userId);
    if (idx >= 0) {
      localUsers[idx].status = 'suspended';
      localUsers[idx].suspendReason = reason;
      saveStoredLocalUsers(localUsers);
      setUsers(localUsers.map(sanitizeUser));
      recordAudit('ACCOUNT_SUSPENDED', localUsers[idx], `Alasan: ${reason}`);

      // If current user is suspended, log them out immediately
      if (currentUser?.id === userId) {
        logout();
      }
    }

    try {
      await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'suspended',
          reason,
          performedBy: currentUser?.name || 'Super Admin'
        })
      });
      refreshUsers();
      refreshLogs();
    } catch (err) {
      console.warn('Server sync error in suspendUser, local state maintained:', err);
    }

    return { success: true, message: 'Akun berhasil ditangguhkan (Suspended).' };
  };

  // Unsuspend user (restore to approved)
  const unsuspendUser = async (userId: string) => {
    const localUsers = getStoredLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userId);
    if (idx >= 0) {
      localUsers[idx].status = 'approved';
      localUsers[idx].suspendReason = undefined;
      saveStoredLocalUsers(localUsers);
      setUsers(localUsers.map(sanitizeUser));
      recordAudit('ACCOUNT_UNSUSPENDED', localUsers[idx], 'Penangguhan akun dicabut, akses dipulihkan.');
    }

    try {
      await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          performedBy: currentUser?.name || 'Super Admin'
        })
      });
      refreshUsers();
      refreshLogs();
    } catch (err) {
      console.warn('Server sync error in unsuspendUser, local state maintained:', err);
    }

    return { success: true, message: 'Akun berhasil diaktifkan kembali (Unsuspended).' };
  };

  // Update role
  const updateUserRole = async (userId: string, role: UserRole) => {
    const localUsers = getStoredLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userId);
    if (idx >= 0) {
      const oldRole = localUsers[idx].role;
      localUsers[idx].role = role;
      saveStoredLocalUsers(localUsers);
      setUsers(localUsers.map(sanitizeUser));
      recordAudit('ROLE_CHANGED', localUsers[idx], `Peran diubah dari ${oldRole} menjadi ${role}.`);

      if (currentUser?.id === userId) {
        setCurrentUser({ ...currentUser, role });
      }
    }

    try {
      await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          performedBy: currentUser?.name || 'Super Admin'
        })
      });
      refreshUsers();
      refreshLogs();
    } catch (err) {
      console.warn('Server sync error in updateUserRole, local state maintained:', err);
    }

    return { success: true, message: `Peran pengguna berhasil diubah menjadi ${role}.` };
  };

  // Create user directly
  const createUser = async (userData: { name: string; email: string; password: string; role: UserRole; status?: UserApprovalStatus; phone?: string; kloterOrAgency?: string; notes?: string }) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const localUsers = getStoredLocalUsers();
    if (localUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    const newUser: StoredUserWithPassword = {
      id: 'user-' + Date.now(),
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: userData.role,
      status: userData.status || 'approved',
      phone: userData.phone,
      kloterOrAgency: userData.kloterOrAgency,
      notes: userData.notes,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [newUser, ...localUsers];
    saveStoredLocalUsers(updatedUsers);
    setUsers(updatedUsers.map(sanitizeUser));
    recordAudit('USER_CREATED', newUser, `Dibuat manual oleh ${currentUser?.name || 'Super Admin'}.`);

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          email: cleanEmail,
          performedBy: currentUser?.name || 'Super Admin'
        })
      });
      refreshUsers();
      refreshLogs();
    } catch (err) {
      console.warn('Server sync error in createUser, local state maintained:', err);
    }

    return { success: true, message: 'Pengguna baru berhasil ditambahkan.' };
  };

  // Update user info
  const updateUser = async (userId: string, userData: { name?: string; email?: string; phone?: string; kloterOrAgency?: string; notes?: string; role?: UserRole }) => {
    const localUsers = getStoredLocalUsers();
    const idx = localUsers.findIndex(u => u.id === userId);
    if (idx >= 0) {
      localUsers[idx] = {
        ...localUsers[idx],
        ...userData,
        email: userData.email ? userData.email.trim().toLowerCase() : localUsers[idx].email
      };
      saveStoredLocalUsers(localUsers);
      setUsers(localUsers.map(sanitizeUser));
      recordAudit('USER_UPDATED', localUsers[idx], 'Data profil/akun diperbarui.');

      if (currentUser?.id === userId) {
        setCurrentUser(sanitizeUser(localUsers[idx]));
      }
    }

    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          performedBy: currentUser?.name || 'Super Admin'
        })
      });
      refreshUsers();
      refreshLogs();
    } catch (err) {
      console.warn('Server sync error in updateUser, local state maintained:', err);
    }

    return { success: true, message: 'Data pengguna berhasil diperbarui.' };
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    const localUsers = getStoredLocalUsers();
    const targetUser = localUsers.find(u => u.id === userId);
    const updatedUsers = localUsers.filter(u => u.id !== userId);
    saveStoredLocalUsers(updatedUsers);
    setUsers(updatedUsers.map(sanitizeUser));

    if (targetUser) {
      recordAudit('USER_DELETED', targetUser, `Akun dihapus permanen oleh ${currentUser?.name || 'Super Admin'}.`);
    }

    try {
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          performedBy: currentUser?.name || 'Super Admin'
        })
      });
      refreshUsers();
      refreshLogs();
    } catch (err) {
      console.warn('Server sync error in deleteUser, local state maintained:', err);
    }

    return { success: true, message: 'Pengguna berhasil dihapus.' };
  };

  const pendingUsersCount = users.filter(u => u.status === 'pending').length;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin' || isSuperAdmin;
  const isAuthenticated = currentUser !== null && currentUser.status === 'approved';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isSuperAdmin,
        isAdmin,
        users,
        auditLogs,
        loading,
        pendingUsersCount,
        login,
        register,
        logout,
        approveUser,
        rejectUser,
        suspendUser,
        unsuspendUser,
        updateUserRole,
        createUser,
        updateUser,
        deleteUser,
        refreshUsers,
        refreshLogs,
        isLoginModalOpen,
        setIsLoginModalOpen,
        initialRegisterMode,
        openLoginModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
