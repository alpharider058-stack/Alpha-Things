'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserSettings, DEFAULT_USER_SETTINGS, CustomLink } from '@/types/user';
import { cyberAudio } from '@/lib/audio';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toggleFavorite: (linkId: string) => void;
  addCustomLink: (link: Omit<CustomLink, 'id' | 'createdAt'>) => void;
  removeCustomLink: (linkId: string) => void;
}

const STORAGE_USERS_KEY = 'alpha_things_accounts_v1';
const STORAGE_ACTIVE_USER_ID = 'alpha_things_active_id_v1';

// Preset avatar options
export const AVATAR_OPTIONS = [
  '⚡', '👾', '💻', '🛡️', '🧠', '🚀', '🔮', '🎮', '👁️', '🧬'
];

interface StoredAccount {
  profile: UserProfile;
  passwordHash: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const activeId = localStorage.getItem(STORAGE_ACTIVE_USER_ID);
      const rawAccounts = localStorage.getItem(STORAGE_USERS_KEY);
      if (rawAccounts && activeId) {
        const accounts: StoredAccount[] = JSON.parse(rawAccounts);
        const found = accounts.find((a) => a.profile.id === activeId);
        if (found) {
          const hasMigratedClickOption = localStorage.getItem('alpha_click_color_migrated_v3');
          const mergedSettings: UserSettings = {
            ...DEFAULT_USER_SETTINGS,
            ...found.profile.settings,
          };
          if (!hasMigratedClickOption) {
            mergedSettings.clickChangesColor = false;
            try {
              localStorage.setItem('alpha_click_color_migrated_v3', 'true');
            } catch {}
          }
          return {
            ...found.profile,
            settings: mergedSettings,
          };
        }
      }
    } catch {
      return null;
    }
    return null;
  });
  const [isLoading] = useState<boolean>(false);

  // Helper to persist user changes
  const saveUserToStorage = useCallback((updatedProfile: UserProfile) => {
    try {
      const rawAccounts = localStorage.getItem(STORAGE_USERS_KEY);
      const accounts: StoredAccount[] = rawAccounts ? JSON.parse(rawAccounts) : [];
      const idx = accounts.findIndex((a) => a.profile.id === updatedProfile.id);
      if (idx !== -1) {
        accounts[idx].profile = updatedProfile;
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
      }
      setUser(updatedProfile);
    } catch {
      setUser(updatedProfile);
    }
  }, []);

  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    const accounts: StoredAccount[] = raw ? JSON.parse(raw) : [];
    const cleanId = identifier.trim().toLowerCase();

    const account = accounts.find(
      (a) => a.profile.username.toLowerCase() === cleanId || a.profile.email.toLowerCase() === cleanId
    );

    if (!account) {
      return { success: false, error: 'Usuario o correo no registrado.' };
    }

    if (account.passwordHash !== pass) {
      return { success: false, error: 'Contraseña de acceso incorrecta.' };
    }

    const updatedProfile: UserProfile = {
      ...account.profile,
      lastLogin: Date.now(),
    };

    saveUserToStorage(updatedProfile);
    localStorage.setItem(STORAGE_ACTIVE_USER_ID, updatedProfile.id);
    cyberAudio.playLockOn();
    return { success: true };
  };

  const register = async (
    username: string,
    email: string,
    pass: string,
    avatar = '⚡'
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres.' };
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Por favor introduce un correo válido.' };
    }
    if (pass.length < 4) {
      return { success: false, error: 'La clave de seguridad debe tener mínimo 4 caracteres.' };
    }

    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    const accounts: StoredAccount[] = raw ? JSON.parse(raw) : [];

    const exists = accounts.some(
      (a) =>
        a.profile.username.toLowerCase() === cleanUsername.toLowerCase() ||
        a.profile.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      return { success: false, error: 'Ya existe una cuenta con este usuario o correo.' };
    }

    const newProfile: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      username: cleanUsername,
      email: cleanEmail,
      avatar,
      role: 'ALPHA_OPERATOR',
      createdAt: Date.now(),
      lastLogin: Date.now(),
      favorites: ['cineos', 'gta-v-web'],
      customLinks: [],
      settings: { ...DEFAULT_USER_SETTINGS },
    };

    const newAccount: StoredAccount = {
      profile: newProfile,
      passwordHash: pass,
    };

    accounts.push(newAccount);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_ACTIVE_USER_ID, newProfile.id);
    setUser(newProfile);
    cyberAudio.playLockOn();

    return { success: true };
  };

  const loginAsDemo = () => {
    const demoProfile: UserProfile = {
      id: 'demo_operator',
      username: 'Operador_Alpha',
      email: 'demo@alpha.io',
      avatar: '🛡️',
      role: 'INVITADO_ELITE',
      createdAt: Date.now(),
      lastLogin: Date.now(),
      favorites: ['gta-v-web', 'cineos', 'alpha-hack'],
      customLinks: [],
      settings: { ...DEFAULT_USER_SETTINGS },
    };

    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    const accounts: StoredAccount[] = raw ? JSON.parse(raw) : [];
    const idx = accounts.findIndex((a) => a.profile.id === 'demo_operator');
    if (idx !== -1) {
      accounts[idx].profile = demoProfile;
    } else {
      accounts.push({ profile: demoProfile, passwordHash: 'alpha123' });
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_ACTIVE_USER_ID, demoProfile.id);
    setUser(demoProfile);
    cyberAudio.playLockOn();
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_ACTIVE_USER_ID);
    setUser(null);
    cyberAudio.playLaserBlip();
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      settings: {
        ...user.settings,
        ...newSettings,
      },
    };
    saveUserToStorage(updated);
  };

  const toggleFavorite = (linkId: string) => {
    if (!user) return;
    const isFav = user.favorites.includes(linkId);
    const newFavs = isFav
      ? user.favorites.filter((id) => id !== linkId)
      : [...user.favorites, linkId];
    cyberAudio.playBeep(isFav ? 450 : 850, 0.05, 'sine');
    saveUserToStorage({
      ...user,
      favorites: newFavs,
    });
  };

  const addCustomLink = (linkData: Omit<CustomLink, 'id' | 'createdAt'>) => {
    if (!user) return;
    const newLink: CustomLink = {
      ...linkData,
      id: 'link_' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    cyberAudio.playLaserBlip();
    saveUserToStorage({
      ...user,
      customLinks: [newLink, ...user.customLinks],
    });
  };

  const removeCustomLink = (linkId: string) => {
    if (!user) return;
    cyberAudio.playBeep(350, 0.05, 'sawtooth');
    saveUserToStorage({
      ...user,
      customLinks: user.customLinks.filter((l) => l.id !== linkId),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
        updateSettings,
        toggleFavorite,
        addCustomLink,
        removeCustomLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
