// ─── Base palettes ────────────────────────────────────────
const light = {
  background: '#FFF8F0',
  primary: '#7D9B76',
  primaryLight: '#A8C5A0',
  accent: '#E8A0BF',
  secondary: '#B8A9C9',
  earth: '#C4A882',
  text: '#3D3229',
  textLight: '#7A6E63',
  card: '#FFFFFF',
  border: '#E8DDD0',
  white: '#FFFFFF',
  overlay: 'rgba(61, 50, 41, 0.5)',
  gold: '#F59E0B',

  category: {
    familia: '#F4A5A5',
    salud: '#A5D6A7',
    trabajo: '#90CAF9',
    amigos: '#FFCC80',
    naturaleza: '#80CBC4',
    comida: '#FFF59D',
    descanso: '#CE93D8',
    amor: '#F48FB1',
    yoMisma: '#FFD54F',
  },
};

const dark: typeof light = {
  background: '#1A1A2E',
  primary: '#8FB88A',
  primaryLight: '#6A9A63',
  accent: '#D88AAF',
  secondary: '#9A8AB8',
  earth: '#A08968',
  text: '#E8E0D8',
  textLight: '#A09888',
  card: '#252540',
  border: '#3A3A55',
  white: '#FFFFFF',
  overlay: 'rgba(10, 10, 20, 0.7)',
  gold: '#F59E0B',

  category: {
    familia: '#D48A8A',
    salud: '#7AB87C',
    trabajo: '#6CA8E0',
    amigos: '#E0AA60',
    naturaleza: '#60ACA6',
    comida: '#E0D880',
    descanso: '#B878C0',
    amor: '#D070A0',
    yoMisma: '#E0B840',
  },
};

export type ThemeColors = typeof light;

// ─── Gradient palettes by time of day ─────────────────────
// Each period has [top, middle, bottom] for a 3-stop LinearGradient

export const SKY_GRADIENTS = {
  dawn: {         // 5:00 - 7:59
    light: ['#FFD4A8', '#FFB88C', '#FFF0E0'] as const,
    dark:  ['#2A1A3A', '#3A2040', '#1A1A2E'] as const,
  },
  morning: {      // 8:00 - 11:59
    light: ['#A8D8F0', '#C8E8FF', '#FFF8F0'] as const,
    dark:  ['#1E2A4A', '#252540', '#1A1A2E'] as const,
  },
  afternoon: {    // 12:00 - 16:59
    light: ['#87CEEB', '#B0E0FF', '#FFF8F0'] as const,
    dark:  ['#1A2540', '#252540', '#1A1A2E'] as const,
  },
  sunset: {       // 17:00 - 19:59
    light: ['#FF9966', '#FF7E5F', '#FFD4A8'] as const,
    dark:  ['#3A1A30', '#2A1530', '#1A1A2E'] as const,
  },
  night: {        // 20:00 - 4:59
    light: ['#2C3E6B', '#4A5A8A', '#7080A0'] as const,
    dark:  ['#0A0A1A', '#151530', '#1A1A2E'] as const,
  },
} as const;

export type TimePeriod = keyof typeof SKY_GRADIENTS;

export function getTimePeriod(hour?: number): TimePeriod {
  const h = hour ?? new Date().getHours();
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

// ─── Exports ──────────────────────────────────────────────
// Default export for backward compatibility (light theme)
export const Colors = light;
export const DarkColors = dark;

export function getColors(isDark: boolean): ThemeColors {
  return isDark ? dark : light;
}
