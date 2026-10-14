'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cyberAudio } from '@/lib/audio';
import { useAuth } from '@/context/AuthContext';
import { Magnet, Orbit, Palette, Sparkles, Binary, Sliders } from 'lucide-react';
import { ColorTheme, BackgroundEffect, InteractionMode } from '@/types/user';

interface MatrixRainCanvasProps {
  opacity?: number;
  interactive?: boolean;
  onOpenCustomizer?: () => void;
}

interface ColorPalette {
  name: string;
  lead: string;
  trail: string;
  glow: string;
  spark: string;
  borderAccent: string;
}

const COLOR_PALETTES: Record<ColorTheme, ColorPalette> = {
  matrix: {
    name: 'Matrix Verde',
    lead: '#ffffff',
    trail: '#00ff66',
    glow: '#39ff14',
    spark: '#aaffaa',
    borderAccent: '#00ff66',
  },
  cyan: {
    name: 'Cian Cibernético',
    lead: '#ffffff',
    trail: '#00f0ff',
    glow: '#38bdf8',
    spark: '#bae6fd',
    borderAccent: '#00f0ff',
  },
  purple: {
    name: 'Neón Violeta',
    lead: '#ffffff',
    trail: '#d946ef',
    glow: '#a855f7',
    spark: '#f5d0fe',
    borderAccent: '#d946ef',
  },
  amber: {
    name: 'Ámbar Hacker',
    lead: '#ffffff',
    trail: '#ffb703',
    glow: '#fb8500',
    spark: '#fef08a',
    borderAccent: '#ffb703',
  },
  crimson: {
    name: 'Carmesí Alerta',
    lead: '#ffffff',
    trail: '#ff0055',
    glow: '#ef4444',
    spark: '#fecaca',
    borderAccent: '#ff0055',
  },
  lime: {
    name: 'Lima Tóxico',
    lead: '#ffffff',
    trail: '#84cc16',
    glow: '#a3e635',
    spark: '#d9f99d',
    borderAccent: '#84cc16',
  },
  obsidian: {
    name: 'Obsidiana Liquid Glass',
    lead: '#ffffff',
    trail: '#38bdf8',
    glow: '#818cf8',
    spark: '#e0e7ff',
    borderAccent: '#38bdf8',
  },
  'liquid-smoke': {
    name: 'Liquid Smoke',
    lead: '#ffffff',
    trail: '#6366f1',
    glow: '#a855f7',
    spark: '#f3e8ff',
    borderAccent: '#6366f1',
  },
};

const THEME_CYCLE: ColorTheme[] = ['matrix', 'cyan', 'purple', 'amber', 'crimson', 'lime'];

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
  color: string;
}

export function MatrixRainCanvas({
  opacity = 0.88,
  interactive = true,
  onOpenCustomizer,
}: MatrixRainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { user, updateSettings } = useAuth();

  const settings = user?.settings;
  const activeColorTheme: ColorTheme = settings?.colorTheme || 'matrix';
  const activeBgEffect: BackgroundEffect = settings?.bgEffect || 'matrix';
  const activeMode: InteractionMode = settings?.interactionMode || 'disperse';
  const activeSpeed = settings?.matrixSpeed || 'normal';
  const activeScanlines = settings?.scanlines || 'subtle';
  const activeClickChangesColor = settings?.clickChangesColor ?? false;

  const [activeThemeNotice, setActiveThemeNotice] = useState<string | null>(null);

  // Mutable refs for high-fps animation loop
  const themeRef = useRef<ColorTheme>(activeColorTheme);
  const modeRef = useRef<InteractionMode>(activeMode);
  const bgEffectRef = useRef<BackgroundEffect>(activeBgEffect);
  const speedRef = useRef(activeSpeed);
  const clickChangesColorRef = useRef(activeClickChangesColor);
  const shockwavesRef = useRef<Shockwave[]>([]);

  useEffect(() => {
    themeRef.current = activeColorTheme;
  }, [activeColorTheme]);

  useEffect(() => {
    modeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    bgEffectRef.current = activeBgEffect;
  }, [activeBgEffect]);

  useEffect(() => {
    speedRef.current = activeSpeed;
  }, [activeSpeed]);

  useEffect(() => {
    clickChangesColorRef.current = activeClickChangesColor;
  }, [activeClickChangesColor]);

  const mousePosRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
  }>({
    x: -999,
    y: -999,
    vx: 0,
    vy: 0,
    active: false,
  });

  const cycleColorTheme = useCallback((sound = true) => {
    const cur = themeRef.current;
    const idx = THEME_CYCLE.indexOf(cur);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    if (sound) {
      cyberAudio.playColorWarp();
    }
    setActiveThemeNotice(COLOR_PALETTES[next].name);
    updateSettings({ colorTheme: next });
  }, [updateSettings]);

  // Notice timer
  useEffect(() => {
    if (activeThemeNotice) {
      const t = setTimeout(() => setActiveThemeNotice(null), 2000);
      return () => clearTimeout(t);
    }
  }, [activeThemeNotice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);

    // Characters pools
    const binaryChars = '01';
    const cyberChars = '01010101αβγ0101λµΩθ01789ABCDEF!#%&*+=:<>~';

    // Particle column state for rain
    interface ColumnData {
      y: number;
      speed: number;
      chars: string[];
      offsetsX: number[];
      offsetsY: number[];
      velocitiesX: number[];
      velocitiesY: number[];
      brightness: number;
    }

    let cols: ColumnData[] = [];

    // Starfield particles state
    interface StarParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      char: string;
    }
    let stars: StarParticle[] = [];

    const initSimulation = () => {
      columns = Math.floor(width / fontSize);
      cols = [];
      const trailLength = 26;
      for (let i = 0; i < columns; i++) {
        const startY = Math.floor(Math.random() * -100);
        const charsArr: string[] = [];
        const offsetsX: number[] = [];
        const offsetsY: number[] = [];
        const vxArr: number[] = [];
        const vyArr: number[] = [];

        for (let k = 0; k < trailLength; k++) {
          charsArr.push(Math.random() > 0.5 ? '1' : '0');
          offsetsX.push(0);
          offsetsY.push(0);
          vxArr.push(0);
          vyArr.push(0);
        }

        cols.push({
          y: startY,
          speed: 0.7 + Math.random() * 0.9,
          chars: charsArr,
          offsetsX,
          offsetsY,
          velocitiesX: vxArr,
          velocitiesY: vyArr,
          brightness: Math.random() > 0.85 ? 1 : 0.65,
        });
      }

      // Init starfield
      stars = [];
      const starCount = Math.floor((width * height) / 12000);
      for (let s = 0; s < starCount; s++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 1 + Math.random() * 2,
          char: Math.random() > 0.5 ? '1' : '0',
        });
      }
    };

    initSimulation();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initSimulation();
    };

    window.addEventListener('resize', handleResize);

    let prevMouseX = -999;
    let prevMouseY = -999;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const vx = prevMouseX !== -999 ? e.clientX - prevMouseX : 0;
      const vy = prevMouseY !== -999 ? e.clientY - prevMouseY : 0;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
        vx,
        vy,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
      prevMouseX = -999;
      prevMouseY = -999;
    };

    const handleWindowPointerDown = (e: MouseEvent) => {
      if (!interactive) return;

      // Do not trigger background effects or color change when clicking interactive UI elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('a') ||
          target.closest('select') ||
          target.closest('[role="button"]') ||
          target.closest('[role="dialog"]') ||
          target.closest('.interactive-clickable') ||
          target.closest('.modal-content'))
      ) {
        return;
      }

      const currentPal = COLOR_PALETTES[themeRef.current] || COLOR_PALETTES.matrix;
      shockwavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.min(width, 420),
        speed: 16,
        opacity: 0.9,
        color: currentPal.glow,
      });

      // Strictly only cycle color if clickChangesColor is explicitly TRUE
      if (clickChangesColorRef.current === true) {
        cycleColorTheme(true);
      } else {
        // Subtle cyber blip feedback without altering background color
        cyberAudio.playLaserBlip();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('pointerdown', handleWindowPointerDown);

    let lastTime = 0;
    const interval = 30;

    const render = (time: number) => {
      if (time - lastTime > interval) {
        lastTime = time;

        const currentTheme = themeRef.current;
        const currentMode = modeRef.current;
        const currentBg = bgEffectRef.current;
        const currentSpd = speedRef.current;
        const pal = COLOR_PALETTES[currentTheme] || COLOR_PALETTES.matrix;
        const speedMultiplier = currentSpd === 'slow' ? 0.6 : currentSpd === 'fast' ? 1.6 : 1.0;
        const mouse = mousePosRef.current;

        // Background clearing
        if (currentBg === 'minimal') {
          ctx.fillStyle = '#020603';
          ctx.fillRect(0, 0, width, height);
          animationFrameId = requestAnimationFrame(render);
          return;
        }

        ctx.fillStyle = 'rgba(3, 7, 4, 0.14)';
        ctx.fillRect(0, 0, width, height);

        // Process Shockwaves
        for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
          const sw = shockwavesRef.current[s];
          sw.radius += sw.speed;
          sw.opacity -= 0.035;

          if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
            shockwavesRef.current.splice(s, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.lineWidth = 2.5;
          ctx.globalAlpha = sw.opacity * 0.7;
          ctx.shadowColor = sw.color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // RENDER EFFECT 1: GRID MESH
        if (currentBg === 'grid') {
          const gridSize = 45;
          ctx.strokeStyle = `${pal.trail}22`;
          ctx.lineWidth = 1;
          for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          if (mouse.active) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
            ctx.fillStyle = `${pal.glow}15`;
            ctx.fill();
            ctx.strokeStyle = pal.glow;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
        // RENDER EFFECT 2: STARFIELD / CONSTELLATIONS
        else if (currentBg === 'starfield') {
          ctx.font = `12px 'JetBrains Mono', monospace`;
          for (let i = 0; i < stars.length; i++) {
            const st = stars[i];
            st.x += st.vx;
            st.y += st.vy;
            if (st.x < 0) st.x = width;
            if (st.x > width) st.x = 0;
            if (st.y < 0) st.y = height;
            if (st.y > height) st.y = 0;

            if (mouse.active) {
              const d = Math.hypot(st.x - mouse.x, st.y - mouse.y);
              if (d < 120) {
                const angle = Math.atan2(st.y - mouse.y, st.x - mouse.x);
                if (currentMode === 'disperse') {
                  st.x += Math.cos(angle) * 3;
                  st.y += Math.sin(angle) * 3;
                } else {
                  st.x -= Math.cos(angle) * 2;
                  st.y -= Math.sin(angle) * 2;
                }
              }
            }

            ctx.fillStyle = pal.trail;
            ctx.fillText(st.char, st.x, st.y);

            // Connect nearby stars with lines
            for (let j = i + 1; j < Math.min(i + 8, stars.length); j++) {
              const st2 = stars[j];
              const dist = Math.hypot(st.x - st2.x, st.y - st2.y);
              if (dist < 85) {
                ctx.beginPath();
                ctx.moveTo(st.x, st.y);
                ctx.lineTo(st2.x, st2.y);
                ctx.strokeStyle = `${pal.trail}${Math.floor((1 - dist / 85) * 40).toString(16).padStart(2, '0')}`;
                ctx.stroke();
              }
            }
          }
        }
        // RENDER EFFECT 3: MATRIX & BINARY RAIN
        else {
          const charsPool = currentBg === 'binary' ? binaryChars : cyberChars;
          const mouseRadius = 140;
          ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

          for (let i = 0; i < cols.length; i++) {
            const col = cols[i];
            const baseX = i * fontSize;
            const headY = col.y * fontSize;

            if (Math.random() > 0.6) {
              const randomIdx = Math.floor(Math.random() * col.chars.length);
              col.chars[randomIdx] = charsPool.charAt(
                Math.floor(Math.random() * charsPool.length)
              );
            }

            for (let k = 0; k < col.chars.length; k++) {
              const char = col.chars[k];
              const charY = headY - k * fontSize;
              if (charY < -fontSize || charY > height + fontSize) continue;

              let posX = baseX + col.offsetsX[k];
              let posY = charY + col.offsetsY[k];

              if (mouse.active) {
                const dx = posX - mouse.x;
                const dy = posY - mouse.y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouseRadius && dist > 1) {
                  const force = 1 - dist / mouseRadius;
                  const angle = Math.atan2(dy, dx);
                  if (currentMode === 'disperse') {
                    const pushStrength = force * 14;
                    col.velocitiesX[k] += Math.cos(angle) * pushStrength;
                    col.velocitiesY[k] += Math.sin(angle) * pushStrength;
                  } else {
                    const pullStrength = force * 10;
                    col.velocitiesX[k] -= Math.cos(angle) * pullStrength;
                    col.velocitiesY[k] -= Math.sin(angle) * pullStrength;
                  }
                }
              }

              // Shockwave physics
              for (let s = 0; s < shockwavesRef.current.length; s++) {
                const sw = shockwavesRef.current[s];
                const distToSw = Math.hypot(posX - sw.x, posY - sw.y);
                if (Math.abs(distToSw - sw.radius) < 25) {
                  const angle = Math.atan2(posY - sw.y, posX - sw.x);
                  col.velocitiesX[k] += Math.cos(angle) * 8;
                  col.velocitiesY[k] += Math.sin(angle) * 8;
                  col.chars[k] = charsPool.charAt(
                    Math.floor(Math.random() * charsPool.length)
                  );
                }
              }

              // Spring dampening
              col.velocitiesX[k] *= 0.82;
              col.velocitiesY[k] *= 0.82;
              col.offsetsX[k] += col.velocitiesX[k];
              col.offsetsY[k] += col.velocitiesY[k];
              col.offsetsX[k] *= 0.92;
              col.offsetsY[k] *= 0.92;

              posX = baseX + col.offsetsX[k];
              posY = charY + col.offsetsY[k];

              const isHead = k === 0;
              const distToMouse = mouse.active ? Math.hypot(posX - mouse.x, posY - mouse.y) : 999;
              const isNearCursor = distToMouse < 90;

              if (isHead) {
                ctx.fillStyle = pal.lead;
                ctx.shadowColor = pal.glow;
                ctx.shadowBlur = 12;
              } else if (isNearCursor) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = pal.spark;
                ctx.shadowBlur = 10;
              } else {
                const alphaFraction = Math.max(0.2, 1 - k / col.chars.length);
                ctx.fillStyle = pal.trail;
                ctx.globalAlpha = alphaFraction * (col.brightness > 0.8 ? 1 : 0.7);
                ctx.shadowColor = pal.glow;
                ctx.shadowBlur = k < 3 ? 5 : 1;
              }

              ctx.fillText(char, posX, posY);
              ctx.globalAlpha = 1;
            }

            col.y += col.speed * speedMultiplier;
            if (col.y * fontSize > height + col.chars.length * fontSize) {
              col.y = -Math.floor(Math.random() * 20);
              col.speed = 0.7 + Math.random() * 0.9;
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerdown', handleWindowPointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive, cycleColorTheme]);

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        {activeScanlines !== 'none' && (
          <div
            className={`absolute inset-0 scanline-overlay pointer-events-none ${
              activeScanlines === 'intense' ? 'opacity-65' : 'opacity-35'
            }`}
          />
        )}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(3,7,4,0.65)_75%,rgba(3,7,4,0.92)_100%] pointer-events-none" />
      </div>

      {/* Floating Quick Settings Dock */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        {activeThemeNotice && (
          <div
            className="px-3 py-1.5 text-xs font-mono rounded bg-[#030905]/95 border shadow-[0_0_15px_rgba(0,255,102,0.4)] transition-all animate-bounce"
            style={{
              borderColor: (COLOR_PALETTES[activeColorTheme] || COLOR_PALETTES.matrix).borderAccent,
              color: (COLOR_PALETTES[activeColorTheme] || COLOR_PALETTES.matrix).borderAccent,
            }}
          >
            Tema: <strong>{activeThemeNotice}</strong>
          </div>
        )}

        <div className="flex items-center gap-2 p-1.5 bg-[#030a05]/90 backdrop-blur-md border border-[#00ff66]/35 rounded-full shadow-[0_0_20px_rgba(0,255,102,0.2)]">
          {/* Open full customizer button */}
          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              onOpenCustomizer?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#00ff66] rounded-full bg-[#051408] border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
            title="Abrir Menú de Personalización (Fuentes, Fondo, Colores)"
          >
            <Sliders className="w-3.5 h-3.5 text-[#39ff14]" />
            <span className="hidden sm:inline font-bold">Personalizar</span>
          </button>

          {/* Color theme quick cycle */}
          <button
            onClick={() => cycleColorTheme(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full bg-[#051408] border border-[#00ff66]/30 hover:border-[#00ff66] transition-colors"
            style={{ color: (COLOR_PALETTES[activeColorTheme] || COLOR_PALETTES.matrix).borderAccent }}
            title="Cambiar paleta de color manual"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-bold">
              {(COLOR_PALETTES[activeColorTheme] || COLOR_PALETTES.matrix).name}
            </span>
          </button>

          {/* Toggle Click Changes Color: NO / SÍ */}
          <button
            onClick={() => {
              const nextVal = !activeClickChangesColor;
              cyberAudio.playLaserBlip();
              updateSettings({ clickChangesColor: nextVal });
              setActiveThemeNotice(
                nextVal
                  ? 'Clic en pantalla: Cambia Color'
                  : 'Clic en pantalla: Color Fijo (No cambia)'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full border transition-all ${
              activeClickChangesColor
                ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#39ff14] shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                : 'bg-[#051408] border-white/20 text-white/60 hover:text-white hover:border-white/40'
            }`}
            title={
              activeClickChangesColor
                ? 'Clic en pantalla: Cambia de color (Haz clic para fijar color y NO cambiar)'
                : 'Clic en pantalla: Color FIJO (NO cambia de color al hacer clic)'
            }
          >
            {activeClickChangesColor ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#39ff14]" />
                <span className="hidden sm:inline">Clic: Cambia</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="hidden sm:inline">Clic: Color Fijo</span>
              </>
            )}
          </button>

          {/* Interaction Mode: Disperse vs Gather */}
          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              updateSettings({
                interactionMode: activeMode === 'disperse' ? 'gather' : 'disperse',
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#00ff66] rounded-full bg-[#051408] border border-[#00ff66]/30 hover:border-[#00ff66] transition-colors"
            title={
              activeMode === 'disperse'
                ? 'Cursor: Dispersar código (clic para Agrupar)'
                : 'Cursor: Agrupar código (clic para Dispersar)'
            }
          >
            {activeMode === 'disperse' ? (
              <>
                <Orbit className="w-3.5 h-3.5 text-[#39ff14]" />
                <span className="hidden sm:inline">Dispersar</span>
              </>
            ) : (
              <>
                <Magnet className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span className="hidden sm:inline">Agrupar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
