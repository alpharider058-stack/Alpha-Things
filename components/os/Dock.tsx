'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { OSApp } from '@/types/os';
import { Plus } from 'lucide-react';
import { osAudio } from '@/lib/audio';
import { useCustomization } from '@/lib/customization';

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
  const { settings } = useCustomization();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bouncingAppId, setBouncingAppId] = useState<string | null>(null);
  const [isNearBottom, setIsNearBottom] = useState<boolean>(true);
  const dockRef = useRef<HTMLDivElement | null>(null);

  // Auto-hide listener: detect mouse near bottom edge
  useEffect(() => {
    if (!settings.dockAutoHide) return;

    const handleMouseMove = (e: MouseEvent) => {
      const threshold = window.innerHeight - 55;
      setIsNearBottom(e.clientY >= threshold);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.dockAutoHide]);

  const handleAppClick = (app: OSApp) => {
    osAudio.playClick(800, 0.04);
    setBouncingAppId(app.id);
    setTimeout(() => setBouncingAppId(null), 900);
    onLaunchApp(app);
  };

  // Base icon size according to dockSize setting
  const iconPixelSize =
    settings.dockSize === 'small' ? 40 : settings.dockSize === 'large' ? 56 : 48;
  const imageSize =
    settings.dockSize === 'small' ? 32 : settings.dockSize === 'large' ? 48 : 40;

  // Calculate magnification scale for an item
  const getScaleAndY = (index: number) => {
    if (!settings.dockMagnification || hoveredIndex === null) {
      return { scale: 1, y: 0 };
    }
    const dist = Math.abs(hoveredIndex - index);
    if (dist === 0) return { scale: 1.28, y: -10 };
    if (dist === 1) return { scale: 1.15, y: -5 };
    if (dist === 2) return { scale: 1.06, y: -2 };
    return { scale: 1, y: 0 };
  };

  const isDockVisible = !settings.dockAutoHide || isNearBottom;

  return (
    <>
      {/* Invisible hover trigger area for auto-hide */}
      {settings.dockAutoHide && (
        <div
          onMouseEnter={() => setIsNearBottom(true)}
          className="fixed bottom-0 left-0 w-full h-8 z-25 pointer-events-auto"
        />
      )}

      <motion.div
        ref={dockRef}
        animate={{
          y: isDockVisible ? 0 : 90,
          opacity: isDockVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        onMouseLeave={() => setHoveredIndex(null)}
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 select-none pointer-events-auto"
      >
        <div className="liquid-glass-dock rounded-3xl px-3.5 py-2.5 flex items-end gap-2.5 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
          {apps.map((app, index) => {
            const isOpen = openAppIds.includes(app.id);
            const isActive = activeAppId === app.id;
            const isHovered = hoveredIndex === index;
            const isBouncing = bouncingAppId === app.id;
            const { scale, y } = getScaleAndY(index);

            return (
              <div
                key={app.id}
                className="relative group flex flex-col items-center"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  osAudio.playDockHover();
                }}
              >
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.9 }}
                      animate={{ opacity: 1, y: -12, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="absolute -top-11 px-3 py-1 rounded-xl liquid-glass text-[11px] font-semibold text-white whitespace-nowrap shadow-xl border border-white/20 z-50 pointer-events-none flex items-center gap-1.5 backdrop-blur-xl"
                    >
                      <span className="drop-shadow">{app.name}</span>
                      {app.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-sky-300 font-mono">
                          {app.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* App Icon Button with fluid spring magnification */}
                <motion.button
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  animate={
                    isBouncing
                      ? { y: [0, -20, 0, -12, 0], scale: 1.1 }
                      : { scale, y }
                  }
                  transition={
                    isBouncing
                      ? { duration: 0.8, ease: 'easeOut' }
                      : { type: 'spring', stiffness: 450, damping: 25 }
                  }
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleAppClick(app)}
                  style={{ width: iconPixelSize, height: iconPixelSize }}
                  className={`relative rounded-2xl flex items-center justify-center p-1.5 transition-shadow cursor-pointer select-none ${
                    isActive
                      ? 'ring-2 ring-[var(--accent-color)] shadow-[0_0_25px_var(--accent-glow)]'
                      : 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
                  }`}
                  title={app.name}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center relative pointer-events-none select-none">
                    {app.icon && app.icon.startsWith('/') ? (
                      <Image
                        src={app.icon}
                        alt={app.name}
                        width={imageSize}
                        height={imageSize}
                        draggable={false}
                        className="w-full h-full object-contain drop-shadow-md pointer-events-none select-none"
                      />
                    ) : (
                      <span className="text-2xl select-none pointer-events-none">{app.icon || '🌐'}</span>
                    )}
                  </div>
                </motion.button>

                {/* Status Indicator Dot under the icon */}
                <div className="h-2 flex items-center justify-center mt-0.5">
                  {isOpen ? (
                    <motion.div
                      layoutId={`dock-indicator-${app.id}`}
                      className={`rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-2 h-2 bg-[var(--accent-color)] shadow-[0_0_12px_var(--accent-glow)] scale-110'
                          : 'w-1.5 h-1.5 bg-white/70 shadow-[0_0_6px_rgba(255,255,255,0.6)]'
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
              setHoveredIndex(apps.length);
              osAudio.playDockHover();
            }}
          >
            {hoveredIndex === apps.length && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: -12 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute -top-11 px-3 py-1 rounded-xl liquid-glass text-[11px] font-semibold text-white whitespace-nowrap shadow-xl border border-white/20 pointer-events-none"
              >
                Añadir App o Web
              </motion.div>
            )}

            <motion.button
              animate={getScaleAndY(apps.length)}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                osAudio.playClick();
                onOpenAddApp();
              }}
              style={{ width: iconPixelSize, height: iconPixelSize }}
              className="rounded-2xl liquid-glass flex items-center justify-center text-white/70 hover:text-white border border-white/20 hover:border-white/40 cursor-pointer mb-2 transition-all shadow-md"
              title="Añadir Aplicación Personalizada"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
