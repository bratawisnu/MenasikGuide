export type ManasikCategory = 'umroh' | 'haji';

export type StepType = 'rukun' | 'wajib' | 'sunnah';

export interface PrayerItem {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  repetition?: string;
  note?: string;
}

export interface ManasikStep {
  id: string;
  category: ManasikCategory;
  stepNumber: number;
  title: string;
  arabicTitle: string;
  statusType: StepType;
  location: string;
  dayOrTime: string;
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  prayers: PrayerItem[];
  elderlyTips: string[];
  doAndDonts: {
    do: string[];
    dont: string[];
  };
  presenterNotes: string;
}

export type MasteryStatus = 'unopened' | 'understood' | 'repeat';

export interface UserProgressItem {
  stepId: string;
  completed: boolean;
  status: MasteryStatus;
  lastReadAt?: string;
  personalNotes?: string;
}

export type DesignTheme = 'emerald' | 'gold' | 'azure' | 'highContrast';

export type FontSizeOption = 'normal' | 'large' | 'xlarge';

export interface AccessibilitySettings {
  fontSize: FontSizeOption;
  lineHeight: 'normal' | 'relaxed';
  speechRate: number; // 0.75 - 1.0
  highContrast: boolean;
  autoPlayDoaPrompt: boolean;
}

export interface QuizQuestion {
  id: string;
  category: ManasikCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningNotification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'reminder' | 'encouragement';
  timestamp: string;
  read: boolean;
}

export interface VisitorStatsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  activeNow: number;
  lastUpdated?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'jamaah';

export type UserApprovalStatus = 'approved' | 'pending' | 'suspended' | 'rejected';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserApprovalStatus;
  phone?: string;
  kloterOrAgency?: string;
  createdAt: string;
  lastLogin?: string;
  suspendReason?: string;
  notes?: string;
}

export interface UserAuditLog {
  id: string;
  action: string;
  targetUserId: string;
  targetUserName: string;
  performedBy: string;
  details?: string;
  timestamp: string;
}

export interface CurriculumInfo {
  id: string; // 'default' | userId
  title: string;
  authorName: string;
  agency?: string;
  role: UserRole | 'system';
  stepsCount: number;
  lastUpdated?: string;
}
