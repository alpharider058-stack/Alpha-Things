'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { OSApp } from '@/types/os';
import { Plus } from 'lucide-react';
import { osAudio } from '@/lib/audio';

interface DockProps {
  apps: OSApp[];
  openAppIds: string[];
  activeAppId: string | null;
  onLaunchApp: (app: OSApp) => void;
  onOpenAddApp: () => void;
}

export function Dock({
  apps,
  openAppIds,
  activeAppId,
  onLaunchApp,
  onOpenAddApp,
}: DockProps) {
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [bouncingAppId, setBouncingAppId] = useState<string | null>(null);

  const handleAppClick = (app: OSApp) => {
    osAudio.playClick(800, 0.04);
    setBouncingAppId(app.id);
    setTimeout(() => setBouncingAppId(null), 900);
    onLaunchApp(app);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="liquid-glass-dock rounded-3xl px-3 py-2.5 flex items-end gap-2.5 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
        {apps.map((app) => {
          const isOpen = openAppIds.includes(app.id);
          const isActive = activeAppId === app.id;
          const isHovered = hoveredAppId === app.id;
          const isBouncing = bouncingAppId === app.id;

          return (
            <div
              key={app.id}
              className="relative group flex flex-col items-center"
              onMouseEnter={() => {
                setHoveredAppId(app.id);
                osAudio.playDockHover();
              }}
              onMouseLeave={() => setHoveredAppId(null)}
            >
              {/* Tooltip on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: -8, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-10 px-3 py-1 rounded-xl liquid-glass text-[11px] font-medium text-white whitespace-nowrap shadow-lg border border-white/20 z-50 pointer-events-none flex items-center gap-1.5"
                  >
                    <span>{app.name}</span>
                    {app.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-sky-400 font-mono">
                        {app.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* App Icon Button */}
              <motion.button
                whileHover={{ scale: 1.25, y: -6 }}
                whileTap={{ scale: 0.95 }}
                animate={isBouncing ? { y: [0, -18, 0, -10, 0] } : {}}
                transition={
                  isBouncing
                    ? { duration: 0.8, ease: 'easeOut' }
                    : { type: 'spring', stiffness: 450, damping: 25 }
                }
                onClick={() => handleAppClick(app)}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center p-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                    : 'hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)]'
                }`}
                title={app.name}
              >
                <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center relative">
                  {app.icon && app.icon.startsWith('/') ? (
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  ) : (
                    <span className="text-2xl">{app.icon || '🌐'}</span>
                  )}
                </div>
              </motion.button>

              {/* Running Application Indicator Dot */}
              <div className="h-1.5 flex items-center justify-center mt-0.5">
                {isOpen ? (
                  <motion.div
                    layoutId={`indicator-${app.id}`}
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'bg-white/60'
                    }`}
                  />
                ) : (
                  <div className="w-1.5 h-1.5 opacity-0" />
                )}
              </div>
            </div>
          );
        })}

        {/* Separator */}
        <div className="w-px h-8 bg-white/15 mx-0.5 self-center mb-2" />

        {/* Add Shortcut / Custom App Button */}
        <div
          className="relative group flex flex-col items-center"
          onMouseEnter={() => {
            setHoveredAppId('add-app');
            osAudio.playDockHover();
          }}
          onMouseLeave={() => setHoveredAppId(null)}
        >
          {hoveredAppId === 'add-app' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -8 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-10 px-2.5 py-1 rounded-xl liquid-glass text-[11px] font-medium text-white whitespace-nowrap shadow-lg border border-white/20 pointer-events-none"
            >
              Añadir App o Web
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.2, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              osAudio.playClick();
              onOpenAddApp();
            }}
            className="w-11 h-11 rounded-2xl liquid-glass flex items-center justify-center text-white/70 hover:text-white border border-white/20 hover:border-white/40 cursor-pointer mb-2 transition-all"
            title="Añadir Aplicación Personalizada"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
