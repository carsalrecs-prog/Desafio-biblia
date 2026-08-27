export interface DayItem {
  num: number;
  reading: string;
  topic?: string;
  summary?: string;
}

export interface WeekTheme {
  bg: string;
  border: string;
  text: string;
  lightText: string;
  accentBg: string;
  circleUnchecked: string;
  circleChecked: string;
}

export interface WeekChallenge {
  week: number | string;
  title: string;
  subtitle: string;
  theme: WeekTheme;
  days: DayItem[];
  reflections: string[];
}

export interface DayProgress {
  flor: boolean;
  tereque: boolean;
}

export interface PartnerNames {
  flor: string;
  tereque: string;
}

export interface ReflectionAnswers {
  flor?: string;
  tereque?: string;
}

export interface CertificateConfig {
  completionDate: string;
  customDedication: string;
  includeChecklist: boolean;
  includeReflections: boolean;
}
