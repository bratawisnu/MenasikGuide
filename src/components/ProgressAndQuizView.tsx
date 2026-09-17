import React, { useState } from 'react';
import { useManasik } from '../context/ManasikContext';
import { getThemeClasses, getFontSizeClass } from '../utils/themeStyles';
import { DEFAULT_QUIZ_QUESTIONS } from '../data/defaultManasikData';
import { QuizQuestion } from '../types';
import {
  Award,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Trophy,
  Check,
  XCircle,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProgressAndQuizView: React.FC = () => {
  const {
    steps,
    userProgress,
    theme,
    accessibility,
    calculateProgress,
    updateProgressStatus,
    setSelectedStepId
  } = useManasik();

  const themeClasses = getThemeClasses(theme);
  const fontClasses = getFontSizeClass(accessibility.fontSize);

  const umrohProg = calculateProgress('umroh');
  const hajiProg = calculateProgress('haji');

  // Quiz state
  const [activeQuizCat, setActiveQuizCat] = useState<'semua' | 'umroh' | 'haji'>('semua');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = DEFAULT_QUIZ_QUESTIONS.filter(q =>
    activeQuizCat === 'semua' ? true : q.category === activeQuizCat
  );

  const currentQ: QuizQuestion | undefined = quizQuestions[quizIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setQuizScore(prev => prev + 1);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // Badges logic
  const isIhramDone = !!userProgress['umroh-1-ihram']?.completed || !!userProgress['haji-1-ihram-tarwiyah']?.completed;
  const isTawafDone = !!userProgress['umroh-3-tawaf']?.completed;
  const isSaiDone = !!userProgress['umroh-5-sai']?.completed;
  const isWukufDone = !!userProgress['haji-2-wukuf-arafah']?.completed;
  const isAllUmrohDone = umrohProg.percentage === 100;
  const isAllHajiDone = hajiProg.percentage === 100;

  const badges = [
    {
      id: 'b1',
      title: 'Niat & Miqat Suci',
      desc: 'Memahami rukun niat ihram & larangannya',
      icon: '✨',
      unlocked: isIhramDone
    },
    {
      id: 'b2',
      title: 'Penakluk Tawaf',
      desc: 'Menguasai 7 putaran Ka\'bah & doa istilam',
      icon: '🕋',
      unlocked: isTawafDone
    },
    {
      id: 'b3',
      title: 'Pejuang Sa\'i Shafa-Marwah',
      desc: 'Memahami rukun sa\'i & tips kesehatan',
      icon: '⛰️',
      unlocked: isSaiDone
    },
    {
      id: 'b4',
      title: 'Munajat Padang Arafah',
      desc: 'Menghayati doa puncak wukuf & sayyidul istighfar',
      icon: '⛺',
      unlocked: isWukufDone
    },
    {
      id: 'b5',
      title: 'Khatam Manasik Umroh',
      desc: '100% materi rukun & wajib umroh dikuasai',
      icon: '🌙',
      unlocked: isAllUmrohDone
    },
    {
      id: 'b6',
      title: 'Kesiapan Haji Mabrur',
      desc: '100% materi rukun & wajib haji dikuasai',
      icon: '👑',
      unlocked: isAllHajiDone
    }
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      {/* Progress Cards Overview */}
      <section className={`${themeClasses.cardBg} rounded-3xl p-6 sm:p-8 border shadow-sm`}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className={`${fontClasses.title} font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2`}>
              <span>📊 Kesiapan Belajar Manasik Jamaah</span>
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Pantau tahapan rukun yang sudah dipahami dan yang perlu diulang kembali.
            </p>
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            Tersimpan Otomatis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Umroh Progress Card */}
          <div className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2 text-stone-900 dark:text-stone-100">
                <span>🌙 Progres Ibadah Umroh</span>
              </h3>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {umrohProg.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-3.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${umrohProg.percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mt-1">
              <span>{umrohProg.completed} dari {umrohProg.total} materi dipahami</span>
              <span>{umrohProg.total - umrohProg.completed} tersisa</span>
            </div>
          </div>

          {/* Haji Progress Card */}
          <div className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2 text-stone-900 dark:text-stone-100">
                <span>🕋 Progres Ibadah Haji</span>
              </h3>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                {hajiProg.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-3.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${hajiProg.percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mt-1">
              <span>{hajiProg.completed} dari {hajiProg.total} materi dipahami</span>
              <span>{hajiProg.total - hajiProg.completed} tersisa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lencana Motivasi Belajar */}
      <section className={`${themeClasses.cardBg} rounded-3xl p-6 sm:p-8 border shadow-sm`}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className={`${fontClasses.subtitle} font-bold text-stone-900 dark:text-stone-100`}>
            Lencana Pencapaian Belajar Jamaah
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-2">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                b.unlocked
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 shadow-xs'
                  : 'bg-stone-100/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700/40 opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl mb-2">{b.icon}</div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {b.title}
              </h4>
              <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">
                {b.desc}
              </p>
              <span
                className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  b.unlocked ? 'bg-amber-200 text-amber-900' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {b.unlocked ? 'Tercapai 🎉' : 'Terkunci'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Quiz / Uji Pemahaman Mandiri Ramah Lansia */}
      <section className={`${themeClasses.cardBg} rounded-3xl p-6 sm:p-8 border shadow-sm`}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className={`${fontClasses.subtitle} font-bold text-stone-900 dark:text-stone-100`}>
              Cek Pemahaman Mandiri (Ramah Lansia)
            </h3>
          </div>

          {/* Filter quiz category */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            {(['semua', 'umroh', 'haji'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveQuizCat(cat);
                  handleRestartQuiz();
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg capitalize ${
                  activeQuizCat === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {quizFinished ? (
          <div className="py-8 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mb-4 shadow-inner">
              🏆
            </div>
            <h4 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              Alhamdulillah, Selesai!
            </h4>
            <p className="text-stone-600 dark:text-stone-300 mt-2">
              Anda menjawab benar <span className="font-extrabold text-emerald-600 text-lg">{quizScore}</span> dari{' '}
              <span className="font-bold">{quizQuestions.length}</span> pertanyaan.
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Semoga Allah memudahkan seluruh rangkaian manasik dan ibadah di tanah suci.
            </p>
            <button
              onClick={handleRestartQuiz}
              className="mt-6 min-h-[48px] px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Latihan Soal</span>
            </button>
          </div>
        ) : currentQ ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500">
              <span className="uppercase tracking-wider">
                Pertanyaan {quizIndex + 1} dari {quizQuestions.length} ({currentQ.category.toUpperCase()})
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Skor Saat Ini: {quizScore}
              </span>
            </div>

            {/* Question Text (Large font) */}
            <h4 className={`${fontClasses.title} font-extrabold text-stone-900 dark:text-stone-100 leading-snug`}>
              {currentQ.question}
            </h4>

            {/* Big Touch-Target Options */}
            <div className="grid grid-cols-1 gap-3.5">
              {currentQ.options.map((option, optIdx) => {
                let btnStyle = 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-emerald-500';

                if (isAnswered) {
                  if (optIdx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                  } else if (optIdx === selectedAnswer) {
                    btnStyle = 'bg-red-100 border-red-400 text-red-950';
                  } else {
                    btnStyle = 'opacity-50 border-stone-200';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    className={`w-full min-h-[56px] text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${btnStyle}`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className={`${fontClasses.body} font-medium flex-1`}>
                      {option}
                    </span>
                    {isAnswered && optIdx === currentQ.correctIndex && (
                      <Check className="w-5 h-5 text-emerald-700 shrink-0 stroke-[3]" />
                    )}
                    {isAnswered && optIdx === selectedAnswer && optIdx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            {isAnswered && (
              <div className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <ThumbsUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block mb-1">
                      Penjelasan & Dalil:
                    </span>
                    <p className={`${fontClasses.body} text-stone-700 dark:text-stone-300 leading-relaxed`}>
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNextQuiz}
                    className="min-h-[48px] px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all"
                  >
                    <span>Lanjut Soal Berikutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
};
