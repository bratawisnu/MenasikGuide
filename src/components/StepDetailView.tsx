import React, { useState, useEffect } from 'react';
import { useManasik } from '../context/ManasikContext';
import { getThemeClasses, getFontSizeClass } from '../utils/themeStyles';
import { playTextSpeech, stopTextSpeech } from '../utils/audioHelper';
import {
  Volume2,
  VolumeX,
  CheckCircle2,
  RotateCcw,
  MapPin,
  Clock,
  HeartHandshake,
  Check,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Share2,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StepDetailView: React.FC = () => {
  const {
    currentStep,
    filteredSteps,
    setSelectedStepId,
    userProgress,
    updateProgressStatus,
    theme,
    accessibility,
    updateAccessibility
  } = useManasik();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePrayerId, setActivePrayerId] = useState<string | null>(null);

  useEffect(() => {
    // Stop audio on step change
    stopTextSpeech();
    setIsPlayingAudio(false);
    setActivePrayerId(null);
  }, [currentStep?.id]);

  if (!currentStep) {
    return (
      <div className="p-12 text-center text-stone-500">
        Pilih materi rukun manasik untuk mulai belajar.
      </div>
    );
  }

  const themeClasses = getThemeClasses(theme);
  const fontClasses = getFontSizeClass(accessibility.fontSize);

  const currentIndex = filteredSteps.findIndex(s => s.id === currentStep.id);
  const prevStep = currentIndex > 0 ? filteredSteps[currentIndex - 1] : null;
  const nextStep = currentIndex < filteredSteps.length - 1 ? filteredSteps[currentIndex + 1] : null;

  const currentProgress = userProgress[currentStep.id];
  const isUnderstood = currentProgress?.status === 'understood';
  const isRepeat = currentProgress?.status === 'repeat';

  // Audio recitation handler
  const handlePlayPrayerAudio = (prayer: { id: string; arabic: string; latin: string; translation: string }) => {
    if (isPlayingAudio && activePrayerId === prayer.id) {
      stopTextSpeech();
      setIsPlayingAudio(false);
      setActivePrayerId(null);
      return;
    }

    stopTextSpeech();
    setIsPlayingAudio(true);
    setActivePrayerId(prayer.id);

    // Speak the prayer: first latin/arabic context, then Indonesian translation
    const fullSpeechText = `${prayer.latin}. Artinya: ${prayer.translation}`;
    playTextSpeech(fullSpeechText, 'id-ID', accessibility.speechRate, () => {
      setIsPlayingAudio(false);
      setActivePrayerId(null);
    });
  };

  const handleMarkUnderstood = () => {
    updateProgressStatus(currentStep.id, 'understood');
    // Launch celebratory confetti for encouraging elderly learners
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  const handleMarkRepeat = () => {
    updateProgressStatus(currentStep.id, 'repeat');
  };

  return (
    <article className="flex-1 min-w-0 flex flex-col gap-6">
      {/* Top Banner Card with Image, Order, Status */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-xs transition-all">
        {/* Visual Image Header */}
        <div className="relative h-72 sm:h-80 md:h-[350px] w-full overflow-hidden bg-stone-900">
          <img
            src={currentStep.imageUrl}
            alt={currentStep.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top badges on image */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase bg-black/60 text-white border border-white/20 backdrop-blur-md">
                Langkah {currentIndex + 1} dari {filteredSteps.length}
              </span>
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                  currentStep.statusType === 'rukun'
                    ? 'bg-[#0b6b4f] text-white'
                    : currentStep.statusType === 'wajib'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {currentStep.statusType === 'rukun'
                  ? '⭐ Rukun'
                  : currentStep.statusType === 'wajib'
                  ? '⚡ Wajib'
                  : '✨ Sunnah'}
              </span>
            </div>

            {/* Quick Status Pill */}
            {isUnderstood ? (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
                <CheckCircle2 className="w-4 h-4" /> Sudah Dipahami
              </span>
            ) : isRepeat ? (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/90 text-stone-950 backdrop-blur-md shadow-xs">
                <RotateCcw className="w-4 h-4" /> Perlu Diulang
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/20 backdrop-blur-md">
                Belum Ditandai
              </span>
            )}
          </div>

          {/* Title and Arabic on bottom of banner */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div className="max-w-xl">
              <h1 className={`${fontClasses.title} font-extrabold tracking-tight text-white drop-shadow-md text-2xl sm:text-3xl`}>
                {currentStep.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs sm:text-sm text-stone-200">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  {currentStep.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  {currentStep.dayOrTime}
                </span>
              </div>
            </div>

            <div className="text-left md:text-right shrink-0">
              <p className="font-arabic text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-300 drop-shadow-lg" dir="rtl">
                {currentStep.arabicTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Short Summary & Explanation */}
        <div className="p-6 sm:p-8">
          <div className="bg-stone-50/70 dark:bg-stone-800/40 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 mb-6">
            <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
              Ringkasan Inti
            </h3>
            <p className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
              {currentStep.shortDesc}
            </p>
          </div>

          <div className="prose max-w-none text-stone-700 dark:text-stone-300">
            <p className={`${fontClasses.body} leading-relaxed text-base`}>
              {currentStep.fullDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Doa & Dzikir Section */}
      {currentStep.prayers.length > 0 && (
        <section className={`${themeClasses.cardBg} rounded-3xl p-6 sm:p-8 border shadow-sm`}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-4 border-b border-stone-200/60 dark:border-stone-800">
            <div>
              <h2 className={`${fontClasses.subtitle} font-bold flex items-center gap-2 text-stone-900 dark:text-stone-100`}>
                <span>🤲 Doa & Dzikir Bacaan</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Lafalkan dengan tenang dan khusyuk. Tekan tombol audio untuk mendengarkan.
              </p>
            </div>
            {/* Speed speech toggle for elderly clarity */}
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="text-xs font-semibold px-2 text-stone-500">Kecepatan Suara:</span>
              <button
                onClick={() => updateAccessibility({ speechRate: 0.75 })}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  accessibility.speechRate === 0.75
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                0.75x (Perlahan Lansia)
              </button>
              <button
                onClick={() => updateAccessibility({ speechRate: 0.95 })}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  accessibility.speechRate === 0.95
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                1.0x (Normal)
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {currentStep.prayers.map((prayer, pIdx) => {
              const isThisAudioPlaying = isPlayingAudio && activePrayerId === prayer.id;

              return (
                <div
                  key={prayer.id}
                  className={`${themeClasses.arabicBox} rounded-2xl p-5 sm:p-7 transition-all`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-2 border-b border-emerald-900/10 dark:border-amber-500/20">
                    <span className="font-bold text-sm sm:text-base text-emerald-900 dark:text-amber-300">
                      Doa #{pIdx + 1}: {prayer.title}
                    </span>

                    {/* Audio Play Button (Big target for elderly) */}
                    <button
                      onClick={() => handlePlayPrayerAudio(prayer)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
                        isThisAudioPlaying
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                      aria-label="Putar Doa Audio"
                    >
                      {isThisAudioPlaying ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Hentikan Suara</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Dengarkan Pelafalan</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Arabic text with Tajweed-friendly Amiri font */}
                  <p
                    dir="rtl"
                    className={`font-arabic ${fontClasses.arabic} text-right text-stone-900 dark:text-amber-200 font-semibold my-4 py-2 select-text`}
                  >
                    {prayer.arabic}
                  </p>

                  {/* Latin transliteration */}
                  <div className="mt-3 pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400 block mb-1">
                      Transliterasi Latin:
                    </span>
                    <p className={`${fontClasses.body} italic text-emerald-950 dark:text-amber-100 font-medium`}>
                      "{prayer.latin}"
                    </p>
                  </div>

                  {/* Translation in Indonesian */}
                  <div className="mt-3 pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400 block mb-1">
                      Artinya:
                    </span>
                    <p className={`${fontClasses.body} text-stone-800 dark:text-stone-200 leading-relaxed`}>
                      {prayer.translation}
                    </p>
                  </div>

                  {/* Repetition or note info */}
                  {(prayer.repetition || prayer.note) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                      {prayer.repetition && (
                        <span className="px-2.5 py-1 rounded-md bg-stone-200/70 dark:bg-stone-800 font-medium">
                          🔄 {prayer.repetition}
                        </span>
                      )}
                      {prayer.note && (
                        <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium">
                          💡 {prayer.note}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tips Khusus Calon Jamaah Lansia & Risti (High Contrast Gold Card) */}
      <section className={`${themeClasses.tipsBox} rounded-3xl p-6 sm:p-8 shadow-sm`}>
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-300/60 dark:border-amber-700/60">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">
            <span>♿</span>
          </div>
          <div>
            <h2 className={`${fontClasses.subtitle} font-extrabold text-amber-950 dark:text-amber-200`}>
              Tips Khusus Calon Jamaah Lansia & Risti
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium">
              Panduan menjaga kenyamanan, hidrasi, tenaga fisik, dan keselamatan ibadah
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
          {currentStep.elderlyTips.map((tip, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-amber-200 dark:border-amber-800/60"
            >
              <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className={`${fontClasses.tips} font-medium text-stone-800 dark:text-stone-200 leading-snug`}>
                {tip}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Do & Don'ts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dianjurkan (Do) */}
        <div className={`${themeClasses.cardBg} rounded-3xl p-6 border shadow-sm`}>
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Hal yang Dianjurkan (Sunnah & Tertib)</span>
          </h3>
          <ul className="flex flex-col gap-2.5">
            {currentStep.doAndDonts.do.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-stone-700 dark:text-stone-300">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1 stroke-[3]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dilarang / Perlu Dihindari (Don't) */}
        <div className={`${themeClasses.cardBg} rounded-3xl p-6 border shadow-sm`}>
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-red-800 dark:text-red-300 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
            <XCircle className="w-5 h-5 text-red-600" />
            <span>Hal yang Dilarang / Hindari</span>
          </h3>
          <ul className="flex flex-col gap-2.5">
            {currentStep.doAndDonts.dont.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-stone-700 dark:text-stone-300">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Catatan Muthawwif / Pembimbing Manasik */}
      {currentStep.presenterNotes && (
        <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/50 border border-stone-300 dark:border-stone-700 flex items-start gap-3">
          <Info className="w-5 h-5 text-stone-600 dark:text-stone-300 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Catatan Pembimbing Manasik (Muthawwif):
            </span>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-0.5">
              {currentStep.presenterNotes}
            </p>
          </div>
        </div>
      )}

      {/* Action Bar: Mark Understanding (Big button for elderly) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-7 border border-stone-200/80 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="max-w-xl">
          <h4 className="font-extrabold text-base sm:text-lg text-stone-900 leading-snug">
            Bagaimana Pemahaman Anda tentang Tahap Ini?
          </h4>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tandai agar tersimpan dalam rekaman progres belajar manasik Anda.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button
            onClick={handleMarkRepeat}
            className={`min-h-[46px] px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              isRepeat
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700 hover:border-stone-300'
            }`}
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Perlu Diulang Nanti</span>
          </button>

          <button
            onClick={handleMarkUnderstood}
            className={`min-h-[46px] px-5 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
              isUnderstood
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-[#0b6b4f] hover:bg-[#095740] text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="whitespace-nowrap">Alhamdulillah Paham!</span>
          </button>
        </div>
      </div>

      {/* Bottom Sequential Navigation Buttons (Prev & Next Steps) */}
      <nav className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 pb-16 sm:pb-8">
        {prevStep ? (
          <button
            onClick={() => setSelectedStepId(prevStep.id)}
            className="flex-1 min-h-[50px] px-4 py-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 shrink-0" />
            <span className="truncate">Kembali: {prevStep.title}</span>
          </button>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}

        {nextStep ? (
          <button
            onClick={() => setSelectedStepId(nextStep.id)}
            className="flex-1 min-h-[50px] px-5 py-3 rounded-2xl bg-[#0b6b4f] hover:bg-[#095740] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <span className="truncate">Lanjut: {nextStep.title}</span>
            <ChevronRight className="w-5 h-5 shrink-0" />
          </button>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}
      </nav>
    </article>
  );
};
