export type ColorTheme = 'matrix' | 'cyan' | 'purple' | 'amber' | 'crimson' | 'lime';
export type FontFamily = 'jetbrains' | 'orbitron' | 'sharetech' | 'rajdhani' | 'fira' | 'inter';
export type FontSize = 'compact' | 'normal' | 'large';
export type BackgroundEffect = 'matrix' | 'binary' | 'grid' | 'starfield' | 'minimal';
export type ScanlineIntensity = 'none' | 'subtle' | 'intense';
export type GlowIntensity = 'low' | 'medium' | 'high';
export type InteractionMode = 'disperse' | 'gather';

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
  colorTheme: 'matrix',
  fontFamily: 'jetbrains',
  fontSize: 'normal',
  bgEffect: 'matrix',
  matrixSpeed: 'normal',
  scanlines: 'subtle',
  glowIntensity: 'medium',
  interactionMode: 'disperse',
  audioMuted: false,
  soundVolume: 0.8,
  terminalExpanded: false,
  clickChangesColor: false,
};
