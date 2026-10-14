'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Volume2, VolumeX, Sliders, LogOut, Plus, User, Shield } from 'lucide-react';
import { cyberAudio } from '@/lib/audio';
import { useAuth } from '@/context/AuthContext';

interface CyberHeaderProps {
  onReplayIntro: () => void;
  onOpenCustomizer: () => void;
  onOpenAddLink: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function CyberHeader({
  onReplayIntro,
  onOpenCustomizer,
  onOpenAddLink,
  isMuted,
  onToggleMute,
}: CyberHeaderProps) {
  const { user, logout } = useAuth();

  const handleNavClick = (sectionId: string) => {
    cyberAudio.playBeep(720, 0.05, 'sine');
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#030704]/90 border-b border-[#00ff66]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark with Classroom Stealth Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 relative rounded-lg overflow-hidden border border-[#00ff66]/30 shadow-[0_0_10px_rgba(0,255,102,0.25)] group-hover:scale-105 transition-transform bg-[#051108] p-0.5">
              <Image
                src="/classroom-logo.svg"
                alt="Classroom"
                width={32}
                height={32}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-cyber font-black text-xl tracking-wider text-[#00ff66] group-hover:text-[#39ff14] transition-colors whitespace-nowrap text-neon">
              Alpha-Things
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-mono text-[#a5f3cf]">
          <button
            onClick={() => handleNavClick('gta-v')}
            className="text-[#39ff14] font-semibold hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#39ff14]/70 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
            GTA V
          </button>
          <button
            onClick={() => handleNavClick('cine-os')}
            className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#00ff66]/50"
          >
            Cine-OS
          </button>
          <button
            onClick={() => handleNavClick('seccion-ia')}
            className="text-[#00f0ff] font-semibold hover:text-[#38bdf8] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#00f0ff]/70 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            Hub IAs
          </button>
          <button
            onClick={() => handleNavClick('alpha-links')}
            className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#00ff66]/50"
          >
            Alpha Links
          </button>
          <button
            onClick={() => handleNavClick('terminal')}
            className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#00ff66]/50"
          >
            Terminal
          </button>
        </nav>

        {/* Zone 3: User Profile & Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Customizer Button */}
          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              onOpenCustomizer();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#00ff66] bg-[#051408] border border-[#00ff66]/35 rounded hover:border-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
            title="Abrir Menú de Personalización"
          >
            <Sliders className="w-3.5 h-3.5 text-[#39ff14]" />
            <span className="hidden sm:inline">Personalizar</span>
          </button>

          {/* Add Link Button */}
          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              onOpenAddLink();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#a5f3cf] bg-[#051108] border border-[#00ff66]/20 rounded hover:border-[#00ff66] transition-colors"
            title="Añadir Enlace a mi Portal"
          >
            <Plus className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="hidden md:inline">+ Enlace</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
            className="p-1.5 text-[#00ff66]/80 hover:text-[#00ff66] bg-[#051108] border border-[#00ff66]/30 rounded hover:border-[#00ff66] transition-colors"
            title={isMuted ? 'Sonido desactivado' : 'Sonido activado'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#39ff14]" />
            )}
          </button>

          {/* User Profile Capsule */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-[#00ff66]/20">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#051408] border border-[#00ff66]/30 rounded text-xs font-mono"
                title={`Operador: ${user.username} (${user.email})`}
              >
                <span className="text-sm select-none">{user.avatar}</span>
                <span className="hidden sm:inline font-bold text-[#00ff66] max-w-[90px] truncate">
                  {user.username}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={() => {
                  cyberAudio.playLaserBlip();
                  logout();
                }}
                className="p-1.5 text-[#00ff66]/60 hover:text-red-400 bg-[#051108] border border-[#00ff66]/20 hover:border-red-400/50 rounded transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Replay Intro */}
          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              onReplayIntro();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-cyber font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] rounded transition-all shadow-[0_0_10px_rgba(0,255,102,0.5)] whitespace-nowrap shrink-0"
            title="Volver a reproducir la animación de inicio"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Intro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
