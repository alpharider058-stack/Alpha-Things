'use client';

import React from 'react';
import {
  Wifi,
  Volume2,
  VolumeX,
  Sliders,
  Lock,
  RotateCcw,
  MousePointerClick,
  Palette,
  Sparkles,
  Sun,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { osAudio } from '@/lib/audio';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onLockScreen: () => void;
  onOpenSettings: () => void;
}

export function ControlCenter({
  isOpen,
  onClose,
  onLockScreen,
  onOpenSettings,
}: ControlCenterProps) {
  const { user, updateSettings } = useAuth();
  const isMuted = Boolean(user?.settings?.audioMuted);
  const clickChangesColor = Boolean(user?.settings?.clickChangesColor);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    osAudio.toggleMute();
    updateSettings({ audioMuted: nextMute });
  };

  const handleToggleClickColor = () => {
    osAudio.playClick(850, 0.04);
    updateSettings({ clickChangesColor: !clickChangesColor });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed top-10 right-3.5 z-40 w-80 rounded-3xl liquid-glass-panel p-4 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150 select-none text-white font-inter"
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-white">Centro de Control</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
          Classroom OS
        </span>
      </div>

      {/* Grid of Quick Action Tiles */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* Audio Toggle Tile */}
        <button
          onClick={handleToggleMute}
          className={`p-3 rounded-2xl liquid-glass border flex flex-col justify-between h-20 text-left transition-all cursor-pointer ${
            !isMuted
              ? 'border-sky-400/50 bg-sky-500/15 text-white'
              : 'border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {!isMuted ? <Volume2 className="w-5 h-5 text-sky-400" /> : <VolumeX className="w-5 h-5" />}
            <div
              className={`w-2 h-2 rounded-full ${!isMuted ? 'bg-sky-400' : 'bg-white/20'}`}
            />
          </div>
          <div>
            <p className="text-xs font-semibold">Sonido</p>
            <p className="text-[10px] text-white/50">{!isMuted ? 'Activo' : 'Silencio'}</p>
          </div>
        </button>

        {/* Click Color Effect Tile */}
        <button
          onClick={handleToggleClickColor}
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
              className={`w-2 h-2 rounded-full ${
                clickChangesColor ? 'bg-purple-400' : 'bg-white/20'
              }`}
            />
          </div>
          <div>
            <p className="text-xs font-semibold">Color al Clic</p>
            <p className="text-[10px] text-white/50">
              {clickChangesColor ? 'Activado' : 'Desactivado'}
            </p>
          </div>
        </button>
      </div>

      {/* Connectivity & Display */}
      <div className="liquid-glass rounded-2xl p-3 border border-white/10 mb-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-white/80">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Red Wi-Fi</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">Conectado (5G)</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-white/80">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Efecto Liquid Glass</span>
          </span>
          <span className="text-[10px] text-sky-400 font-mono">Blur 36px</span>
        </div>
      </div>

      {/* System Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
          className="py-2.5 px-3 rounded-xl liquid-glass hover:bg-white/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-white/90"
        >
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span>Personalizar</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onLockScreen();
          }}
          className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Bloquear SO</span>
        </button>
      </div>
    </div>
  );
}
