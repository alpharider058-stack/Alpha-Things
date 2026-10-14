'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cyberAudio } from '@/lib/audio';
import { X, Plus, Globe, Bookmark, Layers, Sparkles } from 'lucide-react';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLinkModal({ isOpen, onClose }: AddLinkModalProps) {
  const { addCustomLink } = useAuth();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Personal');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    addCustomLink({
      title: title.trim(),
      url: finalUrl,
      category: category.trim() || 'General',
      description: description.trim() || 'Enlace personalizado añadido por el operador.',
    });

    setTitle('');
    setUrl('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#030905] border border-[#00ff66]/40 rounded-xl shadow-[0_0_35px_rgba(0,255,102,0.25)] flex flex-col overflow-hidden box-neon">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#051408] border-b border-[#00ff66]/25">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#39ff14]" />
            <h3 className="font-cyber font-bold text-sm text-white">
              Añadir Enlace Personalizado
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#00ff66]/70 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[#00ff66]/80 mb-1">TÍTULO DEL SITIO / APP:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Mi Servidor Discord o Portal Favorito"
              className="w-full bg-[#020603] border border-[#00ff66]/30 text-white placeholder-[#00ff66]/30 px-3 py-2 rounded focus:outline-none focus:border-[#00ff66]"
            />
          </div>

          <div>
            <label className="block text-[#00ff66]/80 mb-1">URL / ENLACE WEB:</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#00ff66]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                className="w-full bg-[#020603] border border-[#00ff66]/30 text-white placeholder-[#00ff66]/30 pl-9 pr-3 py-2 rounded focus:outline-none focus:border-[#00ff66]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#00ff66]/80 mb-1">CATEGORÍA:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#020603] border border-[#00ff66]/30 text-[#00ff66] px-3 py-2 rounded focus:outline-none focus:border-[#00ff66]"
            >
              <option value="Personal">Personal</option>
              <option value="Juegos">Juegos & Emulación</option>
              <option value="Herramientas">Herramientas & Dev</option>
              <option value="Educación">Educación</option>
              <option value="Media">Media & Streaming</option>
            </select>
          </div>

          <div>
            <label className="block text-[#00ff66]/80 mb-1">DESCRIPCIÓN BREVE (OPCIONAL):</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la herramienta o web..."
              className="w-full bg-[#020603] border border-[#00ff66]/30 text-white placeholder-[#00ff66]/30 px-3 py-2 rounded focus:outline-none focus:border-[#00ff66]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 font-cyber font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] rounded transition-all shadow-[0_0_15px_#00ff66]"
            >
              GUARDAR EN MI CUENTA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
