export interface SystemTheme {
  id: string;
  name: string;
  primary: string; // e.g. #e31b23
  primaryDark: string; // e.g. #8b0000
  accent: string; // e.g. #f59e0b
  headerGradient: string; // css gradient
  buttonClass: string;
  bgLight: string;
}

export const SYSTEM_COLOR_PRESETS: SystemTheme[] = [
  {
    id: 'igloo-red',
    name: 'Igloo Signature Red (Default)',
    primary: '#e31b23',
    primaryDark: '#8b0000',
    accent: '#f59e0b',
    headerGradient: 'linear-gradient(135deg, rgba(227, 27, 35, 0.95) 0%, rgba(200, 16, 46, 0.98) 50%, rgba(139, 0, 0, 1) 100%)',
    buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
    bgLight: '#fef2f2'
  },
  {
    id: 'royal-blue',
    name: 'Royal Ocean Blue',
    primary: '#2563eb',
    primaryDark: '#1e3a8a',
    accent: '#38bdf8',
    headerGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(29, 78, 216, 0.98) 50%, rgba(30, 58, 138, 1) 100%)',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    bgLight: '#eff6ff'
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    primary: '#059669',
    primaryDark: '#064e3b',
    accent: '#34d399',
    headerGradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.95) 0%, rgba(4, 120, 87, 0.98) 50%, rgba(6, 78, 59, 1) 100%)',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    bgLight: '#ecfdf5'
  },
  {
    id: 'purple-indigo',
    name: 'Modern Purple Indigo',
    primary: '#7c3aed',
    primaryDark: '#4c1d95',
    accent: '#c084fc',
    headerGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.95) 0%, rgba(109, 40, 217, 0.98) 50%, rgba(76, 29, 149, 1) 100%)',
    buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
    bgLight: '#faf5ff'
  },
  {
    id: 'amber-orange',
    name: 'Warm Sunset Orange',
    primary: '#ea580c',
    primaryDark: '#7c2d12',
    accent: '#f59e0b',
    headerGradient: 'linear-gradient(135deg, rgba(234, 88, 12, 0.95) 0%, rgba(194, 65, 12, 0.98) 50%, rgba(124, 45, 18, 1) 100%)',
    buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
    bgLight: '#fff7ed'
  },
  {
    id: 'dark-midnight',
    name: 'Midnight Slate & Cyan',
    primary: '#0f172a',
    primaryDark: '#020617',
    accent: '#06b6d4',
    headerGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(2, 6, 23, 1) 100%)',
    buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    bgLight: '#f8fafc'
  },
  {
    id: 'rose-gold',
    name: 'Berry Rose & Gold',
    primary: '#e11d48',
    primaryDark: '#881337',
    accent: '#fbbf24',
    headerGradient: 'linear-gradient(135deg, rgba(225, 29, 72, 0.95) 0%, rgba(190, 18, 60, 0.98) 50%, rgba(136, 19, 55, 1) 100%)',
    buttonClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    bgLight: '#fff1f2'
  }
];

const THEME_STORAGE_KEY = 'igloo_system_custom_theme_v2';

export function getSavedTheme(): SystemTheme {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return SYSTEM_COLOR_PRESETS[0];
}

export function saveTheme(theme: SystemTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    applyThemeToDOM(theme);
  } catch (e) {}
}

export function applyThemeToDOM(theme: SystemTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.primary);
  root.style.setProperty('--primary-dark', theme.primaryDark);
  root.style.setProperty('--header-gradient', theme.headerGradient);
  root.style.setProperty('--primary-light', theme.bgLight);
  root.style.setProperty('--accent-color', theme.accent);
}
