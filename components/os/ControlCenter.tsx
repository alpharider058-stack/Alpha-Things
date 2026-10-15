'use client';

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Volume2,
  VolumeX,
  Sliders,
  Lock,
  Sun,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Sparkles,
  MousePointerClick,
  Layers,
  Palette,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { osAudio } from '@/lib/audio';
import { useCustomization, ACCENT_COLORS, AccentColorId } from '@/lib/customization';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onLockScreen: () => void;
  onOpenSettings: () => void;
  onToggleWidgets?: () => void;
  isWidgetsOpen?: boolean;
}

export function ControlCenter({
  isOpen,
  onClose,
  onLockScreen,
  onOpenSettings,
  onToggleWidgets,
  isWidgetsOpen = true,
}: ControlCenterProps) {
  const { user, updateSettings } = useAuth();
  const { settings, updateCustomization } = useCustomization();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const isMuted = Boolean(user?.settings?.audioMuted);
  const clickChangesColor = Boolean(user?.settings?.clickChangesColor);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    osAudio.toggleMute();
    updateSettings({ audioMuted: nextMute });
  };

  const handleToggleFullscreen = () => {
    osAudio.playClick(750, 0.03);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    updateCustomization({ screenBrightness: val });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    updateCustomization({ soundVolume: val });
  };

  const handleSelectAccent = (colorId: AccentColorId) => {
    osAudio.playClick(900, 0.03);
    updateCustomization({ accentColor: colorId });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed top-10 right-3.5 z-40 w-84 rounded-3xl liquid-glass-panel p-4 border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150 select-none text-white font-inter"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="text-xs font-semibold text-white">Centro de Control</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">
          macOS Glass
        </span>
      </div>

      {/* Grid of Quick Action Tiles */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* Audio Toggle Tile */}
        <button
          onClick={handleToggleMute}
          className={`p-3 rounded-2xl liquid-glass border flex flex-col justify-between h-20 text-left transition-all cursor-pointer ${
            !isMuted
              ? 'border-[var(--accent-color)]/50 bg-[var(--accent-color)]/15 text-white'
              : 'border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {!isMuted ? (
              <Volume2 className="w-5 h-5 text-[var(--accent-color)]" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
            <div
              className={`w-2 h-2 rounded-full ${!isMuted ? 'bg-[var(--accent-color)]' : 'bg-white/20'}`}
            />
          </div>
          <div>
            <p className="text-xs font-semibold">Sonido</p>
            <p className="text-[10px] text-white/50">{!isMuted ? 'Activo' : 'Silencio'}</p>
          </div>
        </button>

        {/* Fullscreen Tile */}
        <button
          onClick={handleToggleFullscreen}
          className={`p-3 rounded-2xl liquid-glass border flex flex-col justify-between h-20 text-left transition-all cursor-pointer ${
            isFullscreen
              ? 'border-emerald-400/50 bg-emerald-500/15 text-white'
              : 'border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white/70" />
            )}
            <div
              className={`w-2 h-2 rounded-full ${isFullscreen ? 'bg-emerald-400' : 'bg-white/20'}`}
            />
          </div>
          <div>
            <p className="text-xs font-semibold">Pantalla</p>
            <p className="text-[10px] text-white/50">
              {isFullscreen ? 'Completa' : 'Ventana'}
            </p>
          </div>
        </button>

        {/* Widgets Toggle Tile */}
        {onToggleWidgets && (
          <button
            onClick={() => {
              osAudio.playClick(800, 0.03);
              onToggleWidgets();
            }}
            className={`p-3 rounded-2xl liquid-glass border flex flex-col justify-between h-20 text-left transition-all cursor-pointer ${
              isWidgetsOpen
                ? 'border-purple-400/50 bg-purple-500/15 text-white'
                : 'border-white/10 text-white/60 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Layers className="w-5 h-5 text-purple-400" />
              <div
                className={`w-2 h-2 rounded-full ${isWidgetsOpen ? 'bg-purple-400' : 'bg-white/20'}`}
              />
            </div>
            <div>
              <p className="text-xs font-semibold">Widgets</p>
              <p className="text-[10px] text-white/50">
                {isWidgetsOpen ? 'Visibles' : 'Ocultos'}
              </p>
            </div>
          </button>
        )}

        {/* Click Color Effect Tile */}
        <button
          onClick={() => {
            osAudio.playClick(850, 0.04);
            updateSettings({ clickChangesColor: !clickChangesColor });
          }}
          className={`p-3 rounded-2xl liquid-glass border flex flex-col justify-between h-20 text-left transition-all cursor-pointer ${
            clickChangesColor
              ? 'border-purple-400/50 bg-purple-500/15 text-white'
              : 'border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <MousePointerClick
              className={`w-5 h-5 ${clickChangesColor ? 'text-purple-400' : ''}`}
            />
            <div
              className={`w-2 h-2 rounded-full ${clickChangesColor ? 'bg-purple-400' : 'bg-white/20'}`}
            />
          </div>
          <div>
            <p className="text-xs font-semibold">Color Clic</p>
            <p className="text-[10px] text-white/50">
              {clickChangesColor ? 'Activo' : 'Fijo'}
            </p>
          </div>
        </button>
      </div>

      {/* Sliders: Brightness & Volume */}
      <div className="space-y-3 mb-3.5 bg-black/35 p-3 rounded-2xl border border-white/10">
        {/* Brightness Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-white/70">
            <span className="flex items-center gap-1.5 font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Brillo de Pantalla</span>
            </span>
            <span className="font-mono text-white/90">
              {Math.round(settings.screenBrightness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="1.0"
            step="0.05"
            value={settings.screenBrightness}
            onChange={handleBrightnessChange}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
          />
        </div>

        {/* Volume Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-white/70">
            <span className="flex items-center gap-1.5 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Volumen Audio</span>
            </span>
            <span className="font-mono text-white/90">
              {Math.round(settings.soundVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.05"
            value={settings.soundVolume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
          />
        </div>
      </div>

      {/* 1-Tap Accent Color Selector */}
      <div className="mb-3.5 p-2.5 rounded-2xl bg-black/35 border border-white/10">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-2">
          Color de Acento Global
        </p>
        <div className="flex items-center justify-between">
          {(Object.keys(ACCENT_COLORS) as AccentColorId[]).map((cId) => {
            const acc = ACCENT_COLORS[cId];
            const isSel = settings.accentColor === cId;
            return (
              <button
                key={cId}
                onClick={() => handleSelectAccent(cId)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSel ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: acc.color }}
                title={acc.name}
              >
                {isSel && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
        <button
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Palette className="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span>Ajustes</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onLockScreen();
          }}
          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer flex items-center justify-center gap-2 text-rose-300"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Bloquear</span>
        </button>
      </div>
    </div>
  );
}
