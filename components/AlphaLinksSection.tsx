'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  GraduationCap,
  Terminal,
  Dna,
  Search,
  Monitor,
  Shield,
  Layers,
  Gamepad2,
  Tv,
  Star,
  Plus,
  Trash2,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { cyberAudio } from '@/lib/audio';
import { useAuth } from '@/context/AuthContext';

interface AlphaLinksSectionProps {
  onPreview: (url: string, title: string) => void;
  onOpenAddLink?: () => void;
}

interface AlphaLinkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  type: 'game' | 'education' | 'security' | 'media' | 'custom';
  description: string;
  icon: React.ElementType;
  specs: string[];
  accentColor: string;
  isCustom?: boolean;
}

const DEFAULT_LINKS: AlphaLinkItem[] = [
  {
    id: 'gta-v-web',
    title: 'GTA V Online (Web)',
    url: 'https://gta.deloskiyt.pl/',
    category: 'Juegos & Emulación',
    type: 'game',
    description:
      'Juega a Grand Theft Auto V directamente en tu navegador web. Acceso instantáneo sin descargas con controles completos y aceleración WebGL.',
    icon: Gamepad2,
    specs: ['GTA V WEB', 'DELOSKIYT.PL', 'JUEGO ONLINE'],
    accentColor: '#39ff14',
  },
  {
    id: 'cine-os',
    title: 'Cine-OS Multimedia',
    url: 'https://cineosweb.github.io/',
    category: 'Sistema Operativo Web',
    type: 'media',
    description:
      'Entorno de escritorio virtual interactivo con interfaz multimedia, reproducción de contenidos audiovisuales y apps web.',
    icon: Tv,
    specs: ['WEB OS', 'STREAMING', 'MULTIMEDIA'],
    accentColor: '#00ff66',
  },
  {
    id: 'classroom-alpha-five',
    title: 'Classroom Alpha Five',
    url: 'https://classroom-alpha-five.vercel.app/',
    category: 'Educación & Aula Digital',
    type: 'education',
    description:
      'Plataforma de aula virtual interactiva Alpha, entorno colaborativo para gestión de asignaturas, tareas y materiales digitales.',
    icon: GraduationCap,
    specs: ['VERCEL HOSTED', 'HTTPS SECURE', 'AULA DIGITAL'],
    accentColor: '#00ff66',
  },
  {
    id: 'alpha-hack',
    title: 'Alpha Hack',
    url: 'https://alpha-hack.vercel.app/',
    category: 'Ciberseguridad & Terminal Hacker',
    type: 'security',
    description:
      'Suite de herramientas cibernéticas, utilidades de terminal, pruebas de concepto y recursos de pentesting y seguridad digital.',
    icon: Terminal,
    specs: ['SECURITY SUITE', 'CYBER TERMINAL', 'HACK TOOLS'],
    accentColor: '#39ff14',
  },
  {
    id: 'classroom-biologia',
    title: 'Classroom Biología',
    url: 'https://classroom-biologia.vercel.app/',
    category: 'Ciencias & Biología Alpha',
    type: 'education',
    description:
      'Portal académico enfocado en biología, anatomía, botánica y ecología con módulos interactivos y recursos curriculares.',
    icon: Dna,
    specs: ['CIENCIAS BIOLÓGICAS', 'RECURSOS ACADÉMICOS', 'INTERACTIVO'],
    accentColor: '#00f0ff',
  },
];

export function AlphaLinksSection({ onPreview, onOpenAddLink }: AlphaLinksSectionProps) {
  const { user, toggleFavorite, removeCustomLink } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const favorites = user?.favorites || [];
  const customLinks = user?.customLinks || [];

  // Merge default links with user custom links
  const allLinks: AlphaLinkItem[] = [
    ...DEFAULT_LINKS,
    ...customLinks.map((cl) => ({
      id: cl.id,
      title: cl.title,
      url: cl.url,
      category: cl.category || 'Personal',
      type: 'custom' as const,
      description: cl.description || 'Enlace personalizado añadido por el operador.',
      icon: Bookmark,
      specs: ['ENLACE PERSONALIZADO', 'GUARDADO EN CUENTA'],
      accentColor: '#38bdf8',
      isCustom: true,
    })),
  ];

  const handleCopy = (url: string, id: string) => {
    cyberAudio.playBeep(920, 0.05, 'sine');
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = allLinks.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'favorites') {
      return favorites.includes(item.id);
    }
    if (activeCategory === 'games') {
      return item.type === 'game' || item.type === 'media';
    }
    if (activeCategory === 'education') {
      return item.type === 'education';
    }
    if (activeCategory === 'security') {
      return item.type === 'security';
    }
    if (activeCategory === 'custom') {
      return item.isCustom;
    }

    return true;
  });

  return (
    <section id="alpha-links" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-[#00ff66]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66]/70 uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4 text-[#39ff14]" />
            <span>Red Centralizada de Aplicaciones & Servicios</span>
          </div>
          <h2 className="font-cyber text-2xl sm:text-3xl lg:text-4xl font-black text-[#00ff66] tracking-wide text-neon">
            Ecosistema de Enlaces
          </h2>
        </div>

        {/* Search input & Add Link action */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en todos los enlaces..."
              className="w-full bg-[#040e07] border border-[#00ff66]/30 text-xs font-mono text-[#00ff66] placeholder-[#00ff66]/40 px-3.5 py-2 pl-9 rounded focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.1)]"
            />
            <Search className="w-4 h-4 text-[#00ff66]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              onOpenAddLink?.();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] rounded transition-all shadow-[0_0_10px_#00ff66] whitespace-nowrap"
            title="Añadir nuevo enlace a tu cuenta"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-8 pb-2 overflow-x-auto">
        <button
          onClick={() => {
            cyberAudio.playBeep(600, 0.03, 'sine');
            setActiveCategory('all');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-[#00ff66] text-[#030704] font-bold shadow-[0_0_10px_#00ff66]'
              : 'bg-[#051408] text-[#a5f3cf]/70 hover:text-white border border-[#00ff66]/20'
          }`}
        >
          Todos ({allLinks.length})
        </button>

        <button
          onClick={() => {
            cyberAudio.playBeep(600, 0.03, 'sine');
            setActiveCategory('favorites');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
            activeCategory === 'favorites'
              ? 'bg-[#ffb703] text-[#030704] font-bold shadow-[0_0_10px_#ffb703]'
              : 'bg-[#051408] text-[#a5f3cf]/70 hover:text-white border border-[#00ff66]/20'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Favoritos ({allLinks.filter((l) => favorites.includes(l.id)).length})</span>
        </button>

        <button
          onClick={() => {
            cyberAudio.playBeep(600, 0.03, 'sine');
            setActiveCategory('games');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
            activeCategory === 'games'
              ? 'bg-[#39ff14] text-[#030704] font-bold shadow-[0_0_10px_#39ff14]'
              : 'bg-[#051408] text-[#a5f3cf]/70 hover:text-white border border-[#00ff66]/20'
          }`}
        >
          GTA V & Cine-OS
        </button>

        <button
          onClick={() => {
            cyberAudio.playBeep(600, 0.03, 'sine');
            setActiveCategory('education');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
            activeCategory === 'education'
              ? 'bg-[#00ff66] text-[#030704] font-bold shadow-[0_0_10px_#00ff66]'
              : 'bg-[#051408] text-[#a5f3cf]/70 hover:text-white border border-[#00ff66]/20'
          }`}
        >
          Aulas & Educación
        </button>

        <button
          onClick={() => {
            cyberAudio.playBeep(600, 0.03, 'sine');
            setActiveCategory('security');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
            activeCategory === 'security'
              ? 'bg-[#00ff66] text-[#030704] font-bold shadow-[0_0_10px_#00ff66]'
              : 'bg-[#051408] text-[#a5f3cf]/70 hover:text-white border border-[#00ff66]/20'
          }`}
        >
          Ciberseguridad
        </button>

        {customLinks.length > 0 && (
          <button
            onClick={() => {
              cyberAudio.playBeep(600, 0.03, 'sine');
              setActiveCategory('custom');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
              activeCategory === 'custom'
                ? 'bg-[#00f0ff] text-[#030704] font-bold shadow-[0_0_10px_#00f0ff]'
                : 'bg-[#051408] text-[#a5f3cf]/70 hover:text-white border border-[#00ff66]/20'
            }`}
          >
            Mis Enlaces ({customLinks.length})
          </button>
        )}
      </div>

      {/* Grid of Links Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.map((item) => {
          const Icon = item.icon;
          const isCopied = copiedId === item.id;
          const isFavorited = favorites.includes(item.id);

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between p-6 bg-[#040e07]/85 border border-[#00ff66]/25 rounded-xl box-neon box-neon-hover transition-all duration-300 overflow-hidden"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00ff66]" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00ff66]" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00ff66]" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00ff66]" />

              {/* Card Body */}
              <div>
                {/* Header row with Icon, Online state, and Favorite button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center text-[#39ff14] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Favorite star */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-1.5 rounded transition-all ${
                        isFavorited
                          ? 'text-[#ffb703] drop-shadow-[0_0_8px_#ffb703]'
                          : 'text-white/20 hover:text-white/60'
                      }`}
                      title={isFavorited ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
                    >
                      <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>

                    {/* Delete button if custom */}
                    {item.isCustom && (
                      <button
                        onClick={() => removeCustomLink(item.id)}
                        className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                        title="Eliminar este enlace personalizado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse ml-1" />
                    <span className="text-[10px] font-mono text-[#00ff66]/70 uppercase">ONLINE</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#00ff66]/60 mb-1">
                  {item.category}
                </div>

                <h3 className="font-cyber font-bold text-lg sm:text-xl text-white group-hover:text-[#00ff66] transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs font-mono text-[#b3eccd] leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>

                {/* Specs / Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.specs.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 bg-[#00ff66]/5 border border-[#00ff66]/20 text-[#a5f3cf] rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* URL preview container */}
                <div className="p-2.5 bg-[#020603] border border-[#00ff66]/20 rounded font-mono text-[11px] text-[#00ff66] flex items-center justify-between gap-2 mb-6">
                  <span className="truncate select-all opacity-80">{item.url}</span>
                  <button
                    onClick={() => handleCopy(item.url, item.id)}
                    className="p-1 text-[#00ff66]/70 hover:text-[#39ff14] transition-colors shrink-0"
                    title="Copiar URL"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-[#39ff14]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#00ff66]/15">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberAudio.playLaserBlip()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-cyber font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] rounded transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)] hover:shadow-[0_0_18px_rgba(57,255,20,0.6)]"
                >
                  <span>ACCEDER</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    cyberAudio.playBeep(680, 0.05, 'sine');
                    onPreview(item.url, item.title);
                  }}
                  className="p-2 text-xs font-mono text-[#00ff66] bg-[#051408] border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 rounded transition-colors"
                  title="Previsualizar en ventana"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Quick Card: Add custom link card */}
        <div
          onClick={() => {
            cyberAudio.playLaserBlip();
            onOpenAddLink?.();
          }}
          className="group cursor-pointer flex flex-col items-center justify-center p-8 bg-[#040e07]/40 border-2 border-dashed border-[#00ff66]/30 hover:border-[#00ff66] rounded-xl hover:bg-[#00ff66]/5 transition-all text-center min-h-[260px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center text-[#39ff14] group-hover:scale-110 transition-transform mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="font-cyber font-bold text-sm text-white mb-1">
            + Añadir Enlace Personalizado
          </h4>
          <p className="text-xs font-mono text-[#a5f3cf]/60 max-w-xs">
            Guarda tus webs, juegos o herramientas preferidas en tu perfil personal.
          </p>
        </div>
      </div>

      {filteredLinks.length === 0 && (
        <div className="p-8 text-center border border-[#00ff66]/20 bg-[#040e07]/60 rounded-lg text-xs font-mono text-[#00ff66]/70">
          No se encontraron enlaces en esta categoría o con el criterio &quot;{searchQuery}&quot;.
        </div>
      )}
    </section>
  );
}
