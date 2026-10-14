export type ColorTheme = 'matrix' | 'cyan' | 'purple' | 'amber' | 'crimson' | 'lime' | 'obsidian' | 'liquid-smoke';
export type FontFamily = 'jetbrains' | 'orbitron' | 'sharetech' | 'rajdhani' | 'fira' | 'inter' | 'sf-pro' | 'outfit';
export type FontSize = 'compact' | 'normal' | 'large';
export type BackgroundEffect = 'matrix' | 'binary' | 'grid' | 'starfield' | 'minimal' | 'liquid-glass' | 'aurora';
export type ScanlineIntensity = 'none' | 'subtle' | 'intense';
export type GlowIntensity = 'low' | 'medium' | 'high';
export type InteractionMode = 'disperse' | 'gather';
export type WallpaperId = 'liquid-smoke' | 'obsidian-glow' | 'aurora-glass' | 'platinum-mesh' | 'cosmic-dark' | 'deep-abyss';

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  category: string;
  description?: string;
  icon?: string;
  createdAt: number;
}

export interface UserSettings {
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  fontSize: FontSize;
  bgEffect: BackgroundEffect;
  matrixSpeed: 'slow' | 'normal' | 'fast';
  scanlines: ScanlineIntensity;
  glowIntensity: GlowIntensity;
  interactionMode: InteractionMode;
  audioMuted: boolean;
  soundVolume: number;
  terminalExpanded: boolean;
  clickChangesColor: boolean;
  wallpaper: WallpaperId;
  glassBlur: 'low' | 'medium' | 'high';
  dockPosition: 'bottom' | 'left';
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: number;
  lastLogin: number;
  favorites: string[];
  customLinks: CustomLink[];
  settings: UserSettings;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  colorTheme: 'obsidian',
  fontFamily: 'inter',
  fontSize: 'normal',
  bgEffect: 'liquid-glass',
  matrixSpeed: 'normal',
  scanlines: 'none',
  glowIntensity: 'medium',
  interactionMode: 'disperse',
  audioMuted: false,
  soundVolume: 0.8,
  terminalExpanded: false,
  clickChangesColor: false,
  wallpaper: 'liquid-smoke',
  glassBlur: 'high',
  dockPosition: 'bottom',
};
