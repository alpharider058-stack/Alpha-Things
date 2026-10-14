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
} from 'lucide-react';
import { useAuth, AVATAR_OPTIONS } from '@/context/AuthContext';
import { WallpaperId, FontFamily } from '@/types/user';
import { osAudio } from '@/lib/audio';

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

const FONTS: { id: FontFamily; name: string; sample: string }[] = [
  { id: 'inter', name: 'Inter (Predeterminada)', sample: 'Classroom OS Liquid Glass 14.5' },
  { id: 'sf-pro', name: 'SF Pro / System OS', sample: 'Classroom OS Liquid Glass 14.5' },
  { id: 'outfit', name: 'Outfit Modern', sample: 'Classroom OS Liquid Glass 14.5' },
  { id: 'jetbrains', name: 'JetBrains Mono', sample: 'Classroom OS Liquid Glass 14.5' },
  { id: 'fira', name: 'Fira Code', sample: 'Classroom OS Liquid Glass 14.5' },
  { id: 'orbitron', name: 'Orbitron Cyber', sample: 'Classroom OS Liquid Glass 14.5' },
  { id: 'rajdhani', name: 'Rajdhani Tech', sample: 'Classroom OS Liquid Glass 14.5' },
];

export function SettingsApp() {
  const { user, updateSettings } = useAuth();
  const [activeTab, setActiveTab] = useState<'appearance' | 'click' | 'audio' | 'account'>('appearance');

  const currentWallpaper = (user?.settings?.wallpaper || 'liquid-smoke') as WallpaperId;
  const currentFont = (user?.settings?.fontFamily || 'inter') as FontFamily;
  const clickChangesColor = Boolean(user?.settings?.clickChangesColor);
  const isAudioMuted = Boolean(user?.settings?.audioMuted);

  const handleSelectWallpaper = (id: WallpaperId) => {
    osAudio.playClick(750, 0.03);
    updateSettings({ wallpaper: id });
  };

  const handleSelectFont = (id: FontFamily) => {
    osAudio.playClick(700, 0.03);
    updateSettings({ fontFamily: id });
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
    <div className="flex h-full text-white font-inter">
      {/* Sidebar Navigation */}
      <aside className="w-56 liquid-glass border-r border-white/10 p-3 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-white/50 uppercase tracking-wider">
            Ajustes de Sistema
          </div>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'appearance'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Fondo & Apariencia</span>
          </button>

          <button
            onClick={() => setActiveTab('click')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'click'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MousePointerClick className="w-4 h-4" />
            <span>Efecto al hacer Clic</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'audio'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Sonido del Sistema</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'account'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Cuenta de Usuario</span>
          </button>
        </div>

        {/* System Version Footer */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-white/50">
          <p className="font-semibold text-white/80">Classroom OS 14.5</p>
          <p className="text-[10px]">Liquid Glass Dark Edition</p>
        </div>
      </aside>

      {/* Main Settings Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0a0d16]/95">
        {activeTab === 'appearance' && (
          <div className="max-w-2xl space-y-7">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Fondos Liquid Glass</h2>
              <p className="text-xs text-white/60">
                Selecciona la atmósfera visual que definirá el fondo de tu sistema operativo.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-4">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => handleSelectWallpaper(wp.id)}
                    className={`group relative h-28 rounded-2xl p-3 flex flex-col justify-end text-left border overflow-hidden transition-all ${
                      currentWallpaper === wp.id
                        ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-lg scale-[1.02]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${wp.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white drop-shadow-sm">
                        {wp.name}
                      </span>
                      {currentWallpaper === wp.id && (
                        <div className="w-4 h-4 rounded-full bg-sky-400 text-black flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="pt-4 border-t border-white/10">
              <h2 className="text-lg font-bold text-white mb-1">Tipografía del Sistema</h2>
              <p className="text-xs text-white/60 mb-4">
                Elige la fuente tipográfica con la que se representarán los menús, ventanas y aplicaciones.
              </p>

              <div className="space-y-2">
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleSelectFont(font.id)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                      currentFont === font.id
                        ? 'bg-white/10 border-sky-400 text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white">{font.name}</p>
                      <p className={`text-[11px] text-white/60 mt-0.5 font-${font.id}`}>
                        {font.sample}
                      </p>
                    </div>
                    {currentFont === font.id && (
                      <div className="w-5 h-5 rounded-full bg-sky-400 text-black flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Click Color Effect Section (Addressing User Requests 2 & 3) */}
        {activeTab === 'click' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Efecto al hacer Clic</h2>
              <p className="text-xs text-white/60">
                Personaliza la respuesta interactiva del escritorio cuando haces clic en la pantalla.
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <h3 className="text-sm font-semibold text-white mb-1">
                    Cambiar color de fondo al hacer clic
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {clickChangesColor
                      ? 'Activado: Cada clic en el fondo del escritorio genera una ondulación cromática reactiva.'
                      : 'Desactivado: El fondo se mantiene estático, estable y fiel a tu tema visual sin alterar sus colores al hacer clic.'}
                  </p>
                </div>

                {/* Modern Toggle Switch */}
                <button
                  type="button"
                  onClick={handleToggleClickColor}
                  className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer flex-shrink-0 ${
                    clickChangesColor ? 'bg-sky-500' : 'bg-white/15'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white transition-transform shadow-md ${
                      clickChangesColor ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Status Indicator Banner */}
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  clickChangesColor
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    clickChangesColor ? 'bg-sky-400' : 'bg-emerald-400'
                  }`}
                />
                <span>
                  {clickChangesColor
                    ? 'Opción activa: los clics cambian el tono del fondo.'
                    : 'Opción activa: NO se cambia el color al hacer clic (modo preferido).'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Audio Settings */}
        {activeTab === 'audio' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Efectos de Audio del Sistema</h2>
              <p className="text-xs text-white/60">
                Sintetizador Web Audio para respuesta táctil al abrir ventanas, arrastrar apps o desbloquear.
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/15 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Sonidos del Sistema Operativo
                </h3>
                <p className="text-xs text-white/70">
                  {isAudioMuted ? 'El sistema está en silencio total.' : 'Sonidos sutiles de interfaz activos.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleAudio}
                className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer flex-shrink-0 ${
                  !isAudioMuted ? 'bg-emerald-500' : 'bg-white/15'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform shadow-md ${
                    !isAudioMuted ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* User Account Details */}
        {activeTab === 'account' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Perfil de Usuario</h2>
              <p className="text-xs text-white/60">
                Tus datos se guardan de forma permanente en este navegador con tu cuenta creada.
              </p>
            </div>

            {user ? (
              <div className="liquid-glass rounded-2xl p-6 border border-white/15 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center text-3xl border border-white/20">
                    {user.avatar || '⚡'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{user.username}</h3>
                    <p className="text-xs text-sky-400 font-mono">{user.email || 'usuario@classroom.os'}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Cuenta Guardada y Sincronizada
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-white/70">
                  <div className="flex justify-between">
                    <span>Identificador de Sistema:</span>
                    <span className="font-mono text-white/90">{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha de Creación:</span>
                    <span className="font-mono text-white/90">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aplicaciones personalizadas:</span>
                    <span className="font-mono text-white/90">{user.customLinks?.length || 0}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl liquid-glass text-xs text-white/70">
                No hay una sesión activa de usuario.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
