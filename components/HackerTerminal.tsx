'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, CornerDownLeft, Sparkles, ExternalLink } from 'lucide-react';
import { cyberAudio } from '@/lib/audio';

interface HackerTerminalProps {
  onReplayIntro: () => void;
  onPreview: (url: string, title: string) => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export function HackerTerminal({ onReplayIntro, onPreview }: HackerTerminalProps) {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys.init --portal=ALPHA_THINGS',
      output: (
        <span className="text-[#a5f3cf]">
          Alpha-Things Hacker Console v3.8. Escribe <strong className="text-[#39ff14]">&quot;help&quot;</strong> para listar comandos de acceso directo.
        </span>
      ),
      timestamp: '10:40:00',
    },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    cyberAudio.playLaserBlip();
    const normalized = cmd.toLowerCase();
    const timeStr = new Date().toLocaleTimeString();

    let outputNode: React.ReactNode = null;

    if (normalized === 'help') {
      outputNode = (
        <div className="space-y-1 text-xs text-[#a5f3cf]">
          <p className="text-[#39ff14] font-bold">Comandos disponibles en la consola:</p>
          <p><span className="text-[#00ff66] font-bold">cineos</span> : Abre Cine-OS (https://cineosweb.github.io/)</p>
          <p><span className="text-[#00ff66] font-bold">alpha5</span> : Abre Classroom Alpha Five (https://classroom-alpha-five.vercel.app/)</p>
          <p><span className="text-[#00ff66] font-bold">hack</span> : Abre Alpha Hack (https://alpha-hack.vercel.app/)</p>
          <p><span className="text-[#00ff66] font-bold">bio</span> : Abre Classroom Biología (https://classroom-biologia.vercel.app/)</p>
          <p><span className="text-[#00ff66] font-bold">links</span> : Muestra la lista completa de enlaces</p>
          <p><span className="text-[#00ff66] font-bold">intro</span> : Vuelve a reproducir el video cinemático de Alpha-Things</p>
          <p><span className="text-[#00ff66] font-bold">scan</span> : Ejecuta un escaneo de puertos y latencia del sistema</p>
          <p><span className="text-[#00ff66] font-bold">clear</span> : Limpia el historial de la consola</p>
        </div>
      );
    } else if (normalized === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else if (normalized === 'cineos') {
      outputNode = (
        <div className="text-xs text-[#39ff14]">
          Abriendo Cine-OS... Redirigiendo a https://cineosweb.github.io/
        </div>
      );
      window.open('https://cineosweb.github.io/', '_blank');
    } else if (normalized === 'alpha5' || normalized === 'alpha-five') {
      outputNode = (
        <div className="text-xs text-[#39ff14]">
          Abriendo Classroom Alpha Five... Redirigiendo a https://classroom-alpha-five.vercel.app/
        </div>
      );
      window.open('https://classroom-alpha-five.vercel.app/', '_blank');
    } else if (normalized === 'hack' || normalized === 'alpha-hack') {
      outputNode = (
        <div className="text-xs text-[#39ff14]">
          Abriendo Alpha Hack... Redirigiendo a https://alpha-hack.vercel.app/
        </div>
      );
      window.open('https://alpha-hack.vercel.app/', '_blank');
    } else if (normalized === 'bio' || normalized === 'biologia') {
      outputNode = (
        <div className="text-xs text-[#39ff14]">
          Abriendo Classroom Biología... Redirigiendo a https://classroom-biologia.vercel.app/
        </div>
      );
      window.open('https://classroom-biologia.vercel.app/', '_blank');
    } else if (normalized === 'links') {
      outputNode = (
        <div className="space-y-1.5 text-xs text-[#a5f3cf]">
          <p className="text-[#00ff66] font-bold">ENLACES DEL SISTEMA ALPHA:</p>
          <p>1. Cine-OS: https://cineosweb.github.io/</p>
          <p>2. Classroom Alpha 5: https://classroom-alpha-five.vercel.app/</p>
          <p>3. Alpha Hack: https://alpha-hack.vercel.app/</p>
          <p>4. Classroom Biología: https://classroom-biologia.vercel.app/</p>
        </div>
      );
    } else if (normalized === 'intro') {
      outputNode = <span className="text-[#39ff14]">Iniciando secuencia de video cinemático...</span>;
      setTimeout(onReplayIntro, 600);
    } else if (normalized === 'scan') {
      outputNode = (
        <div className="text-xs font-mono space-y-1 text-[#a5f3cf]">
          <p>&gt; Escaneando nodos remotos...</p>
          <p>&gt; [OK] cineosweb.github.io · HTTP 200 · 18ms</p>
          <p>&gt; [OK] classroom-alpha-five.vercel.app · HTTP 200 · 24ms</p>
          <p>&gt; [OK] alpha-hack.vercel.app · HTTP 200 · 15ms</p>
          <p>&gt; [OK] classroom-biologia.vercel.app · HTTP 200 · 21ms</p>
          <p className="text-[#39ff14] font-bold">&gt; Todos los sistemas operativos al 100%</p>
        </div>
      );
    } else {
      outputNode = (
        <span className="text-red-400 text-xs">
          Comando desconocido: &quot;{cmd}&quot;. Escribe <strong className="text-[#00ff66]">&quot;help&quot;</strong> para consultar la lista.
        </span>
      );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: cmd,
        output: outputNode,
        timestamp: timeStr,
      },
    ]);
    setInputVal('');
  };

  return (
    <section id="terminal" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#030905]/95 border border-[#00ff66]/35 rounded-lg overflow-hidden box-neon">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#051408] border-b border-[#00ff66]/25">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#39ff14]" />
            <span className="font-cyber text-xs tracking-wider text-[#00ff66] font-bold">
              TERMINAL DE ACCESO DIRECTO // ALPHA_BASH
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#00ff66]/60">
            TTY: /dev/pts/0 · ENCRIPTACIÓN AES-256
          </div>
        </div>

        {/* Terminal Log Area */}
        <div className="p-4 sm:p-6 font-mono text-xs space-y-3 max-h-72 overflow-y-auto bg-[#020603]/80">
          {logs.map((log) => (
            <div key={log.id} className="space-y-1">
              <div className="flex items-center gap-2 text-[#00ff66]/60">
                <span className="text-[10px] text-[#00ff66]/40">[{log.timestamp}]</span>
                <span className="text-[#39ff14] font-bold">alpha@user:~$</span>
                <span className="text-white font-semibold">{log.command}</span>
              </div>
              <div className="pl-6 border-l border-[#00ff66]/20 py-0.5">{log.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Form */}
        <form
          onSubmit={handleCommand}
          className="flex items-center gap-2 p-3 bg-[#051108] border-t border-[#00ff66]/25"
        >
          <span className="text-xs font-mono text-[#39ff14] font-bold pl-2 select-none">
            alpha@user:~$
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Escribe 'help', 'cineos', 'alpha5', 'hack', 'bio'..."
            className="flex-1 bg-transparent border-0 text-xs font-mono text-[#00ff66] placeholder-[#00ff66]/40 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] font-bold rounded transition-colors"
          >
            <span>Ejecutar</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
