'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Cpu,
  Wifi,
  Plus,
  Trash2,
  X,
  Sparkles,
  RotateCw,
} from 'lucide-react';
import { osAudio } from '@/lib/audio';
import { useCustomization, WidgetId } from '@/lib/customization';

interface DesktopWidgetsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
}

const ALL_WIDGET_CONFIG: { id: WidgetId; name: string }[] = [
  { id: 'clock', name: 'Reloj & Clima' },
  { id: 'pomodoro', name: 'Temporizador Focus' },
  { id: 'tasks', name: 'Tareas del Día' },
  { id: 'performance', name: 'Monitor de Sistema' },
];

export function DesktopWidgets({ isOpen, onClose }: DesktopWidgetsProps) {
  const { settings, updateCustomization } = useCustomization();
  const enabledWidgets = useMemo(
    () => settings.enabledWidgets || ['clock', 'pomodoro', 'tasks', 'performance'],
    [settings.enabledWidgets]
  );

  // Clock state
  const [time, setTime] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  // Pomodoro state
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState<boolean>(false);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('classroom_os_widgets_tasks');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [
      { id: '1', text: 'Repasar apuntes de Biología', done: true },
      { id: '2', text: 'Entregar práctica en Mantle', done: false },
      { id: '3', text: 'Descanso de 5 minutos', done: false },
    ];
  });
  const [newTaskText, setNewTaskText] = useState<string>('');

  // Performance telemetry state
  const [cpuLoad, setCpuLoad] = useState<number>(24);
  const [ramLoad, setRamLoad] = useState<number>(42);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clock interval
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setSeconds(String(now.getSeconds()).padStart(2, '0'));
      setDateStr(
        now.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro timer interval
  useEffect(() => {
    if (!isPomoRunning) return;
    const interval = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          setIsPomoRunning(false);
          osAudio.playWindowOpen();
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPomoRunning]);

  // Save tasks
  useEffect(() => {
    try {
      localStorage.setItem('classroom_os_widgets_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // Performance canvas animation
  useEffect(() => {
    if (!isOpen || !enabledWidgets.includes('performance')) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const history: number[] = Array.from({ length: 40 }, () => Math.random() * 20 + 15);

    const interval = setInterval(() => {
      const nextCpu = Math.floor(Math.random() * 25 + 18);
      const nextRam = Math.floor(Math.random() * 6 + 40);
      setCpuLoad(nextCpu);
      setRamLoad(nextRam);
      history.shift();
      history.push(nextCpu);
    }, 1400);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 10; y < h; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw graph line
      ctx.beginPath();
      const step = w / (history.length - 1);
      history.forEach((val, i) => {
        const x = i * step;
        const y = h - (val / 100) * (h - 8);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fill area under line
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, enabledWidgets]);

  const removeWidget = (id: WidgetId) => {
    osAudio.playClick(600, 0.03);
    const next = enabledWidgets.filter((w) => w !== id);
    updateCustomization({ enabledWidgets: next });
  };

  const restoreWidget = (id: WidgetId) => {
    osAudio.playClick(850, 0.03);
    if (!enabledWidgets.includes(id)) {
      updateCustomization({ enabledWidgets: [...enabledWidgets, id] });
    }
  };

  const restoreAllWidgets = () => {
    osAudio.playClick(900, 0.04);
    updateCustomization({
      enabledWidgets: ['clock', 'pomodoro', 'tasks', 'performance'],
    });
  };

  const toggleTask = (id: string) => {
    osAudio.playClick(800, 0.03);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    osAudio.playClick(900, 0.03);
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newTaskText.trim(), done: false },
    ]);
    setNewTaskText('');
  };

  const deleteTask = (id: string) => {
    osAudio.playClick(600, 0.03);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const formatPomo = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const removedWidgets = ALL_WIDGET_CONFIG.filter((w) => !enabledWidgets.includes(w.id));

  return (
    <motion.aside
      initial={{ x: 340, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 340, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="fixed top-12 right-4 z-20 w-80 max-h-[calc(100vh-120px)] overflow-y-auto space-y-3 select-none pointer-events-auto pr-0.5"
    >
      {/* Top panel control bar */}
      <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-white/50">
        <span className="font-semibold text-white/70 uppercase tracking-wider text-[10px]">
          Widgets de Escritorio
        </span>
        <button
          onClick={onClose}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          title="Ocultar barra de widgets"
        >
          <span>Ocultar barra</span>
        </button>
      </div>

      {/* AnimatePresence for smooth removal when clicking the cross */}
      <AnimatePresence mode="popLayout">
        {/* Widget 1: Digital Clock & Weather Glass */}
        {enabledWidgets.includes('clock') && (
          <motion.div
            key="widget-clock"
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.2 }}
            className="liquid-glass rounded-3xl p-4.5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group"
          >
            {/* Cruz para eliminar widget */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeWidget('clock');
              }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/35 hover:border-rose-400 transition-all duration-200 cursor-pointer flex items-center justify-center z-20 shadow-md group/xbtn"
              title="Eliminar este widget"
              aria-label="Eliminar widget Reloj"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover/xbtn:scale-110" />
            </button>

            <div className="flex items-baseline justify-between mb-1 pr-7">
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-4xl font-bold tracking-tight text-white drop-shadow">
                  {time || '12:00'}
                </span>
                <span className="text-xs font-semibold text-white/50 tracking-wider">
                  {seconds || '00'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[var(--accent-color)] border border-white/10 font-bold uppercase">
                En vivo
              </span>
            </div>

            <p className="text-xs text-white/80 capitalize font-medium mb-3">
              {dateStr}
            </p>

            <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-[11px] text-white/70">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Classroom OS Pro</span>
              </span>
              <span className="font-mono text-white/90">21°C · Despejado</span>
            </div>
          </motion.div>
        )}

        {/* Widget 2: Pomodoro Focus Timer */}
        {enabledWidgets.includes('pomodoro') && (
          <motion.div
            key="widget-pomodoro"
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.2 }}
            className="liquid-glass rounded-3xl p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group"
          >
            {/* Cruz para eliminar widget */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeWidget('pomodoro');
              }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/35 hover:border-rose-400 transition-all duration-200 cursor-pointer flex items-center justify-center z-20 shadow-md group/xbtn"
              title="Eliminar este widget"
              aria-label="Eliminar widget Pomodoro"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover/xbtn:scale-110" />
            </button>

            <div className="flex items-center justify-between mb-2.5 pr-7">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Clock className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Temporizador Focus</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">25 MIN</span>
            </div>

            <div className="flex items-center justify-between py-1 mb-2">
              <span className="text-3xl font-mono font-bold tracking-wider text-white">
                {formatPomo(pomodoroSeconds)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    osAudio.playClick(isPomoRunning ? 600 : 850, 0.03);
                    setIsPomoRunning(!isPomoRunning);
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    isPomoRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-[var(--accent-color)] text-slate-950 font-bold shadow-lg hover:brightness-110'
                  }`}
                  title={isPomoRunning ? 'Pausar' : 'Iniciar'}
                >
                  {isPomoRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    osAudio.playClick(700, 0.03);
                    setIsPomoRunning(false);
                    setPomodoroSeconds(25 * 60);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[var(--accent-color)] transition-all duration-500 shadow-[0_0_8px_var(--accent-glow)]"
                style={{ width: `${((25 * 60 - pomodoroSeconds) / (25 * 60)) * 100}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Widget 3: Quick Tasks / Checklist */}
        {enabledWidgets.includes('tasks') && (
          <motion.div
            key="widget-tasks"
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.2 }}
            className="liquid-glass rounded-3xl p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group"
          >
            {/* Cruz para eliminar widget */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeWidget('tasks');
              }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/35 hover:border-rose-400 transition-all duration-200 cursor-pointer flex items-center justify-center z-20 shadow-md group/xbtn"
              title="Eliminar este widget"
              aria-label="Eliminar widget Tareas"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover/xbtn:scale-110" />
            </button>

            <div className="flex items-center justify-between mb-2.5 pr-7">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tareas del Día</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">
                {tasks.filter((t) => t.done).length}/{tasks.length}
              </span>
            </div>

            {/* Tasks list */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2.5 pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer group/item ${
                    task.done ? 'bg-white/5 text-white/40' : 'bg-white/5 hover:bg-white/10 text-white/90'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden pr-1">
                    {task.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-white/40 group-hover/item:text-white flex-shrink-0" />
                    )}
                    <span className={`text-[11px] truncate ${task.done ? 'line-through' : ''}`}>
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="opacity-0 group-hover/item:opacity-100 p-1 text-white/40 hover:text-rose-400 transition-all cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new task input */}
            <form onSubmit={addTask} className="flex items-center gap-1.5">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Añadir nueva tarea..."
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-color)]"
              />
              <button
                type="submit"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* Widget 4: Telemetría & Monitor de Rendimiento con Canvas */}
        {enabledWidgets.includes('performance') && (
          <motion.div
            key="widget-performance"
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.2 }}
            className="liquid-glass rounded-3xl p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group"
          >
            {/* Cruz para eliminar widget */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeWidget('performance');
              }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/35 hover:border-rose-400 transition-all duration-200 cursor-pointer flex items-center justify-center z-20 shadow-md group/xbtn"
              title="Eliminar este widget"
              aria-label="Eliminar widget Monitor"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover/xbtn:scale-110" />
            </button>

            <div className="flex items-center justify-between mb-2 pr-7">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
                <span>Monitor de Sistema</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
                <span>CPU {cpuLoad}%</span>
                <span>RAM {ramLoad}%</span>
              </div>
            </div>

            {/* Real-time Canvas Graph */}
            <div className="relative w-full h-16 rounded-xl bg-black/40 border border-white/10 overflow-hidden mb-2">
              <canvas
                ref={canvasRef}
                width={300}
                height={64}
                className="w-full h-full block"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-400" /> WebAssembly 60 FPS
              </span>
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-400" /> Latencia 28ms
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State if all widgets were removed */}
      {enabledWidgets.length === 0 && (
        <div className="liquid-glass rounded-3xl p-6 border border-white/10 text-center space-y-3">
          <p className="text-xs text-white/70">No hay widgets activos en el escritorio.</p>
          <button
            onClick={restoreAllWidgets}
            className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
          >
            Restaurar todos los widgets
          </button>
        </div>
      )}

      {/* Restore individual widgets if any was removed */}
      {removedWidgets.length > 0 && enabledWidgets.length > 0 && (
        <div className="liquid-glass rounded-2xl p-2.5 border border-white/10 space-y-1.5">
          <p className="text-[10px] text-white/50 px-1 font-semibold uppercase tracking-wider">
            Widgets eliminados:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {removedWidgets.map((w) => (
              <button
                key={w.id}
                onClick={() => restoreWidget(w.id)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer border border-white/10"
              >
                <Plus className="w-3 h-3 text-[var(--accent-color)]" />
                <span>{w.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
