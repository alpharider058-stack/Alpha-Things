'use client';

import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { cyberAudio } from '@/lib/audio';

interface IframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function IframeModal({ isOpen, onClose, url, title }: IframeModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#030a05] border border-[#00ff66]/50 rounded-lg shadow-[0_0_35px_rgba(0,255,102,0.3)] flex flex-col overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#051408] border-b border-[#00ff66]/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-[#00ff66]" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66]">
              <Shield className="w-3.5 h-3.5 text-[#39ff14]" />
              <span className="font-bold tracking-wide">{title}</span>
              <span className="text-[#00ff66]/50 hidden sm:inline">[{url}]</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cyberAudio.playLaserBlip()}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] font-bold rounded transition-colors"
            >
              <span>Abrir Fuera</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => {
                cyberAudio.playBeep(400, 0.05, 'sawtooth');
                onClose();
              }}
              className="p-1.5 text-[#00ff66]/70 hover:text-[#00ff66] hover:bg-[#00ff66]/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Bar */}
        <div className="px-4 py-1.5 bg-[#071c0b] text-[11px] font-mono text-[#a3f7c4] flex items-center justify-between border-b border-[#00ff66]/15">
          <span className="flex items-center gap-1">
            <span className="text-[#39ff14]">●</span> Modo Sandbox Seguro
          </span>
          <span className="text-[#00ff66]/60 hidden sm:inline">
            Si la web bloquea iframes (X-Frame-Options), usa el botón &quot;Abrir Fuera&quot;.
          </span>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 bg-black">
          {!iframeLoaded && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#030a05] text-[#00ff66] font-mono text-sm z-10">
              <RefreshCw className="w-6 h-6 animate-spin text-[#39ff14]" />
              <p>Conectando con nodo remoto...</p>
              <p className="text-xs text-[#00ff66]/50">{url}</p>
            </div>
          )}

          <iframe
            src={url}
            title={title}
            className="w-full h-full border-0 bg-white/95"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setIframeLoaded(true)}
            onError={() => setHasError(true)}
          />
        </div>
      </div>
    </div>
  );
}
