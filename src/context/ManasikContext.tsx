import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ManasikStep,
  ManasikCategory,
  DesignTheme,
  AccessibilitySettings,
  UserProgressItem,
  MasteryStatus,
  LearningNotification,
  VisitorStatsData
} from '../types';
import { DEFAULT_MANASIK_STEPS } from '../data/defaultManasikData';

interface ManasikContextType {
  steps: ManasikStep[];
  activeCategory: ManasikCategory;
  setActiveCategory: (cat: ManasikCategory) => void;
  selectedStepId: string;
  setSelectedStepId: (id: string) => void;
  filteredSteps: ManasikStep[];
  currentStep: ManasikStep | undefined;
  userProgress: Record<string, UserProgressItem>;
  theme: DesignTheme;
  setTheme: (t: DesignTheme) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  notifications: LearningNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type?: 'achievement' | 'reminder' | 'encouragement') => void;
  updateProgressStatus: (stepId: string, status: MasteryStatus) => void;
  toggleStepCompleted: (stepId: string) => void;
  calculateProgress: (category: ManasikCategory) => {
    total: number;
    completed: number;
    understood: number;
    percentage: number;
  };
  // Visitor Counting Stats
  visitorStats: VisitorStatsData;
  refreshVisitorStats: () => Promise<void>;
  resetVisitorStats: () => Promise<void>;
  // CMS Methods
  addStep: (step: Omit<ManasikStep, 'id'>) => void;
  updateStep: (step: ManasikStep) => void;
  deleteStep: (id: string) => void;
  reorderStep: (id: string, direction: 'up' | 'down') => void;
  resetDefaultCurriculum: () => void;
  exportCurriculumJson: () => string;
  importCurriculumJson: (jsonString: string) => boolean;
}

const STORAGE_KEY_STEPS = 'manasik_steps_v1';
const STORAGE_KEY_PROGRESS = 'manasik_progress_v1';
const STORAGE_KEY_THEME = 'manasik_theme_v1';
const STORAGE_KEY_A11Y = 'manasik_a11y_v1';
const STORAGE_KEY_NOTIFS = 'manasik_notifs_v1';

const INITIAL_NOTIFICATIONS: LearningNotification[] = [
  {
    id: 'notif-1',
    title: 'Selamat Datang di Manasik Pintar',
    message: 'Pelajari rukun dan doa umroh & haji dengan tenang. Gunakan tombol ukuran teks di atas jika tulisan terasa kecil.',
    type: 'encouragement',
    timestamp: 'Hari ini',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Tips Khusus Lansia Tersedia',
    message: 'Setiap tahapan dilengkapi tips khusus kursi roda, istirahat, dan pencegahan kelelahan fisik.',
    type: 'reminder',
    timestamp: 'Hari ini',
    read: false
  }
];

const ManasikContext = createContext<ManasikContextType | undefined>(undefined);

export const ManasikProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load steps
  const [steps, setSteps] = useState<ManasikStep[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MANASIK_STEPS;
  });

  const [activeCategory, setActiveCategory] = useState<ManasikCategory>('umroh');
  const [selectedStepId, setSelectedStepId] = useState<string>(() => {
    const firstUmroh = DEFAULT_MANASIK_STEPS.find(s => s.category === 'umroh');
    return firstUmroh ? firstUmroh.id : DEFAULT_MANASIK_STEPS[0].id;
  });

  // User Progress
  const [userProgress, setUserProgress] = useState<Record<string, UserProgressItem>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  // Theme - Multi-theme temporarily disabled, locked to default emerald
  const [theme, setThemeState] = useState<DesignTheme>('emerald');

  // Accessibility
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_A11Y);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      fontSize: 'large', // default large font for elderly accessibility
      lineHeight: 'relaxed',
      speechRate: 0.85,
      highContrast: false,
      autoPlayDoaPrompt: false
    };
  });

  // Notifications
  const [notifications, setNotifications] = useState<LearningNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEPS, JSON.stringify(steps));
    } catch {
      // ignore
    }
  }, [steps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(userProgress));
    } catch {
      // ignore
    }
  }, [userProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, 'emerald');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_A11Y, JSON.stringify(accessibility));
    } catch {
      // ignore
    }
  }, [accessibility]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Keep filtered steps
  const filteredSteps = steps
    .filter(s => s.category === activeCategory)
    .sort((a, b) => a.stepNumber - b.stepNumber);

  // If selectedStepId not in activeCategory, auto switch to first step in activeCategory
  useEffect(() => {
    const current = steps.find(s => s.id === selectedStepId);
    if (!current || current.category !== activeCategory) {
      const firstInCat = filteredSteps[0];
      if (firstInCat) {
        setSelectedStepId(firstInCat.id);
      }
    }
  }, [activeCategory, filteredSteps, selectedStepId, steps]);

  const currentStep = steps.find(s => s.id === selectedStepId) || filteredSteps[0];

  const setTheme = (newTheme: DesignTheme) => {
    setThemeState(newTheme);
    if (newTheme === 'highContrast') {
      setAccessibility(prev => ({ ...prev, highContrast: true }));
    } else {
      setAccessibility(prev => ({ ...prev, highContrast: false }));
    }
  };

  const updateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...newSettings }));
  };

  const addNotification = (
    title: string,
    message: string,
    type: 'achievement' | 'reminder' | 'encouragement' = 'achievement'
  ) => {
    const newNotif: LearningNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: 'Baru saja',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateProgressStatus = (stepId: string, status: MasteryStatus) => {
    setUserProgress(prev => {
      const existing = prev[stepId] || {
        stepId,
        completed: false,
        status: 'unopened'
      };
      const updated = {
        ...existing,
        status,
        completed: status === 'understood',
        lastReadAt: new Date().toISOString()
      };

      const newState = { ...prev, [stepId]: updated };

      // Trigger achievement notification if step marked as understood
      if (status === 'understood') {
        const stepObj = steps.find(s => s.id === stepId);
        const title = stepObj ? stepObj.title : 'Materi';
        addNotification(
          'Alhamdulillah!',
          `Anda telah memahami "${title}". Tetap istiqamah mengulang doa.`,
          'achievement'
        );
      }

      return newState;
    });
  };

  const toggleStepCompleted = (stepId: string) => {
    setUserProgress(prev => {
      const existing = prev[stepId] || {
        stepId,
        completed: false,
        status: 'unopened'
      };
      const newCompleted = !existing.completed;
      const updated = {
        ...existing,
        completed: newCompleted,
        status: newCompleted ? ('understood' as MasteryStatus) : ('repeat' as MasteryStatus),
        lastReadAt: new Date().toISOString()
      };
      return { ...prev, [stepId]: updated };
    });
  };

  const calculateProgress = (category: ManasikCategory) => {
    const catSteps = steps.filter(s => s.category === category);
    const total = catSteps.length;
    if (total === 0) return { total: 0, completed: 0, understood: 0, percentage: 0 };

    let completed = 0;
    let understood = 0;

    catSteps.forEach(step => {
      const prog = userProgress[step.id];
      if (prog) {
        if (prog.completed) completed++;
        if (prog.status === 'understood') understood++;
      }
    });

    const percentage = Math.round((completed / total) * 100);
    return { total, completed, understood, percentage };
  };

  // CMS Implementation
  const addStep = (stepData: Omit<ManasikStep, 'id'>) => {
    const newId = `${stepData.category}-${Date.now()}`;
    const newStep: ManasikStep = {
      ...stepData,
      id: newId
    };
    setSteps(prev => [...prev, newStep]);
    addNotification('Kurikulum Diperbarui', `Langkah baru "${newStep.title}" berhasil ditambahkan ke CMS.`);
  };

  const updateStep = (updatedStep: ManasikStep) => {
    setSteps(prev => prev.map(s => (s.id === updatedStep.id ? updatedStep : s)));
    addNotification('Perubahan Disimpan', `Materi "${updatedStep.title}" berhasil diperbarui.`);
  };

  const deleteStep = (id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id));
    addNotification('Materi Dihapus', 'Satu materi kurikulum telah dihapus dari sistem CMS.');
  };

  const reorderStep = (id: string, direction: 'up' | 'down') => {
    setSteps(prev => {
      const list = [...prev];
      const stepIndex = list.findIndex(s => s.id === id);
      if (stepIndex === -1) return prev;

      const currentStep = list[stepIndex];
      const sameCatSteps = list
        .filter(s => s.category === currentStep.category)
        .sort((a, b) => a.stepNumber - b.stepNumber);

      const catIndex = sameCatSteps.findIndex(s => s.id === id);
      if (direction === 'up' && catIndex > 0) {
        const prevStep = sameCatSteps[catIndex - 1];
        const tempNum = currentStep.stepNumber;
        currentStep.stepNumber = prevStep.stepNumber;
        prevStep.stepNumber = tempNum;
      } else if (direction === 'down' && catIndex < sameCatSteps.length - 1) {
        const nextStep = sameCatSteps[catIndex + 1];
        const tempNum = currentStep.stepNumber;
        currentStep.stepNumber = nextStep.stepNumber;
        nextStep.stepNumber = tempNum;
      }

      return [...list];
    });
  };

  const resetDefaultCurriculum = () => {
    setSteps(DEFAULT_MANASIK_STEPS);
    addNotification('Kurikulum Direset', 'Seluruh materi manasik telah dikembalikan ke standar awal Kemenag & Haramain.');
  };

  const exportCurriculumJson = (): string => {
    return JSON.stringify(steps, null, 2);
  };

  const importCurriculumJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].prayers) {
        setSteps(parsed);
        addNotification('Kurikulum Diimpor', 'Data manasik kustom berhasil dimuat.');
        return true;
      }
    } catch {
      // invalid
    }
    return false;
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Visitor counting state
  const [visitorStats, setVisitorStats] = useState<VisitorStatsData>(() => {
    try {
      const saved = localStorage.getItem('manasik_stats_cache');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      totalVisits: 1,
      uniqueVisitors: 1,
      todayVisits: 1,
      activeNow: 1
    };
  });

  const getVisitorId = useCallback((): string => {
    let id = localStorage.getItem('manasik_visitor_id_v1');
    if (!id) {
      id = 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
      try {
        localStorage.setItem('manasik_visitor_id_v1', id);
      } catch {
        // ignore
      }
    }
    return id;
  }, []);

  const refreshVisitorStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setVisitorStats(data);
        localStorage.setItem('manasik_stats_cache', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Could not fetch visitor stats');
    }
  }, []);

  const resetVisitorStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setVisitorStats({
          totalVisits: data.totalVisits || 0,
          uniqueVisitors: data.uniqueVisitors || 0,
          todayVisits: data.todayVisits || 0,
          activeNow: data.activeNow || 1
        });
        localStorage.setItem('manasik_stats_cache', JSON.stringify(data));
        addNotification('Statistik Direset', 'Penghitung akses jamaah telah dimulai ulang.');
      }
    } catch (err) {
      console.error('Error resetting visitor stats:', err);
    }
  }, []);

  // Initialize visitor tracking on mount
  useEffect(() => {
    const visitorId = getVisitorId();
    let isNewSession = false;

    try {
      if (!sessionStorage.getItem('manasik_session_active_v1')) {
        isNewSession = true;
        sessionStorage.setItem('manasik_session_active_v1', '1');
      }
    } catch {
      isNewSession = true;
    }

    // Register visit
    fetch('/api/stats/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, isNewSession })
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && typeof data.totalVisits === 'number') {
          setVisitorStats({
            totalVisits: data.totalVisits,
            uniqueVisitors: data.uniqueVisitors,
            todayVisits: data.todayVisits,
            activeNow: data.activeNow
          });
          localStorage.setItem('manasik_stats_cache', JSON.stringify(data));
        }
      })
      .catch(() => {
        setVisitorStats(prev => {
          const next = {
            ...prev,
            totalVisits: prev.totalVisits + (isNewSession ? 1 : 0),
            todayVisits: prev.todayVisits + (isNewSession ? 1 : 0)
          };
          localStorage.setItem('manasik_stats_cache', JSON.stringify(next));
          return next;
        });
      });

    // Heartbeat every 35s to keep active count accurate
    const heartbeatInterval = setInterval(() => {
      fetch('/api/stats/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId })
      })
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data && typeof data.activeNow === 'number') {
            setVisitorStats(prev => ({ ...prev, activeNow: data.activeNow }));
          }
        })
        .catch(() => {});
    }, 35000);

    // Periodic stats poll every 25s
    const pollInterval = setInterval(() => {
      refreshVisitorStats();
    }, 25000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(pollInterval);
    };
  }, [getVisitorId, refreshVisitorStats]);

  return (
    <ManasikContext.Provider
      value={{
        steps,
        activeCategory,
        setActiveCategory,
        selectedStepId,
        setSelectedStepId,
        filteredSteps,
        currentStep,
        userProgress,
        theme,
        setTheme,
        accessibility,
        updateAccessibility,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        updateProgressStatus,
        toggleStepCompleted,
        calculateProgress,
        visitorStats,
        refreshVisitorStats,
        resetVisitorStats,
        addStep,
        updateStep,
        deleteStep,
        reorderStep,
        resetDefaultCurriculum,
        exportCurriculumJson,
        importCurriculumJson
      }}
    >
      {children}
    </ManasikContext.Provider>
  );
};

export const useManasik = () => {
  const context = useContext(ManasikContext);
  if (!context) {
    throw new Error('useManasik must be used within a ManasikProvider');
  }
  return context;
};
