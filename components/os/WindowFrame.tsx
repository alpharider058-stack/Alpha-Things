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
  Info,
  Sparkles,
  ArrowRight,
  AppWindow,
  Lock,
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
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    osAudio.playClick(950, 0.05);
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Launch a standalone frameless pop-up desktop window
  const handleOpenStandalonePopup = () => {
    osAudio.playClick(850, 0.04);
    if (currentUrl) {
      const width = Math.min(1200, window.innerWidth - 60);
      const height = Math.min(820, window.innerHeight - 80);
      const left = Math.max(30, (window.innerWidth - width) / 2);
      const top = Math.max(40, (window.innerHeight - height) / 2);

      window.open(
        currentUrl,
        `popup_${app.id}`,
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,status=no,resizable=yes`
      );
    }
  };

  // Window drag handlers on header
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      win.isMaximized
    ) {
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
      const newX = Math.max(
        10,
        Math.min(window.innerWidth - 120, dragStartRef.current.startX + dx)
      );
      const newY = Math.max(
        32,
        Math.min(window.innerHeight - 80, dragStartRef.current.startY + dy)
      );
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

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  // Window container styles
  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: 32,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 32px - 80px)',
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
      };

  const domainDisplay = currentUrl ? currentUrl.replace(/^https?:\/\//, '').split('/')[0] : '';

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={windowStyle}
      onClick={onFocus}
      className={`flex flex-col rounded-2xl overflow-hidden select-none transition-shadow duration-200 border ${
        isActive
          ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_var(--accent-glow)] border-white/25 ring-1 ring-white/10'
          : 'shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] border-white/10 opacity-95'
      } bg-[#080a12]/95 backdrop-blur-2xl`}
    >
      {/* Window Header / Titlebar */}
      <div
        onMouseDown={handleMouseDownHeader}
        className={`h-11 px-3.5 flex items-center justify-between border-b transition-colors ${
          isActive
            ? 'bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-white/[0.08] border-white/20'
            : 'bg-white/[0.04] border-white/10'
        } cursor-grab active:cursor-grabbing`}
      >
        {/* Left: Window Controls (macOS style liquid glass dots) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 group/controls pr-2">
            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-rose-500/90 hover:bg-rose-500 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_8px_rgba(244,63,94,0.4)]"
              title="Cerrar ventana"
            >
              <X className="w-2 h-2 text-rose-950 opacity-0 group-hover/controls:opacity-100 transition-opacity" />
            </button>

            {/* Minimize */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-3 h-3 rounded-full bg-amber-500/90 hover:bg-amber-500 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              title="Minimizar al dock"
            >
              <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover/controls:opacity-100 transition-opacity" />
            </button>

            {/* Maximize */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMaximize();
              }}
              className="w-3 h-3 rounded-full bg-emerald-500/90 hover:bg-emerald-500 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              title={win.isMaximized ? 'Restaurar ventana' : 'Maximizar'}
            >
              {win.isMaximized ? (
                <Minimize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover/controls:opacity-100 transition-opacity" />
              ) : (
                <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover/controls:opacity-100 transition-opacity" />
              )}
            </button>
          </div>

          {/* App Icon & Name */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-5 h-5 rounded-lg liquid-glass p-0.5 flex items-center justify-center border border-white/20 shadow-sm flex-shrink-0">
              {app.icon && app.icon.startsWith('/') ? (
                <Image
                  src={app.icon}
                  alt={app.name}
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs">{app.icon || '🌐'}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-white/90 drop-shadow-sm truncate max-w-[140px] sm:max-w-[200px]">
              {app.name}
            </span>
            {app.badge && (
              <span className="hidden md:inline text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-white/10 text-sky-300 font-semibold border border-white/10">
                {app.badge}
              </span>
            )}
          </div>
        </div>

        {/* Center: URL Address Bar or Mantle Modes */}
        <div className="flex items-center justify-center flex-1 mx-2 max-w-xl">
          {app.id === 'mantle' && app.mantleModes ? (
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/60 border border-white/10 text-xs shadow-inner overflow-x-auto max-w-full scrollbar-none">
              {app.mantleModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMantleTab(mode.id);
                    setIsLoading(true);
                    osAudio.playClick(650, 0.03);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                    activeMantleTab === mode.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  title={mode.description}
                >
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          ) : currentUrl ? (
            <div className="flex items-center gap-2 w-full max-w-md justify-center">
              {/* Clean modern address bar with SSL lock */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-xs text-white/80 shadow-inner w-full justify-between">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="font-mono text-[11px] text-white/90 font-medium truncate">
                    {domainDisplay}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 text-white/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReload();
                    }}
                    className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    title="Recargar"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl();
                    }}
                    className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    title="Copiar URL"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right: Window Utilities */}
        <div className="flex items-center gap-1.5 text-white/70">
          {/* Guide toggle button (if app has guide info, e.g. Manus) */}
          {app.aiDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGuide((prev) => !prev);
                osAudio.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                showGuide
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'hover:bg-white/10 text-white/70 hover:text-white'
              }`}
              title={showGuide ? 'Volver a la App' : 'Ver Guía y Especificaciones'}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showGuide ? 'App' : 'Guía'}</span>
            </button>
          )}

          {currentUrl && (
            <>
              {/* Standalone Desktop Popup */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenStandalonePopup();
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                title="Abrir como ventana flotante dedicada en tu pantalla"
              >
                <AppWindow className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Flotante</span>
              </button>

              {/* External Tab */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenExternal();
                }}
                className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-sky-500/30 hover:border-sky-400"
                title="Abrir en pestaña externa completa"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pestaña</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className="relative flex-1 w-full bg-[#080a12]/95 overflow-hidden flex flex-col">
        {/* Custom child components (e.g. Settings App) */}
        {children ? (
          <div className="flex-1 w-full h-full overflow-hidden flex flex-col">{children}</div>
        ) : showGuide && app.aiDetails ? (
          /* Rich Specifications & Guide (Displayed only when user explicitly toggles 'Guía') */
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

              {/* When to use */}
              <div className="liquid-glass rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
                  <ArrowRight className="w-4 h-4" />
                  <span>¿Cuándo conviene usarla?</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-inter">
                  {app.aiDetails.whenToUse}
                </p>
              </div>
            </div>

            {/* Strengths */}
            <div className="liquid-glass rounded-2xl p-5 border border-white/10 mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
                Puntos Fuertes y Ventajas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {app.aiDetails.strengths.map((strength, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white/90"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended For & Launch buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/60">
                <strong className="text-white">Ideal para:</strong> {app.aiDetails.recommendedFor}
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowGuide(false)}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-lg transition-all cursor-pointer"
                >
                  Volver a la App
                </button>
                <button
                  onClick={handleOpenStandalonePopup}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <AppWindow className="w-3.5 h-3.5 text-sky-400" />
                  <span>Flotante</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Live Viewport */
          <div className="relative flex-1 w-full h-full bg-[#07090e] flex flex-col">
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#080a12]/95 backdrop-blur-md transition-opacity">
                <div
                  className="w-14 h-14 rounded-2xl liquid-glass p-2 border border-white/20 shadow-2xl flex items-center justify-center mb-4 animate-pulse"
                  style={{ boxShadow: `0 0 35px ${app.accentColor || '#38bdf8'}44` }}
                >
                  {app.icon && app.icon.startsWith('/') ? (
                    <Image src={app.icon} alt={app.name} width={36} height={36} />
                  ) : (
                    <span className="text-2xl">{app.icon || '🌐'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-white/90 font-semibold tracking-wide">
                    Iniciando {app.name}...
                  </p>
                </div>
              </div>
            )}

            {/* Active Live Iframe */}
            <div className="relative flex-1 w-full h-full">
              <iframe
                key={`${app.id}-${currentUrl}-${iframeKey}`}
                src={currentUrl}
                title={app.name}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals allow-pointer-lock allow-presentation"
                allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; microphone; camera; display-capture; geolocation; pointer-lock; gamepad; keyboard-map"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
