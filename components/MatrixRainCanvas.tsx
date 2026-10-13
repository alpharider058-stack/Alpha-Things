'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cyberAudio } from '@/lib/audio';
import { Magnet, Orbit, Palette, Sparkles, Binary } from 'lucide-react';

export type MatrixColorTheme = 'matrix' | 'cyan' | 'amber' | 'purple' | 'crimson' | 'chromatic';
export type InteractionMode = 'disperse' | 'gather';

interface MatrixRainCanvasProps {
  binaryOnly?: boolean;
  opacity?: number;
  interactive?: boolean;
}

interface ColorPalette {
  name: string;
  lead: string;
  trail: string;
  glow: string;
  spark: string;
  borderAccent: string;
}

const COLOR_PALETTES: Record<MatrixColorTheme, ColorPalette> = {
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
  amber: {
    name: 'Ámbar Hacker',
    lead: '#ffffff',
    trail: '#ffb703',
    glow: '#fb8500',
    spark: '#fef08a',
    borderAccent: '#ffb703',
  },
  purple: {
    name: 'Neón Violeta',
    lead: '#ffffff',
    trail: '#d946ef',
    glow: '#a855f7',
    spark: '#f5d0fe',
    borderAccent: '#d946ef',
  },
  crimson: {
    name: 'Carmesí Alerta',
    lead: '#ffffff',
    trail: '#ff0055',
    glow: '#ef4444',
    spark: '#fecaca',
    borderAccent: '#ff0055',
  },
  chromatic: {
    name: 'Cromático RGB',
    lead: '#ffffff',
    trail: '#00ff66',
    glow: '#00f0ff',
    spark: '#ffffff',
    borderAccent: '#00f0ff',
  },
};

const THEME_CYCLE: MatrixColorTheme[] = ['matrix', 'cyan', 'amber', 'purple', 'crimson', 'chromatic'];

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
  binaryOnly = false,
  opacity = 0.88,
  interactive = true,
}: MatrixRainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States for user controls
  const [colorTheme, setColorTheme] = useState<MatrixColorTheme>('matrix');
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('disperse');
  const [isBinaryMode, setIsBinaryMode] = useState<boolean>(binaryOnly);
  const [activeThemeNotice, setActiveThemeNotice] = useState<string | null>(null);

  // Mutable refs for high-fps loop access
  const themeRef = useRef<MatrixColorTheme>('matrix');
  const modeRef = useRef<InteractionMode>('disperse');
  const binaryModeRef = useRef<boolean>(binaryOnly);
  const shockwavesRef = useRef<Shockwave[]>([]);

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

  // Keep refs synchronized without writing during render
  useEffect(() => {
    themeRef.current = colorTheme;
  }, [colorTheme]);

  useEffect(() => {
    modeRef.current = interactionMode;
  }, [interactionMode]);

  useEffect(() => {
    binaryModeRef.current = isBinaryMode;
  }, [isBinaryMode]);

  // Cycle color function
  const cycleColorTheme = useCallback((sound = true) => {
    setColorTheme((prev) => {
      const idx = THEME_CYCLE.indexOf(prev);
      const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      if (sound) {
        cyberAudio.playColorWarp();
      }
      setActiveThemeNotice(COLOR_PALETTES[next].name);
      return next;
    });
  }, []);

  // Clear notice after 2s
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

    // Characters definition
    const binaryChars = '01';
    const cyberChars = '01010101αβγ0101λµΩθ01789ABCDEF!#%&*+=:<>~';

    // Particle column state
    interface ColumnData {
      y: number;
      speed: number;
      chars: string[];
      offsetsX: number[];
      offsetsY: number[];
      velocitiesX: number[];
      velocitiesY: number[];
      brightness: number;
      hue: number;
    }

    let cols: ColumnData[] = [];

    const initCols = () => {
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
          hue: (i / columns) * 360,
        });
      }
    };

    initCols();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initCols();
    };

    window.addEventListener('resize', handleResize);

    // Mouse movement listener
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

    // Click anywhere listener: creates shockwave + color shift + physics burst!
    const handleWindowPointerDown = (e: MouseEvent) => {
      if (!interactive) return;

      // Create shockwave expanding ripple at click position
      const currentPal = COLOR_PALETTES[themeRef.current];
      shockwavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.min(width, 420),
        speed: 16,
        opacity: 0.9,
        color: currentPal.glow,
      });

      // Shift to next color theme
      cycleColorTheme(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('pointerdown', handleWindowPointerDown);

    let lastTime = 0;
    const interval = 30; // ~33fps smooth animation

    const render = (time: number) => {
      if (time - lastTime > interval) {
        lastTime = time;

        const currentTheme = themeRef.current;
        const currentMode = modeRef.current;
        const currentBinary = binaryModeRef.current;
        const pal = COLOR_PALETTES[currentTheme];
        const charsPool = currentBinary ? binaryChars : cyberChars;

        // Background dark fade trail
        ctx.fillStyle = 'rgba(3, 7, 4, 0.13)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px 'JetBrains Mono', 'Share Tech Mono', monospace`;

        const mouse = mousePosRef.current;
        const mouseRadius = 140; // interaction radius

        // 1. Process Shockwaves
        for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
          const sw = shockwavesRef.current[s];
          sw.radius += sw.speed;
          sw.opacity -= 0.035;

          if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
            shockwavesRef.current.splice(s, 1);
            continue;
          }

          // Draw visual shockwave ring
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

        // 2. Render each column & calculate physical reaction
        for (let i = 0; i < cols.length; i++) {
          const col = cols[i];
          const baseX = i * fontSize;
          const headY = col.y * fontSize;

          // Occasionally randomize trail character
          if (Math.random() > 0.6) {
            const randomIdx = Math.floor(Math.random() * col.chars.length);
            col.chars[randomIdx] = charsPool.charAt(
              Math.floor(Math.random() * charsPool.length)
            );
          }

          // Draw trailing characters in this column
          for (let k = 0; k < col.chars.length; k++) {
            const char = col.chars[k];
            const charY = headY - k * fontSize;

            // Don't draw if outside vertical screen
            if (charY < -fontSize || charY > height + fontSize) continue;

            // Physics calculation for interactive cursor reaction
            let posX = baseX + col.offsetsX[k];
            let posY = charY + col.offsetsY[k];

            if (mouse.active) {
              const dx = posX - mouse.x;
              const dy = posY - mouse.y;
              const dist = Math.hypot(dx, dy);

              if (dist < mouseRadius && dist > 1) {
                // Interactive displacement: Disperse vs Gather
                const force = (1 - dist / mouseRadius);
                const angle = Math.atan2(dy, dx);

                if (currentMode === 'disperse') {
                  // Push away from cursor
                  const pushStrength = force * 14;
                  col.velocitiesX[k] += Math.cos(angle) * pushStrength;
                  col.velocitiesY[k] += Math.sin(angle) * pushStrength;
                } else {
                  // Gather / attract towards cursor
                  const pullStrength = force * 10;
                  col.velocitiesX[k] -= Math.cos(angle) * pullStrength;
                  col.velocitiesY[k] -= Math.sin(angle) * pullStrength;
                }
              }
            }

            // Shockwave interaction: displace characters on shockwave front
            for (let s = 0; s < shockwavesRef.current.length; s++) {
              const sw = shockwavesRef.current[s];
              const distToSw = Math.hypot(posX - sw.x, posY - sw.y);
              if (Math.abs(distToSw - sw.radius) < 25) {
                // Front explosion
                const angle = Math.atan2(posY - sw.y, posX - sw.x);
                col.velocitiesX[k] += Math.cos(angle) * 8;
                col.velocitiesY[k] += Math.sin(angle) * 8;
                col.chars[k] = charsPool.charAt(
                  Math.floor(Math.random() * charsPool.length)
                );
              }
            }

            // Spring return physics
            col.velocitiesX[k] *= 0.82;
            col.velocitiesY[k] *= 0.82;
            col.offsetsX[k] += col.velocitiesX[k];
            col.offsetsY[k] += col.velocitiesY[k];

            // Attenuate offset back to natural column
            col.offsetsX[k] *= 0.92;
            col.offsetsY[k] *= 0.92;

            posX = baseX + col.offsetsX[k];
            posY = charY + col.offsetsY[k];

            // Color calculation based on position & theme
            const isHead = k === 0;
            const distToMouse = mouse.active ? Math.hypot(posX - mouse.x, posY - mouse.y) : 999;
            const isNearCursor = distToMouse < 90;

            if (isHead) {
              // Glowing leading tip
              ctx.fillStyle = pal.lead;
              ctx.shadowColor = pal.glow;
              ctx.shadowBlur = 12;
            } else if (isNearCursor) {
              // Ultra neon highlight near cursor
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = pal.spark;
              ctx.shadowBlur = 10;
            } else if (currentTheme === 'chromatic') {
              // Chromatic mode: rainbow hue per column
              const h = (col.hue + (k * 8)) % 360;
              ctx.fillStyle = `hsl(${h}, 100%, ${65 - k * 1.5}%)`;
              ctx.shadowColor = `hsl(${h}, 100%, 50%)`;
              ctx.shadowBlur = 4;
            } else {
              // Standard themed tail fade
              const alphaFraction = Math.max(0.2, 1 - k / col.chars.length);
              ctx.fillStyle = pal.trail;
              ctx.globalAlpha = alphaFraction * (col.brightness > 0.8 ? 1 : 0.7);
              ctx.shadowColor = pal.glow;
              ctx.shadowBlur = k < 3 ? 5 : 1;
            }

            ctx.fillText(char, posX, posY);
            ctx.globalAlpha = 1;
          }

          // Move head drop downwards
          col.y += col.speed;

          // Reset column when it goes completely off screen
          if (col.y * fontSize > height + col.chars.length * fontSize) {
            col.y = -Math.floor(Math.random() * 20);
            col.speed = 0.7 + Math.random() * 0.9;
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
      {/* Background Canvas */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        {/* Subtle CRT Scanlines */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-35" />
        {/* Radial Matrix Vignette */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(3,7,4,0.65)_75%,rgba(3,7,4,0.92)_100%] pointer-events-none" />
      </div>

      {/* Interactive Controls Overlay Toolbar (Floating bottom right) */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Active Theme Toast Notification */}
        {activeThemeNotice && (
          <div
            className="px-3 py-1.5 text-xs font-mono rounded bg-[#030905]/95 border shadow-[0_0_15px_rgba(0,255,102,0.4)] transition-all animate-bounce"
            style={{
              borderColor: COLOR_PALETTES[colorTheme].borderAccent,
              color: COLOR_PALETTES[colorTheme].borderAccent,
            }}
          >
            Tema de Color: <strong>{activeThemeNotice}</strong>
          </div>
        )}

        <div className="flex items-center gap-2 p-1.5 bg-[#030a05]/90 backdrop-blur-md border border-[#00ff66]/35 rounded-full shadow-[0_0_20px_rgba(0,255,102,0.2)]">
          {/* Color theme cycle button */}
          <button
            onClick={() => cycleColorTheme(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full bg-[#051408] border border-[#00ff66]/30 hover:border-[#00ff66] transition-colors"
            style={{ color: COLOR_PALETTES[colorTheme].borderAccent }}
            title="Haz clic aquí o en cualquier parte de la pantalla para cambiar el color del código"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-bold">
              {COLOR_PALETTES[colorTheme].name}
            </span>
          </button>

          {/* Interaction Mode: Disperse vs Gather */}
          <button
            onClick={() => {
              cyberAudio.playLaserBlip();
              setInteractionMode((prev) => (prev === 'disperse' ? 'gather' : 'disperse'));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#00ff66] rounded-full bg-[#051408] border border-[#00ff66]/30 hover:border-[#00ff66] transition-colors"
            title={
              interactionMode === 'disperse'
                ? 'Modo: Dispersión al mover el ratón (clic para cambiar a Agrupamiento)'
                : 'Modo: Agrupamiento al mover el ratón (clic para cambiar a Dispersión)'
            }
          >
            {interactionMode === 'disperse' ? (
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

          {/* Binary only vs Cyber Runes Mode */}
          <button
            onClick={() => {
              cyberAudio.playBeep(650, 0.05, 'triangle');
              setIsBinaryMode((prev) => !prev);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#a5f3cf] rounded-full bg-[#051408] border border-[#00ff66]/30 hover:border-[#00ff66] transition-colors"
            title="Alternar entre modo binario puro (0 y 1) o glifos cibernéticos"
          >
            {isBinaryMode ? (
              <>
                <Binary className="w-3.5 h-3.5 text-[#39ff14]" />
                <span className="hidden sm:inline">0 / 1</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span className="hidden sm:inline">Matrix</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
