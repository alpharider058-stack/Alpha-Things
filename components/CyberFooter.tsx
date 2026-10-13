'use client';

import React from 'react';
import { ExternalLink, Terminal, Shield, ArrowUp } from 'lucide-react';
import { cyberAudio } from '@/lib/audio';

export function CyberFooter() {
  const scrollToTop = () => {
    cyberAudio.playBeep(800, 0.05, 'sine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20 border-t border-[#00ff66]/20 bg-[#020603]/95 text-xs font-mono text-[#a5f3cf]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Info */}
        <div className="text-center md:text-left">
          <div className="font-cyber font-bold text-sm text-[#00ff66] mb-1">
            Alpha-Things Portal
          </div>
          <p className="text-[11px] text-[#00ff66]/60">
            Entorno de acceso unificado a Cine-OS y herramientas del ecosistema Alpha.
          </p>
        </div>

        {/* Center: Direct Link Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <a
            href="https://cineosweb.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00ff66] transition-colors"
          >
            Cine-OS
          </a>
          <span>·</span>
          <a
            href="https://classroom-alpha-five.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00ff66] transition-colors"
          >
            Classroom Alpha 5
          </a>
          <span>·</span>
          <a
            href="https://alpha-hack.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00ff66] transition-colors"
          >
            Alpha Hack
          </a>
          <span>·</span>
          <a
            href="https://classroom-biologia.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00ff66] transition-colors"
          >
            Classroom Biología
          </a>
        </div>

        {/* Right: Scroll to top */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-[#00ff66] bg-[#051408] border border-[#00ff66]/30 hover:border-[#00ff66] rounded transition-colors"
          >
            <span>Volver Arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
