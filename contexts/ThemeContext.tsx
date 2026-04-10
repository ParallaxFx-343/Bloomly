import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ThemeColors,
  TimePeriod,
  SKY_GRADIENTS,
  getTimePeriod,
  getColors,
} from '../constants/Colors';
import { kvGet, kvSet, kvGetBool, kvSetBool } from '../lib/database';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  timePeriod: TimePeriod;
  skyGradient: readonly string[];
  /** 'auto' = follows time of day, 'light' = forced light, 'dark' = forced dark */
  darkModePreference: 'auto' | 'light' | 'dark';
  setDarkModePreference: (pref: 'auto' | 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<'auto' | 'light' | 'dark'>('auto');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(getTimePeriod());
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Load saved preference on mount
  useEffect(() => {
    (async () => {
      const saved = await kvGet('dark_mode_preference');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        setPreferenceState(saved);
      }
    })();
  }, []);

  // Update time period every minute
  useEffect(() => {
    const update = () => setTimePeriod(getTimePeriod());
    intervalRef.current = setInterval(update, 60_000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const setDarkModePreference = useCallback((pref: 'auto' | 'light' | 'dark') => {
    setPreferenceState(pref);
    kvSet('dark_mode_preference', pref);
  }, []);

  // Resolve dark mode
  const isDark =
    preference === 'dark' ? true :
    preference === 'light' ? false :
    // auto: dark when night (20:00-4:59)
    timePeriod === 'night';

  const colors = useMemo(() => getColors(isDark), [isDark]);
  const skyGradient = SKY_GRADIENTS[timePeriod][isDark ? 'dark' : 'light'];

  const value = useMemo(() => ({
    colors,
    isDark,
    timePeriod,
    skyGradient,
    darkModePreference: preference,
    setDarkModePreference,
  }), [colors, isDark, timePeriod, skyGradient, preference, setDarkModePreference]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
