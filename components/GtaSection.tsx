'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Gamepad2, Play, Sparkles, Monitor, ShieldCheck, Flame } from 'lucide-react';
import { cyberAudio } from '@/lib/audio';

interface GtaSectionProps {
  onPreview: (url: string, title: string) => void;
}

export function GtaSection({ onPreview }: GtaSectionProps) {
  const [copied, setCopied] = useState(false);
  const url = 'https://gta.deloskiyt.pl/';

  const handleCopy = () => {
    cyberAudio.playBeep(920, 0.05, 'sine');
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="gta-v" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-[#00ff66]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#39ff14] uppercase tracking-widest mb-1">
            <Gamepad2 className="w-4 h-4 text-[#39ff14]" />
            <span>Zona Gaming & Emulación Web</span>
          </div>
          <h2 className="font-cyber text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wide flex items-center gap-3">
            <span className="text-[#39ff14] text-neon-intense">GTA V</span>
            <span className="text-sm sm:text-base font-mono text-[#00ff66]/80 font-normal px-2.5 py-0.5 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded">
              Web Edition
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#a5f3cf]/70">
          <span>SERVIDOR: deloskiyt.pl</span>
          <span>·</span>
          <span>CONTROL: TECLADO / RATÓN</span>
          <span>·</span>
          <span className="text-[#39ff14] font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
            SERVIDOR ONLINE
          </span>
        </div>
      </div>

      {/* Main Feature Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Game Launcher Card */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-[#040e07]/90 border border-[#39ff14]/40 rounded-lg box-neon relative overflow-hidden">
          {/* Subtle Corner Sci-Fi Markers */}
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#39ff14]" />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#39ff14]" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#39ff14]" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#39ff14]" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 text-xs font-mono text-[#030704] bg-[#39ff14] font-black rounded flex items-center gap-1.5 shadow-[0_0_10px_#39ff14]">
                <Flame className="w-3.5 h-3.5" />
                <span>NUEVO ENLACE</span>
              </span>
              <span className="text-xs font-mono text-[#00ff66]/80">
                Grand Theft Auto V en el Navegador
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-cyber font-bold text-white mb-3">
              Jugar a GTA V Online en la Web
            </h3>

            <p className="text-sm font-mono text-[#b3eccd] leading-relaxed mb-6">
              Servidor web optimizado para jugar a Grand Theft Auto V directamente desde tu navegador sin descargas pesadas. Compatible con pantalla completa, renderizado acelerado por hardware y sesiones multijugador.
            </p>

            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6 text-xs font-mono">
              <div className="p-2.5 bg-[#020603] border border-[#00ff66]/20 rounded">
                <span className="text-[#00ff66]/60 text-[10px] block">RESOLUCIÓN</span>
                <span className="text-white font-bold">1080p WebGL</span>
              </div>
              <div className="p-2.5 bg-[#020603] border border-[#00ff66]/20 rounded">
                <span className="text-[#00ff66]/60 text-[10px] block">CONTROLES</span>
                <span className="text-white font-bold">WASD + Ratón</span>
              </div>
              <div className="p-2.5 bg-[#020603] border border-[#00ff66]/20 rounded col-span-2 sm:col-span-1">
                <span className="text-[#00ff66]/60 text-[10px] block">LATENCIA ESTIMADA</span>
                <span className="text-[#39ff14] font-bold">~15-30 ms</span>
              </div>
            </div>

            {/* URL Display Box */}
            <div className="p-3 bg-[#020603] border border-[#00ff66]/25 rounded font-mono text-xs text-[#00ff66] flex items-center justify-between gap-2 mb-6">
              <span className="truncate select-all">{url}</span>
              <button
                onClick={handleCopy}
                className="p-1 text-[#00ff66]/70 hover:text-[#39ff14] transition-colors shrink-0"
                title="Copiar enlace directo"
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
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-cyber font-bold tracking-wider text-[#030704] bg-[#39ff14] hover:bg-[#00ff66] rounded transition-all shadow-[0_0_15px_rgba(57,255,20,0.6)] hover:shadow-[0_0_25px_rgba(57,255,20,0.9)] hover:scale-105 active:scale-95"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>JUGAR A GTA V AHORA</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                cyberAudio.playBeep(700, 0.05, 'sine');
                onPreview(url, 'GTA V Web Edition');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-mono text-[#00ff66] bg-[#051408] border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/10 rounded transition-colors"
            >
              <Monitor className="w-4 h-4" />
              <span>Abrir en Ventana</span>
            </button>
          </div>
        </div>

        {/* Right Side: Cyber Terminal & Game Quick View */}
        <div className="lg:col-span-5 flex flex-col bg-[#030905]/90 border border-[#00ff66]/30 rounded-lg overflow-hidden box-neon">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#06150a] border-b border-[#00ff66]/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
              <span className="text-xs font-mono text-[#00ff66]/80 ml-2">
                game_node@gta-v: ~ /online
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#39ff14] font-bold">LIVE STREAM</span>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between font-mono text-xs text-[#a3f7c4]">
            <div className="space-y-3">
              <div className="p-4 bg-[#020603] border border-[#00ff66]/20 rounded-md text-center">
                <div className="w-12 h-12 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] mx-auto mb-3">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h4 className="font-cyber font-bold text-base text-white mb-1">
                  Los Santos · Servidor Activo
                </h4>
                <p className="text-[11px] text-[#00ff66]/70 mb-3">
                  Instancia web de GTA V lista para conexión directa
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#051408] border border-[#00ff66]/30 rounded text-[10px] text-[#39ff14]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-ping" />
                  <span>Conexión P2P / WebSocket lista</span>
                </div>
              </div>

              <div className="text-[11px] text-[#00ff66]/80 space-y-1.5 pl-3 border-l-2 border-[#00ff66]/30">
                <p>&gt; Servidor: https://gta.deloskiyt.pl/</p>
                <p>&gt; Audio: 3D Posicional habilitado</p>
                <p>&gt; Teclas: [W, A, S, D] Moverse | [F] Vehículo</p>
                <p>&gt; Disparo: [Click Izq] | [Espacio] Saltar</p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#00ff66]/15 flex items-center justify-between text-[11px] text-[#00ff66]/60">
              <span>ACCESO WEB SIN INSTALACIÓN</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#39ff14] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Entrar al juego</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
