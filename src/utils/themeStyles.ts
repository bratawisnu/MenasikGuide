import { DesignTheme, FontSizeOption } from '../types';

export function getThemeClasses(theme: DesignTheme) {
  switch (theme) {
    case 'gold':
      return {
        bg: 'bg-stone-950 text-stone-100',
        cardBg: 'bg-stone-900 border-amber-500/30 text-stone-100 shadow-md',
        cardHeader: 'bg-stone-800/80 border-b border-amber-500/20 text-amber-300',
        accentText: 'text-amber-400',
        accentBg: 'bg-amber-600 hover:bg-amber-500 text-stone-950',
        accentBorder: 'border-amber-500',
        secondaryBg: 'bg-stone-800 text-amber-200 border-stone-700',
        badgeRukun: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
        badgeWajib: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
        badgeSunnah: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
        activeTab: 'bg-amber-600 text-stone-950 font-bold shadow',
        inactiveTab: 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-amber-300',
        navBg: 'bg-stone-900/95 border-b border-stone-800 text-stone-100 backdrop-blur-md',
        arabicBox: 'bg-stone-900/90 border border-amber-500/40 text-amber-100',
        tipsBox: 'bg-amber-950/40 border-2 border-amber-500/60 text-amber-100'
      };

    case 'azure':
      return {
        bg: 'bg-slate-50 text-slate-900',
        cardBg: 'bg-white border-sky-200 text-slate-900 shadow-sm',
        cardHeader: 'bg-sky-50 border-b border-sky-100 text-sky-950',
        accentText: 'text-sky-700',
        accentBg: 'bg-sky-600 hover:bg-sky-700 text-white',
        accentBorder: 'border-sky-600',
        secondaryBg: 'bg-sky-100 text-sky-900 border-sky-200',
        badgeRukun: 'bg-sky-100 text-sky-800 border border-sky-300',
        badgeWajib: 'bg-amber-100 text-amber-800 border border-amber-300',
        badgeSunnah: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
        activeTab: 'bg-sky-700 text-white font-bold shadow',
        inactiveTab: 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-800 border border-slate-200',
        navBg: 'bg-white/95 border-b border-slate-200 text-slate-900 backdrop-blur-md',
        arabicBox: 'bg-sky-50/70 border border-sky-200 text-slate-900',
        tipsBox: 'bg-amber-50 border-2 border-amber-300 text-amber-950'
      };

    case 'highContrast':
      return {
        bg: 'bg-black text-white',
        cardBg: 'bg-black border-4 border-yellow-400 text-white shadow-none',
        cardHeader: 'bg-yellow-400 text-black font-extrabold border-b-4 border-yellow-400',
        accentText: 'text-yellow-300',
        accentBg: 'bg-yellow-400 hover:bg-yellow-300 text-black font-black',
        accentBorder: 'border-yellow-400',
        secondaryBg: 'bg-zinc-900 text-yellow-300 border-2 border-yellow-400',
        badgeRukun: 'bg-yellow-400 text-black font-bold border-2 border-white',
        badgeWajib: 'bg-white text-black font-bold border-2 border-yellow-400',
        badgeSunnah: 'bg-green-400 text-black font-bold border-2 border-white',
        activeTab: 'bg-yellow-400 text-black font-black text-xl border-2 border-white',
        inactiveTab: 'bg-zinc-900 text-yellow-300 hover:bg-zinc-800 border-2 border-yellow-400',
        navBg: 'bg-black border-b-4 border-yellow-400 text-white',
        arabicBox: 'bg-zinc-950 border-4 border-yellow-400 text-yellow-200',
        tipsBox: 'bg-zinc-900 border-4 border-yellow-400 text-yellow-300 font-bold'
      };

    case 'emerald':
    default:
      return {
        bg: 'bg-[#f8faf9] text-stone-900',
        cardBg: 'bg-white border-stone-200/80 text-stone-900 shadow-xs',
        cardHeader: 'bg-emerald-50/70 border-b border-emerald-100 text-emerald-950',
        accentText: 'text-[#0b6b4f]',
        accentBg: 'bg-[#0b6b4f] hover:bg-[#095740] text-white',
        accentBorder: 'border-[#0b6b4f]',
        secondaryBg: 'bg-emerald-50 text-emerald-900 border-emerald-200/80',
        badgeRukun: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold',
        badgeWajib: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
        badgeSunnah: 'bg-teal-50 text-teal-700 border border-teal-200 font-bold',
        activeTab: 'bg-[#0b6b4f] text-white font-bold shadow-xs',
        inactiveTab: 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200',
        navBg: 'bg-white/95 border-b border-stone-200/80 text-stone-900 backdrop-blur-md',
        arabicBox: 'bg-emerald-50/40 border border-emerald-200/70 text-stone-900',
        tipsBox: 'bg-amber-50/80 border border-amber-200 text-amber-950'
      };
  }
}

export function getFontSizeClass(size: FontSizeOption) {
  switch (size) {
    case 'normal':
      return {
        body: 'text-base',
        title: 'text-2xl',
        subtitle: 'text-lg',
        arabic: 'text-2xl leading-loose',
        prayerTitle: 'text-lg',
        tips: 'text-base'
      };
    case 'xlarge':
      return {
        body: 'text-xl leading-relaxed',
        title: 'text-3xl sm:text-4xl',
        subtitle: 'text-2xl',
        arabic: 'text-3xl sm:text-4xl leading-loose tracking-wide',
        prayerTitle: 'text-2xl font-bold',
        tips: 'text-xl leading-relaxed'
      };
    case 'large':
    default:
      return {
        body: 'text-lg leading-relaxed',
        title: 'text-2xl sm:text-3xl',
        subtitle: 'text-xl',
        arabic: 'text-2xl sm:text-3xl leading-loose',
        prayerTitle: 'text-xl font-bold',
        tips: 'text-lg leading-relaxed'
      };
  }
}
