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
import { ControlCenter } from './ControlCenter';
import { AddAppModal } from './AddAppModal';
import { DesktopWidgets } from './DesktopWidgets';
import { SpotlightSearch } from './SpotlightSearch';
import { osAudio } from '@/lib/audio';
import { WallpaperId } from '@/types/user';
import { useCustomization } from '@/lib/customization';
import {
  Palette,
  Sliders,
  Lock,
  Plus,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DesktopProps {
  onLockScreen: () => void;
}

export function Desktop({ onLockScreen }: DesktopProps) {
  const { user, updateSettings } = useAuth();
  const { settings: customSettings, updateCustomization } = useCustomization();

  const [windows, setWindows] = useState<OSWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isAddAppOpen, setIsAddAppOpen] = useState<boolean>(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);
  const [nextZIndex, setNextZIndex] = useState<number>(20);
  const [selectedDesktopIconId, setSelectedDesktopIconId] = useState<string | null>(null);
  const [hoveredIconId, setHoveredIconId] = useState<string | null>(null);

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
      // If AI app (and not Manus), directly open the floating popup window of that AI!
      if (app.category === 'ai' && app.id !== 'manus') {
        osAudio.playWindowOpen();
        if (typeof window !== 'undefined' && app.defaultUrl) {
          const w = Math.min(1180, window.innerWidth > 200 ? window.innerWidth - 60 : 1180);
          const h = Math.min(820, window.innerHeight > 200 ? window.innerHeight - 80 : 820);
          const left = Math.max(20, Math.floor((window.innerWidth - w) / 2));
          const top = Math.max(35, Math.floor((window.innerHeight - h) / 2));
          window.open(
            app.defaultUrl,
            `floating_${app.id}`,
            `width=${w},height=${h},top=${top},left=${left},scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no`
          );
        }
        return;
      }

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
          activeView: 'web',
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
    osAudio.playClick(650, 0.04);
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  // Handle Desktop background click (deselects icons and closes context menu/popovers)
  const handleDesktopClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-desktop-area="true"]') ||
      target.classList.contains('desktop-bg-target')
    ) {
      setSelectedDesktopIconId(null);
      setContextMenu(null);
      setIsControlCenterOpen(false);

      if (clickChangesColor) {
        setClickColorHue((prev) => (prev + 35) % 360);
      }
    }
  };

  // Right Click Context Menu on Desktop
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 240),
      y: Math.min(e.clientY, window.innerHeight - 280),
    });
  };

  // Keyboard shortcut listener (Cmd+L to lock, Cmd+, to settings, Cmd+Space / Ctrl+K / Alt+Space for Spotlight)
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
      if (
        ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.code === 'Space')) ||
        (e.altKey && e.code === 'Space')
      ) {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
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

  // Determine wallpaper style/class
  const wallpaperClass =
    customSettings.wallpaperType === 'animated-aurora'
      ? 'bg-wallpaper-animated-aurora'
      : customSettings.wallpaperType === 'animated-cyber'
      ? 'bg-wallpaper-animated-cyber'
      : customSettings.wallpaperType === 'animated-sunset'
      ? 'bg-wallpaper-animated-sunset'
      : `bg-wallpaper-${currentWallpaper}`;

  const customWallpaperStyle: React.CSSProperties =
    customSettings.wallpaperType === 'custom' && customSettings.customWallpaperUrl
      ? {
          backgroundImage: `url(${customSettings.customWallpaperUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {};

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      data-desktop-area="true"
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none ${wallpaperClass} transition-all duration-700 desktop-bg-target`}
      style={{
        ...customWallpaperStyle,
        filter: `brightness(${customSettings.screenBrightness}) ${
          clickChangesColor ? `hue-rotate(${clickColorHue}deg)` : ''
        }`,
      }}
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
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onToggleWidgets={() =>
          updateCustomization({ showWidgets: !customSettings.showWidgets })
        }
        isWidgetsOpen={customSettings.showWidgets}
      />

      {/* Desktop Workspace Grid (Fixed grid, apps stay in place without moving) */}
      <div
        data-desktop-area="true"
        className="relative z-10 w-full h-[calc(100vh-32px-84px)] p-6 grid grid-flow-col auto-cols-[108px] grid-rows-[repeat(auto-fill,124px)] gap-4 items-start content-start"
      >
        {allApps.map((app) => {
          const isSelected = selectedDesktopIconId === app.id;
          const isHovered = hoveredIconId === app.id;

          return (
            <motion.div
              key={app.id}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              whileTap={{ scale: 0.94 }}
              onMouseEnter={() => setHoveredIconId(app.id)}
              onMouseLeave={() => setHoveredIconId(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDesktopIconId(app.id);
                handleLaunchApp(app);
              }}
              className={`w-26 h-30 rounded-2xl flex flex-col items-center justify-start p-2 text-center cursor-pointer transition-colors group relative select-none ${
                isSelected
                  ? 'bg-white/20 backdrop-blur-md ring-2 ring-[var(--accent-color)] shadow-xl'
                  : 'hover:bg-white/10 hover:backdrop-blur-sm'
              }`}
            >
              {/* App Icon Container - Fixed in grid, not draggable */}
              <div
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center p-2 mb-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] border border-white/25 group-hover:scale-105 group-hover:border-white/40 transition-all overflow-hidden relative flex-shrink-0 select-none"
              >
                {app.icon && app.icon.startsWith('/') ? (
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={44}
                    height={44}
                    draggable={false}
                    className="w-full h-full object-contain drop-shadow select-none pointer-events-none"
                  />
                ) : (
                  <span className="text-2xl select-none pointer-events-none">{app.icon || '🌐'}</span>
                )}
              </div>

              {/* Title with 2-line clamp support */}
              <span className="text-[11px] font-medium text-white/95 group-hover:text-white line-clamp-2 text-center leading-tight drop-shadow-md tracking-tight px-1 max-w-[96px] break-words">
                {app.name}
              </span>

              {app.badge && (
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-sky-300 mt-0.5 opacity-80 group-hover:opacity-100">
                  {app.badge}
                </span>
              )}

              {/* Subtle hover tooltip if title is long */}
              <AnimatePresence>
                {isHovered && app.name.length > 12 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute -bottom-7 z-40 px-2.5 py-1 rounded-xl liquid-glass text-[10px] text-white whitespace-nowrap shadow-xl border border-white/20 pointer-events-none"
                  >
                    {app.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Widgets Panel (Right Side) */}
      <DesktopWidgets
        isOpen={customSettings.showWidgets}
        onClose={() => updateCustomization({ showWidgets: false })}
      />

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
        onToggleWidgets={() =>
          updateCustomization({ showWidgets: !customSettings.showWidgets })
        }
        isWidgetsOpen={customSettings.showWidgets}
      />

      {/* Spotlight Search Modal (Ctrl+K or Alt+Space) */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        apps={allApps}
        onLaunchApp={handleLaunchApp}
        onOpenSettings={() => {
          const settingsApp = allApps.find((a) => a.id === 'settings');
          if (settingsApp) handleLaunchApp(settingsApp);
        }}
        onLockScreen={onLockScreen}
        onToggleWidgets={() =>
          updateCustomization({ showWidgets: !customSettings.showWidgets })
        }
      />

      {/* Add App / Shortcut Modal */}
      <AddAppModal
        isOpen={isAddAppOpen}
        onClose={() => setIsAddAppOpen(false)}
      />

      {/* Desktop Context Menu (Custom Right Click Menu) */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-60 rounded-2xl liquid-glass-panel py-2 px-1.5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/20 text-xs text-white/90 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-3xl"
        >
          {/* Spotlight item */}
          <button
            onClick={() => {
              setContextMenu(null);
              setIsSpotlightOpen(true);
            }}
            className="w-full px-3 py-1.5 rounded-xl flex items-center justify-between hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Buscar en Spotlight</span>
            </span>
            <span className="text-[10px] text-white/40 font-mono">Ctrl+K</span>
          </button>

          <button
            onClick={() => {
              setContextMenu(null);
              setIsAddAppOpen(true);
            }}
            className="w-full px-3 py-1.5 rounded-xl flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Añadir App o Enlace Web</span>
          </button>

          <div className="h-px bg-white/10 my-1.5" />

          {/* Toggle Widgets */}
          <button
            onClick={() => {
              setContextMenu(null);
              updateCustomization({ showWidgets: !customSettings.showWidgets });
            }}
            className="w-full px-3 py-1.5 rounded-xl flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>
              {customSettings.showWidgets ? 'Ocultar Widgets' : 'Mostrar Widgets'}
            </span>
          </button>

          <button
            onClick={() => {
              setContextMenu(null);
              const settingsApp = allApps.find((a) => a.id === 'settings');
              if (settingsApp) handleLaunchApp(settingsApp);
            }}
            className="w-full px-3 py-1.5 rounded-xl flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <Palette className="w-4 h-4 text-sky-400" />
            <span>Fondo de Pantalla & Estilos</span>
          </button>

          <button
            onClick={() => {
              setContextMenu(null);
              const settingsApp = allApps.find((a) => a.id === 'settings');
              if (settingsApp) handleLaunchApp(settingsApp);
            }}
            className="w-full px-3 py-1.5 rounded-xl flex items-center gap-2 hover:bg-white/15 cursor-pointer text-left transition-colors"
          >
            <Sliders className="w-4 h-4 text-white/70" />
            <span>Ajustes del Sistema</span>
          </button>

          <div className="h-px bg-white/10 my-1.5" />

          <button
            onClick={() => {
              setContextMenu(null);
              onLockScreen();
            }}
            className="w-full px-3 py-1.5 rounded-xl flex items-center gap-2 hover:bg-rose-500/20 cursor-pointer text-left text-rose-300 transition-colors"
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
