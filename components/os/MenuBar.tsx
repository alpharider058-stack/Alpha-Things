'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Sliders,
  Lock,
  LogOut,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { osAudio } from '@/lib/audio';

interface MenuBarProps {
  activeAppName: string;
  onOpenSettings: () => void;
  onLockScreen: () => void;
  onToggleControlCenter: () => void;
  isControlCenterOpen: boolean;
}

export function MenuBar({
  activeAppName,
  onOpenSettings,
  onLockScreen,
  onToggleControlCenter,
  isControlCenterOpen,
}: MenuBarProps) {
  const { user, logout } = useAuth();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => osAudio.getMuted());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close system menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsSystemMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(osAudio.toggleMute());
  };

  return (
    <header className="relative z-30 w-full h-8 px-3.5 liquid-glass border-b border-white/10 flex items-center justify-between text-xs select-none backdrop-blur-2xl">
      {/* Left: System Menu (Classroom Logo) + Active App Title */}
      <div className="flex items-center gap-3">
        {/* Classroom Logo / System Menu trigger */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => {
              osAudio.playClick(600, 0.03);
              setIsSystemMenuOpen(!isSystemMenuOpen);
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            title="Inicio - Classroom"
          >
            <Image
              src="/classroom-logo.svg"
              alt="Classroom"
              width={16}
              height={16}
              className="drop-shadow-sm"
            />
            <span className="font-semibold text-white/95 text-[11px] tracking-wide">Inicio</span>
          </button>

          {/* System Dropdown Menu */}
          {isSystemMenuOpen && (
            <div className="absolute top-7 left-0 w-60 rounded-2xl liquid-glass-panel py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl liquid-glass flex items-center justify-center p-1.5">
                  <Image src="/classroom-logo.svg" alt="Classroom OS" width={20} height={20} />
                </div>
                <div>
                  <p className="font-semibold text-xs text-white">Classroom OS</p>
                  <p className="text-[10px] text-white/50">Versión 14.5 Liquid Glass</p>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsSystemMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-white/90 hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ajustes del Sistema...</span>
                  </span>
                  <span className="text-[10px] text-white/40">⌘,</span>
                </button>

                <button
                  onClick={() => {
                    setIsSystemMenuOpen(false);
                    handleToggleFullscreen();
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-white/90 hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {isFullscreen ? (
                      <Minimize2 className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                    )}
                    <span>{isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}</span>
                  </span>
                  <span className="text-[10px] text-white/40">F11</span>
                </button>
              </div>

              <div className="border-t border-white/10 py-1">
                <button
                  onClick={() => {
                    setIsSystemMenuOpen(false);
                    onLockScreen();
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-amber-300 hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Bloquear Pantalla</span>
                  </span>
                  <span className="text-[10px] text-white/40">⌘L</span>
                </button>

                <button
                  onClick={() => {
                    setIsSystemMenuOpen(false);
                    logout();
                    onLockScreen();
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/15 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Application Identifier */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-2.5">
          <span className="font-semibold text-white text-[11px] tracking-wide">
            {activeAppName}
          </span>
        </div>

        {/* Menubar simulated items */}
        <div className="hidden md:flex items-center gap-3 text-white/60 text-[11px] ml-1">
          <span className="hover:text-white transition-colors cursor-default">Archivo</span>
          <span className="hover:text-white transition-colors cursor-default">Edición</span>
          <span className="hover:text-white transition-colors cursor-default">Ver</span>
          <span className="hover:text-white transition-colors cursor-default">Ventana</span>
          <span className="hover:text-white transition-colors cursor-default">Ayuda</span>
        </div>
      </div>

      {/* Right: Controls & Clock */}
      <div className="flex items-center gap-3 text-white/80">
        <button
          onClick={handleToggleMute}
          className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          title={isMuted ? 'Activar Sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onToggleControlCenter}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
            isControlCenterOpen
              ? 'bg-sky-500 text-white shadow-sm'
              : 'hover:bg-white/10 text-white/80'
          }`}
          title="Centro de Control"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Control</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/70">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/70">
          <Battery className="w-3.5 h-3.5 text-white/80" />
          <span className="hidden sm:inline">100%</span>
        </div>

        {/* Clock & Date */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/90 font-inter pl-1 border-l border-white/10">
          <span className="hidden sm:inline text-white/60">{dateStr}</span>
          <span>{timeStr || '12:00'}</span>
        </div>

        {/* User avatar badge */}
        {user && (
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-1 pl-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            title={`Usuario: ${user.username}`}
          >
            <div className="w-5 h-5 rounded-full liquid-glass flex items-center justify-center text-[10px] border border-white/20">
              {user.avatar || '⚡'}
            </div>
            <span className="hidden md:inline text-[11px] font-medium text-white/90">
              {user.username}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
