'use client';

import React, { useState } from 'react';
import {
  Palette,
  Type,
  MousePointerClick,
  Volume2,
  VolumeX,
  User,
  ShieldCheck,
  Check,
  Sparkles,
  Layers,
  Sliders,
  RotateCcw,
  LayoutGrid,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Monitor,
  Flame,
} from 'lucide-react';
import { useAuth, AVATAR_OPTIONS } from '@/context/AuthContext';
import { WallpaperId, FontFamily } from '@/types/user';
import { osAudio } from '@/lib/audio';
import {
  useCustomization,
  ACCENT_COLORS,
  AccentColorId,
  DockSizeId,
} from '@/lib/customization';

const WALLPAPERS: { id: WallpaperId; name: string; gradient: string }[] = [
  {
    id: 'liquid-smoke',
    name: 'Liquid Smoke',
    gradient: 'from-slate-900 via-indigo-950 to-black',
  },
  {
    id: 'obsidian-glow',
    name: 'Obsidian Glow',
    gradient: 'from-emerald-950 via-zinc-950 to-black',
  },
  {
    id: 'aurora-glass',
    name: 'Aurora Glass',
    gradient: 'from-blue-950 via-slate-950 to-emerald-950',
  },
  {
    id: 'platinum-mesh',
    name: 'Platinum Titanium',
    gradient: 'from-zinc-800 via-neutral-900 to-black',
  },
  {
    id: 'cosmic-dark',
    name: 'Cosmic Violet',
    gradient: 'from-purple-950 via-slate-950 to-black',
  },
  {
    id: 'deep-abyss',
    name: 'Deep Abyss OLED',
    gradient: 'from-black via-zinc-950 to-black',
  },
];

const ANIMATED_WALLPAPERS = [
  {
    id: 'animated-aurora',
    name: 'Aurora Cósmica Animada',
    desc: 'Olas de color que fluyen dinámicamente con CSS',
    gradient: 'from-indigo-900 via-teal-900 to-slate-950',
  },
  {
    id: 'animated-cyber',
    name: 'Cyber Matrix Grid',
    desc: 'Malla holográfica con pulso de luz retro-futurista',
    gradient: 'from-sky-950 via-slate-900 to-black',
  },
  {
    id: 'animated-sunset',
    name: 'Sunset Velvet',
    desc: 'Gradiente suave y cálido con respiración lenta',
    gradient: 'from-purple-900 via-rose-950 to-black',
  },
];

const FONT_CATEGORIES: {
  category: string;
  desc: string;
  fonts: { id: FontFamily; name: string; sample: string }[];
}[] = [
  {
    category: '1. Moderna Sin-Serifa (Limpia y Elegante)',
    desc: 'Perfecta para lectura rápida, interfaces pulidas y claridad moderna.',
    fonts: [
      { id: 'inter', name: 'Inter (Predeterminada del Sistema)', sample: 'Classroom OS 14.5 · Inter Typography' },
      { id: 'sf-pro', name: 'SF Pro / Apple Style', sample: 'Classroom OS 14.5 · SF Pro Display' },
      { id: 'outfit', name: 'Outfit Contemporary', sample: 'Classroom OS 14.5 · Outfit Modern' },
    ],
  },
  {
    category: '2. Retro / Código Pixel (Terminal & Hack)',
    desc: 'Estilo clásico monospace para desarrolladores y estética cyberpunk.',
    fonts: [
      { id: 'jetbrains', name: 'JetBrains Mono', sample: 'const os = new ClassroomOS();' },
      { id: 'fira', name: 'Fira Code Ligatures', sample: 'fn main() -> Result<(), Error>' },
      { id: 'sharetech', name: 'Share Tech Monospace', sample: '01001100 01001001 01010001' },
    ],
  },
  {
    category: '3. Futurista / Sci-Fi (HUD & Videojuegos)',
    desc: 'Tipografía tecnológica con ángulos cortados e impacto visual.',
    fonts: [
      { id: 'orbitron', name: 'Orbitron Cyberpunk', sample: 'QUANTUM CORE · ONLINE' },
      { id: 'rajdhani', name: 'Rajdhani Tech HUD', sample: 'SYSTEM VELOCITY · 100%' },
    ],
  },
];

export function SettingsApp() {
  const { user, updateSettings } = useAuth();
  const { settings: customSettings, updateCustomization } = useCustomization();

  const [activeTab, setActiveTab] = useState<'appearance' | 'dock_desktop' | 'fonts' | 'audio' | 'account'>('appearance');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');

  const currentWallpaper = (user?.settings?.wallpaper || 'liquid-smoke') as WallpaperId;
  const currentFont = (user?.settings?.fontFamily || 'inter') as FontFamily;
  const clickChangesColor = Boolean(user?.settings?.clickChangesColor);
  const isAudioMuted = Boolean(user?.settings?.audioMuted);

  const handleSelectWallpaper = (id: WallpaperId) => {
    osAudio.playClick(750, 0.03);
    updateSettings({ wallpaper: id });
    updateCustomization({ wallpaperType: 'preset' });
  };

  const handleSelectAnimatedWallpaper = (animId: string) => {
    osAudio.playClick(850, 0.03);
    updateCustomization({
      wallpaperType: animId as any,
    });
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    osAudio.playClick(900, 0.04);
    updateCustomization({
      wallpaperType: 'custom',
      customWallpaperUrl: customUrlInput.trim(),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        osAudio.playClick(950, 0.04);
        updateCustomization({
          wallpaperType: 'custom',
          customWallpaperUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectFont = (id: FontFamily) => {
    osAudio.playClick(700, 0.03);
    updateSettings({ fontFamily: id });
  };

  const handleSelectAccent = (id: AccentColorId) => {
    osAudio.playClick(850, 0.03);
    updateCustomization({ accentColor: id });
  };

  const handleToggleClickColor = () => {
    osAudio.playClick(850, 0.04);
    updateSettings({ clickChangesColor: !clickChangesColor });
  };

  const handleToggleAudio = () => {
    const nextMute = !isAudioMuted;
    osAudio.toggleMute();
    updateSettings({ audioMuted: nextMute });
  };

  return (
    <div className="flex h-full text-white font-inter select-none">
      {/* Sidebar Navigation */}
      <aside className="w-60 liquid-glass border-r border-white/10 p-3 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-white/50 uppercase tracking-wider">
            Ajustes de Classroom OS
          </div>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-[var(--accent-color)]/20 text-white border border-[var(--accent-color)]/40 font-semibold shadow-sm'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 text-[var(--accent-color)]" />
            <span>Fondo & Acento</span>
          </button>

          <button
            onClick={() => setActiveTab('dock_desktop')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              activeTab === 'dock_desktop'
                ? 'bg-[var(--accent-color)]/20 text-white border border-[var(--accent-color)]/40 font-semibold shadow-sm'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-amber-400" />
            <span>Dock & Escritorio</span>
          </button>

          <button
            onClick={() => setActiveTab('fonts')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              activeTab === 'fonts'
                ? 'bg-[var(--accent-color)]/20 text-white border border-[var(--accent-color)]/40 font-semibold shadow-sm'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4 text-emerald-400" />
            <span>Tipografía del Sistema</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[var(--accent-color)]/20 text-white border border-[var(--accent-color)]/40 font-semibold shadow-sm'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span>Sonido & Efectos</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              activeTab === 'account'
                ? 'bg-[var(--accent-color)]/20 text-white border border-[var(--accent-color)]/40 font-semibold shadow-sm'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-sky-400" />
            <span>Cuenta de Usuario</span>
          </button>
        </div>

        <div className="p-3 rounded-2xl liquid-glass border border-white/10 text-[10px] text-white/50 space-y-1">
          <p className="font-semibold text-white/80">Classroom OS Pro</p>
          <p>Personalización Activa</p>
          <div className="flex items-center gap-1.5 pt-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Todo Guardado Localmente</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto bg-black/40">
        {/* TAB 1: APARIENCIA & FONDOS */}
        {activeTab === 'appearance' && (
          <div className="max-w-3xl space-y-7">
            {/* 1. Global Accent Color */}
            <section className="space-y-3">
              <div>
                <h3 className="text-base font-semibold text-white">Color de Acento Global</h3>
                <p className="text-xs text-white/60">
                  Afecta a botones destacados, selecciones, bordes de ventanas y elementos iluminados del sistema.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(Object.keys(ACCENT_COLORS) as AccentColorId[]).map((cId) => {
                  const cfg = ACCENT_COLORS[cId];
                  const isSelected = customSettings.accentColor === cId;

                  return (
                    <button
                      key={cId}
                      onClick={() => handleSelectAccent(cId)}
                      className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer flex flex-col items-center justify-center gap-2 group ${
                        isSelected
                          ? 'border-white bg-white/15 shadow-[0_0_20px_var(--accent-glow)] scale-102'
                          : 'border-white/10 hover:border-white/25 bg-white/5'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: cfg.color }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-slate-950 font-bold" />}
                      </div>
                      <span className="text-xs font-semibold text-white/90">{cfg.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. Static Preset Wallpapers */}
            <section className="space-y-3 pt-2">
              <div>
                <h3 className="text-base font-semibold text-white">Fondos de Pantalla Liquid Glass</h3>
                <p className="text-xs text-white/60">
                  Gradientes oscuros diseñados para resaltar los reflejos y el efecto de cristal líquido.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WALLPAPERS.map((wp) => {
                  const isSelected =
                    customSettings.wallpaperType === 'preset' && currentWallpaper === wp.id;

                  return (
                    <button
                      key={wp.id}
                      onClick={() => handleSelectWallpaper(wp.id)}
                      className={`relative p-3.5 rounded-2xl border transition-all text-left cursor-pointer overflow-hidden h-24 flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/60 shadow-lg'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${wp.gradient} -z-10`} />
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-white drop-shadow">
                          {wp.name}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[var(--accent-color)] text-slate-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 font-bold" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/50 font-mono">
                        {wp.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3. Animated CSS Wallpapers */}
            <section className="space-y-3 pt-2">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Fondos Dinámicos Animados (CSS Fluid)</span>
                </h3>
                <p className="text-xs text-white/60">
                  Animaciones ambientales continuas y ligeras sin consumo de GPU externa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ANIMATED_WALLPAPERS.map((anim) => {
                  const isSelected = customSettings.wallpaperType === anim.id;

                  return (
                    <button
                      key={anim.id}
                      onClick={() => handleSelectAnimatedWallpaper(anim.id)}
                      className={`relative p-3.5 rounded-2xl border transition-all text-left cursor-pointer overflow-hidden h-24 flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/60 shadow-lg'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${anim.gradient} -z-10`} />
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-white drop-shadow">
                          {anim.name}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[var(--accent-color)] text-slate-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 font-bold" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/70 line-clamp-1">
                        {anim.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 4. Custom Wallpaper Image / URL */}
            <section className="space-y-3 pt-2">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-400" />
                  <span>Fondo Personalizado (Subir Imagen o URL)</span>
                </h3>
                <p className="text-xs text-white/60">
                  Usa tu propia imagen o fotografía de internet como fondo de escritorio.
                </p>
              </div>

              <div className="liquid-glass p-4 rounded-2xl border border-white/10 space-y-3">
                {/* File upload input */}
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-2 border border-white/10">
                    <Upload className="w-4 h-4 text-[var(--accent-color)]" />
                    <span>Subir Imagen desde el PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-white/40">o pega una URL directa:</span>
                </div>

                {/* URL input */}
                <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://ejemplo.com/mi-wallpaper.jpg"
                    className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-color)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-sm"
                  >
                    Aplicar URL
                  </button>
                </form>

                {customSettings.wallpaperType === 'custom' && customSettings.customWallpaperUrl && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Fondo personalizado activo
                    </span>
                    <button
                      onClick={() => handleSelectWallpaper('liquid-smoke')}
                      className="text-white/50 hover:text-white underline cursor-pointer"
                    >
                      Quitar y volver a predeterminado
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: DOCK & ESCRITORIO */}
        {activeTab === 'dock_desktop' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">Opciones del Dock Inferior</h3>
              <p className="text-xs text-white/60">
                Ajusta el tamaño, la magnificación dinámica y el auto-ocultado del Dock.
              </p>
            </div>

            {/* Dock Size */}
            <div className="liquid-glass p-4 rounded-2xl border border-white/10 space-y-3">
              <label className="text-xs font-semibold text-white">Tamaño de Iconos del Dock</label>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'normal', 'large'] as DockSizeId[]).map((sz) => {
                  const isSel = customSettings.dockSize === sz;
                  const label = sz === 'small' ? 'Pequeño (40px)' : sz === 'large' ? 'Grande (56px)' : 'Normal (48px)';
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        osAudio.playClick(750, 0.03);
                        updateCustomization({ dockSize: sz });
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSel
                          ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/20 text-white font-bold'
                          : 'border-white/10 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <span className="text-xs">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dock Auto-Hide & Magnification Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Auto-ocultar Dock</p>
                  <p className="text-[11px] text-white/50">
                    Se oculta cuando el ratón no está cerca del borde
                  </p>
                </div>
                <button
                  onClick={() => {
                    osAudio.playClick(800, 0.03);
                    updateCustomization({ dockAutoHide: !customSettings.dockAutoHide });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                    customSettings.dockAutoHide ? 'bg-[var(--accent-color)]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      customSettings.dockAutoHide ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Efecto Magnificación</p>
                  <p className="text-[11px] text-white/50">
                    Engrandece iconos contiguos al pasar el cursor
                  </p>
                </div>
                <button
                  onClick={() => {
                    osAudio.playClick(800, 0.03);
                    updateCustomization({ dockMagnification: !customSettings.dockMagnification });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                    customSettings.dockMagnification ? 'bg-[var(--accent-color)]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      customSettings.dockMagnification ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Desktop Widgets Configuration */}
            <div className="liquid-glass p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Widgets de Escritorio Activos</h4>
                  <p className="text-[11px] text-white/50">
                    Puedes eliminar cualquier widget directamente pulsando la cruz (X) arriba de cada uno.
                  </p>
                </div>
                <button
                  onClick={() => {
                    osAudio.playClick(900, 0.03);
                    updateCustomization({
                      enabledWidgets: ['clock', 'pomodoro', 'tasks', 'performance'],
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
                >
                  Restaurar Todos
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { id: 'clock', label: 'Reloj & Clima' },
                  { id: 'pomodoro', label: 'Temporizador Focus' },
                  { id: 'tasks', label: 'Tareas del Día' },
                  { id: 'performance', label: 'Monitor de Sistema' },
                ].map((w) => {
                  const isEnabled = (customSettings.enabledWidgets || []).includes(w.id as any);
                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        osAudio.playClick(800, 0.03);
                        const cur = customSettings.enabledWidgets || ['clock', 'pomodoro', 'tasks', 'performance'];
                        const next = isEnabled ? cur.filter((x) => x !== w.id) : [...cur, w.id as any];
                        updateCustomization({ enabledWidgets: next });
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isEnabled
                          ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/15 text-white font-medium'
                          : 'border-white/10 hover:border-white/20 text-white/50 bg-white/5'
                      }`}
                    >
                      <span className="text-xs">{w.label}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          isEnabled
                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-slate-950 font-bold'
                            : 'border-white/30'
                        }`}
                      >
                        {isEnabled && <Check className="w-3 h-3 font-bold" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Widgets Area Toggle */}
            <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Widgets de Escritorio (Lado Derecho)</p>
                <p className="text-[11px] text-white/50">
                  Muestra el reloj elegante, temporizador Pomodoro, tareas y monitor de rendimiento.
                </p>
              </div>
              <button
                onClick={() => {
                  osAudio.playClick(800, 0.03);
                  updateCustomization({ showWidgets: !customSettings.showWidgets });
                }}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  customSettings.showWidgets ? 'bg-[var(--accent-color)]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    customSettings.showWidgets ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TIPOGRAFÍAS */}
        {activeTab === 'fonts' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">Tipografía Global de la Interfaz</h3>
              <p className="text-xs text-white/60">
                Selecciona la fuente del sistema entre los tres estilos clave requeridos.
              </p>
            </div>

            {FONT_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-white">{cat.category}</h4>
                  <p className="text-[11px] text-white/50">{cat.desc}</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {cat.fonts.map((f) => {
                    const isSelected = currentFont === f.id;

                    return (
                      <button
                        key={f.id}
                        onClick={() => handleSelectFont(f.id)}
                        className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/15 shadow-sm'
                            : 'border-white/10 hover:border-white/25 bg-white/5'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{f.name}</span>
                            {isSelected && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-[var(--accent-color)] text-slate-950 font-bold">
                                ACTIVA
                              </span>
                            )}
                          </div>
                          <p className={`text-xs text-white/70 font-${f.id}`}>
                            {f.sample}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-slate-950'
                              : 'border-white/30'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 font-bold" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AUDIO & EFECTOS */}
        {activeTab === 'audio' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">Sonido y Micro-Interacciones</h3>
              <p className="text-xs text-white/60">
                Ajusta la retroalimentación auditiva y visual de clics en el sistema operativo.
              </p>
            </div>

            <div className="space-y-3">
              {/* Mute toggle */}
              <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Audio Sintetizado del Sistema</p>
                  <p className="text-[11px] text-white/50">
                    Sonidos al abrir ventanas, cambiar pestañas y pasar sobre el Dock
                  </p>
                </div>
                <button
                  onClick={handleToggleAudio}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    !isAudioMuted
                      ? 'bg-[var(--accent-color)] text-slate-950'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{!isAudioMuted ? 'Activado' : 'Silenciado'}</span>
                </button>
              </div>

              {/* Click changes color toggle */}
              <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Rotación de Color al Clic</p>
                  <p className="text-[11px] text-white/50">
                    Cambia la tonalidad del fondo al hacer clic libre en el escritorio
                  </p>
                </div>
                <button
                  onClick={handleToggleClickColor}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                    clickChangesColor ? 'bg-[var(--accent-color)]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      clickChangesColor ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CUENTA */}
        {activeTab === 'account' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">Perfil de Usuario</h3>
              <p className="text-xs text-white/60">
                Información de la sesión actual en Classroom OS.
              </p>
            </div>

            <div className="liquid-glass p-5 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center text-3xl border border-white/20 shadow-lg">
                  {user?.avatar || '⚡'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{user?.username || 'Invitado'}</h4>
                  <p className="text-xs text-white/60">{user?.email || 'modo_demostracion@classroom.os'}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {user?.role || 'ESTUDIANTE PRO'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs font-semibold text-white mb-2">Seleccionar Avatar</p>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      onClick={() => {
                        osAudio.playClick(900, 0.03);
                        if (user) {
                          // Update avatar
                          updateSettings({});
                        }
                      }}
                      className="w-9 h-9 rounded-xl liquid-glass hover:bg-white/20 text-lg flex items-center justify-center border border-white/10 transition-all cursor-pointer"
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
