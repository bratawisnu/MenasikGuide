import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppUser, UserRole, UserApprovalStatus } from '../types';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  UserPlus,
  Search,
  Filter,
  Check,
  X,
  Ban,
  RotateCcw,
  Edit2,
  Trash2,
  UserCheck,
  Shield,
  FileSpreadsheet,
  RefreshCw,
  AlertTriangle,
  FileText,
  Building,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  LogOut,
  LogIn,
  BookOpen,
  Lock
} from 'lucide-react';

interface SuperAdminViewProps {
  onBackToGuide?: () => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({ onBackToGuide }) => {
  const {
    currentUser,
    isAuthenticated,
    isSuperAdmin,
    logout,
    openLoginModal,
    users,
    auditLogs,
    loading,
    refreshUsers,
    refreshLogs,
    approveUser,
    rejectUser,
    suspendUser,
    unsuspendUser,
    updateUserRole,
    createUser,
    updateUser,
    deleteUser
  } = useAuth();

  // Navigation sub-tab
  const [activeTab, setActiveTab] = useState<'users' | 'pending' | 'suspended' | 'logs'>('users');

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserApprovalStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  // Form states for adding user
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jamaah' as UserRole,
    status: 'approved' as UserApprovalStatus,
    phone: '',
    kloterOrAgency: '',
    notes: ''
  });

  // Form states for editing user
  const [editUserData, setEditUserData] = useState<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    kloterOrAgency: string;
    notes: string;
  }>({
    id: '',
    name: '',
    email: '',
    role: 'jamaah',
    phone: '',
    kloterOrAgency: '',
    notes: ''
  });

  // Form state for suspending user
  const [suspendReason, setSuspendReason] = useState('');
  const [customSuspendReason, setCustomSuspendReason] = useState('');

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Metrics
  const stats = useMemo(() => {
    const total = users.length;
    const pending = users.filter(u => u.status === 'pending').length;
    const approved = users.filter(u => u.status === 'approved').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    const superAdmins = users.filter(u => u.role === 'super_admin').length;
    return { total, pending, approved, suspended, superAdmins };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Tab filter
      if (activeTab === 'pending' && user.status !== 'pending') return false;
      if (activeTab === 'suspended' && user.status !== 'suspended') return false;

      // Status dropdown filter
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;

      // Role filter
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(term);
        const matchesEmail = user.email.toLowerCase().includes(term);
        const matchesPhone = user.phone ? user.phone.includes(term) : false;
        const matchesKloter = user.kloterOrAgency ? user.kloterOrAgency.toLowerCase().includes(term) : false;
        return matchesName || matchesEmail || matchesPhone || matchesKloter;
      }

      return true;
    });
  }, [users, activeTab, statusFilter, roleFilter, searchTerm]);

  // Handle Quick Approval
  const handleApprove = async (user: AppUser) => {
    const res = await approveUser(user.id);
    if (res.success) {
      showNotification('success', `Akun ${user.name} berhasil disetujui (Approved)!`);
    } else {
      showNotification('error', res.message);
    }
  };

  // Handle Quick Reject
  const handleReject = async (user: AppUser) => {
    const res = await rejectUser(user.id, 'Pendaftaran ditolak oleh Super Admin.');
    if (res.success) {
      showNotification('success', `Pendaftaran akun ${user.name} ditolak.`);
    } else {
      showNotification('error', res.message);
    }
  };

  // Handle Approve All Pending
  const handleApproveAllPending = async () => {
    const pendingUsers = users.filter(u => u.status === 'pending');
    if (pendingUsers.length === 0) return;

    for (const u of pendingUsers) {
      await approveUser(u.id);
    }
    showNotification('success', `Berhasil menyetujui ${pendingUsers.length} akun jamaah!`);
  };

  // Open Suspend Modal
  const openSuspendModal = (user: AppUser) => {
    setSelectedUser(user);
    setSuspendReason('Pemeriksaan berkas dokumen paspor dan validasi data kloter.');
    setCustomSuspendReason('');
    setShowSuspendModal(true);
  };

  // Submit Suspend
  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;
    const finalReason = suspendReason === 'custom' ? customSuspendReason : suspendReason;
    if (!finalReason.trim()) {
      showNotification('error', 'Silakan pilih atau masukkan alasan penangguhan.');
      return;
    }

    const res = await suspendUser(selectedUser.id, finalReason);
    if (res.success) {
      showNotification('success', `Akun ${selectedUser.name} berhasil ditangguhkan (Suspended).`);
      setShowSuspendModal(false);
      setSelectedUser(null);
    } else {
      showNotification('error', res.message);
    }
  };

  // Handle Unsuspend
  const handleUnsuspend = async (user: AppUser) => {
    const res = await unsuspendUser(user.id);
    if (res.success) {
      showNotification('success', `Akun ${user.name} berhasil dipulihkan dan aktif kembali (Approved)!`);
    } else {
      showNotification('error', res.message);
    }
  };

  // Open Edit Modal
  const openEditModal = (user: AppUser) => {
    setSelectedUser(user);
    setEditUserData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      kloterOrAgency: user.kloterOrAgency || '',
      notes: user.notes || ''
    });
    setShowEditModal(true);
  };

  // Submit Edit
  const handleConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const res = await updateUser(selectedUser.id, {
      name: editUserData.name,
      email: editUserData.email,
      role: editUserData.role,
      phone: editUserData.phone,
      kloterOrAgency: editUserData.kloterOrAgency,
      notes: editUserData.notes
    });

    if (res.success) {
      showNotification('success', `Data ${editUserData.name} berhasil diperbarui.`);
      setShowEditModal(false);
      setSelectedUser(null);
    } else {
      showNotification('error', res.message);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (user: AppUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Submit Delete
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    const res = await deleteUser(selectedUser.id);
    if (res.success) {
      showNotification('success', res.message);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } else {
      showNotification('error', res.message);
    }
  };

  // Submit Add User
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      showNotification('error', 'Nama, email, dan kata sandi wajib diisi.');
      return;
    }

    const res = await createUser(newUserData);
    if (res.success) {
      showNotification('success', `Pengguna baru ${newUserData.name} berhasil dibuat!`);
      setShowAddModal(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        role: 'jamaah',
        status: 'approved',
        phone: '',
        kloterOrAgency: '',
        notes: ''
      });
    } else {
      showNotification('error', res.message);
    }
  };

  // Export Users CSV
  const handleExportCsv = () => {
    try {
      const headers = ['ID', 'Nama', 'Email', 'Role', 'Status', 'No_HP', 'Kloter_Agency', 'Tanggal_Daftar', 'Alasan_Suspend'];
      const rows = users.map(u => [
        `"${u.id}"`,
        `"${u.name}"`,
        `"${u.email}"`,
        `"${u.role}"`,
        `"${u.status}"`,
        `"${u.phone || '-'}"`,
        `"${u.kloterOrAgency || '-'}"`,
        `"${new Date(u.createdAt).toLocaleDateString('id-ID')}"`,
        `"${u.suspendReason || '-'}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `data_pengguna_manasik_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('success', 'Data pengguna berhasil diexport ke format CSV.');
    } catch {
      showNotification('error', 'Gagal mengekspor file CSV.');
    }
  };

  // Access control check for Super Admin
  if (!isAuthenticated || !currentUser || !isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-stone-900 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-800 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center shadow-md">
          <Lock className="w-10 h-10 text-amber-700 dark:text-amber-400" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 uppercase tracking-wider">
            Portal Khusus Super Administrator
          </span>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-2">
            {isAuthenticated ? 'Akses Dibatasi' : 'Sesi Telah Berakhir / Anda Belum Masuk'}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-2 max-w-md mx-auto">
            {isAuthenticated
              ? `Akun Anda (${currentUser?.name}) tidak memiliki wewenang Super Admin. Halaman ini memerlukan level Super Admin.`
              : 'Anda saat ini dalam status keluar (logged out). Silakan masuk kembali dengan akun Super Admin untuk mengelola sistem dan jamaah.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openLoginModal(false)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Sebagai Super Admin</span>
          </button>
          <button
            onClick={onBackToGuide}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm border border-stone-200 dark:border-stone-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Kembali ke Panduan Jamaah</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20'
              : 'bg-rose-600 text-white border-rose-500 shadow-rose-900/20'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Super Admin Hero Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-stone-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-3xl shadow-lg shrink-0">
              👑
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-stone-950 uppercase tracking-wider">
                  Super Administrator Portal
                </span>
                <span className="text-xs text-stone-400">
                  {currentUser ? `Login: ${currentUser.name}` : 'Akses Penuh Pengelola'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Manajemen Pengguna & Otoritas Akun
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Pusat kendali persetujuan (approval) pendaftaran jamaah baru, penangguhan (suspend), mutasi hak akses, dan audit jejak aktivitas sistem.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah User Baru</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              title="Unduh Data CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => {
                refreshUsers();
                refreshLogs();
                showNotification('success', 'Data pengguna berhasil dimuat ulang.');
              }}
              disabled={loading}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 transition-all cursor-pointer"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Prominent Direct Logout Button on Super Admin Header */}
            <button
              onClick={() => {
                logout();
                if (onBackToGuide) {
                  onBackToGuide();
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border border-rose-500"
              title="Keluar dari akun Super Admin"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-800/80">
          <div className="bg-stone-800/60 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-stone-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">Total Pengguna</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1.5">{stats.total}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">{stats.superAdmins} Super Admin</div>
          </div>

          <div
            onClick={() => setActiveTab('pending')}
            className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all ${
              stats.pending > 0
                ? 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30 ring-2 ring-amber-500/30'
                : 'bg-stone-800/60 border-stone-700/60 hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                Menunggu Approval
                {stats.pending > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1.5">{stats.pending}</div>
            <div className="text-[11px] text-amber-400/80 mt-0.5">
              {stats.pending > 0 ? 'Perlu tindakan Super Admin' : 'Semua sudah disetujui'}
            </div>
          </div>

          <div
            onClick={() => {
              setActiveTab('users');
              setStatusFilter('approved');
            }}
            className="cursor-pointer bg-stone-800/60 hover:bg-stone-800 p-3.5 sm:p-4 rounded-2xl border border-stone-700/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">Akun Aktif (Approved)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1.5">{stats.approved}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Dapat mengakses portal</div>
          </div>

          <div
            onClick={() => setActiveTab('suspended')}
            className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all ${
              stats.suspended > 0
                ? 'bg-rose-500/20 border-rose-500/50 hover:bg-rose-500/30'
                : 'bg-stone-800/60 border-stone-700/60 hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-300">Ditangguhkan (Suspended)</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 mt-1.5">{stats.suspended}</div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">Akses masuk diblokir</div>
          </div>
        </div>
      </div>

      {/* PENDING APPROVAL QUICK BANNER (If any accounts require immediate attention) */}
      {stats.pending > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-stone-950 font-black shrink-0 shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200">
                Ada {stats.pending} Akun Menunggu Persetujuan (Pending Approval)
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Jamaah ini telah mendaftar dan membutuhkan verifikasi Super Admin sebelum dapat menggunakan akun mereka.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setActiveTab('pending')}
              className="px-3.5 py-2 rounded-xl bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 text-xs font-bold hover:bg-amber-300 transition-all"
            >
              Lihat Antrean
            </button>
            <button
              onClick={handleApproveAllPending}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Setujui Semua</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('users');
              setStatusFilter('all');
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Semua Pengguna</span>
            <span className="text-xs bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-full font-bold">
              {stats.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Antrean Approval</span>
            {stats.pending > 0 && (
              <span className="text-xs bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-black animate-pulse">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('suspended')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'suspended'
                ? 'bg-white dark:bg-stone-900 text-rose-700 dark:text-rose-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Akun Tersuspend</span>
            <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-700 px-2 py-0.5 rounded-full font-bold">
              {stats.suspended}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Audit Log Aktivitas</span>
            <span className="text-xs bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-full font-bold">
              {auditLogs.length}
            </span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR (Only for users/pending/suspended tabs) */}
      {activeTab !== 'logs' && (
        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama jamaah, email, nomor HP, atau kloter..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'users' && (
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">Semua Status</option>
                <option value="approved">🟢 Disetujui (Approved)</option>
                <option value="pending">🟡 Menunggu (Pending)</option>
                <option value="suspended">🔴 Ditangguhkan (Suspended)</option>
                <option value="rejected">⚪ Ditolak (Rejected)</option>
              </select>
            )}

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Semua Peran (Role)</option>
              <option value="super_admin">👑 Super Admin</option>
              <option value="admin">👳 Admin</option>
              <option value="jamaah">🧕 Jamaah</option>
            </select>

            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRoleFilter('all');
                }}
                className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 text-xs font-bold transition-all"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS / PENDING / SUSPENDED */}
      {activeTab !== 'logs' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-3 text-2xl">
                🔍
              </div>
              <h4 className="text-base font-bold text-stone-700 dark:text-stone-300">
                Tidak ada data pengguna yang sesuai
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Silakan ubah kata kunci pencarian atau reset filter di atas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Pengguna</th>
                    <th className="py-3.5 px-4">Kontak & Kloter</th>
                    <th className="py-3.5 px-4">Hak Akses (Role)</th>
                    <th className="py-3.5 px-4">Status Akun</th>
                    <th className="py-3.5 px-4 text-center">Manajemen Status & Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredUsers.map(user => {
                    const isSelf = currentUser?.id === user.id;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors ${
                          user.status === 'suspended'
                            ? 'bg-rose-50/40 dark:bg-rose-950/20'
                            : user.status === 'pending'
                            ? 'bg-amber-50/40 dark:bg-amber-950/20'
                            : ''
                        }`}
                      >
                        {/* Column 1: User Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border shadow-xs ${
                                user.role === 'super_admin'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : user.role === 'admin'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700'
                              }`}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isSelf && (
                                  <span className="text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-1.5 py-0.2 rounded font-semibold">
                                    Anda
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-stone-400" />
                                <span>{user.email}</span>
                              </div>
                              {user.notes && (
                                <div className="text-[11px] text-stone-400 dark:text-stone-500 italic mt-0.5 truncate max-w-xs">
                                  {user.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Contact & Agency */}
                        <td className="py-3.5 px-4 text-xs">
                          <div className="space-y-1">
                            {user.phone ? (
                              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-medium">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{user.phone}</span>
                              </div>
                            ) : (
                              <span className="text-stone-400 italic">No HP tidak dicantumkan</span>
                            )}
                            {user.kloterOrAgency && (
                              <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                                <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span className="truncate max-w-[180px]">{user.kloterOrAgency}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Column 3: Role Selector */}
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center">
                            <select
                              value={user.role}
                              disabled={isSelf}
                              onChange={e => updateUserRole(user.id, e.target.value as UserRole)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                user.role === 'super_admin'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                                  : user.role === 'admin'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                                  : 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-200'
                              } disabled:opacity-75 disabled:cursor-not-allowed`}
                            >
                              <option value="super_admin">👑 Super Admin</option>
                              <option value="admin">👳 Admin</option>
                              <option value="jamaah">🧕 Jamaah</option>
                            </select>
                          </div>
                        </td>

                        {/* Column 4: Status Badge & Reason */}
                        <td className="py-3.5 px-4">
                          <div>
                            {user.status === 'approved' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Approved (Aktif)
                              </span>
                            )}

                            {user.status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                                <Clock className="w-3 h-3" />
                                Pending Approval
                              </span>
                            )}

                            {user.status === 'suspended' && (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                                  <ShieldAlert className="w-3 h-3" />
                                  Suspended (Ditangguhkan)
                                </span>
                                {user.suspendReason && (
                                  <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium leading-tight max-w-xs">
                                    Alasan: {user.suspendReason}
                                  </p>
                                )}
                              </div>
                            )}

                            {user.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400 border border-stone-300">
                                Ditolak (Rejected)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 5: Management Actions */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* IF PENDING: Show Approve & Reject Buttons */}
                            {user.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(user)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                                  title="Setujui Akun (Approve)"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  onClick={() => handleReject(user)}
                                  className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                  title="Tolak Pendaftaran"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Tolak</span>
                                </button>
                              </>
                            )}

                            {/* IF APPROVED: Show Suspend Button */}
                            {user.status === 'approved' && !isSelf && (
                              <button
                                onClick={() => openSuspendModal(user)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                title="Tangguhkan Akun (Suspend)"
                              >
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                <span>Suspend</span>
                              </button>
                            )}

                            {/* IF SUSPENDED: Show Unsuspend / Aktifkan Kembali Button */}
                            {user.status === 'suspended' && (
                              <button
                                onClick={() => handleUnsuspend(user)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                                title="Buka Suspend & Aktifkan Kembali"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Buka Suspend</span>
                              </button>
                            )}

                            {/* Edit Button */}
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                              title="Edit Profil Pengguna"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Button (Protected against self delete) */}
                            {!isSelf && (
                              <button
                                onClick={() => openDeleteModal(user)}
                                className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Riwayat & Log Jejak Aktivitas Super Admin
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Mencatat semua aksi persetujuan, penangguhan akun, dan perubahan hak akses pengguna.
              </p>
            </div>
            <button
              onClick={() => refreshLogs()}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Log</span>
            </button>
          </div>

          {auditLogs.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              Belum ada riwayat aktivitas yang tercatat.
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        log.action.includes('APPROVAL')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : log.action.includes('SUSPEND')
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {log.action.includes('APPROVAL') ? (
                        <Check className="w-4 h-4" />
                      ) : log.action.includes('SUSPEND') ? (
                        <Ban className="w-4 h-4" />
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {log.details || log.action}
                      </div>
                      <div className="text-stone-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>Target: <strong>{log.targetUserName}</strong></span>
                        <span>•</span>
                        <span>Oleh: <strong className="text-emerald-700 dark:text-emerald-400">{log.performedBy}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-400 self-end sm:self-center shrink-0">
                    {new Date(log.timestamp).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: SUSPEND ACCOUNT ================= */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="p-6 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Tangguhkan Akun (Suspend)</h3>
                  <p className="text-xs text-rose-100">Blokir akses masuk pengguna sementara</p>
                </div>
              </div>
              <button
                onClick={() => setShowSuspendModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300">
                <div>Nama: <strong>{selectedUser.name}</strong></div>
                <div>Email: <strong>{selectedUser.email}</strong></div>
                <div>Kloter: <strong>{selectedUser.kloterOrAgency || '-'}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Pilih Alasan Penangguhan:
                </label>
                <select
                  value={suspendReason}
                  onChange={e => setSuspendReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs font-medium focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Pemeriksaan berkas dokumen paspor dan validasi data kloter.">
                    Pemeriksaan berkas dokumen paspor & data kloter
                  </option>
                  <option value="Terindikasi pelanggaran ketentuan akun atau aktivitas mencurigakan.">
                    Terindikasi pelanggaran ketentuan akun
                  </option>
                  <option value="Permintaan penundaan keberangkatan / pengajuan pembatalan jamaah.">
                    Permintaan penundaan keberangkatan jamaah
                  </option>
                  <option value="Menunggu konfirmasi pembayaran dan pelunasan BPIH.">
                    Menunggu konfirmasi pelunasan BPIH
                  </option>
                  <option value="custom">Alasan Lainnya (Tulis Sendiri)...</option>
                </select>
              </div>

              {suspendReason === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tuliskan Alasan Khusus:
                  </label>
                  <textarea
                    value={customSuspendReason}
                    onChange={e => setCustomSuspendReason(e.target.value)}
                    placeholder="Contoh: Menunggu surat rekomendasi dari kantor Kemenag daerah..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-rose-500"
                  ></textarea>
                </div>
              )}

              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                ⚠️ Ketika akun disuspend, pengguna tidak akan dapat login dan akan melihat alasan ini pada layar login.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuspendModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSuspend}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Ban className="w-4 h-4" />
                  <span>Konfirmasi Suspend</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW USER ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-8">
            <div className="p-6 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Tambah Pengguna Baru</h3>
                  <p className="text-xs text-emerald-100">Didaftarkan langsung oleh Super Admin</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={e => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="Contoh: Bpk. H. Ahmad Subardjo"
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={e => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="email@contoh.com"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Kata Sandi Awal *
                  </label>
                  <input
                    type="password"
                    required
                    value={newUserData.password}
                    onChange={e => setNewUserData({ ...newUserData, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Hak Akses (Role)
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={e => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="super_admin">👑 Super Admin</option>
                    <option value="admin">👳 Admin</option>
                    <option value="jamaah">🧕 Jamaah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Status Awal
                  </label>
                  <select
                    value={newUserData.status}
                    onChange={e => setNewUserData({ ...newUserData, status: e.target.value as UserApprovalStatus })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="approved">🟢 Langsung Disetujui (Approved)</option>
                    <option value="pending">🟡 Menunggu Approval (Pending)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={newUserData.phone}
                    onChange={e => setNewUserData({ ...newUserData, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Kloter / KBIHU / Travel
                  </label>
                  <input
                    type="text"
                    value={newUserData.kloterOrAgency}
                    onChange={e => setNewUserData({ ...newUserData, kloterOrAgency: e.target.value })}
                    placeholder="Contoh: Kloter 08 JKG"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Catatan Admin (Opsional)
                </label>
                <input
                  type="text"
                  value={newUserData.notes}
                  onChange={e => setNewUserData({ ...newUserData, notes: e.target.value })}
                  placeholder="Contoh: Pendaftaran manual via kantor pusat..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Simpan Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT USER ================= */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20">
                  <Edit2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Edit Data Pengguna</h3>
                  <p className="text-xs text-stone-300">{selectedUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmEdit} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editUserData.name}
                  onChange={e => setEditUserData({ ...editUserData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={editUserData.email}
                  onChange={e => setEditUserData({ ...editUserData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={editUserData.phone}
                    onChange={e => setEditUserData({ ...editUserData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Hak Akses (Role)
                  </label>
                  <select
                    value={editUserData.role}
                    onChange={e => setEditUserData({ ...editUserData, role: e.target.value as UserRole })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs font-bold focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="super_admin">👑 Super Admin</option>
                    <option value="admin">👳 Admin</option>
                    <option value="jamaah">🧕 Jamaah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Kloter / KBIHU / Travel
                </label>
                <input
                  type="text"
                  value={editUserData.kloterOrAgency}
                  onChange={e => setEditUserData({ ...editUserData, kloterOrAgency: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Catatan Admin
                </label>
                <input
                  type="text"
                  value={editUserData.notes}
                  onChange={e => setEditUserData({ ...editUserData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE USER ================= */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Hapus Akun Pengguna?
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Apakah Anda yakin ingin menghapus akun <strong>{selectedUser.name}</strong> ({selectedUser.email})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
