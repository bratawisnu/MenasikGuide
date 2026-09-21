import React, { useState } from 'react';
import { ManasikProvider, useManasik } from './context/ManasikContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { StepTimeline } from './components/StepTimeline';
import { StepDetailView } from './components/StepDetailView';
import { PresentationMode } from './components/PresentationMode';
import { ProgressAndQuizView } from './components/ProgressAndQuizView';
import { CmsManager } from './components/CmsManager';
import { SuperAdminView } from './components/SuperAdminView';
import { LoginModal } from './components/LoginModal';
import { getThemeClasses } from './utils/themeStyles';
import {
  HeartHandshake,
  Sparkles,
  PhoneCall,
  Volume2,
  Type,
  Presentation,
  Minus,
  ChevronUp
} from 'lucide-react';

function MainAppContent() {
  const { theme, activeCategory, setActiveCategory, accessibility, updateAccessibility, visitorStats } = useManasik();
  const { isAdmin, isSuperAdmin, openLoginModal } = useAuth();
  const [currentView, setCurrentView] = useState<'guide' | 'presentation' | 'progress' | 'cms' | 'superadmin'>('guide');
  const [isHelperMinimized, setIsHelperMinimized] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('manasik_helper_minimized_v2');
      if (saved !== null) {
        return saved === 'true';
      }
      return true; // Default kondisi awal adalah minimized
    } catch {
      return true;
    }
  });

  const toggleHelperMinimize = (minimized: boolean) => {
    setIsHelperMinimized(minimized);
    try {
      localStorage.setItem('manasik_helper_minimized_v2', String(minimized));
    } catch {
      // ignore
    }
  };

  const themeClasses = getThemeClasses(theme);

  // If in presentation mode, show presentation mode as an immersive view
  if (currentView === 'presentation') {
    return <PresentationMode onExit={() => setCurrentView('guide')} />;
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-200 selection:text-emerald-950`}>
      {/* Main Top Header Navbar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'guide' && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sequential Timeline Sidebar */}
            <StepTimeline />

            {/* Interactive Step Detail with Doa & Audio */}
            <StepDetailView />
          </div>
        )}

        {currentView === 'progress' && <ProgressAndQuizView />}

        {currentView === 'cms' && (
          isAdmin ? (
            <CmsManager />
          ) : (
            <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold border border-amber-200 dark:border-amber-800">
                🔒
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Akses CMS Terbatas
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Halaman CMS Konten khusus diperuntukkan bagi <strong>Admin</strong> dan <strong>Super Admin</strong> untuk mengelola tahapan, doa, dan materi manasik.
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Sebagai Jamaah, Anda dapat langsung mempelajari seluruh materi, memutar audio doa, dan mengevaluasi pemahaman di menu utama tanpa perlu login.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentView('guide')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Kembali ke Panduan Jamaah
                </button>
                <button
                  onClick={() => openLoginModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Masuk sebagai Admin
                </button>
              </div>
            </div>
          )
        )}

        {currentView === 'superadmin' && (
          isSuperAdmin ? (
            <SuperAdminView onBackToGuide={() => setCurrentView('guide')} />
          ) : (
            <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold border border-rose-200 dark:border-rose-800">
                👑
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Akses Khusus Super Admin
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Halaman ini hanya dapat diakses oleh akun dengan role <strong>Super Admin</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('guide')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Kembali ke Panduan Jamaah
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Login & Registration Modal */}
      <LoginModal />

      {/* Floating Bottom Elderly Helper Bar (Quick Access for seniors) */}
      {isHelperMinimized ? (
        <button
          onClick={() => toggleHelperMinimize(false)}
          className="fixed bottom-4 right-4 z-30 flex items-center gap-2 bg-stone-900/90 hover:bg-stone-800 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-stone-700/80 transition-all hover:scale-105 cursor-pointer group"
          title="Buka Panel Bantuan Lansia & Ukuran Teks"
          aria-label="Buka Panel Bantuan Lansia"
        >
          <HeartHandshake className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-amber-400">Bantuan Lansia</span>
          <div className="w-5 h-5 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 group-hover:text-emerald-400 transition-colors">
            <ChevronUp className="w-3.5 h-3.5" />
          </div>
        </button>
      ) : (
        <aside
          aria-label="Aksesibilitas Cepat Jamaah Lansia"
          className="fixed bottom-4 right-4 z-30 flex items-center gap-2 bg-stone-900/90 text-white backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-stone-700/80 transition-all"
        >
          <span className="text-xs font-bold text-amber-400 hidden sm:inline flex items-center gap-1">
            <HeartHandshake className="w-4 h-4" /> Bantuan Lansia:
          </span>

          {/* Quick font toggle */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => updateAccessibility({ fontSize: 'normal' })}
              className={`px-2 py-0.5 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                accessibility.fontSize === 'normal' ? 'bg-emerald-600 text-white' : 'text-stone-300 hover:text-white'
              }`}
              title="Teks Normal"
            >
              A
            </button>
            <button
              onClick={() => updateAccessibility({ fontSize: 'large' })}
              className={`px-2 py-0.5 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                accessibility.fontSize === 'large' ? 'bg-emerald-600 text-white' : 'text-stone-300 hover:text-white'
              }`}
              title="Teks Besar"
            >
              A+
            </button>
            <button
              onClick={() => updateAccessibility({ fontSize: 'xlarge' })}
              className={`px-2 py-0.5 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                accessibility.fontSize === 'xlarge' ? 'bg-emerald-600 text-white' : 'text-stone-300 hover:text-white'
              }`}
              title="Teks Ekstra Besar"
            >
              A++
            </button>
          </div>

          {/* Quick Presentation Projector Mode Button */}
          <button
            onClick={() => setCurrentView('presentation')}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            title="Buka Mode Presentasi Layar Proyektor"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Proyektor</span>
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => toggleHelperMinimize(true)}
            className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer ml-0.5"
            title="Kecilkan / Minimize Panel"
            aria-label="Kecilkan Panel Bantuan Lansia"
          >
            <Minus className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 py-8 text-center text-xs sm:text-sm text-stone-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-stone-700">
            <span>🕋 Manasik Pintar</span>
            <span className="text-stone-400">•</span>
            <span className="font-normal text-stone-500">CMS & Panduan Interaktif Haji & Umroh Ramah Lansia</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 text-xs">
            <div className="flex items-center gap-2 bg-stone-100 text-stone-700 px-3 py-1.5 rounded-xl font-medium border border-stone-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-700">{visitorStats.activeNow} Jamaah Online</span>
              <span className="text-stone-300">|</span>
              <span>{visitorStats.totalVisits.toLocaleString('id-ID')} Total Kunjungan ({visitorStats.uniqueVisitors.toLocaleString('id-ID')} Jamaah Unik)</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
              Pedoman Kemenag & Syariat Shahih
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ManasikProvider>
        <MainAppContent />
      </ManasikProvider>
    </AuthProvider>
  );
}
