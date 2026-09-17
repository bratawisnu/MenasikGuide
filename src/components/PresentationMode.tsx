import React, { useState, useEffect, useRef } from 'react';
import { useManasik } from '../context/ManasikContext';
import { playTextSpeech, stopTextSpeech } from '../utils/audioHelper';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Eye,
  Volume2,
  VolumeX,
  FileText,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Target,
  Users
} from 'lucide-react';

interface PresentationModeProps {
  onExit: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({ onExit }) => {
  const {
    filteredSteps,
    selectedStepId,
    setSelectedStepId,
    activeCategory,
    accessibility,
    visitorStats
  } = useManasik();

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = filteredSteps.findIndex(s => s.id === selectedStepId);
    return idx !== -1 ? idx : 0;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showSlideIndex, setShowSlideIndex] = useState(false);
  const [laserPointerActive, setLaserPointerActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlayingDoa, setIsPlayingDoa] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentStep = filteredSteps[currentIndex] || filteredSteps[0];

  // Update selectedStepId in context
  useEffect(() => {
    if (currentStep) {
      setSelectedStepId(currentStep.id);
    }
    stopTextSpeech();
    setIsPlayingDoa(false);
  }, [currentIndex, currentStep, setSelectedStepId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (showSlideIndex) setShowSlideIndex(false);
        else if (showNotes) setShowNotes(false);
        else onExit();
      } else if (e.key.toLowerCase() === 'l') {
        setLaserPointerActive(prev => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        setShowNotes(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredSteps.length, showNotes, showSlideIndex, onExit]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredSteps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (laserPointerActive) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTogglePlayDoa = () => {
    if (isPlayingDoa) {
      stopTextSpeech();
      setIsPlayingDoa(false);
      return;
    }
    if (!currentStep.prayers.length) return;

    const prayer = currentStep.prayers[0];
    const text = `${prayer.latin}. Artinya: ${prayer.translation}`;
    setIsPlayingDoa(true);
    playTextSpeech(text, 'id-ID', 0.8, () => {
      setIsPlayingDoa(false);
    });
  };

  if (!currentStep) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 bg-stone-950 text-white flex flex-col select-none overflow-hidden ${
        laserPointerActive ? 'cursor-none' : ''
      }`}
    >
      {/* Laser Pointer Simulated Dot */}
      {laserPointerActive && (
        <div
          className="pointer-events-none fixed z-50 w-6 h-6 rounded-full bg-red-500 shadow-[0_0_20px_6px_rgba(239,68,68,0.9)] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
          <div className="w-2 h-2 rounded-full bg-white m-auto mt-2" />
        </div>
      )}

      {/* Top Presentation Bar */}
      <header className="h-16 px-6 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Modul</span>
          </button>
          <div className="h-4 w-px bg-stone-700 mx-1" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {activeCategory === 'umroh' ? 'Presentasi Manasik Umroh' : 'Presentasi Manasik Haji'}
          </span>
          <span className="text-xs text-stone-400 font-mono">
            Slide {currentIndex + 1} / {filteredSteps.length}
          </span>
        </div>

        {/* Presenter Tools */}
        <div className="flex items-center gap-2">
          {/* Active Attendees Counter for Muthawwif */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/90 border border-stone-700 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{visitorStats.activeNow} Jamaah Online</span>
          </div>

          {/* Laser Pointer Toggle */}
          <button
            onClick={() => setLaserPointerActive(!laserPointerActive)}
            title="Laser Pointer Proyektor (Tekan L)"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              laserPointerActive
                ? 'bg-red-600 border-red-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Laser Pointer</span>
          </button>

          {/* Presenter Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            title="Catatan Pembimbing (Tekan N)"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              showNotes
                ? 'bg-amber-600 border-amber-400 text-stone-950 font-extrabold'
                : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Catatan Pembimbing</span>
          </button>

          {/* Audio Recitation Trigger */}
          {currentStep.prayers.length > 0 && (
            <button
              onClick={handleTogglePlayDoa}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isPlayingDoa
                  ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse'
                  : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {isPlayingDoa ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Suara Doa</span>
            </button>
          )}

          {/* Slide Index Drawer */}
          <button
            onClick={() => setShowSlideIndex(!showSlideIndex)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Daftar Slide</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Slide Content Area */}
      <main className="flex-1 relative overflow-y-auto p-6 sm:p-12 flex flex-col justify-center max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image & Location */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-stone-700/80 shadow-2xl aspect-4/3 bg-stone-900">
              <img
                src={currentStep.imageUrl}
                alt={currentStep.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>{currentStep.location}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300 text-xs mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentStep.dayOrTime}</span>
                </div>
              </div>
            </div>

            {/* Quick Elderly Highlight Box */}
            <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                ⭐ Tips Utama Lansia:
              </span>
              <p className="text-sm text-amber-100 leading-relaxed">
                {currentStep.elderlyTips[0] || 'Utamakan keselamatan fisik dan dampingan ketua regu.'}
              </p>
            </div>
          </div>

          {/* Right Column: Slide Titles, Arabic Calligraphy & Key Doa */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-5">
            {/* Status Pill */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-stone-950">
                Tahap {currentIndex + 1}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-800 border border-stone-700 text-stone-300">
                {currentStep.statusType.toUpperCase()}
              </span>
            </div>

            {/* Arabic Big Title */}
            <p className="font-arabic text-3xl sm:text-4xl text-amber-300 text-right leading-relaxed" dir="rtl">
              {currentStep.arabicTitle}
            </p>

            {/* Main Indonesian Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {currentStep.title}
            </h1>

            {/* Big Description */}
            <p className="text-lg sm:text-xl text-stone-300 leading-relaxed">
              {currentStep.shortDesc}
            </p>

            {/* High Impact Doa Box */}
            {currentStep.prayers.length > 0 && (
              <div className="bg-stone-900/90 border-2 border-emerald-600/60 rounded-3xl p-6 sm:p-8 mt-2 shadow-xl">
                <div className="flex items-center justify-between mb-3 text-emerald-400 text-sm font-bold">
                  <span>🤲 Lafadz Bacaan Doa:</span>
                  <span className="text-xs text-stone-400">
                    {currentStep.prayers[0].title}
                  </span>
                </div>
                <p
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl text-right text-amber-200 font-semibold leading-loose py-2 select-text"
                >
                  {currentStep.prayers[0].arabic}
                </p>
                <p className="text-base sm:text-lg italic text-emerald-300 font-medium mt-3">
                  "{currentStep.prayers[0].latin}"
                </p>
                <p className="text-sm sm:text-base text-stone-300 mt-2">
                  Artinya: {currentStep.prayers[0].translation}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Presenter Notes Drawer (Toggled by N or button) */}
      {showNotes && (
        <div className="absolute bottom-20 left-6 right-6 lg:left-24 lg:right-24 bg-amber-950/95 border-2 border-amber-400 p-5 rounded-2xl shadow-2xl text-amber-100 z-30 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/40">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Catatan Presenter / Muthawwif:
            </span>
            <button
              onClick={() => setShowNotes(false)}
              className="text-amber-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm sm:text-base leading-relaxed">
            {currentStep.presenterNotes || 'Tidak ada catatan khusus untuk slide ini.'}
          </p>
        </div>
      )}

      {/* Slide Index Modal / Quick Jump */}
      {showSlideIndex && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 p-8 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Daftar Seluruh Tahapan Manasik</span>
            </h3>
            <button
              onClick={() => setShowSlideIndex(false)}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 overflow-y-auto">
            {filteredSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowSlideIndex(false);
                }}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  idx === currentIndex
                    ? 'bg-amber-600/30 border-amber-400 text-white'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold">{step.title}</h4>
                  <p className="text-xs text-stone-400 mt-0.5">{step.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <footer className="h-20 px-8 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between shrink-0">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-sm flex items-center gap-2 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Sebelumnya</span>
        </button>

        {/* Slide dots indicator */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md">
          {filteredSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-8 bg-amber-400'
                  : 'w-2.5 bg-stone-700 hover:bg-stone-500'
              }`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === filteredSteps.length - 1}
          className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:pointer-events-none text-stone-950 font-black text-sm flex items-center gap-2 transition-all shadow-lg"
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};
