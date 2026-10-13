'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Tv, Monitor, Play, Sparkles, Terminal } from 'lucide-react';
import { cyberAudio } from '@/lib/audio';

interface FeaturedCineOSProps {
  onPreview: (url: string, title: string) => void;
}

export function FeaturedCineOS({ onPreview }: FeaturedCineOSProps) {
  const [copied, setCopied] = useState(false);
  const url = 'https://cineosweb.github.io/';

  const handleCopy = () => {
    cyberAudio.playBeep(900, 0.05, 'sine');
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="cine-os" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-[#00ff66]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66]/70 uppercase tracking-widest mb-1">
            <Monitor className="w-4 h-4 text-[#39ff14]" />
            <span>Sistema Operativo Web Destacado</span>
          </div>
          <h2 className="font-cyber text-2xl sm:text-3xl lg:text-4xl font-black text-[#00ff66] tracking-wide text-neon">
            Cine-OS
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#a5f3cf]/70">
          <span>HOST: GitHub Pages</span>
          <span>·</span>
          <span>PROTOCOLO: HTTPS</span>
          <span>·</span>
          <span className="text-[#39ff14] font-semibold">ESTADO: ONLINE</span>
        </div>
      </div>

      {/* Main Feature Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Information & Action Launchpad */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-[#040e07]/80 border border-[#00ff66]/30 rounded-lg box-neon relative overflow-hidden">
          {/* Subtle Corner Markers */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00ff66]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00ff66]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00ff66]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00ff66]" />

          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/30 rounded mb-4">
              <Tv className="w-3.5 h-3.5 text-[#39ff14]" />
              <span>Plataforma Multimedia & OS</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-cyber font-bold text-white mb-3">
              Sistema Operativo Cinematográfico en la Web
            </h3>

            <p className="text-sm font-mono text-[#b3eccd] leading-relaxed mb-6">
              Cine-OS es un entorno de escritorio virtual interactivo con interfaz multimedia, diseñado para reproducción de contenidos audiovisuales, navegación web, utilidades y aplicaciones integradas en navegador sin instalaciones.
            </p>

            {/* URL Display Box */}
            <div className="p-3 bg-[#020603] border border-[#00ff66]/25 rounded font-mono text-xs text-[#00ff66] flex items-center justify-between gap-2 mb-6">
              <span className="truncate select-all">{url}</span>
              <button
                onClick={handleCopy}
                className="p-1 text-[#00ff66]/70 hover:text-[#39ff14] transition-colors shrink-0"
                title="Copiar enlace"
              >
                {copied ? <Check className="w-4 h-4 text-[#39ff14]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#00ff66]/15">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cyberAudio.playLaserBlip()}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 text-xs font-cyber font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] rounded transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.7)]"
            >
              <span>INICIAR CINE-OS</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                cyberAudio.playBeep(650, 0.05, 'sine');
                onPreview(url, 'Cine-OS Web Platform');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 text-xs font-mono text-[#00ff66] bg-[#051408] border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/10 rounded transition-colors"
            >
              <Monitor className="w-4 h-4" />
              <span>Previsualizar</span>
            </button>
          </div>
        </div>

        {/* Right Side: High-Tech Cyber Terminal Window Mockup */}
        <div className="lg:col-span-7 flex flex-col bg-[#030905]/90 border border-[#00ff66]/30 rounded-lg overflow-hidden box-neon">
          {/* Mock Window Titlebar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#06150a] border-b border-[#00ff66]/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
              <span className="text-xs font-mono text-[#00ff66]/80 ml-2">
                cine-os@github: ~ /sys/boot
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#00ff66]/50">
              PORT: 443 · ENCRYPTED
            </div>
          </div>

          {/* Mock Interface Graphic */}
          <div className="p-6 flex-1 flex flex-col justify-between font-mono text-xs text-[#a3f7c4]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#39ff14]">
                <Terminal className="w-4 h-4" />
                <span>$ load_module --target=&quot;https://cineosweb.github.io/&quot;</span>
              </div>
              <div className="text-[#00ff66]/80 text-[11px] space-y-1 pl-4 border-l-2 border-[#00ff66]/30">
                <p>&gt; [OK] Resolviendo DNS para cineosweb.github.io</p>
                <p>&gt; [OK] Handshake TLS v1.3 completado</p>
                <p>&gt; [OK] Interfaz gráfica de ventanas Cine-OS lista</p>
                <p>&gt; [OK] Reproductores de video y catálogos vinculados</p>
              </div>

              {/* Visual Mini Desktop OS Preview Layout */}
              <div className="mt-4 p-4 bg-[#020603] border border-[#00ff66]/20 rounded-md">
                <div className="flex items-center justify-between text-[11px] text-[#00ff66] mb-3 pb-2 border-b border-[#00ff66]/20">
                  <span className="font-bold flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-[#39ff14]" /> Cine-OS Desktop Environment
                  </span>
                  <span className="text-[#00ff66]/60">v3.2</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-3 bg-[#051408] border border-[#00ff66]/20 rounded hover:border-[#00ff66] transition-colors cursor-pointer"
                       onClick={() => window.open(url, '_blank')}>
                    <Play className="w-5 h-5 mx-auto text-[#39ff14] mb-1" />
                    <span>Cine Player</span>
                  </div>
                  <div className="p-3 bg-[#051408] border border-[#00ff66]/20 rounded hover:border-[#00ff66] transition-colors cursor-pointer"
                       onClick={() => window.open(url, '_blank')}>
                    <Monitor className="w-5 h-5 mx-auto text-[#00ff66] mb-1" />
                    <span>Apps & Tools</span>
                  </div>
                  <div className="p-3 bg-[#051408] border border-[#00ff66]/20 rounded hover:border-[#00ff66] transition-colors cursor-pointer"
                       onClick={() => window.open(url, '_blank')}>
                    <Sparkles className="w-5 h-5 mx-auto text-[#00f0ff] mb-1" />
                    <span>Multimedia OS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick status bottom bar */}
            <div className="mt-6 pt-3 border-t border-[#00ff66]/15 flex items-center justify-between text-[10px] text-[#00ff66]/60">
              <span>ALPHA-SECURITY PROTOCOL · SHA-256 VERIFIED</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#39ff14] hover:underline flex items-center gap-1"
              >
                <span>Acceso directo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
