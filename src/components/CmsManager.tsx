import React, { useState } from 'react';
import { useManasik } from '../context/ManasikContext';
import { useAuth } from '../context/AuthContext';
import { getThemeClasses } from '../utils/themeStyles';
import { ManasikStep, StepType, ManasikCategory, PrayerItem } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  RotateCcw,
  Save,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity,
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';

export const CmsManager: React.FC = () => {
  const { currentUser, isAdmin, isSuperAdmin } = useAuth();
  const {
    steps,
    activeCategory,
    activeCurriculumId,
    activeCurriculumInfo,
    availableCurricula,
    switchCurriculum,
    addStep,
    updateStep,
    deleteStep,
    reorderStep,
    resetDefaultCurriculum,
    exportCurriculumJson,
    importCurriculumJson,
    visitorStats,
    refreshVisitorStats,
    resetVisitorStats,
    theme
  } = useManasik();

  const themeClasses = getThemeClasses(theme);

  const [selectedCatFilter, setSelectedCatFilter] = useState<ManasikCategory>(activeCategory);
  const [editingStep, setEditingStep] = useState<ManasikStep | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const filteredSteps = steps
    .filter(s => s.category === selectedCatFilter)
    .sort((a, b) => a.stepNumber - b.stepNumber);

  // Blank step template for creating new
  const blankStep: Omit<ManasikStep, 'id'> = {
    category: selectedCatFilter,
    stepNumber: filteredSteps.length + 1,
    title: '',
    arabicTitle: '',
    statusType: 'rukun',
    location: 'Masjidil Haram, Makkah',
    dayOrTime: 'Hari Pelaksanaan',
    shortDesc: '',
    fullDesc: '',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-' + Date.now(),
        title: 'Doa Utama',
        arabic: '',
        latin: '',
        translation: '',
        repetition: '1x'
      }
    ],
    elderlyTips: ['Gunakan alas kaki yang nyaman dan bawa botol air minum.'],
    doAndDonts: {
      do: ['Menjaga wudhu dan berdzikir'],
      dont: ['Mendorong jamaah lain']
    },
    presenterNotes: 'Fokuskan pada bimbingan jamaah lansia.'
  };

  const handleStartCreate = () => {
    setEditingStep({ ...blankStep, id: 'temp-' + Date.now() });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (step: ManasikStep) => {
    setEditingStep(JSON.parse(JSON.stringify(step)));
    setIsCreatingNew(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStep) return;

    if (!editingStep.title.trim()) {
      setNotificationMsg('Judul tahapan wajib diisi.');
      setTimeout(() => setNotificationMsg(null), 3000);
      return;
    }

    if (isCreatingNew) {
      const { id, ...stepData } = editingStep;
      addStep(stepData);
      setNotificationMsg('Tahap baru berhasil ditambahkan.');
    } else {
      updateStep(editingStep);
      setNotificationMsg('Perubahan materi berhasil disimpan.');
    }

    setEditingStep(null);
    setIsCreatingNew(false);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    deleteStep(id);
    setNotificationMsg(`Materi "${title}" berhasil dihapus.`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportCurriculumJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kurikulum-manasik-${selectedCatFilter}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = importCurriculumJson(importJsonText);
    if (success) {
      setShowImportModal(false);
      setImportJsonText('');
      setNotificationMsg('Kurikulum kustom berhasil diimpor!');
      setTimeout(() => setNotificationMsg(null), 3000);
    } else {
      setNotificationMsg('Format JSON tidak valid atau struktur tidak sesuai. Pastikan file berasal dari export aplikasi.');
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Alert Notification */}
      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Live Visitor Statistics Overview Card */}
      <section className={`${themeClasses.cardBg} rounded-3xl p-6 sm:p-7 border shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
                Statistik Akses & Pengunjung Aplikasi
              </h3>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Pantau jumlah calon jamaah dan pembimbing yang mengakses materi manasik secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await refreshVisitorStats();
                setNotificationMsg('Data statistik akses berhasil diperbarui.');
                setTimeout(() => setNotificationMsg(null), 2500);
              }}
              className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-200 dark:border-stone-700"
              title="Perbarui Data Statistik"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang</span>
            </button>

            <button
              onClick={() => {
                resetVisitorStats();
                setNotificationMsg('Penghitung akses telah direset untuk kloter baru.');
                setTimeout(() => setNotificationMsg(null), 3000);
              }}
              className="px-3 py-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Reset hitungan untuk kloter bimbingan baru"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Kloter</span>
            </button>
          </div>
        </div>

        {/* 4 Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Active Now */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Aktif Saat Ini
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900/60 font-black">
                LIVE
              </span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-emerald-950 dark:text-emerald-50 tracking-tight">
                {visitorStats.activeNow}
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 ml-1.5">jamaah online</span>
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-1">
              Perangkat yang terhubung sekarang
            </p>
          </div>

          {/* Today Visits */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Akses Hari Ini
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Hari ini</span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {visitorStats.todayVisits.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-semibold text-stone-500 ml-1.5">kali dibuka</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Akumulasi kunjungan hari ini
            </p>
          </div>

          {/* Unique Visitors */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Jamaah Unik
              </span>
              <span className="text-[10px] text-stone-400">Total</span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {visitorStats.uniqueVisitors.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-semibold text-stone-500 ml-1.5">orang</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Berdasarkan ID perangkat unik
            </p>
          </div>

          {/* Total Visits */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-600" />
                Total Kunjungan
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 font-black">
                ALL TIME
              </span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-amber-950 dark:text-amber-50 tracking-tight">
                {visitorStats.totalVisits.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 ml-1.5">kali</span>
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400 mt-1">
              Seluruh sesi pembukaan materi
            </p>
          </div>
        </div>
      </section>

      {/* Header & Controls Bar */}
      <section className={`${themeClasses.cardBg} rounded-3xl p-6 sm:p-8 border shadow-sm`}>
        {/* Multi-Admin Curriculum Info & Switcher */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xl font-bold shadow-xs">
              {currentUser?.role === 'super_admin' ? '👑' : '👳'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {currentUser?.role === 'super_admin' ? 'Portal Super Admin' : 'Admin CMS Mandiri'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                  {activeCurriculumInfo.title}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Pengelola: <strong>{activeCurriculumInfo.authorName}</strong> ({activeCurriculumInfo.agency || 'KBIHU / Travel'})
                {currentUser?.role === 'admin' && ' • Seluruh perubahan tersimpan otomatis ke kurikulum mandiri Anda.'}
              </p>
            </div>
          </div>

          {/* Super Admin can switch which Admin's curriculum they are inspecting/managing */}
          {isSuperAdmin && (
            <div className="flex items-center gap-2 shrink-0 bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400 whitespace-nowrap">
                Kelola Kurikulum:
              </span>
              <select
                value={activeCurriculumId}
                onChange={e => switchCurriculum(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 cursor-pointer focus:ring-2 focus:ring-emerald-500"
              >
                {availableCurricula.map(c => {
                  const cleanTitle = c.title.replace(/\s*\(Super Admin\)/gi, '').trim();
                  return (
                    <option key={c.id} value={c.id}>
                      {c.role === 'system' ? '🏛️ ' : c.role === 'super_admin' ? '👑 ' : '👳 '}
                      {cleanTitle} ({c.stepsCount} materi)
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>⚙️ CMS Pengelolaan Kurikulum Manasik</span>
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Sesuaikan urutan rukun, doa, tips lansia, dan materi bimbingan sesuai KBIHU / Travel Anda.
            </p>
          </div>

          {/* Action buttons: Add, Export, Import, Reset */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleStartCreate}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Materi</span>
            </button>

            <button
              onClick={handleExport}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 border border-stone-300 dark:border-stone-700"
              title="Ekspor Kurikulum JSON"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor JSON</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 border border-stone-300 dark:border-stone-700"
              title="Impor Kurikulum JSON"
            >
              <Upload className="w-4 h-4" />
              <span>Impor JSON</span>
            </button>

            <button
              onClick={() => {
                resetDefaultCurriculum();
                setNotificationMsg('Kurikulum berhasil dikembalikan ke standar Kemenag & Haramain.');
                setTimeout(() => setNotificationMsg(null), 3000);
              }}
              className="min-h-[44px] px-3 py-2 rounded-xl text-stone-500 hover:text-red-600 font-medium text-xs flex items-center gap-1"
              title="Kembalikan ke Kurikulum Standar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
          </div>
        </div>

        {/* Category Tab Filter */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setSelectedCatFilter('umroh')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCatFilter === 'umroh'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 hover:text-stone-900'
            }`}
          >
            🌙 Kurikulum Umroh ({steps.filter(s => s.category === 'umroh').length} Tahap)
          </button>
          <button
            onClick={() => setSelectedCatFilter('haji')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCatFilter === 'haji'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 hover:text-stone-900'
            }`}
          >
            🕋 Kurikulum Haji ({steps.filter(s => s.category === 'haji').length} Tahap)
          </button>
        </div>
      </section>

      {/* Step Management List */}
      <section className="flex flex-col gap-3">
        {filteredSteps.map((step, idx) => (
          <div
            key={step.id}
            className={`${themeClasses.cardBg} rounded-2xl p-4 sm:p-5 border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all`}
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Step order index */}
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                {idx + 1}
              </div>

              {/* Thumbnail */}
              <img
                src={step.imageUrl}
                alt={step.title}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      step.statusType === 'rukun'
                        ? 'bg-emerald-100 text-emerald-800'
                        : step.statusType === 'wajib'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {step.statusType}
                  </span>
                  <span className="text-xs text-stone-400 font-arabic" dir="rtl">
                    {step.arabicTitle}
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100 truncate mt-0.5">
                  {step.title}
                </h4>
                <p className="text-xs text-stone-500 truncate">
                  {step.location} • {step.prayers.length} Doa • {step.elderlyTips.length} Tips Lansia
                </p>
              </div>
            </div>

            {/* Actions: Move Up / Down, Edit, Delete */}
            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
              <button
                onClick={() => reorderStep(step.id, 'up')}
                disabled={idx === 0}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 disabled:opacity-30"
                title="Pindah ke Atas"
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => reorderStep(step.id, 'down')}
                disabled={idx === filteredSteps.length - 1}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 disabled:opacity-30"
                title="Pindah ke Bawah"
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleStartEdit(step)}
                className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100"
                title="Edit Materi"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDelete(step.id, step.title)}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50"
                title="Hapus Materi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Editor Modal for Adding / Editing a Step */}
      {editingStep && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                {isCreatingNew ? '➕ Tambah Tahap Manasik Baru' : `✏️ Edit: ${editingStep.title}`}
              </h3>
              <button
                onClick={() => setEditingStep(null)}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex flex-col gap-5">
              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                    Kategori Ibadah
                  </label>
                  <select
                    value={editingStep.category}
                    onChange={e =>
                      setEditingStep({ ...editingStep, category: e.target.value as ManasikCategory })
                    }
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-semibold"
                  >
                    <option value="umroh">🌙 Umroh</option>
                    <option value="haji">🕋 Haji</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                    Status Hukum
                  </label>
                  <select
                    value={editingStep.statusType}
                    onChange={e =>
                      setEditingStep({ ...editingStep, statusType: e.target.value as StepType })
                    }
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-semibold"
                  >
                    <option value="rukun">⭐ Rukun (Wajib dilakukan sendiri, tidak sah jika tertinggal)</option>
                    <option value="wajib">⚡ Wajib (Bila tertinggal wajib dam / denda)</option>
                    <option value="sunnah">✨ Sunnah (Mendapat pahala tambahan)</option>
                  </select>
                </div>
              </div>

              {/* Title & Arabic Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                    Judul Tahap (Bahasa Indonesia) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStep.title}
                    onChange={e => setEditingStep({ ...editingStep, title: e.target.value })}
                    placeholder="Contoh: Tawaf 7 Putaran"
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                    Judul Kaligrafi Arab
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingStep.arabicTitle}
                    onChange={e => setEditingStep({ ...editingStep, arabicTitle: e.target.value })}
                    placeholder="الطَّوَافُ حَوْلَ الْكَعْبَةِ"
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-arabic text-right"
                  />
                </div>
              </div>

              {/* Location & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                    Lokasi Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={editingStep.location}
                    onChange={e => setEditingStep({ ...editingStep, location: e.target.value })}
                    placeholder="Contoh: Masjidil Haram / Padang Arafah"
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                    Waktu / Hari Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={editingStep.dayOrTime}
                    onChange={e => setEditingStep({ ...editingStep, dayOrTime: e.target.value })}
                    placeholder="Contoh: 9 Dzulhijjah / Setelah Miqat"
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                  URL Gambar Ilustrasi / Foto Lokasi
                </label>
                <input
                  type="url"
                  value={editingStep.imageUrl}
                  onChange={e => setEditingStep({ ...editingStep, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                />
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                  Ringkasan Inti (Singkat untuk Lansia)
                </label>
                <textarea
                  rows={2}
                  value={editingStep.shortDesc}
                  onChange={e => setEditingStep({ ...editingStep, shortDesc: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat..."
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                  Deskripsi Lengkap Tata Cara
                </label>
                <textarea
                  rows={3}
                  value={editingStep.fullDesc}
                  onChange={e => setEditingStep({ ...editingStep, fullDesc: e.target.value })}
                  placeholder="Penjelasan lengkap tata cara..."
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                />
              </div>

              {/* Doa / Prayers Editor (Primary prayer) */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-3">
                  🤲 Doa / Dzikir Terkait
                </span>
                {editingStep.prayers.map((pr, pIndex) => (
                  <div key={pr.id} className="flex flex-col gap-2.5 mb-4 pb-3 border-b border-stone-200 dark:border-stone-700">
                    <input
                      type="text"
                      placeholder="Judul Doa (Contoh: Doa Masuk Masjid)"
                      value={pr.title}
                      onChange={e => {
                        const updated = [...editingStep.prayers];
                        updated[pIndex].title = e.target.value;
                        setEditingStep({ ...editingStep, prayers: updated });
                      }}
                      className="w-full p-2.5 rounded-lg border text-xs font-bold"
                    />
                    <textarea
                      dir="rtl"
                      rows={2}
                      placeholder="Teks Arab (Berharakat)"
                      value={pr.arabic}
                      onChange={e => {
                        const updated = [...editingStep.prayers];
                        updated[pIndex].arabic = e.target.value;
                        setEditingStep({ ...editingStep, prayers: updated });
                      }}
                      className="w-full p-2.5 rounded-lg border text-sm font-arabic text-right"
                    />
                    <input
                      type="text"
                      placeholder="Transliterasi Latin"
                      value={pr.latin}
                      onChange={e => {
                        const updated = [...editingStep.prayers];
                        updated[pIndex].latin = e.target.value;
                        setEditingStep({ ...editingStep, prayers: updated });
                      }}
                      className="w-full p-2.5 rounded-lg border text-xs"
                    />
                    <textarea
                      rows={2}
                      placeholder="Terjemahan Bahasa Indonesia"
                      value={pr.translation}
                      onChange={e => {
                        const updated = [...editingStep.prayers];
                        updated[pIndex].translation = e.target.value;
                        setEditingStep({ ...editingStep, prayers: updated });
                      }}
                      className="w-full p-2.5 rounded-lg border text-xs"
                    />
                  </div>
                ))}
              </div>

              {/* Elderly Tips (Comma or line separated) */}
              <div>
                <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                  Tips Khusus Lansia & Risti (Pisahkan dengan baris baru)
                </label>
                <textarea
                  rows={3}
                  value={editingStep.elderlyTips.join('\n')}
                  onChange={e =>
                    setEditingStep({
                      ...editingStep,
                      elderlyTips: e.target.value.split('\n').filter(t => t.trim().length > 0)
                    })
                  }
                  placeholder="Tips 1 per baris..."
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                />
              </div>

              {/* Presenter Notes */}
              <div>
                <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                  Catatan Pembimbing / Muthawwif (Hanya terlihat di Mode Presentasi)
                </label>
                <textarea
                  rows={2}
                  value={editingStep.presenterNotes}
                  onChange={e => setEditingStep({ ...editingStep, presenterNotes: e.target.value })}
                  placeholder="Catatan penceramah..."
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingStep(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              <span>Impor Format Kurikulum JSON</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Tempelkan (paste) struktur JSON kurikulum manasik yang sebelumnya diekspor.
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder='[ { "category": "umroh", "title": "...", ... } ]'
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 font-mono text-xs mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border"
              >
                Batal
              </button>
              <button
                onClick={handleImport}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Impor Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
