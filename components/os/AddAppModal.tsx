'use client';

import React, { useState } from 'react';
import { X, Plus, Globe, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { osAudio } from '@/lib/audio';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_ICONS = ['🌐', '🚀', '🎮', '💡', '📚', '🎬', '🛠️', '⚡', '🤖', '🔮'];

export function AddAppModal({ isOpen, onClose }: AddAppModalProps) {
  const { addCustomLink } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('🌐');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    if (!title.trim()) {
      setError('Por favor indica un nombre para la aplicación.');
      return;
    }

    try {
      new URL(finalUrl);
    } catch {
      setError('Por favor introduce una dirección URL válida.');
      return;
    }

    addCustomLink({
      title: title.trim(),
      url: finalUrl,
      category: 'custom',
      description: description.trim() || 'Aplicación personalizada agregada por el usuario.',
      icon: selectedIcon,
    });

    osAudio.playUnlock();
    onClose();
    setTitle('');
    setUrl('');
    setDescription('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none font-inter"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl liquid-glass-panel p-6 border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.85)] text-white"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl liquid-glass flex items-center justify-center text-base">
              ➕
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Añadir Nueva Aplicación</h3>
              <p className="text-[11px] text-white/50">Crea un acceso directo a cualquier web en tu OS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] text-white/70 mb-1.5 font-medium">
              Icono de la App
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setSelectedIcon(ic)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all ${
                    selectedIcon === ic
                      ? 'bg-sky-500/30 border-2 border-sky-400 scale-105'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-white/70 mb-1 font-medium">
              Nombre de la App
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. YouTube, Discord, Chess..."
              className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] text-white/70 mb-1 font-medium">
              Dirección URL
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-white/70 mb-1 font-medium">
              Descripción (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve nota sobre qué hace esta aplicación"
              className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl liquid-glass text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Instalar en el Escritorio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
