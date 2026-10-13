'use client';

import React from 'react';
import { Play, Volume2, VolumeX, Terminal, ExternalLink } from 'lucide-react';
import { cyberAudio } from '@/lib/audio';

interface CyberHeaderProps {
  onReplayIntro: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeSection: string;
}

export function CyberHeader({
  onReplayIntro,
  isMuted,
  onToggleMute,
  activeSection,
}: CyberHeaderProps) {
  const handleNavClick = (sectionId: string) => {
    cyberAudio.playBeep(720, 0.05, 'sine');
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#030704]/90 border-b border-[#00ff66]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-cyber font-black text-xl tracking-wider text-[#00ff66] hover:text-[#39ff14] transition-colors whitespace-nowrap text-neon"
          >
            Alpha-Things
          </a>
        </div>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-mono text-[#a5f3cf]">
          <button
            onClick={() => handleNavClick('cine-os')}
            className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#00ff66]/50"
          >
            Cine-OS
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
          <button
            onClick={() => handleNavClick('telemetria')}
            className="hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#00ff66]/50"
          >
            Diagnóstico
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Audio toggle button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
            className="p-2 text-[#00ff66]/80 hover:text-[#00ff66] bg-[#051108] border border-[#00ff66]/30 rounded hover:border-[#00ff66] transition-colors"
            title={isMuted ? 'Sonido desactivado' : 'Sonido activado'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#39ff14]" />
            )}
          </button>

          {/* Primary Action Button: Replay Intro */}
          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              onReplayIntro();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-cyber font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] rounded transition-all shadow-[0_0_12px_rgba(0,255,102,0.6)] hover:shadow-[0_0_20px_rgba(57,255,20,0.8)] whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Repetir Intro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
