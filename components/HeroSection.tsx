'use client';

import React from 'react';
import { ExternalLink, Play, Terminal, ArrowDown, Cpu, ShieldCheck } from 'lucide-react';
import { cyberAudio } from '@/lib/audio';

interface HeroSectionProps {
  onReplayIntro: () => void;
}

export function HeroSection({ onReplayIntro }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    cyberAudio.playBeep(700, 0.05, 'sine');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Sci-Fi Status Kicker */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-mono text-[#00ff66] bg-[#051408]/90 border border-[#00ff66]/35 rounded-full mb-6 shadow-[0_0_12px_rgba(0,255,102,0.15)]">
        <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
        <span className="tracking-widest uppercase">SISTEMA ALPHA-THINGS EN LÍNEA</span>
      </div>

      {/* Main Hero Headline */}
      <h1 className="font-cyber text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#00ff66] tracking-tight leading-none mb-6 text-neon-intense">
        ALPHA-THINGS
      </h1>

      <p className="max-w-3xl mx-auto text-base sm:text-lg font-mono text-[#b3eccd] leading-relaxed mb-8">
        Portal centralizado cyberpunk con efectos de código binario en cascada, tipografía verde neón y lanzadera de aplicaciones hacia <strong className="text-[#39ff14]">Cine-OS</strong> y el ecosistema de herramientas <strong className="text-[#39ff14]">Alpha</strong>.
      </p>

      {/* Primary CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <button
          onClick={() => scrollTo('cine-os')}
          className="flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-cyber font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] rounded transition-all shadow-[0_0_20px_rgba(0,255,102,0.5)] hover:shadow-[0_0_30px_rgba(57,255,20,0.8)] hover:scale-105 active:scale-95"
        >
          <span>ACCEDER A CINE-OS</span>
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          onClick={() => scrollTo('alpha-links')}
          className="flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#00ff66] bg-[#040e07]/90 border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/10 rounded transition-all shadow-[0_0_12px_rgba(0,255,102,0.15)]"
        >
          <span>VER ALPHA LINKS</span>
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            cyberAudio.playLaserBlip();
            onReplayIntro();
          }}
          className="flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-mono text-[#a5f3cf] bg-[#051108]/80 border border-[#00ff66]/20 hover:border-[#00ff66] rounded transition-colors"
        >
          <Play className="w-4 h-4 text-[#39ff14] fill-current" />
          <span>Reproducir Intro</span>
        </button>
      </div>

      {/* Cyber System Diagnostic Strip */}
      <div id="telemetria" className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto p-4 bg-[#030a05]/80 border border-[#00ff66]/25 rounded-lg box-neon text-left font-mono">
        <div className="p-2 border-r border-[#00ff66]/15">
          <div className="text-[10px] text-[#00ff66]/60">NODOS CONECTADOS</div>
          <div className="text-sm font-bold text-[#39ff14] tabular-nums">4 / 4 ONLINE</div>
        </div>
        <div className="p-2 md:border-r border-[#00ff66]/15">
          <div className="text-[10px] text-[#00ff66]/60">ENCRIPTACIÓN</div>
          <div className="text-sm font-bold text-white">TLS 1.3 / AES</div>
        </div>
        <div className="p-2 border-r border-[#00ff66]/15">
          <div className="text-[10px] text-[#00ff66]/60">DISPONIBILIDAD</div>
          <div className="text-sm font-bold text-[#39ff14] tabular-nums">99.99%</div>
        </div>
        <div className="p-2">
          <div className="text-[10px] text-[#00ff66]/60">PROTOCOLO</div>
          <div className="text-sm font-bold text-[#00f0ff]">ALPHA_CORE</div>
        </div>
      </div>
    </section>
  );
}
