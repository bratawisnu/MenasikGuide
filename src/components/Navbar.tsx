import React, { useState } from 'react';
import { useManasik } from '../context/ManasikContext';
import { useAuth } from '../context/AuthContext';
import { getThemeClasses } from '../utils/themeStyles';
import { DesignTheme } from '../types';
import {
  BookOpen,
  Presentation,
  CheckCircle2,
  Settings,
  Bell,
  Sparkles,
  Sun,
  Eye,
  Volume2,
  X,
  Users,
  Activity,
  Calendar,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  LogIn,
  LogOut,
  User,
  Clock,
  KeyRound,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentView: 'guide' | 'presentation' | 'progress' | 'cms' | 'superadmin';
  setCurrentView: (view: 'guide' | 'presentation' | 'progress' | 'cms' | 'superadmin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const {
    activeCategory,
    setActiveCategory,
    theme,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    calculateProgress,
    visitorStats,
    refreshVisitorStats
  } = useManasik();

  const {
    currentUser,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    logout,
    openLoginModal,
    pendingUsersCount
  } = useAuth();

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    if (currentView === 'superadmin') {
      setCurrentView('guide');
    }
    setLogoutNotice(true);
    setTimeout(() => {
      setLogoutNotice(false);
    }, 3500);
  };

  const themeClasses = getThemeClasses(theme);
  const umrohProg = calculateProgress('umroh');
  const hajiProg = calculateProgress('haji');
  const currentProg = activeCategory === 'umroh' ? umrohProg : hajiProg;

  return (
    <header className={`sticky top-0 z-40 ${themeClasses.navBg} transition-colors duration-200 shadow-sm`}>
      {/* Logout Success Toast */}
      {logoutNotice && (
        <div className="fixed top-4 right-4 z-50 bg-stone-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-3 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Anda telah berhasil keluar dari akun (Logout).</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand + Live Visitors + Auth Account Menu */}
        <div className="flex items-center justify-between h-16 sm:h-20 border-b border-stone-200/40 dark:border-stone-800">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentView('guide')}
            title="Kembali ke Panduan Utama"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#094838] text-white flex items-center justify-center font-bold text-2xl shadow-xs transition-transform hover:scale-105">
              <span>🕋</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-stone-900 dark:text-stone-100">
                Manasik Pintar
              </span>
              {isSuperAdmin && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Super Admin
                </span>
              )}
            </div>
          </div>

          {/* Right Side Tools: Visitor Counter, Notifications, Auth/Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Visitor Counter Pill */}
            <div className="relative">
              <button
                onClick={() => setShowVisitorModal(!showVisitorModal)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700 transition-all text-stone-700 dark:text-stone-200 text-xs font-semibold cursor-pointer"
                title="Jumlah Pengunjung & Jamaah Online"
                aria-label="Statistik Kunjungan Jamaah"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400">
                  {visitorStats.activeNow || 1} Online
                </span>
                <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>{visitorStats.uniqueVisitors || 1}</span>
                </span>
              </button>

              {/* Visitor Stats Popover Modal */}
              {showVisitorModal && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Statistik Akses Jamaah</h4>
                    </div>
                    <button
                      onClick={() => setShowVisitorModal(false)}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Aktif Sekarang</span>
                      </div>
                      <p className="text-xl font-black text-emerald-950 dark:text-emerald-100 mt-1">
                        {visitorStats.activeNow} <span className="text-xs font-medium text-emerald-700">jamaah</span>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Hari Ini</span>
                      </div>
                      <p className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1">
                        {visitorStats.todayVisits.toLocaleString('id-ID')} <span className="text-xs font-medium text-stone-500">kali</span>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>Jamaah Unik</span>
                      </div>
                      <p className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1">
                        {visitorStats.uniqueVisitors.toLocaleString('id-ID')} <span className="text-xs font-medium text-stone-500">orang</span>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/40">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Total Akses</span>
                      </div>
                      <p className="text-xl font-black text-amber-950 dark:text-amber-100 mt-1">
                        {visitorStats.totalVisits.toLocaleString('id-ID')} <span className="text-xs font-medium text-amber-700">kali</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500">
                    <span>Diperbarui secara real-time</span>
                    <button
                      onClick={() => refreshVisitorStats()}
                      className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Refresh
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifModal(!showNotifModal)}
                className="w-10 h-10 rounded-full border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center relative transition-colors cursor-pointer"
                title="Pemberitahuan & Pengingat Belajar"
                aria-label="Notifikasi Belajar"
              >
                <Bell className="w-5 h-5 text-stone-700 dark:text-stone-200" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifModal && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-stone-900 dark:text-stone-100">Notifikasi Progres Jamaah</h4>
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-emerald-700 hover:underline font-medium"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-sm text-stone-500">Belum ada notifikasi baru.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                            !n.read ? 'bg-emerald-50/70 dark:bg-emerald-950/40' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">{n.title}</h5>
                            <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifModal(false)}
                    className="w-full mt-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                  >
                    Tutup Notifikasi
                  </button>
                </div>
              )}
            </div>

            {/* USER AUTHENTICATION TRIGGER / PROFILE DROPDOWN */}
            <div className="relative">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                      title="Klik untuk membuka menu akun"
                      aria-expanded={showUserDropdown}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                          currentUser.role === 'super_admin'
                            ? 'bg-amber-600'
                            : currentUser.role === 'admin'
                            ? 'bg-emerald-600'
                            : 'bg-stone-700'
                        }`}
                      >
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden md:block">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate max-w-[120px]">
                          {currentUser.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          {currentUser.role === 'super_admin' ? '👑 Super Admin' : currentUser.role === 'admin' ? '👳 Pembimbing' : '🧕 Jamaah'}
                        </div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
                    </button>

                    {/* Profile Dropdown with Backdrop */}
                    {showUserDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                          onClick={() => setShowUserDropdown(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                          <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                            <p className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                              {currentUser.name}
                            </p>
                            <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                            <div className="mt-2 flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                currentUser.role === 'super_admin'
                                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                                  : currentUser.role === 'admin'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-stone-100 text-stone-800'
                              }`}>
                                {currentUser.role === 'super_admin' ? 'Super Administrator' : currentUser.role === 'admin' ? 'Pembimbing Haji' : 'Jamaah Terdaftar'}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                ✓ Approved
                              </span>
                            </div>
                          </div>

                          <div className="py-2 space-y-1">
                            {isSuperAdmin && (
                              <button
                                onClick={() => {
                                  setCurrentView('superadmin');
                                  setShowUserDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 flex items-center justify-between transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <span>👑</span> Panel Super Admin
                                </span>
                                {pendingUsersCount > 0 && (
                                  <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                                    {pendingUsersCount}
                                  </span>
                                )}
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setCurrentView('guide');
                                setShowUserDropdown(false);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                              <span>Panduan Manasik</span>
                            </button>

                            <button
                              onClick={() => {
                                setCurrentView('progress');
                                setShowUserDropdown(false);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>Status Belajar Saya</span>
                            </button>

                            {/* CMS Konten hanya untuk role Admin & Super Admin */}
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  setCurrentView('cms');
                                  setShowUserDropdown(false);
                                }}
                                className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                              >
                                <Settings className="w-3.5 h-3.5 text-stone-400" />
                                <span>CMS Konten</span>
                              </button>
                            )}
                          </div>

                          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/70 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Keluar (Logout)</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openLoginModal(false)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b6b4f] hover:bg-[#095740] text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </button>

                  <button
                    onClick={() => openLoginModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-sm border border-stone-200 transition-all cursor-pointer"
                  >
                    <span>Daftar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Nav Bar: Category Switcher (Haji vs Umroh) + Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between py-2.5 gap-2">
          {/* Haji vs Umroh Pill Toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200/80 dark:border-stone-700">
            <button
              onClick={() => setActiveCategory('umroh')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'umroh'
                  ? 'bg-[#0b6b4f] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 dark:text-stone-300'
              }`}
            >
              <span>🌙 Umroh</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeCategory === 'umroh' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                {umrohProg.percentage}%
              </span>
            </button>
            <button
              onClick={() => setActiveCategory('haji')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'haji'
                  ? 'bg-[#0b6b4f] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 dark:text-stone-300'
              }`}
            >
              <span>🕋 Haji</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeCategory === 'haji' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                {hajiProg.percentage}%
              </span>
            </button>
          </div>

          {/* Main App Mode Views */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setCurrentView('guide')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentView === 'guide'
                  ? 'bg-[#0b6b4f] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Panduan Jamaah</span>
            </button>

            <button
              onClick={() => setCurrentView('presentation')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentView === 'presentation'
                  ? 'bg-[#0b6b4f] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>Mode Presentasi</span>
            </button>

            <button
              onClick={() => setCurrentView('progress')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentView === 'progress'
                  ? 'bg-[#0b6b4f] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Progres & Kuis</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {currentProg.completed}/{currentProg.total}
              </span>
            </button>

            {/* SUPER ADMIN PAGE TAB (Hanya tampil jika role adalah super_admin) */}
            {isSuperAdmin && (
              <button
                onClick={() => setCurrentView('superadmin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentView === 'superadmin'
                    ? 'bg-[#0b6b4f] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
                title="Halaman Super Admin (Kelola Pengguna, Approval & Suspend)"
              >
                <span>👑</span>
                <span>Super Admin</span>
                {pendingUsersCount > 0 && (
                  <span className="bg-rose-100 text-rose-700 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                    {pendingUsersCount}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
