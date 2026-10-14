'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  ChevronUp,
  UserPlus,
  LogIn,
  KeyRound,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth, AVATAR_OPTIONS } from '@/context/AuthContext';
import { osAudio } from '@/lib/audio';

interface LockScreenProps {
  onUnlocked: () => void;
  isLocked: boolean;
}

export function LockScreen({ onUnlocked, isLocked }: LockScreenProps) {
  const { user, isAuthenticated, login, register, loginAsDemo } = useAuth();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isSlidingUp, setIsSlidingUp] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => osAudio.getMuted());

  // Form states for login/register
  const [showAuthForm, setShowAuthForm] = useState<boolean>(() => !isAuthenticated);
  const [authMode, setAuthMode] = useState<'login' | 'register'>(() => {
    if (typeof window === 'undefined') return 'register';
    try {
      const raw = localStorage.getItem('alpha_things_accounts_v1');
      const accounts = raw ? JSON.parse(raw) : [];
      return accounts.length > 0 ? 'login' : 'register';
    } catch {
      return 'register';
    }
  });
  const [username, setUsername] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const raw = localStorage.getItem('alpha_things_accounts_v1');
      const accounts = raw ? JSON.parse(raw) : [];
      return accounts.length > 0 ? accounts[0].profile.username || '' : '';
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('⚡');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      const formattedDate = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      setDateStr(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSlideUp = useCallback(() => {
    if (isSlidingUp) return;
    if (!isAuthenticated) {
      // Must login or register first
      setShowAuthForm(true);
      return;
    }
    osAudio.playUnlock();
    setIsSlidingUp(true);
  }, [isSlidingUp, isAuthenticated]);

  // Spacebar trigger to slide up
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input or textarea, don't trigger slide
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleSlideUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSlideUp]);

  // Handle Form Submission
  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (authMode === 'register') {
        if (!username.trim() || !password.trim()) {
          setErrorMessage('Por favor introduce nombre de usuario y contraseña.');
          setIsSubmitting(false);
          return;
        }
        const userEmail = email.trim() || `${username.trim().toLowerCase()}@classroom.os`;
        const res = await register(username.trim(), userEmail, password, selectedAvatar);
        if (res.success) {
          osAudio.playUnlock();
          setShowAuthForm(false);
          // Directly unlock and slide up on creation
          setTimeout(() => {
            setIsSlidingUp(true);
          }, 300);
        } else {
          setErrorMessage(res.error || 'Error al crear la cuenta.');
        }
      } else {
        const res = await login(username.trim(), password);
        if (res.success) {
          osAudio.playUnlock();
          setShowAuthForm(false);
          setTimeout(() => {
            setIsSlidingUp(true);
          }, 300);
        } else {
          setErrorMessage(res.error || 'Contraseña incorrecta.');
        }
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    setShowAuthForm(false);
    osAudio.playUnlock();
    setTimeout(() => {
      setIsSlidingUp(true);
    }, 200);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(osAudio.toggleMute());
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ y: 0 }}
      animate={{ y: isSlidingUp ? '-100%' : 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (isSlidingUp) {
          onUnlocked();
        }
      }}
      onClick={(e) => {
        // If clicking background and authenticated, slide up!
        const target = e.target as HTMLElement;
        if (!target.closest('form') && !target.closest('button') && isAuthenticated) {
          handleSlideUp();
        }
      }}
      className="fixed inset-0 z-40 bg-[#080a11] text-white flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden cursor-default"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(20, 24, 40, 0.9) 0%, rgba(8, 10, 17, 0.98) 100%)`,
      }}
    >
      {/* Liquid Glass Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[15%] w-[550px] h-[550px] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Top Status Bar (Liquid Glass) */}
      <header className="relative z-10 w-full flex items-center justify-between text-xs text-white/70">
        <div className="flex items-center gap-2">
          <Image
            src="/classroom-logo.svg"
            alt="Classroom"
            width={18}
            height={18}
            className="opacity-90"
          />
          <span className="font-medium tracking-wide text-white/90">Classroom OS</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-mono text-emerald-400/90">5G Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono">100%</span>
            <Battery className="w-4 h-4 text-white/90" />
          </div>
        </div>
      </header>

      {/* Center Display: Time & User Auth Card */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md mx-auto">
        {/* Large OS Digital Clock */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white/95 font-inter drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            {timeStr || '12:00'}
          </h1>
          <p className="text-base md:text-lg text-white/60 font-inter mt-1 tracking-wide">
            {dateStr}
          </p>
        </div>

        {/* User Card & Authentication Box */}
        <div className="w-full">
          {!showAuthForm && isAuthenticated && user ? (
            /* Authenticated User Presentation */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="liquid-glass rounded-3xl p-6 text-center border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-2xl liquid-glass flex items-center justify-center text-4xl mb-3 shadow-[0_8px_25px_rgba(0,0,0,0.4)] border border-white/20">
                {user.avatar || '⚡'}
              </div>
              <h2 className="text-lg font-semibold text-white tracking-wide">{user.username}</h2>
              <p className="text-xs text-sky-400 font-mono mt-0.5">Sesión lista · Administrador</p>

              <button
                onClick={handleSlideUp}
                className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
              >
                <span>Acceder al Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowAuthForm(true)}
                className="mt-3 text-xs text-white/40 hover:text-white/80 transition-colors"
              >
                Cambiar de cuenta
              </button>
            </motion.div>
          ) : (
            /* Login or Registration Form (Required for first-time entry) */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="liquid-glass rounded-3xl p-6 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center text-base">
                    {authMode === 'register' ? '✨' : '🔐'}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {authMode === 'register' ? 'Crear Cuenta de Usuario' : 'Iniciar Sesión'}
                    </h3>
                    <p className="text-[11px] text-white/50">
                      {authMode === 'register'
                        ? 'Guarda todas tus apps y preferencias'
                        : 'Accede a tu escritorio Classroom OS'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage('');
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      authMode === 'login' ? 'bg-sky-500 text-white font-medium shadow-sm' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMessage('');
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      authMode === 'register' ? 'bg-sky-500 text-white font-medium shadow-sm' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Registro
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmitAuth} className="space-y-3.5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[11px] text-white/60 font-medium mb-1.5">
                      Elige tu Avatar
                    </label>
                    <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          type="button"
                          key={av}
                          onClick={() => setSelectedAvatar(av)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${
                            selectedAvatar === av
                              ? 'bg-sky-500/30 border-2 border-sky-400 scale-110 shadow-sm'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-white/60 font-medium mb-1">
                    {authMode === 'register' ? 'Nombre de Usuario' : 'Usuario o Email'}
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. Álvaro"
                    className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-xs"
                  />
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-[11px] text-white/60 font-medium mb-1">
                      Correo Electrónico (opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-white/60 font-medium mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(56,189,248,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Procesando...'
                  ) : authMode === 'register' ? (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Crear Cuenta y Entrar al Sistema</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </button>

                <div className="pt-1 flex items-center justify-between text-[11px] text-white/50">
                  <button
                    type="button"
                    onClick={handleDemoAccess}
                    className="text-sky-400/80 hover:text-sky-300 transition-colors"
                  >
                    Modo Invitado / Demo
                  </button>
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => setShowAuthForm(false)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </main>

      {/* Bottom Hint (Click or Space to Slide Up) */}
      <footer className="relative z-10 w-full flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          onClick={handleSlideUp}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/70 group-hover:text-white group-hover:scale-110 transition-all">
            <ChevronUp className="w-4 h-4" />
          </div>
          <p className="text-xs font-medium text-white/75 group-hover:text-white transition-colors">
            Haz clic o presiona <span className="px-1.5 py-0.5 rounded bg-white/10 text-sky-400 font-mono text-[10px]">Espacio</span> para desbloquear
          </p>
        </motion.div>
      </footer>
    </motion.div>
  );
}
