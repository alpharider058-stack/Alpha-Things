'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cyberAudio } from '@/lib/audio';
import {
  X,
  Palette,
  Type,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  Monitor,
  Activity,
  Layers,
  Zap,
} from 'lucide-react';
import {
  ColorTheme,
  FontFamily,
  FontSize,
  BackgroundEffect,
  ScanlineIntensity,
  GlowIntensity,
  InteractionMode,
} from '@/types/user';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_OPTIONS: Array<{ id: ColorTheme; name: string; hex: string; desc: string }> = [
  { id: 'matrix', name: 'Verde Matrix', hex: '#00ff66', desc: 'Verde neón clásico del ciberespacio' },
  { id: 'cyan', name: 'Cian Cibernético', hex: '#00f0ff', desc: 'Azul eléctrico de alta tecnología' },
  { id: 'purple', name: 'Synthwave Violeta', hex: '#d946ef', desc: 'Neón púrpura retro-futurista' },
  { id: 'amber', name: 'Ámbar Hacker', hex: '#ffb703', desc: 'Fósforo ámbar de terminales mainframe' },
  { id: 'crimson', name: 'Carmesí Alerta', hex: '#ff0055', desc: 'Rojo de penetración y alerta crítica' },
  { id: 'lime', name: 'Lima Tóxico', hex: '#39ff14', desc: 'Verde lima radioactivo ultra-brillante' },
];

const FONT_OPTIONS: Array<{ id: FontFamily; name: string; sample: string }> = [
  { id: 'jetbrains', name: 'JetBrains Mono', sample: 'console.log("Alpha System")' },
  { id: 'orbitron', name: 'Orbitron Cyber', sample: 'TACTICAL CYBER HUD 2026' },
  { id: 'sharetech', name: 'Share Tech Mono', sample: '0x887F_A01: OK STREAM' },
  { id: 'rajdhani', name: 'Rajdhani Sci-Fi', sample: 'OPERADOR ALPHA // CONECTADO' },
  { id: 'fira', name: 'Fira Code', sample: 'const auth = () => true;' },
  { id: 'inter', name: 'Inter Tech', sample: 'Interfaz moderna y limpia' },
];

const BG_EFFECTS: Array<{ id: BackgroundEffect; name: string; desc: string }> = [
  { id: 'matrix', name: 'Lluvia Matrix Glifos', desc: 'Caracteres alfanuméricos, hex y símbolos griegos' },
  { id: 'binary', name: 'Binario Puro (0 y 1)', desc: 'Flujo continuo de ceros y unos en cascada' },
  { id: 'grid', name: 'Red Cyber Mesh', desc: 'Rejilla digital táctica interactiva' },
  { id: 'starfield', name: 'Constelación de Datos', desc: 'Partículas estelares enlazadas en el vacío' },
  { id: 'minimal', name: 'Obsidiana Minimal', desc: 'Fondo negro limpio para máxima concentración' },
];

export function CustomizationModal({ isOpen, onClose }: CustomizationModalProps) {
  const { user, updateSettings } = useAuth();
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'background' | 'audio'>('colors');

  if (!isOpen || !user) return null;

  const { settings } = user;

  const handleColorChange = (c: ColorTheme) => {
    cyberAudio.playLaserBlip();
    updateSettings({ colorTheme: c });
  };

  const handleFontChange = (f: FontFamily) => {
    cyberAudio.playBeep(720, 0.05, 'sine');
    updateSettings({ fontFamily: f });
  };

  const handleBgChange = (b: BackgroundEffect) => {
    cyberAudio.playBeep(650, 0.05, 'triangle');
    updateSettings({ bgEffect: b });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#030905] border border-[#00ff66]/40 rounded-xl shadow-[0_0_40px_rgba(0,255,102,0.25)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#051408] border-b border-[#00ff66]/25">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#39ff14]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-base text-white tracking-wide flex items-center gap-2">
                <span>Centro de Personalización</span>
                <span className="text-xs font-mono text-[#00ff66] font-normal px-2 py-0.5 bg-[#00ff66]/10 border border-[#00ff66]/25 rounded">
                  {user.username}
                </span>
              </h3>
              <p className="text-[11px] font-mono text-[#a5f3cf]/70">
                Los cambios se guardan automáticamente en tu perfil.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cyberAudio.playBeep(450, 0.05, 'sine');
              onClose();
            }}
            className="p-1.5 text-[#00ff66]/70 hover:text-white hover:bg-[#00ff66]/15 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-[#040e07] border-b border-[#00ff66]/15 overflow-x-auto">
          <button
            onClick={() => {
              cyberAudio.playBeep(600, 0.03, 'sine');
              setActiveTab('colors');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'colors'
                ? 'border-[#00ff66] text-[#00ff66] font-bold bg-[#00ff66]/5'
                : 'border-transparent text-[#a5f3cf]/60 hover:text-[#a5f3cf]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colores Neón</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playBeep(600, 0.03, 'sine');
              setActiveTab('fonts');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'fonts'
                ? 'border-[#00ff66] text-[#00ff66] font-bold bg-[#00ff66]/5'
                : 'border-transparent text-[#a5f3cf]/60 hover:text-[#a5f3cf]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Tipografía</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playBeep(600, 0.03, 'sine');
              setActiveTab('background');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'background'
                ? 'border-[#00ff66] text-[#00ff66] font-bold bg-[#00ff66]/5'
                : 'border-transparent text-[#a5f3cf]/60 hover:text-[#a5f3cf]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fondo & Efectos</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playBeep(600, 0.03, 'sine');
              setActiveTab('audio');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'audio'
                ? 'border-[#00ff66] text-[#00ff66] font-bold bg-[#00ff66]/5'
                : 'border-transparent text-[#a5f3cf]/60 hover:text-[#a5f3cf]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Audio & Físicas</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: COLORES */}
          {activeTab === 'colors' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-mono text-[#00ff66] uppercase tracking-wider mb-3">
                  Selecciona la paleta de iluminación neón de la web:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {COLOR_OPTIONS.map((col) => {
                    const isSelected = settings.colorTheme === col.id;
                    return (
                      <button
                        key={col.id}
                        onClick={() => handleColorChange(col.id)}
                        className={`p-3.5 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#05180a] shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                            : 'bg-[#020703] border-white/10 hover:border-white/30'
                        }`}
                        style={{ borderColor: isSelected ? col.hex : undefined }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full shadow-[0_0_8px_currentColor]"
                              style={{ backgroundColor: col.hex, color: col.hex }}
                            />
                            <span className="font-cyber font-bold text-xs text-white">
                              {col.name}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#39ff14]" />}
                        </div>
                        <p className="text-[11px] font-mono text-[#a5f3cf]/60">{col.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Glow Intensity */}
              <div className="pt-4 border-t border-[#00ff66]/15">
                <label className="block text-xs font-mono text-[#00ff66] uppercase mb-2">
                  Intensidad del Resplandor Neón (Glow):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as GlowIntensity[]).map((glow) => (
                    <button
                      key={glow}
                      onClick={() => {
                        cyberAudio.playLaserBlip();
                        updateSettings({ glowIntensity: glow });
                      }}
                      className={`py-2 px-3 text-xs font-mono rounded-lg border transition-all uppercase ${
                        settings.glowIntensity === glow
                          ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#39ff14] font-bold'
                          : 'border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {glow === 'low' ? 'Sutil' : glow === 'medium' ? 'Equilibrado' : 'Ultra Neón'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option: Comportamiento al hacer clic en la pantalla */}
              <div className="pt-4 border-t border-[#00ff66]/15 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#39ff14]" />
                    <span>Comportamiento del Color al Hacer Clic en Pantalla:</span>
                  </h5>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    settings.clickChangesColor === true
                      ? 'bg-[#00ff66]/15 border-[#00ff66]/40 text-[#39ff14]'
                      : 'bg-white/5 border-white/20 text-white/60'
                  }`}>
                    {settings.clickChangesColor === true ? 'Modo: Cambio Dinámico' : 'Modo: Color Fijo (Estable)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option A: NO cambiar de color (Color Fijo) */}
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playLaserBlip();
                      updateSettings({ clickChangesColor: false });
                    }}
                    className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                      settings.clickChangesColor !== true
                        ? 'bg-[#05180a] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                        : 'bg-[#020703] border-white/10 hover:border-white/25 text-white/60'
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-full border ${
                      settings.clickChangesColor !== true
                        ? 'border-[#00ff66] bg-[#00ff66]/20 text-[#39ff14]'
                        : 'border-white/30 text-white/40'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                        <span>Color Fijo</span>
                        <span className="text-[10px] text-[#00ff66] font-normal px-1.5 py-0.2 bg-[#00ff66]/10 rounded border border-[#00ff66]/30">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#a5f3cf]/70 mt-0.5 leading-snug">
                        No cambiar de color. Tu tema favorito se mantiene siempre fijo al hacer clic.
                      </p>
                    </div>
                  </button>

                  {/* Option B: Sí cambiar de color al hacer clic */}
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playLaserBlip();
                      updateSettings({ clickChangesColor: true });
                    }}
                    className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                      settings.clickChangesColor === true
                        ? 'bg-[#05180a] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                        : 'bg-[#020703] border-white/10 hover:border-white/25 text-white/60'
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-full border ${
                      settings.clickChangesColor === true
                        ? 'border-[#00ff66] bg-[#00ff66]/20 text-[#39ff14]'
                        : 'border-white/30 text-white/40'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white">
                        Rotar Color al Clic
                      </div>
                      <p className="text-[11px] font-mono text-[#a5f3cf]/70 mt-0.5 leading-snug">
                        Al hacer clic en el fondo de la pantalla, alterna cíclicamente entre las paletas neón.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIPOGRAFÍA */}
          {activeTab === 'fonts' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-mono text-[#00ff66] uppercase tracking-wider mb-3">
                  Familia Tipográfica Principal:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FONT_OPTIONS.map((f) => {
                    const isSelected = settings.fontFamily === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => handleFontChange(f.id)}
                        className={`p-3.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-[#05180a] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                            : 'bg-[#020703] border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-white">{f.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#39ff14]" />}
                        </div>
                        <p className="text-[11px] text-[#00ff66] opacity-80 truncate">{f.sample}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size */}
              <div className="pt-4 border-t border-[#00ff66]/15">
                <label className="block text-xs font-mono text-[#00ff66] uppercase mb-2">
                  Escala de Tamaño de Texto:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['compact', 'normal', 'large'] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        cyberAudio.playBeep(700, 0.05, 'sine');
                        updateSettings({ fontSize: size });
                      }}
                      className={`py-2 px-3 text-xs font-mono rounded-lg border transition-all ${
                        settings.fontSize === size
                          ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#39ff14] font-bold'
                          : 'border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {size === 'compact' ? 'Compacto (90%)' : size === 'normal' ? 'Estándar (100%)' : 'Cómodo (110%)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FONDO & EFECTOS */}
          {activeTab === 'background' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-mono text-[#00ff66] uppercase tracking-wider mb-3">
                  Efecto de Fondo Dinámico:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BG_EFFECTS.map((bg) => {
                    const isSelected = settings.bgEffect === bg.id;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => handleBgChange(bg.id)}
                        className={`p-3.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-[#05180a] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                            : 'bg-[#020703] border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-cyber font-bold text-xs text-white">{bg.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#39ff14]" />}
                        </div>
                        <p className="text-[11px] font-mono text-[#a5f3cf]/60">{bg.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Speed & Scanlines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#00ff66]/15">
                <div>
                  <label className="block text-xs font-mono text-[#00ff66] uppercase mb-2">
                    Velocidad de Lluvia:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['slow', 'normal', 'fast'] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => updateSettings({ matrixSpeed: spd })}
                        className={`py-1.5 px-2 text-[11px] font-mono rounded border transition-all ${
                          settings.matrixSpeed === spd
                            ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#39ff14] font-bold'
                            : 'border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        {spd === 'slow' ? 'Lenta' : spd === 'normal' ? 'Normal' : 'Rápida'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#00ff66] uppercase mb-2">
                    Líneas de Escaneo CRT:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'subtle', 'intense'] as ScanlineIntensity[]).map((sc) => (
                      <button
                        key={sc}
                        onClick={() => updateSettings({ scanlines: sc })}
                        className={`py-1.5 px-2 text-[11px] font-mono rounded border transition-all ${
                          settings.scanlines === sc
                            ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#39ff14] font-bold'
                            : 'border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        {sc === 'none' ? 'Off' : sc === 'subtle' ? 'Sutil' : 'Intenso'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Option: Cambiar color al hacer clic */}
              <div className="pt-4 border-t border-[#00ff66]/15 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#39ff14]" />
                    <span>Cambio de Color al Hacer Clic en Pantalla:</span>
                  </h5>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    settings.clickChangesColor === true
                      ? 'bg-[#00ff66]/15 border-[#00ff66]/40 text-[#39ff14]'
                      : 'bg-white/5 border-white/20 text-white/60'
                  }`}>
                    {settings.clickChangesColor === true ? 'Activado' : 'Desactivado (Color Fijo)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playLaserBlip();
                      updateSettings({ clickChangesColor: false });
                    }}
                    className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                      settings.clickChangesColor !== true
                        ? 'bg-[#05180a] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                        : 'bg-[#020703] border-white/10 hover:border-white/25 text-white/60'
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-full border ${
                      settings.clickChangesColor !== true
                        ? 'border-[#00ff66] bg-[#00ff66]/20 text-[#39ff14]'
                        : 'border-white/30 text-white/40'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                        <span>Color Fijo</span>
                        <span className="text-[10px] text-[#00ff66] font-normal px-1.5 py-0.2 bg-[#00ff66]/10 rounded border border-[#00ff66]/30">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#a5f3cf]/70 mt-0.5 leading-snug">
                        No cambiar de color. Tu tema favorito se mantiene siempre fijo al hacer clic.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playLaserBlip();
                      updateSettings({ clickChangesColor: true });
                    }}
                    className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                      settings.clickChangesColor === true
                        ? 'bg-[#05180a] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                        : 'bg-[#020703] border-white/10 hover:border-white/25 text-white/60'
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-full border ${
                      settings.clickChangesColor === true
                        ? 'border-[#00ff66] bg-[#00ff66]/20 text-[#39ff14]'
                        : 'border-white/30 text-white/40'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white">
                        Rotar Color al Clic
                      </div>
                      <p className="text-[11px] font-mono text-[#a5f3cf]/70 mt-0.5 leading-snug">
                        Al hacer clic en el fondo de la pantalla, alterna cíclicamente entre las paletas neón.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIO & FÍSICAS */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-mono text-[#00ff66] uppercase tracking-wider mb-3">
                  Física del Cursor Interactivo:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      cyberAudio.playLaserBlip();
                      updateSettings({ interactionMode: 'disperse' });
                    }}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      settings.interactionMode === 'disperse'
                        ? 'bg-[#05180a] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                        : 'bg-[#020703] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">Dispersión (Repeler)</span>
                      {settings.interactionMode === 'disperse' && <Check className="w-4 h-4 text-[#39ff14]" />}
                    </div>
                    <p className="text-[11px] font-mono text-[#a5f3cf]/60">
                      El código se aparta y dispersa ante el paso del cursor.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      cyberAudio.playLaserBlip();
                      updateSettings({ interactionMode: 'gather' });
                    }}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      settings.interactionMode === 'gather'
                        ? 'bg-[#05180a] border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                        : 'bg-[#020703] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">Agrupamiento (Atraer)</span>
                      {settings.interactionMode === 'gather' && <Check className="w-4 h-4 text-[#39ff14]" />}
                    </div>
                    <p className="text-[11px] font-mono text-[#a5f3cf]/60">
                      Los caracteres son atraídos magnéticamente hacia el cursor.
                    </p>
                  </button>
                </div>
              </div>

              {/* Audio toggle */}
              <div className="pt-4 border-t border-[#00ff66]/15 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-mono font-bold text-white mb-0.5">
                    Efectos de Sonido Sintetizados Web Audio
                  </h5>
                  <p className="text-[11px] font-mono text-[#a5f3cf]/60">
                    Bleeps cibernéticos, barridos de boot y ondas expansivas al interactuar.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const next = !settings.audioMuted;
                    cyberAudio.toggleMute();
                    updateSettings({ audioMuted: next });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono border transition-all ${
                    !settings.audioMuted
                      ? 'border-[#00ff66] bg-[#00ff66]/20 text-[#39ff14] font-bold'
                      : 'border-white/20 bg-white/5 text-white/50'
                  }`}
                >
                  {!settings.audioMuted ? (
                    <>
                      <Volume2 className="w-4 h-4 text-[#39ff14]" />
                      <span>Activo</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-red-400" />
                      <span>Silenciado</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#040e07] border-t border-[#00ff66]/20 text-xs font-mono">
          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              updateSettings({
                colorTheme: 'matrix',
                fontFamily: 'jetbrains',
                fontSize: 'normal',
                bgEffect: 'matrix',
                matrixSpeed: 'normal',
                scanlines: 'subtle',
                glowIntensity: 'medium',
                interactionMode: 'disperse',
                clickChangesColor: true,
              });
            }}
            className="flex items-center gap-1.5 text-[#a5f3cf]/60 hover:text-[#00ff66] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Valores</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playLockOn();
              onClose();
            }}
            className="px-5 py-2 font-cyber font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)]"
          >
            APLICAR Y CERRAR
          </button>
        </div>
      </div>
    </div>
  );
}
