'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Sliders,
  Palette,
  Lock,
  LayoutGrid,
  Check,
} from 'lucide-react';
import { OSApp } from '@/types/os';
import { osAudio } from '@/lib/audio';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  apps: OSApp[];
  onLaunchApp: (app: OSApp) => void;
  onOpenSettings: () => void;
  onLockScreen: () => void;
  onToggleWidgets?: () => void;
}

export function SpotlightSearch({
  isOpen,
  onClose,
  apps,
  onLaunchApp,
  onOpenSettings,
  onLockScreen,
  onToggleWidgets,
}: SpotlightSearchProps) {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Filter apps and system actions
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return apps.slice(0, 8);
    }
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q)
    );
  }, [apps, query]);

  // Clamped index for safety
  const safeSelectedIndex = selectedIndex >= results.length ? 0 : selectedIndex;

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation inside Spotlight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        osAudio.playClick(800, 0.02);
        setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        osAudio.playClick(800, 0.02);
        setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[safeSelectedIndex]) {
          onLaunchApp(results[safeSelectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, safeSelectedIndex, onLaunchApp, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-start justify-center pt-24 md:pt-32 p-4 select-none animate-in fade-in duration-150"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-3xl liquid-glass-panel border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col"
        >
          {/* Search Header Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <Search className="w-5 h-5 text-[var(--accent-color)] flex-shrink-0 animate-pulse" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Buscar aplicaciones, herramientas o comandos (ej: Mantle, Biología, Ajustes)..."
              className="w-full bg-transparent border-0 text-white placeholder-white/40 focus:outline-none text-base font-medium"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedIndex(0);
                }}
                className="text-xs px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                Limpiar
              </button>
            )}
            <kbd className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/50 border border-white/10">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="p-2.5 max-h-[50vh] overflow-y-auto space-y-1">
            {results.length > 0 ? (
              results.map((app, index) => {
                const isSelected = index === safeSelectedIndex;

                return (
                  <div
                    key={app.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      onLaunchApp(app);
                      onClose();
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/40 shadow-sm'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl liquid-glass p-1.5 flex items-center justify-center border border-white/15 flex-shrink-0 shadow">
                        {app.icon && app.icon.startsWith('/') ? (
                          <Image
                            src={app.icon}
                            alt={app.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xl">{app.icon || '🌐'}</span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white tracking-wide truncate">
                            {app.name}
                          </p>
                          {app.badge && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-md bg-white/10 text-sky-300 font-semibold">
                              {app.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/60 truncate max-w-md">
                          {app.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        {app.category}
                      </span>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--accent-color)] pl-1">
                          <span>Abrir</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-white/50 space-y-2">
                <Search className="w-8 h-8 mx-auto text-white/30" />
                <p className="text-xs">No se encontraron aplicaciones con &quot;{query}&quot;</p>
              </div>
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-5 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
            <div className="flex items-center gap-3">
              <span>↑↓ Navegar</span>
              <span>↵ Abrir</span>
              <span>ESC Salir</span>
            </div>
            <span className="text-[var(--accent-color)] font-sans font-medium text-xs">
              Classroom OS Spotlight
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
