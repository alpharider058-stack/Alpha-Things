'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FastForward, Volume2, VolumeX } from 'lucide-react';
import { osAudio } from '@/lib/audio';

interface BootScreenProps {
  onComplete: () => void;
  videoSrc?: string; // Kept for backwards compatibility
}

interface IrregularShape {
  x: number;
  y: number;
  maxRadius: number;
  currentRadius: number;
  growthRate: number;
  vertices: { angle: number; radiusFactor: number }[];
  rotation: number;
  rotSpeed: number;
}

interface GlassShard {
  points: { x: number; y: number }[];
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  scale: number;
  alpha: number;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => osAudio.getMuted());
  const [animStage, setAnimStage] = useState<'filling' | 'shattering' | 'done'>('filling');
  const animFrameRef = useRef<number | null>(null);
  const completedRef = useRef<boolean>(false);

  const handleFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    osAudio.playGlassShatter();
    handleFinish();
  }, [handleFinish]);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(osAudio.toggleMute());
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Audio cue on start
    osAudio.playWhiteFillRise();

    // 1. Setup Irregular White Shapes that will fill the screen
    const shapes: IrregularShape[] = [];
    const totalShapes = 45;

    const createShape = (x: number, y: number, maxR: number): IrregularShape => {
      const numVerts = Math.floor(Math.random() * 4) + 5; // 5 to 8 vertices
      const vertices: { angle: number; radiusFactor: number }[] = [];
      const angleStep = (Math.PI * 2) / numVerts;

      for (let i = 0; i < numVerts; i++) {
        const baseAngle = i * angleStep;
        const jitter = (Math.random() - 0.5) * 0.45;
        const radiusFactor = 0.55 + Math.random() * 0.75;
        vertices.push({
          angle: baseAngle + jitter,
          radiusFactor,
        });
      }

      return {
        x,
        y,
        maxRadius: maxR,
        currentRadius: 2,
        growthRate: Math.random() * 22 + 18,
        vertices,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      };
    };

    // Pre-populate initial shapes across grid with random offsets
    const cols = 6;
    const rows = 4;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = (c + 0.5) * (width / cols) + (Math.random() - 0.5) * (width / cols) * 0.7;
        const y = (r + 0.5) * (height / rows) + (Math.random() - 0.5) * (height / rows) * 0.7;
        const maxR = Math.max(width, height) * 0.55;
        shapes.push(createShape(x, y, maxR));
      }
    }

    // Add extra center focal shapes
    for (let i = 0; i < 15; i++) {
      shapes.push(
        createShape(
          width * 0.5 + (Math.random() - 0.5) * width * 0.6,
          height * 0.5 + (Math.random() - 0.5) * height * 0.6,
          Math.max(width, height) * 0.65
        )
      );
    }

    // 2. Setup Glass Shards for screen shattering
    let shards: GlassShard[] = [];
    let crackLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    let shatterStartTime = 0;
    let shatterTriggered = false;

    const generateShards = (cx: number, cy: number) => {
      const generated: GlassShard[] = [];
      const gridX = 10;
      const gridY = 8;
      const cellW = width / gridX;
      const cellH = height / gridY;

      // Generate fracture grid vertices with jitter
      const verts: { x: number; y: number }[][] = [];
      for (let i = 0; i <= gridY; i++) {
        verts[i] = [];
        for (let j = 0; j <= gridX; j++) {
          const jitterX = i === 0 || i === gridY || j === 0 || j === gridX ? 0 : (Math.random() - 0.5) * cellW * 0.9;
          const jitterY = i === 0 || i === gridY || j === 0 || j === gridX ? 0 : (Math.random() - 0.5) * cellH * 0.9;
          verts[i][j] = {
            x: j * cellW + jitterX,
            y: i * cellH + jitterY,
          };
        }
      }

      // Generate crack lines radiating from impact point
      crackLines = [];
      for (let i = 0; i < 16; i++) {
        const rad = Math.max(width, height);
        const ang = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        crackLines.push({
          x1: cx,
          y1: cy,
          x2: cx + Math.cos(ang) * rad,
          y2: cy + Math.sin(ang) * rad,
        });
      }

      // Create triangular shards from grid
      for (let i = 0; i < gridY; i++) {
        for (let j = 0; j < gridX; j++) {
          const p1 = verts[i][j];
          const p2 = verts[i][j + 1];
          const p3 = verts[i + 1][j + 1];
          const p4 = verts[i + 1][j];

          // Triangle 1: p1, p2, p3
          const c1x = (p1.x + p2.x + p3.x) / 3;
          const c1y = (p1.y + p2.y + p3.y) / 3;
          const dist1 = Math.hypot(c1x - cx, c1y - cy) || 1;
          const speed1 = 8 + Math.random() * 22;

          generated.push({
            points: [
              { x: p1.x - c1x, y: p1.y - c1y },
              { x: p2.x - c1x, y: p2.y - c1y },
              { x: p3.x - c1x, y: p3.y - c1y },
            ],
            cx: c1x,
            cy: c1y,
            vx: ((c1x - cx) / dist1) * speed1 + (Math.random() - 0.5) * 6,
            vy: ((c1y - cy) / dist1) * speed1 + (Math.random() - 0.5) * 6 - 2,
            rot: 0,
            vRot: (Math.random() - 0.5) * 0.18,
            scale: 1,
            alpha: 1,
          });

          // Triangle 2: p1, p3, p4
          const c2x = (p1.x + p3.x + p4.x) / 3;
          const c2y = (p1.y + p3.y + p4.y) / 3;
          const dist2 = Math.hypot(c2x - cx, c2y - cy) || 1;
          const speed2 = 8 + Math.random() * 22;

          generated.push({
            points: [
              { x: p1.x - c2x, y: p1.y - c2y },
              { x: p3.x - c2x, y: p3.y - c2y },
              { x: p4.x - c2x, y: p4.y - c2y },
            ],
            cx: c2x,
            cy: c2y,
            vx: ((c2x - cx) / dist2) * speed2 + (Math.random() - 0.5) * 6,
            vy: ((c2y - cy) / dist2) * speed2 + (Math.random() - 0.5) * 6 - 2,
            rot: 0,
            vRot: (Math.random() - 0.5) * 0.18,
            scale: 1,
            alpha: 1,
          });
        }
      }

      return generated;
    };

    const startTime = performance.now();
    const fillDuration = 2400; // 2.4 seconds to completely flood screen with irregular white shapes
    const shatterDuration = 1200; // 1.2s for glass shatter explosion

    const render = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < fillDuration) {
        // --- PHASE 1: FILLING WITH IRREGULAR WHITE SHAPES ---
        // Clear background to pure black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        const progress = Math.min(1, elapsed / fillDuration);
        // Exponential acceleration for aggressive flooding towards end
        const easeGrowth = Math.pow(progress, 1.8);

        // Draw irregular white shapes
        ctx.fillStyle = '#ffffff';

        for (const shape of shapes) {
          shape.currentRadius = Math.min(shape.maxRadius, shape.currentRadius + shape.growthRate * (1 + easeGrowth * 4));
          shape.rotation += shape.rotSpeed;

          ctx.save();
          ctx.translate(shape.x, shape.y);
          ctx.rotate(shape.rotation);

          ctx.beginPath();
          for (let i = 0; i < shape.vertices.length; i++) {
            const v = shape.vertices[i];
            const r = shape.currentRadius * v.radiusFactor;
            const vx = Math.cos(v.angle) * r;
            const vy = Math.sin(v.angle) * r;
            if (i === 0) {
              ctx.moveTo(vx, vy);
            } else {
              ctx.lineTo(vx, vy);
            }
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Near 90% progress, bridge remaining gaps with high-speed white flood
        if (progress > 0.85) {
          const floodAlpha = (progress - 0.85) / 0.15;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, floodAlpha * 1.2)})`;
          ctx.fillRect(0, 0, width, height);
        }

        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // --- PHASE 2: SCREEN CRACKS & SHATTERS (SE ROMPE LA PANTALLA) ---
        if (!shatterTriggered) {
          shatterTriggered = true;
          shatterStartTime = now;
          setAnimStage('shattering');
          osAudio.playGlassShatter();
          shards = generateShards(width * 0.5, height * 0.48);
        }

        const shatterElapsed = now - shatterStartTime;
        const shatterProgress = Math.min(1, shatterElapsed / shatterDuration);

        // Clear with transparent void so welcome screen underneath starts shining through
        ctx.clearRect(0, 0, width, height);

        // Draw radial cracks for the initial 200ms
        if (shatterElapsed < 300) {
          const crackAlpha = 1 - shatterElapsed / 300;
          ctx.strokeStyle = `rgba(30, 41, 59, ${crackAlpha * 0.9})`;
          ctx.lineWidth = 2.5;
          for (const line of crackLines) {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
          }
        }

        // Physics update and render glass shards
        for (const shard of shards) {
          shard.cx += shard.vx;
          shard.cy += shard.vy;
          shard.vy += 0.45; // Gravity
          shard.rot += shard.vRot;
          shard.scale = Math.max(0, 1 - shatterProgress * 0.4);
          shard.alpha = Math.max(0, 1 - Math.pow(shatterProgress, 1.4));

          if (shard.alpha <= 0.01) continue;

          ctx.save();
          ctx.translate(shard.cx, shard.cy);
          ctx.rotate(shard.rot);
          ctx.scale(shard.scale, shard.scale);

          ctx.beginPath();
          for (let pIdx = 0; pIdx < shard.points.length; pIdx++) {
            const p = shard.points[pIdx];
            if (pIdx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();

          // Glass shard body: luminous white with subtle opacity
          ctx.fillStyle = `rgba(255, 255, 255, ${shard.alpha})`;
          ctx.fill();

          // Sharp glass edge refraction
          ctx.strokeStyle = `rgba(180, 210, 255, ${shard.alpha * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.restore();
        }

        if (shatterProgress < 1) {
          animFrameRef.current = requestAnimationFrame(render);
        } else {
          setAnimStage('done');
          handleFinish();
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [handleFinish]);

  return (
    <div
      onClick={handleSkip}
      className="fixed inset-0 z-50 bg-black cursor-pointer select-none overflow-hidden"
      title="Haz clic o pulsa Esc para continuar"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Floating HUD Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={handleToggleMute}
          className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition-all shadow-lg"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isMuted ? 'Silencio' : 'Sonido'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-all font-medium shadow-lg"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Omitir [Clic]</span>
        </button>
      </div>

      {/* Subtle indicator hint */}
      {animStage === 'filling' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-mono tracking-widest text-white/40 pointer-events-none uppercase">
          Classroom OS • Inicializando
        </div>
      )}
    </div>
  );
}
