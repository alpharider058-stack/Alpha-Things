'use client';

import { useState, useEffect, useCallback } from 'react';

export type AccentColorId = 'cyan' | 'purple' | 'emerald' | 'orange' | 'rose';
export type DockSizeId = 'small' | 'normal' | 'large';
export type FontStyleCategory = 'modern' | 'retro' | 'futuristic';

export interface AccentColorConfig {
  id: AccentColorId;
  name: string;
  color: string;
  glow: string;
  rgb: string;
  gradient: string;
}

export const ACCENT_COLORS: Record<AccentColorId, AccentColorConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Cian Neón',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    rgb: '56, 189, 248',
    gradient: 'from-sky-400 to-cyan-500',
  },
  purple: {
    id: 'purple',
    name: 'Púrpura Místico',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.45)',
    rgb: '168, 85, 247',
    gradient: 'from-purple-400 to-indigo-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Verde Matrix',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    rgb: '16, 185, 129',
    gradient: 'from-emerald-400 to-teal-500',
  },
  orange: {
    id: 'orange',
    name: 'Ámbar Solar',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.45)',
    rgb: '249, 115, 22',
    gradient: 'from-amber-400 to-orange-500',
  },
  rose: {
    id: 'rose',
    name: 'Rosa Cibernético',
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.45)',
    rgb: '244, 63, 94',
    gradient: 'from-rose-400 to-pink-500',
  },
};

export type WidgetId = 'clock' | 'pomodoro' | 'tasks' | 'performance';

export interface CustomizationSettings {
  accentColor: AccentColorId;
  customWallpaperUrl: string;
  wallpaperType: 'preset' | 'animated-aurora' | 'animated-cyber' | 'animated-sunset' | 'custom';
  dockSize: DockSizeId;
  dockAutoHide: boolean;
  dockMagnification: boolean;
  showWidgets: boolean;
  enabledWidgets: WidgetId[];
  screenBrightness: number; // 0.4 to 1.0
  soundVolume: number; // 0 to 1.0
  fontStyleCategory: FontStyleCategory;
}

export const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  accentColor: 'cyan',
  customWallpaperUrl: '',
  wallpaperType: 'preset',
  dockSize: 'normal',
  dockAutoHide: false,
  dockMagnification: true,
  showWidgets: true,
  enabledWidgets: ['clock', 'pomodoro', 'tasks', 'performance'],
  screenBrightness: 1.0,
  soundVolume: 0.85,
  fontStyleCategory: 'modern',
};

const STORAGE_KEY = 'classroom_os_customization_v2';
const EVENT_CUSTOMIZATION_CHANGE = 'classroom_os_customization_updated';

export function getCustomization(): CustomizationSettings {
  if (typeof window === 'undefined') return DEFAULT_CUSTOMIZATION;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CUSTOMIZATION;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CUSTOMIZATION, ...parsed };
  } catch {
    return DEFAULT_CUSTOMIZATION;
  }
}

export function saveCustomization(newSettings: Partial<CustomizationSettings>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomization();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Update CSS variables on documentElement
    applyCssVariables(updated);

    // Notify all active components
    window.dispatchEvent(new CustomEvent(EVENT_CUSTOMIZATION_CHANGE, { detail: updated }));
  } catch (err) {
    console.error('Error saving customization:', err);
  }
}

export function applyCssVariables(settings: CustomizationSettings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const accent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.cyan;

  root.style.setProperty('--accent-color', accent.color);
  root.style.setProperty('--accent-glow', accent.glow);
  root.style.setProperty('--accent-rgb', accent.rgb);
  root.style.setProperty('--screen-brightness', `${settings.screenBrightness}`);

  const dockPixels =
    settings.dockSize === 'small' ? '40px' : settings.dockSize === 'large' ? '56px' : '48px';
  root.style.setProperty('--dock-icon-size', dockPixels);
}

// React Hook for reactive customization
export function useCustomization() {
  const [settings, setSettings] = useState<CustomizationSettings>(() => getCustomization());

  useEffect(() => {
    applyCssVariables(settings);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CustomizationSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(getCustomization());
      }
    };

    window.addEventListener(EVENT_CUSTOMIZATION_CHANGE, handleUpdate);
    return () => window.removeEventListener(EVENT_CUSTOMIZATION_CHANGE, handleUpdate);
  }, [settings]);

  const update = useCallback((newSettings: Partial<CustomizationSettings>) => {
    saveCustomization(newSettings);
  }, []);

  return { settings, updateCustomization: update };
}
