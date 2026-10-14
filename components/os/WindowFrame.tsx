'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Info,
  Shield,
  Sparkles,
  ArrowRight,
  Monitor,
  AlertCircle,
} from 'lucide-react';
import { OSApp, OSWindow } from '@/types/os';
import { osAudio } from '@/lib/audio';

interface WindowFrameProps {
  window: OSWindow;
  app: OSApp;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  children?: React.ReactNode;
}

export function WindowFrame({
  window: win,
  app,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  children,
}: WindowFrameProps) {
  const [activeMantleTab, setActiveMantleTab] = useState<string>('alpha-five');
  const [activeAiTab, setActiveAiTab] = useState<'info' | 'web'>(() =>
    app.aiDetails ? 'info' : 'web'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [showEmbedNotice, setShowEmbedNotice] = useState<boolean>(false);

  // Dragging state
  const [pos, setPos] = useState({ x: win.position.x, y: win.position.y });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  // Update position if window prop changes and not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setPos({ x: win.position.x, y: win.position.y });
    }
  }, [win.position.x, win.position.y]);

  // Determine current active URL
  let currentUrl = win.url || app.defaultUrl || '';
  if (app.id === 'mantle' && app.mantleModes) {
    const activeMode = app.mantleModes.find((m) => m.id === activeMantleTab);
    if (activeMode) {
      currentUrl = activeMode.url;
    }
  }

  const handleCopyUrl = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl).catch(() => {});
      setCopied(true);
      osAudio.playClick(900, 0.03);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReload = () => {
    osAudio.playClick(600, 0.04);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    osAudio.playClick();
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Window drag handlers on header
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    // Don't drag if clicking buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || win.isMaximized) {
      return;
    }

    onFocus();
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = moveEvent.clientY - dragStartRef.current.mouseY;
      const newX = Math.max(10, Math.min(window.innerWidth - 120, dragStartRef.current.startX + dx));
      const newY = Math.max(32, Math.min(window.innerHeight - 80, dragStartRef.current.startY + dy));
      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!win.isOpen || win.isMinimized) return null;

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 15 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        width: win.isMaximized ? '100vw' : win.size.width,
        height: win.isMaximized ? 'calc(100vh - 32px)' : win.size.height,
        left: win.isMaximized ? 0 : pos.x,
        top: win.isMaximized ? 32 : pos.y,
      }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onClick={onFocus}
      style={{ zIndex: win.zIndex }}
      className={`fixed flex flex-col rounded-2xl liquid-glass-panel overflow-hidden select-none transition-shadow ${
        win.isMaximized ? 'rounded-none border-x-0' : 'border border-white/20'
      } ${
        isActive
          ? 'shadow-[0_30px_90px_rgba(0,0,0,0.9)] ring-1 ring-white/30'
          : 'shadow-[0_15px_45px_rgba(0,0,0,0.55)] opacity-95'
      }`}
    >
      {/* Liquid Glass Window Header Bar */}
      <div
        onMouseDown={handleMouseDownHeader}
        onDoubleClick={onToggleMaximize}
        className="w-full h-11 px-3.5 liquid-glass flex items-center justify-between border-b border-white/10 cursor-move select-none"
      >
        {/* Left: Traffic Light Controls */}
        <div className="flex items-center gap-2">
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-3.5 h-3.5 rounded-full bg-red-500/85 hover:bg-red-500 flex items-center justify-center text-black/90 transition-all cursor-pointer group shadow-sm hover:scale-110"
            title="Cerrar ventana"
          >
            <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-3.5 h-3.5 rounded-full bg-amber-500/85 hover:bg-amber-500 flex items-center justify-center text-black/90 transition-all cursor-pointer group shadow-sm hover:scale-110"
            title="Minimizar al Dock"
          >
            <Minus className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Maximize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
            className="w-3.5 h-3.5 rounded-full bg-emerald-500/85 hover:bg-emerald-500 flex items-center justify-center text-black/90 transition-all cursor-pointer group shadow-sm hover:scale-110"
            title={win.isMaximized ? 'Restaurar tamaño' : 'Maximizar'}
          >
            {win.isMaximized ? (
              <Minimize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Maximize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>

          {/* App title and icon */}
          <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/15">
            {app.icon && app.icon.startsWith('/') ? (
              <Image
                src={app.icon}
                alt={app.name}
                width={18}
                height={18}
                className="drop-shadow-sm object-contain"
              />
            ) : (
              <span className="text-sm">{app.icon || '🌐'}</span>
            )}
            <span className="text-xs font-semibold text-white tracking-wide">{app.name}</span>
          </div>
        </div>

        {/* Center: Tabs Switcher (Mantle & AI Apps) */}
        <div className="flex items-center gap-1">
          {app.id === 'mantle' && app.mantleModes && (
            <div className="flex items-center p-0.5 rounded-xl bg-black/50 border border-white/10 text-xs">
              {app.mantleModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMantleTab(mode.id);
                    osAudio.playClick(750, 0.03);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeMantleTab === mode.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          )}

          {app.aiDetails && (
            <div className="flex items-center p-0.5 rounded-xl bg-black/50 border border-white/10 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveAiTab('info');
                  osAudio.playClick();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeAiTab === 'info'
                    ? 'bg-purple-600 text-white shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Guía & Cuándo Usar</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveAiTab('web');
                  osAudio.playClick();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeAiTab === 'web'
                    ? 'bg-sky-500 text-white shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Navegador Web</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Window Utilities */}
        <div className="flex items-center gap-1 text-white/70">
          {currentUrl && app.id !== 'browser' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReload();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Recargar vista"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyUrl();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Copiar URL"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenExternal();
                }}
                className="ml-1 px-2.5 py-1 rounded-lg liquid-glass text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-sky-400/30 hover:border-sky-400/60"
                title="Abrir en pestaña externa completa"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] font-semibold">Abrir Oficial</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className="relative flex-1 w-full bg-[#080a12]/95 overflow-hidden flex flex-col">
        {/* Custom children (e.g. Browser or Settings app) */}
        {children ? (
          <div className="flex-1 w-full h-full overflow-hidden flex flex-col">{children}</div>
        ) : app.aiDetails && activeAiTab === 'info' ? (
          /* Rich AI Specifications & Guide */
          <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto w-full">
            <div className="flex items-start gap-5 mb-6 pb-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center p-2.5 border border-white/20 shadow-lg flex-shrink-0">
                {app.icon && app.icon.startsWith('/') ? (
                  <Image src={app.icon} alt={app.name} width={48} height={48} />
                ) : (
                  <span className="text-3xl">{app.icon}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-white">{app.name}</h2>
                  {app.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono font-medium">
                      {app.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-sky-300 font-medium mb-2">{app.aiDetails.tagline}</p>
                <p className="text-xs text-white/70 leading-relaxed">{app.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {/* What it does */}
              <div className="liquid-glass rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-4 h-4" />
                  <span>¿Qué hace exactamente?</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-inter">
                  {app.aiDetails.whatItDoes}
                </p>
              </div>

              {/* When to use it */}
              <div className="liquid-glass rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
                  <ArrowRight className="w-4 h-4" />
                  <span>¿Cuándo deberías usarla?</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-inter">
                  {app.aiDetails.whenToUse}
                </p>
              </div>
            </div>

            {/* Strengths & Highlights */}
            <div className="liquid-glass rounded-2xl p-5 border border-white/10 mb-6">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                Puntos Fuertes & Ventajas Clave
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {app.aiDetails.strengths.map((str, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/85">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/70">
                <span className="font-semibold text-white">Recomendado para: </span>
                {app.aiDetails.recommendedFor}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setActiveAiTab('web')}
                  className="px-3 py-2 rounded-xl liquid-glass text-white text-xs font-medium flex items-center gap-1.5 hover:bg-white/15 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Embeber</span>
                </button>
                <button
                  onClick={handleOpenExternal}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <span>Abrir {app.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Live Web Application Viewport */
          <div className="relative flex-1 w-full h-full bg-[#0a0d14] flex flex-col">
            {/* Top Minimal Security & Bridge Bar */}
            <div className="w-full px-3 py-1.5 bg-black/50 border-b border-white/10 flex items-center justify-between text-[11px] text-white/60">
              <div className="flex items-center gap-2 overflow-hidden">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-400 font-mono text-[10px]">Conexión Segura</span>
                <span className="text-white/20">|</span>
                <span className="truncate text-white/80 font-mono max-w-xs md:max-w-md">{currentUrl}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleOpenExternal}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Abrir en Nueva Pestaña</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Smart Embedding Bridge Banner */}
            <div className="px-3 py-1 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-[11px] text-amber-200">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>
                  ¿La página no carga o bloquea el visor? Ábrela directamente en pestaña completa con el botón azul.
                </span>
              </div>
              <button
                onClick={handleOpenExternal}
                className="underline hover:text-white font-medium ml-2 cursor-pointer whitespace-nowrap"
              >
                Abrir ahora
              </button>
            </div>

            {/* Iframe Viewport */}
            <div className="relative flex-1 w-full h-full bg-[#07090e]">
              <iframe
                key={iframeKey}
                src={currentUrl}
                title={app.name}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
