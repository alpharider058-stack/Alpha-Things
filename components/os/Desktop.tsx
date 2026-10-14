'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { OSApp, OSWindow, SYSTEM_APPS } from '@/types/os';
import { useAuth } from '@/context/AuthContext';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { WindowFrame } from './WindowFrame';
import { SettingsApp } from './SettingsApp';
import { BrowserApp } from './BrowserApp';
import { ControlCenter } from './ControlCenter';
import { AddAppModal } from './AddAppModal';
import { osAudio } from '@/lib/audio';
import { WallpaperId } from '@/types/user';
import {
  Palette,
  Sliders,
  Lock,
  Plus,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DesktopProps {
  onLockScreen: () => void;
}

export function Desktop({ onLockScreen }: DesktopProps) {
  const { user, updateSettings } = useAuth();
  const [windows, setWindows] = useState<OSWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isAddAppOpen, setIsAddAppOpen] = useState<boolean>(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState<boolean>(false);
  const [launchpadSearch, setLaunchpadSearch] = useState<string>('');
  const [nextZIndex, setNextZIndex] = useState<number>(20);
  const [selectedDesktopIconId, setSelectedDesktopIconId] = useState<string | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Dynamic click color shift state (only active if user enabled clickChangesColor)
  const [clickColorHue, setClickColorHue] = useState<number>(220);
  const clickChangesColor = Boolean(user?.settings?.clickChangesColor);

  // Combine SYSTEM_APPS with user's custom links
  const allApps: OSApp[] = useMemo(() => {
    const customApps: OSApp[] = (user?.customLinks || []).map((link) => ({
      id: `custom-${link.id}`,
      name: link.title,
      description: link.description || 'App web personalizada',
      category: 'custom',
      icon: link.icon || '🌐',
      accentColor: '#38bdf8',
      defaultUrl: link.url,
      defaultWidth: 960,
      defaultHeight: 640,
    }));
    return [...SYSTEM_APPS, ...customApps];
  }, [user?.customLinks]);

  // Active App for MenuBar
  const activeApp = useMemo(() => {
    if (!activeWindowId) return null;
    const win = windows.find((w) => w.id === activeWindowId && w.isOpen && !w.isMinimized);
    if (!win) return null;
    return allApps.find((a) => a.id === win.appId) || null;
  }, [activeWindowId, windows, allApps]);

  // Launch or Focus App
  const handleLaunchApp = useCallback(
    (app: OSApp) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.appId === app.id);
        const z = nextZIndex + 1;
        setNextZIndex(z);
        setActiveWindowId(app.id);

        if (existing) {
          // If already exists, unminimize, focus and bring to front
          osAudio.playWindowOpen();
          return prev.map((w) =>
            w.appId === app.id
              ? {
                  ...w,
                  isOpen: true,
                  isMinimized: false,
                  zIndex: z,
                }
              : w
          );
        }

        // Calculate cascading spawn position
        const offset = (prev.length % 6) * 32;
        const defaultWidth = Math.min(
          app.defaultWidth || 960,
          typeof window !== 'undefined' ? window.innerWidth - 60 : 960
        );
        const defaultHeight = Math.min(
          app.defaultHeight || 640,
          typeof window !== 'undefined' ? window.innerHeight - 100 : 640
        );

        const spawnX = Math.max(30, 80 + offset);
        const spawnY = Math.max(48, 60 + offset);

        const newWindow: OSWindow = {
          id: app.id,
          appId: app.id,
          title: app.name,
          icon: app.icon,
          url: app.defaultUrl,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: z,
          position: { x: spawnX, y: spawnY },
          size: { width: defaultWidth, height: defaultHeight },
          activeTab: app.id === 'mantle' ? 'alpha-five' : undefined,
          activeView: app.aiDetails ? 'info' : 'web',
        };

        osAudio.playWindowOpen();
        return [...prev, newWindow];
      });
    },
    [nextZIndex]
  );

  const handleFocusWindow = useCallback(
    (winId: string) => {
      const z = nextZIndex + 1;
      setNextZIndex(z);
      setActiveWindowId(winId);
      setWindows((prev) =>
        prev.map((w) => (w.id === winId ? { ...w, zIndex: z } : w))
      );
    },
    [nextZIndex]
  );

  const handleCloseWindow = useCallback((winId: string) => {
    osAudio.playWindowClose();
    setWindows((prev) => prev.filter((w) => w.id !== winId));
    setActiveWindowId((prev) => (prev === winId ? null : prev));
  }, []);

  const handleMinimizeWindow = useCallback((winId: string) => {
    osAudio.playClick(500, 0.04);
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId((prev) => (prev === winId ? null : prev));
  }, []);

  const handleToggleMaximizeWindow = useCallback((winId: string) => {
    osAudio.playClick(700, 0.04);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === winId ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  }, []);

  // Handle desktop click
  const handleDesktopClick = (e: React.MouseEvent) => {
    setContextMenu(null);
    const target = e.target as HTMLElement;

    if (target.dataset.desktopArea === 'true') {
      setSelectedDesktopIconId(null);
      setIsControlCenterOpen(false);

      // Only shift background color if user has specifically enabled this option
      if (clickChangesColor) {
        setClickColorHue((prev) => (prev + 35) % 360);
      }
    }
  };

  // Right Click Context Menu on Desktop
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Keyboard shortcut listener (Cmd+L to lock, Cmd+, to settings, Cmd+Space / Cmd+K for Launchpad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        onLockScreen();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        const settingsApp = allApps.find((a) => a.id === 'settings');
        if (settingsApp) handleLaunchApp(settingsApp);
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.code === 'Space')) {
        e.preventDefault();
        setIsLaunchpadOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLockScreen, allApps, handleLaunchApp]);

  // Open app IDs for dock indicators
  const openAppIds = useMemo(
    () => windows.filter((w) => w.isOpen).map((w) => w.appId),
    [windows]
  );

  const currentWallpaper = (user?.settings?.wallpaper || 'liquid-smoke') as WallpaperId;

  const filteredLaunchpadApps = useMemo(() => {
    if (!launchpadSearch.trim()) return allApps;
    const q = launchpadSearch.toLowerCase();
    return allApps.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [allApps, launchpadSearch]);

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      data-desktop-area="true"
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none bg-wallpaper-${currentWallpaper} transition-all duration-700`}
      style={
        clickChangesColor
          ? {
              filter: `hue-rotate(${clickColorHue}deg)`,
            }
          : undefined
      }
    >
      {/* Liquid Glass Ambient Refraction Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] rounded-full bg-sky-500/10 blur-[160px] animate-pulse" />
        <div className="absolute -bottom-32 right-1/4 w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[170px]" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-[140px]" />

        {/* Specular Shimmer overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* OS Top Menu Bar */}
      <MenuBar
        activeAppName={activeApp ? activeApp.name : 'Classroom OS'}
        onOpenSettings={() => {
          const settingsApp = allApps.find((a) => a.id === 'settings');
          if (settingsApp) handleLaunchApp(settingsApp);
        }}
        onLockScreen={onLockScreen}
        onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)}
        isControlCenterOpen={isControlCenterOpen}
      />

      {/* Desktop Workspace Grid (App Shortcuts) */}
      <div
        data-desktop-area="true"
        className="relative z-10 w-full h-[calc(100vh-32px-84px)] p-6 grid grid-flow-col auto-cols-[108px] grid-rows-[repeat(auto-fill,118px)] gap-4 items-start content-start"
      >
        {allApps.map((app) => {
          const isSelected = selectedDesktopIconId === app.id;

          return (
            <motion.div
              key={app.id}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDesktopIconId(app.id);
                // SINGLE CLICK LAUNCHES THE APP IMMEDIATELY AS REQUESTED!
                handleLaunchApp(app);
              }}
              className={`w-26 h-28 rounded-2xl flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all group ${
                isSelected
                  ? 'bg-white/20 backdrop-blur-md ring-2 ring-sky-400 shadow-xl'
                  : 'hover:bg-white/10 hover:backdrop-blur-sm'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center p-2 mb-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] border border-white/25 group-hover:scale-105 group-hover:border-white/40 transition-all overflow-hidden relative">
                {app.icon && app.icon.startsWith('/') ? (
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={44}
                    height={44}
                    className="w-full h-full object-contain drop-shadow"
                  />
                ) : (
                  <span className="text-2xl">{app.icon || '🌐'}</span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-white/95 group-hover:text-white line-clamp-1 drop-shadow-md tracking-tight px-1">
                {app.name}
              </span>
              {app.badge && (
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-sky-300 mt-0.5 opacity-80 group-hover:opacity-100">
                  {app.badge}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Multi-Window Management Layer */}
      {windows.map((win) => {
        const app = allApps.find((a) => a.id === win.appId);
        if (!app) return null;

        return (
          <WindowFrame
            key={win.id}
            window={win}
            app={app}
            isActive={activeWindowId === win.id}
            onFocus={() => handleFocusWindow(win.id)}
            onClose={() => handleCloseWindow(win.id)}
            onMinimize={() => handleMinimizeWindow(win.id)}
            onToggleMaximize={() => handleToggleMaximizeWindow(win.id)}
          >
            {/* If the window is Settings App, render the dedicated settings panel inside */}
            {app.id === 'settings' && <SettingsApp />}
            {/* If the window is Browser App, render the dedicated hybrid browser engine */}
            {app.id === 'browser' && <BrowserApp onClose={() => handleCloseWindow(win.id)} />}
          </WindowFrame>
        );
      })}

      {/* Control Center Popover */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        onLockScreen={onLockScreen}
        onOpenSettings={() => {
          const settingsApp = allApps.find((a) => a.id === 'settings');
          if (settingsApp) handleLaunchApp(settingsApp);
        }}
      />

      {/* Add App / Shortcut Modal */}
      <AddAppModal
        isOpen={isAddAppOpen}
        onClose={() => setIsAddAppOpen(false)}
      />

      {/* Launchpad / Spotlight Modal */}
      <AnimatePresence>
        {isLaunchpadOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setIsLaunchpadOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-2xl flex flex-col items-center justify-center p-6 select-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl liquid-glass-panel rounded-3xl p-6 border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/10 border border-white/15 mb-6">
                <Search className="w-5 h-5 text-sky-400" />
                <input
                  type="text"
                  value={launchpadSearch}
                  onChange={(e) => setLaunchpadSearch(e.target.value)}
                  placeholder="Buscar apps, suites de Classroom o IA (Claude, Perplexity, Copilot...)"
                  autoFocus
                  className="bg-transparent border-0 text-white placeholder-white/40 focus:outline-none w-full text-sm"
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-y-auto p-2">
                {filteredLaunchpadApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setIsLaunchpadOpen(false);
                      handleLaunchApp(app);
                    }}
                    className="p-3 rounded-2xl hover:bg-white/10 flex flex-col items-center text-center group cursor-pointer transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center p-2 mb-2 group-hover:scale-110 transition-transform shadow-lg border border-white/20">
                      {app.icon && app.icon.startsWith('/') ? (
                        <Image src={app.icon} alt={app.name} width={40} height={40} />
                      ) : (
                        <span className="text-2xl">{app.icon || '🌐'}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-white/90 group-hover:text-white line-clamp-1">
                      {app.name}
                    </span>
                    <span className="text-[10px] text-white/50 line-clamp-1">{app.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Context Menu (Right Click) */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-56 rounded-2xl liquid-glass-panel py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/20 text-xs text-white/90 animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            onClick={() => {
              setContextMenu(null);
              setIsLaunchpadOpen(true);
            }}
            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span>Launchpad de Aplicaciones</span>
          </button>

          <button
            onClick={() => {
              setContextMenu(null);
              setIsAddAppOpen(true);
            }}
            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Añadir App o Enlace Web</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              setContextMenu(null);
              const settingsApp = allApps.find((a) => a.id === 'settings');
              if (settingsApp) handleLaunchApp(settingsApp);
            }}
            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Fondo de Pantalla & Estilos</span>
          </button>

          <button
            onClick={() => {
              setContextMenu(null);
              const settingsApp = allApps.find((a) => a.id === 'settings');
              if (settingsApp) handleLaunchApp(settingsApp);
            }}
            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Ajustes del Sistema</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              setContextMenu(null);
              onLockScreen();
            }}
            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left text-red-300 transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>Bloquear Pantalla</span>
          </button>
        </div>
      )}

      {/* Bottom Liquid Glass Dock */}
      <Dock
        apps={allApps}
        openAppIds={openAppIds}
        activeAppId={activeWindowId}
        onLaunchApp={handleLaunchApp}
        onOpenAddApp={() => setIsAddAppOpen(true)}
      />
    </div>
  );
}
