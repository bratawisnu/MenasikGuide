import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    initialRegisterMode,
    login,
    register,
    loading
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [kloterOrAgency, setKloterOrAgency] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'suspended' | 'pending' | 'success';
    message: string;
    details?: string;
  } | null>(null);

  useEffect(() => {
    if (isLoginModalOpen) {
      setMode(initialRegisterMode ? 'register' : 'login');
      setErrorMessage(null);
      setStatusNotice(null);
    }
  }, [isLoginModalOpen, initialRegisterMode]);

  if (!isLoginModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusNotice(null);

    if (!email || !password) {
      setErrorMessage('Silakan lengkapi email dan kata sandi Anda.');
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      if (res.status === 'suspended') {
        setStatusNotice({
          type: 'suspended',
          message: 'Akun Anda Sedang Ditangguhkan (SUSPENDED)',
          details: res.suspendReason || 'Akun dinonaktifkan sementara oleh Super Admin. Silakan hubungi sekretariat kloter / admin pengelola.'
        });
      } else if (res.status === 'pending') {
        setStatusNotice({
          type: 'pending',
          message: 'Pendaftaran Akun Sedang Menunggu Persetujuan (Pending Approval)',
          details: 'Data Anda telah kami terima dan sedang diverifikasi oleh Super Admin. Anda akan dapat masuk setelah disetujui.'
        });
      } else {
        setErrorMessage(res.message || 'Login gagal. Periksa kembali email dan kata sandi.');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusNotice(null);

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Nama lengkap, email, dan password wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const res = await register({
      name,
      email,
      password,
      phone,
      kloterOrAgency,
      role: 'jamaah'
    });

    if (res.success) {
      setStatusNotice({
        type: 'success',
        message: 'Pendaftaran Berhasil Dikirim!',
        details: 'Akun Anda telah masuk antrean approval Super Admin. Begitu akun disetujui, Anda dapat langsung login.'
      });
      // Switch to login tab and prefill email
      setMode('login');
      setPassword('');
      setConfirmPassword('');
    } else {
      setErrorMessage(res.message || 'Pendaftaran gagal.');
    }
  };

  // Quick Demo Login Helper
  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
    setStatusNotice(null);
    const res = await login(demoEmail, demoPass);
    if (!res.success) {
      if (res.status === 'suspended') {
        setStatusNotice({
          type: 'suspended',
          message: 'Akun Demo Ini Berstatus SUSPENDED',
          details: res.suspendReason || 'Akun dinonaktifkan sementara untuk pengujian.'
        });
      } else if (res.status === 'pending') {
        setStatusNotice({
          type: 'pending',
          message: 'Akun Demo Ini Berstatus PENDING APPROVAL',
          details: 'Menunggu persetujuan Super Admin. Silakan login sebagai Super Admin untuk menyetujui akun ini.'
        });
      } else {
        setErrorMessage(res.message || 'Login gagal.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-8">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 relative">
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              🕋
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Manasik Pintar
                <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Akun & Akses
                </span>
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                {mode === 'login' ? 'Masuk ke portal manasik haji & umroh' : 'Daftar sebagai jamaah atau pembimbing baru'}
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex mt-5 bg-emerald-900/50 p-1 rounded-2xl border border-emerald-600/40">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setStatusNotice(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setStatusNotice(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status Alert: Suspended Account */}
          {statusNotice?.type === 'suspended' && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                    {statusNotice.message}
                  </h4>
                  <p className="text-xs mt-1 text-rose-700 dark:text-rose-400 leading-relaxed">
                    {statusNotice.details}
                  </p>
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-2">
                    💡 Hubungi Super Admin atau ketua rombongan kloter Anda untuk proses pemulihan akses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Alert: Pending Approval */}
          {statusNotice?.type === 'pending' && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
                    {statusNotice.message}
                  </h4>
                  <p className="text-xs mt-1 text-amber-700 dark:text-amber-300 leading-relaxed">
                    {statusNotice.details}
                  </p>
                  <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 mt-2">
                    ⚡ Petunjuk: Anda dapat login sebagai <strong>Super Admin</strong> menggunakan tombol 1-Klik di bawah untuk menyetujui akun ini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Alert: Registration Success */}
          {statusNotice?.type === 'success' && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    {statusNotice.message}
                  </h4>
                  <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    {statusNotice.details}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* General Error Notice */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Kata Sandi (Password)
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block animate-spin">⌛</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Masuk ke Akun</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nama
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Hj. Siti Aminah"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nomor
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="08123456789"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Ulangi Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                ℹ️ <strong>Catatan Keamanan:</strong> Pendaftaran akun baru otomatis masuk ke antrean verifikasi status <strong>Pending Approval</strong> dan akan ditinjau oleh Super Admin.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block animate-spin">⌛</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ajukan Pendaftaran Akun</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* QUICK 1-CLICK DEMO ACCOUNTS (Crucial for convenient testing) */}
          <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Uji Coba Cepat (Akun Demo 1-Klik):
              </span>
              <span className="text-[10px] text-stone-400">Klik langsung untuk masuk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 1. Super Admin Utama (Yusuf Wisnubrata) */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('yusufwisnubrata26@gmail.com', 'admin123')}
                className="text-left p-2.5 rounded-xl border-2 border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 dark:text-emerald-100 flex items-center gap-1">
                    👑 Yusuf Wisnubrata
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 px-1.5 py-0.5 rounded">
                    Super Admin
                  </span>
                </div>
                <div className="text-[11px] text-stone-700 dark:text-stone-300 font-medium truncate mt-0.5">
                  yusufwisnubrata26@gmail.com
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-300 group-hover:underline flex items-center gap-1 mt-1 font-semibold">
                  <span>Akses Super Admin Pemilik</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>

              {/* 2. Super Admin Demo (KH. Abdullah Syukri) */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('superadmin@manasik.id', 'admin123')}
                className="text-left p-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1">
                    👑 KH. Abdullah Syukri
                  </span>
                  <span className="text-[10px] font-bold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded">
                    Super Admin
                  </span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-stone-400 truncate mt-0.5">
                  superadmin@manasik.id
                </div>
                <div className="text-[10px] text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <span>Kelola User, Approval & Suspend</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>

              {/* 3. Pembimbing / Admin Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ustadz@manasik.id', 'ustadz123')}
                className="text-left p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                    👳 Ustadz Hilman Fawzi
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-stone-400 truncate mt-0.5">
                  ustadz@manasik.id
                </div>
                <div className="text-[10px] text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <span>Akses Panduan, Presentasi & CMS</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>

              {/* 4. Jamaah Aktif (Hj. Siti Aminah) */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('siti.aminah@gmail.com', 'jamaah123')}
                className="text-left p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                    🧕 Hj. Siti Aminah
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    Jamaah Aktif
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">
                  siti.aminah@gmail.com
                </div>
                <div className="text-[10px] text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <span>Akses Materi & Panduan Manasik</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>

              {/* 5. Pending Account Test Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('hendra.kusuma@gmail.com', 'jamaah123')}
                className="text-left p-2.5 rounded-xl border border-dashed border-amber-300 dark:border-amber-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    ⏳ Tes Akun Pending
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    Butuh Approval
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">
                  hendra.kusuma@gmail.com
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                  Uji notifikasi status menunggu approval
                </div>
              </button>

              {/* 6. Suspended Account Test Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farhan.suspended@gmail.com', 'jamaah123')}
                className="text-left p-2.5 rounded-xl border border-dashed border-rose-300 dark:border-rose-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    🚫 Tes Akun Suspended
                  </span>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                    Tersuspend
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">
                  farhan.suspended@gmail.com
                </div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                  Uji penolakan login akun disuspend
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
