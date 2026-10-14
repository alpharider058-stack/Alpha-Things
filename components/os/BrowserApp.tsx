'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Search,
  Lock,
  Globe,
  Settings,
  ExternalLink,
  Shield,
  Zap,
  Layers,
  Sparkles,
  Server,
  Key,
  Check,
  AlertTriangle,
  X,
  Play,
  Square,
  Bookmark,
  Share2,
} from 'lucide-react';
import { osAudio } from '@/lib/audio';

type BrowserMode = 'cloud' | 'proxy' | 'iframe';

interface SpeedDialItem {
  name: string;
  url: string;
  icon: string;
  category: string;
  badge?: string;
  description: string;
}

const SPEED_DIAL: SpeedDialItem[] = [
  {
    name: 'Bing Buscador',
    url: 'https://www.bing.com',
    icon: '🔍',
    category: 'Buscador',
    badge: '100% Compatible',
    description: 'Búsqueda web completa con resultados actualizados y libre de bloqueos.',
  },
  {
    name: 'Wikipedia en Español',
    url: 'https://es.m.wikipedia.org',
    icon: '📚',
    category: 'Enciclopedia',
    badge: 'Iframe OK',
    description: 'La mayor enciclopedia libre mundial navegable directamente aquí.',
  },
  {
    name: 'Internet Archive',
    url: 'https://archive.org/web/',
    icon: '🏛️',
    category: 'Archivo',
    badge: 'Wayback',
    description: 'Biblioteca digital universal de páginas web, libros y software histórico.',
  },
  {
    name: 'DuckDuckGo',
    url: 'https://html.duckduckgo.com/html/',
    icon: '🦆',
    category: 'Privacidad',
    badge: 'Lightweight',
    description: 'Motor de búsqueda sin rastreo ni publicidad dirigida.',
  },
  {
    name: 'OpenStreetMap',
    url: 'https://www.openstreetmap.org/export/embed.html',
    icon: '🗺️',
    category: 'Mapas',
    badge: 'Interactivo',
    description: 'Cartografía colaborativa mundial con visualización fluida de mapas.',
  },
  {
    name: 'Ecosia Web',
    url: 'https://www.ecosia.org',
    icon: '🌿',
    category: 'Ecológico',
    badge: 'Sostenible',
    description: 'Buscador alternativo que financia la plantación de árboles en el mundo.',
  },
  {
    name: 'Retro Web Arcade',
    url: 'https://emulatorjs.org',
    icon: '🕹️',
    category: 'Juegos',
    badge: 'WebGL',
    description: 'Emuladores clásicos en WebAssembly jugables directo en navegador.',
  },
  {
    name: 'W3Schools Code',
    url: 'https://www.w3schools.com',
    icon: '💻',
    category: 'Programación',
    badge: 'Docs',
    description: 'Documentación interactiva de desarrollo web, JavaScript, Python y CSS.',
  },
];

interface BrowserAppProps {
  onClose?: () => void;
}

export function BrowserApp({ onClose }: BrowserAppProps) {
  // Settings & Configuration initialized lazily from localStorage
  const [mode, setMode] = useState<BrowserMode>(() => {
    if (typeof window === 'undefined') return 'cloud';
    try {
      return (localStorage.getItem('browser_default_mode') as BrowserMode) || 'cloud';
    } catch {
      return 'cloud';
    }
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('hyperbeam_api_key') || '';
    } catch {
      return '';
    }
  });

  const [embedUrl, setEmbedUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('hyperbeam_embed_url') || '';
    } catch {
      return '';
    }
  });

  const [proxyServer, setProxyServer] = useState<string>(() => {
    if (typeof window === 'undefined') return 'https://uv.example.com';
    try {
      return localStorage.getItem('browser_proxy_server') || 'https://uv.example.com';
    } catch {
      return 'https://uv.example.com';
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Navigation State
  const [urlInput, setUrlInput] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('home');
  const [history, setHistory] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [iframeKey, setIframeKey] = useState<number>(0);

  // Cloud VM State
  const [vmStatus, setVmStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle');
  const [vmError, setVmError] = useState<string | null>(null);
  const [activeSessionUrl, setActiveSessionUrl] = useState<string | null>(null);

  const hyperbeamContainerRef = useRef<HTMLDivElement | null>(null);
  const hbInstanceRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Cleanup Hyperbeam VM instance when window closes or unmounts
  const cleanupHyperbeamInstance = useCallback(() => {
    if (hbInstanceRef.current) {
      try {
        if (typeof hbInstanceRef.current.destroy === 'function') {
          hbInstanceRef.current.destroy();
        }
      } catch (err) {
        console.warn('Error destroying Hyperbeam instance:', err);
      }
      hbInstanceRef.current = null;
    }
    setVmStatus('idle');
    setActiveSessionUrl(null);
  }, []);

  useEffect(() => {
    return () => {
      cleanupHyperbeamInstance();
    };
  }, [cleanupHyperbeamInstance]);

  // Load Hyperbeam SDK dynamically
  const loadHyperbeamSDK = async (): Promise<any> => {
    if (typeof window === 'undefined') return null;
    if ((window as any).Hyperbeam) {
      return (window as any).Hyperbeam.default || (window as any).Hyperbeam;
    }

    try {
      // Dynamic import
      const mod = await import(
        /* webpackIgnore: true */ 'https://unpkg.com/@hyperbeam/web@latest/dist/index.js' as any
      );
      if (mod && (mod.default || mod.Hyperbeam)) {
        (window as any).Hyperbeam = mod.default || mod.Hyperbeam;
        return mod.default || mod.Hyperbeam;
      }
    } catch {
      // Fallback through script injection
    }

    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-hyperbeam-sdk="true"]');
      if (existing) {
        if ((window as any).Hyperbeam) {
          return resolve((window as any).Hyperbeam.default || (window as any).Hyperbeam);
        }
        existing.addEventListener('load', () => {
          resolve((window as any).Hyperbeam.default || (window as any).Hyperbeam);
        });
        existing.addEventListener('error', () => reject(new Error('Error al cargar Hyperbeam SDK')));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@hyperbeam/web@latest/dist/index.js';
      script.async = true;
      script.setAttribute('data-hyperbeam-sdk', 'true');
      script.onload = () => {
        const hb = (window as any).Hyperbeam?.default || (window as any).Hyperbeam;
        if (hb) resolve(hb);
        else reject(new Error('El SDK de Hyperbeam no expuso la función constructora'));
      };
      script.onerror = () => reject(new Error('No se pudo conectar a unpkg para cargar Hyperbeam'));
      document.head.appendChild(script);
    });
  };

  // Launch Cloud VM
  const handleStartCloudVM = async (overrideEmbedUrl?: string) => {
    osAudio.playClick(880, 0.05);
    setVmError(null);
    cleanupHyperbeamInstance();

    const targetEmbed = (overrideEmbedUrl || embedUrl).trim();
    const effectiveKey = apiKey.trim();

    if (!targetEmbed && !effectiveKey) {
      setIsSettingsOpen(true);
      setVmError('Introduce tu HYPERBEAM_API_KEY o un Embed URL activo para iniciar la VM.');
      return;
    }

    setVmStatus('starting');

    try {
      let finalEmbedUrl = targetEmbed;

      if (!finalEmbedUrl && effectiveKey) {
        // Request VM creation via corsproxy.io as specified
        const proxyEndpoint = 'https://corsproxy.io/?https://engine.hyperbeam.com/v0/vm';
        const response = await fetch(proxyEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveKey}`,
          },
          body: JSON.stringify({
            timeout: { offline: 300 },
            ublock: true,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(
            `Error al crear Cloud VM en Hyperbeam (${response.status}): ${errText || 'Clave no válida o cuota excedida'}`
          );
        }

        const data = await response.json();
        if (!data.embed_url) {
          throw new Error('Hyperbeam no devolvió una embed_url válida en la respuesta');
        }
        finalEmbedUrl = data.embed_url;
      }

      setActiveSessionUrl(finalEmbedUrl);

      // Give React a tick to render the container if hidden
      await new Promise((r) => setTimeout(r, 60));

      if (!hyperbeamContainerRef.current) {
        throw new Error('Contenedor de video de Hyperbeam no disponible en el DOM');
      }

      const HyperbeamConstructor = await loadHyperbeamSDK();
      if (!HyperbeamConstructor) {
        throw new Error('No se pudo inicializar la librería Hyperbeam');
      }

      const hbInstance = await HyperbeamConstructor(hyperbeamContainerRef.current, finalEmbedUrl);
      hbInstanceRef.current = hbInstance;
      setVmStatus('running');
      osAudio.playWindowOpen();
    } catch (err: any) {
      console.error('Hyperbeam startup failure:', err);
      setVmStatus('error');
      setVmError(err.message || 'Error desconocido al arrancar la Cloud VM.');
    }
  };

  const handleStopCloudVM = () => {
    osAudio.playClick(600, 0.04);
    cleanupHyperbeamInstance();
  };

  // URL Navigation helper
  const navigateTo = (input: string) => {
    osAudio.playClick(750, 0.03);
    const trimmed = input.trim();
    if (!trimmed) return;

    let target = trimmed;

    // Check if input is a direct domain or search
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const looksLikeUrl = hasProtocol || (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed) && !trimmed.includes(' '));

    if (looksLikeUrl) {
      target = hasProtocol ? trimmed : `https://${trimmed}`;
    } else {
      // Search with Bing (compatible with iframe)
      target = `https://www.bing.com/search?q=${encodeURIComponent(trimmed)}`;
    }

    setCurrentUrl(target);
    setUrlInput(target);

    // Update history
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(target);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      osAudio.playClick(700, 0.03);
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prev);
      setUrlInput(prev === 'home' ? '' : prev);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      osAudio.playClick(720, 0.03);
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(next);
      setUrlInput(next === 'home' ? '' : next);
    }
  };

  const handleReload = () => {
    osAudio.playClick(850, 0.03);
    setIframeKey((prev) => prev + 1);
    if (mode === 'cloud' && vmStatus === 'running' && activeSessionUrl) {
      handleStartCloudVM(activeSessionUrl);
    }
  };

  const handleHome = () => {
    osAudio.playClick(800, 0.03);
    setCurrentUrl('home');
    setUrlInput('');
    const nextHistory = [...history, 'home'];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('hyperbeam_api_key', apiKey.trim());
      localStorage.setItem('hyperbeam_embed_url', embedUrl.trim());
      localStorage.setItem('browser_proxy_server', proxyServer.trim());
      localStorage.setItem('browser_default_mode', mode);

      setSavedSuccess(true);
      osAudio.playNotification();
      setTimeout(() => {
        setSavedSuccess(false);
        setIsSettingsOpen(false);
      }, 900);
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  };

  const handleOpenExternal = () => {
    osAudio.playClick();
    if (currentUrl && currentUrl !== 'home') {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://www.bing.com', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#070b14] text-white select-none relative overflow-hidden font-sans">
      {/* ======================================================== */}
      {/* 1. TOP MODERN BROWSER TOOLBAR                            */}
      {/* ======================================================== */}
      <div className="w-full bg-[#0c1324]/90 backdrop-blur-xl border-b border-white/15 px-3 py-2 flex flex-wrap items-center gap-2 z-20 shadow-md">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              historyIndex > 0 ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'
            }`}
            title="Atrás"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              historyIndex < history.length - 1
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-white/20 cursor-not-allowed'
            }`}
            title="Adelante"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Recargar"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleHome}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Página de Inicio"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Address & Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(urlInput);
          }}
          className="flex-1 min-w-[220px] max-w-2xl flex items-center bg-[#050811]/90 rounded-xl border border-white/15 hover:border-sky-500/40 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 px-2.5 py-1 transition-all shadow-inner"
        >
          <div className="flex items-center gap-1.5 mr-2 text-white/50 flex-shrink-0">
            {currentUrl !== 'home' ? (
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Search className="w-3.5 h-3.5 text-sky-400" />
            )}
          </div>

          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={
              mode === 'cloud'
                ? 'Introduce URL o busca (Cloud VM 100% Sin Bloqueos)...'
                : 'Introduce URL o busca en Bing (ej: wikipedia.org)...'
            }
            className="w-full bg-transparent border-0 text-xs sm:text-sm text-white placeholder-white/35 focus:outline-none font-mono selection:bg-sky-500/30"
          />

          {urlInput && (
            <button
              type="button"
              onClick={() => setUrlInput('')}
              className="text-white/40 hover:text-white/80 p-0.5 rounded cursor-pointer mr-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            type="submit"
            className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-semibold transition-colors cursor-pointer border border-sky-500/30 flex-shrink-0"
          >
            Ir
          </button>
        </form>

        {/* Mode Selector Segmented Control */}
        <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10 text-xs shadow-inner">
          <button
            onClick={() => {
              osAudio.playClick(780, 0.03);
              setMode('cloud');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'cloud'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
            title="Máquina virtual de Chromium dedicada. Cero bloqueos X-Frame-Options."
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span className="hidden md:inline">Cloud VM</span>
            <span className="md:hidden">VM</span>
          </button>

          <button
            onClick={() => {
              osAudio.playClick(750, 0.03);
              setMode('proxy');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'proxy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
            title="Servidor proxy o Neko WebRTC propio."
          >
            <Server className="w-3 h-3 text-indigo-300" />
            <span className="hidden md:inline">Modo Proxy</span>
            <span className="md:hidden">Proxy</span>
          </button>

          <button
            onClick={() => {
              osAudio.playClick(720, 0.03);
              setMode('iframe');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'iframe'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
            title="Iframe directo compatible con Bing, Wikipedia, Archive.org y más."
          >
            <Globe className="w-3 h-3 text-emerald-300" />
            <span className="hidden md:inline">Iframe Directo</span>
            <span className="md:hidden">Directo</span>
          </button>
        </div>

        {/* Right Action Tools: External Link & Settings */}
        <div className="flex items-center gap-1 ml-auto">
          {currentUrl && currentUrl !== 'home' && (
            <button
              onClick={handleOpenExternal}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Abrir en pestaña externa del navegador"
            >
              <ExternalLink className="w-4 h-4 text-sky-400" />
            </button>
          )}

          <button
            onClick={() => {
              osAudio.playClick();
              setIsSettingsOpen(!isSettingsOpen);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
              isSettingsOpen
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 ring-1 ring-sky-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent'
            }`}
            title="Ajustes de Navegador y Credenciales de Cloud VM"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SETTINGS DRAWER / MODAL (ENGRENAJE)                   */}
      {/* ======================================================== */}
      {isSettingsOpen && (
        <div className="absolute top-13 right-3 z-40 w-96 max-w-[calc(100vw-24px)] rounded-2xl liquid-glass-panel border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-4 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl bg-[#0b1021]/95">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Settings className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Ajustes del Navegador</h3>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* HYPERBEAM CLOUD VM SETTINGS */}
            <div className="p-3 rounded-xl bg-black/40 border border-sky-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-sky-300 font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo 1: Cloud VM (Hyperbeam)</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Permite cargar cualquier sitio web sin restricciones ejecutando una sesión de Chromium virtual en la nube.
              </p>

              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1">
                  HYPERBEAM_API_KEY (Guardada en localStorage):
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/40" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="hb_live_... o pega tu clave"
                    className="w-full bg-[#050811] rounded-lg border border-white/15 pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>
                <p className="text-[10px] text-sky-400/80 mt-1">
                  ¿No tienes clave? Consigue una gratis en{' '}
                  <a
                    href="https://hyperbeam.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-sky-300 hover:text-white"
                  >
                    hyperbeam.com
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1">
                  O pega directamente una Embed URL activa:
                </label>
                <input
                  type="text"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder="https://engine.hyperbeam.com/..."
                  className="w-full bg-[#050811] rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              {vmStatus === 'running' ? (
                <button
                  onClick={handleStopCloudVM}
                  className="w-full py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Detener Cloud VM Activa</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStartCloudVM()}
                  className="w-full py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Iniciar / Conectar Cloud VM</span>
                </button>
              )}
            </div>

            {/* PROXY SETTINGS */}
            <div className="p-3 rounded-xl bg-black/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <Server className="w-3.5 h-3.5" />
                <span>Modo 2: Servidor Ultraviolet / Neko</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                URL base de tu instancia de Ultraviolet, Wisp o servidor WebRTC Neko propio.
              </p>
              <input
                type="text"
                value={proxyServer}
                onChange={(e) => setProxyServer(e.target.value)}
                placeholder="https://tu-proxy-ultraviolet.com"
                className="w-full bg-[#050811] rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
              />
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-[11px] text-white/50">Cambios guardados localmente</span>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardado!</span>
                  </>
                ) : (
                  <span>Guardar Ajustes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN CONTENT AREA (BASED ON SELECTED MODE)            */}
      {/* ======================================================== */}
      <div className="flex-1 w-full relative overflow-hidden flex flex-col bg-[#050811]">
        {/* ======================================================== */}
        {/* MODO 1: CLOUD VM (HYPERBEAM)                             */}
        {/* ======================================================== */}
        {mode === 'cloud' && (
          <div className="w-full h-full relative flex flex-col">
            {/* Status Indicator Bar */}
            <div className="px-3 py-1 bg-black/50 border-b border-white/10 flex items-center justify-between text-[11px] text-white/70">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    vmStatus === 'running'
                      ? 'bg-emerald-400 animate-pulse'
                      : vmStatus === 'starting'
                      ? 'bg-amber-400 animate-spin'
                      : vmStatus === 'error'
                      ? 'bg-red-400'
                      : 'bg-white/30'
                  }`}
                />
                <span className="font-mono text-[10px] uppercase tracking-wider text-sky-300">
                  {vmStatus === 'running'
                    ? 'Cloud VM Activa (Sesión Chromium en Vivo)'
                    : vmStatus === 'starting'
                    ? 'Iniciando Cloud VM...'
                    : vmStatus === 'error'
                    ? 'Error en Cloud VM'
                    : 'Cloud VM en Espera'}
                </span>
              </div>

              {vmStatus === 'running' ? (
                <button
                  onClick={handleStopCloudVM}
                  className="text-red-400 hover:text-red-300 font-medium text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Detener VM</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStartCloudVM()}
                  className="text-sky-400 hover:text-sky-300 font-medium text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Iniciar VM</span>
                </button>
              )}
            </div>

            {/* Hyperbeam Container Element for WebRTC Stream */}
            <div
              ref={hyperbeamContainerRef}
              className={`w-full flex-1 bg-black relative ${
                vmStatus === 'running' ? 'block' : 'hidden'
              }`}
              style={{ width: '100%', height: 'calc(100% - 24px)' }}
            />

            {/* If VM is NOT running, show Onboarding / Launch Screen */}
            {vmStatus !== 'running' && (
              <div className="flex-1 w-full h-full overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center text-center">
                <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl liquid-glass-panel border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-[0_10px_30px_rgba(2,132,199,0.5)] border border-white/30">
                    <Zap className="w-8 h-8 text-amber-300" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Navegador Cloud VM (Hyperbeam)
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 mb-6 leading-relaxed">
                    Navega por cualquier sitio web (Google, YouTube, Discord, redes sociales, etc.) sin bloqueos de{' '}
                    <code className="text-sky-300 bg-sky-500/10 px-1 py-0.5 rounded">X-Frame-Options</code> gracias
                    a una máquina virtual de Chromium renderizada en la nube por WebRTC.
                  </p>

                  {vmError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 text-left">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{vmError}</span>
                    </div>
                  )}

                  {apiKey || embedUrl ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          {apiKey ? 'API Key Configurada' : 'Embed URL Listo'}
                        </span>
                        <button
                          onClick={() => setIsSettingsOpen(true)}
                          className="text-sky-400 hover:text-white underline text-[11px] cursor-pointer"
                        >
                          Cambiar
                        </button>
                      </div>

                      <button
                        onClick={() => handleStartCloudVM()}
                        disabled={vmStatus === 'starting'}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_10px_30px_rgba(2,132,199,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {vmStatus === 'starting' ? (
                          <>
                            <RotateCw className="w-4 h-4 animate-spin" />
                            <span>Conectando con Hyperbeam Cloud Engine...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Iniciar Cloud VM Ahora</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-3">
                        <label className="block text-xs font-semibold text-white/90">
                          Introduce tu HYPERBEAM_API_KEY para activar el motor:
                        </label>
                        <div className="relative">
                          <Key className="w-4 h-4 absolute left-3 top-3 text-white/40" />
                          <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Pega tu clave de Hyperbeam (hb_live_...)"
                            className="w-full bg-[#050811] rounded-xl border border-white/20 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <a
                            href="https://hyperbeam.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-400 hover:text-sky-300 underline font-medium flex items-center gap-1"
                          >
                            <span>Obtener clave gratis en Hyperbeam</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={handleSaveSettings}
                            className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold hover:bg-sky-500/30 cursor-pointer"
                          >
                            Guardar Clave
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            if (apiKey.trim()) {
                              handleSaveSettings();
                              handleStartCloudVM();
                            } else {
                              setIsSettingsOpen(true);
                            }
                          }}
                          className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-all cursor-pointer text-center"
                        >
                          Conectar con API Key
                        </button>
                        <button
                          onClick={() => setMode('iframe')}
                          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-medium text-xs transition-all cursor-pointer text-center border border-white/10"
                        >
                          O usar Modo Iframe Directo (Gratis)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODO 2: SERVIDOR EXTERNO / ULTRAVIOLET / NEKO           */}
        {/* ======================================================== */}
        {mode === 'proxy' && (
          <div className="w-full h-full relative flex flex-col">
            <div className="px-3 py-1 bg-black/60 border-b border-white/10 flex items-center justify-between text-[11px] text-white/70">
              <span className="font-mono text-[10px] text-indigo-300">
                Servidor Configurado: {proxyServer || 'No definido'}
              </span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-indigo-400 hover:text-white underline text-[10px] cursor-pointer"
              >
                Cambiar Servidor
              </button>
            </div>

            {proxyServer && proxyServer !== 'https://uv.example.com' ? (
              <iframe
                key={`proxy-${iframeKey}`}
                src={proxyServer}
                className="w-full flex-1 border-0 bg-black"
                allow="autoplay; fullscreen; clipboard-read; clipboard-write"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-downloads allow-modals"
              />
            ) : (
              <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full p-6 rounded-3xl liquid-glass-panel border border-white/20 shadow-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mx-auto mb-3 text-indigo-400">
                    <Server className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Configurar Servidor Proxy</h3>
                  <p className="text-xs text-white/70 mb-4 leading-relaxed">
                    Introduce la URL de tu instancia privada de Ultraviolet Proxy, Wisp o Neko WebRTC en el panel de
                    ajustes para navegar a través de tu propio servidor.
                  </p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Abrir Ajustes de Proxy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODO 3: IFRAME DIRECTO (SPEED DIAL & BUSCADOR COMPATIBLE) */}
        {/* ======================================================== */}
        {mode === 'iframe' && (
          <div className="w-full h-full relative flex flex-col">
            {/* If home is active: show Clean Speed-Dial / Start Page */}
            {currentUrl === 'home' ? (
              <div className="flex-1 w-full h-full overflow-y-auto p-6 md:p-8 flex flex-col items-center">
                <div className="max-w-4xl w-full mx-auto space-y-6">
                  {/* Hero Start Banner */}
                  <div className="text-center pt-2 pb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono mb-3">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Navegador Web OS • Modo Iframe Directo</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                      Explora la Web Sin Salir del Sistema
                    </h1>
                    <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto">
                      Accesos directos optimizados para ejecución en marcos y buscador Bing libre de restricciones de
                      cabeceras.
                    </p>
                  </div>

                  {/* Centered Large Search Bar */}
                  <div className="w-full max-w-xl mx-auto">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        navigateTo(urlInput || 'bing.com');
                      }}
                      className="flex items-center bg-[#0d1428] rounded-2xl border border-white/20 p-2 shadow-[0_10px_35px_rgba(0,0,0,0.6)] focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/30 transition-all"
                    >
                      <Search className="w-5 h-5 text-sky-400 ml-2 mr-3 flex-shrink-0" />
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Busca cualquier cosa en la web o introduce un dominio..."
                        className="w-full bg-transparent border-0 text-sm text-white placeholder-white/40 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex-shrink-0"
                      >
                        Buscar
                      </button>
                    </form>
                  </div>

                  {/* Speed Dial Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                        Accesos Rápidos Compatibles
                      </span>
                      <span className="text-[11px] text-sky-400 font-mono">8 Sitios Disponibles</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {SPEED_DIAL.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => navigateTo(item.url)}
                          className="p-3.5 rounded-2xl liquid-glass hover:bg-white/10 border border-white/15 hover:border-sky-400/50 transition-all text-left flex flex-col justify-between group cursor-pointer shadow-sm hover:scale-[1.02]"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-2xl p-1.5 rounded-xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                              {item.icon}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/25">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-white/60 line-clamp-2 mt-0.5">{item.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Anti-Blocking Tip Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-black border border-sky-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 flex-shrink-0">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white">¿Un sitio web se niega a conectar?</h5>
                        <p className="text-white/70 text-[11px]">
                          Muchos sitios (como Google o Twitter) bloquean iframes con <code>X-Frame-Options</code>. Cambia
                          al <strong>Modo Cloud VM</strong> en la barra superior para navegar sin límites.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMode('cloud');
                        osAudio.playClick();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs whitespace-nowrap cursor-pointer shadow-sm transition-all"
                    >
                      Probar Cloud VM
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Active Iframe Viewer */
              <div className="flex-1 w-full h-full relative flex flex-col">
                <iframe
                  key={`iframe-${iframeKey}-${currentUrl}`}
                  ref={iframeRef}
                  src={currentUrl}
                  title="Navegador Web OS"
                  className="w-full flex-1 border-0 bg-white"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-downloads allow-modals"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />

                {/* Sub-bar with anti-block quick switch */}
                <div className="px-3 py-1.5 bg-[#0a0f1d] border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                  <span className="truncate max-w-[60%] font-mono text-[10px] text-white/70">
                    Cargando: {currentUrl}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenExternal}
                      className="text-sky-400 hover:text-white underline text-[10px] cursor-pointer"
                    >
                      Abrir fuera si está bloqueado
                    </button>
                    <span className="text-white/20">|</span>
                    <button
                      onClick={() => setMode('cloud')}
                      className="text-amber-300 hover:text-amber-200 font-semibold text-[10px] cursor-pointer flex items-center gap-1"
                    >
                      <Zap className="w-2.5 h-2.5" />
                      <span>Pasar a Cloud VM</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
