import React from 'react';
import { useManasik } from '../context/ManasikContext';
import { getThemeClasses } from '../utils/themeStyles';
import { Check, CheckCircle2, Clock, CircleAlert, Sparkles } from 'lucide-react';

export const StepTimeline: React.FC = () => {
  const { filteredSteps, selectedStepId, setSelectedStepId, userProgress, theme, activeCategory } = useManasik();
  const themeClasses = getThemeClasses(theme);

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sticky top-28 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-stone-900 dark:text-stone-100">
              <span>{activeCategory === 'umroh' ? '🌙 Urutan Umroh' : '🕋 Urutan Haji'}</span>
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 font-normal">
              {filteredSteps.length} Tahapan Rukun & Wajib
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
            Terurut Tertib
          </span>
        </div>

        {/* Steps List */}
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
          {filteredSteps.map((step, idx) => {
            const isSelected = step.id === selectedStepId;
            const progress = userProgress[step.id];
            const isCompleted = progress?.completed;
            const isUnderstood = progress?.status === 'understood';
            const isRepeat = progress?.status === 'repeat';

            let badgeClass = 'bg-teal-50 text-teal-700 border border-teal-200';
            if (step.statusType === 'rukun') badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            if (step.statusType === 'wajib') badgeClass = 'bg-amber-50 text-amber-800 border border-amber-200';

            return (
              <button
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`w-64 lg:w-full shrink-0 text-left p-3.5 rounded-2xl transition-all border flex items-start gap-3.5 relative cursor-pointer ${
                  isSelected
                    ? 'border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-stone-200 bg-white dark:bg-stone-900 hover:border-stone-300 hover:bg-stone-50/60 dark:hover:bg-stone-800/50'
                }`}
              >
                {/* Step Number Circle with Status */}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-sm mt-0.5 transition-colors ${
                    isUnderstood
                      ? 'bg-emerald-600 text-white'
                      : isSelected
                      ? 'bg-[#0b6b4f] text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isUnderstood ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
                      {step.statusType}
                    </span>
                    {isRepeat && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Perlu Diulang
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                    {step.title}
                  </h4>
                  <p className="text-xs text-stone-400 dark:text-stone-500 truncate mt-0.5">
                    {step.location}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
