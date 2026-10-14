'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth, AVATAR_OPTIONS } from '@/context/AuthContext';
import { cyberAudio } from '@/lib/audio';
import { Shield, KeyRound, User, Mail, Eye, EyeOff, Sparkles, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onSuccess?: () => void;
}

export function AuthModal({ onSuccess }: AuthModalProps) {
  const { login, register, loginAsDemo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⚡');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    cyberAudio.playLaserBlip();

    try {
      if (isRegister) {
        const res = await register(username, email, password, selectedAvatar);
        if (!res.success) {
          setErrorMsg(res.error || 'Error al crear la cuenta');
          cyberAudio.playBeep(320, 0.1, 'sawtooth');
        } else {
          onSuccess?.();
        }
      } else {
        const res = await login(identifier, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Error al iniciar sesión');
          cyberAudio.playBeep(320, 0.1, 'sawtooth');
        } else {
          onSuccess?.();
        }
      }
    } catch {
      setErrorMsg('Ocurrió un error inesperado en el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    cyberAudio.playLockOn();
    loginAsDemo();
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020503]/95 backdrop-blur-xl overflow-y-auto">
      {/* Decorative Grid & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff6610_1px,transparent_1px),linear-gradient(to_bottom,#00ff6610_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Auth Container Card */}
      <div className="relative w-full max-w-md my-8 bg-[#040e07]/90 border border-[#00ff66]/40 rounded-2xl p-6 sm:p-8 box-neon shadow-[0_0_50px_rgba(0,255,102,0.2)]">
        {/* Corner Sci-Fi Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff66] rounded-tl" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff66] rounded-tr" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff66] rounded-bl" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff66] rounded-br" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 relative rounded-xl overflow-hidden border border-[#00ff66]/40 shadow-[0_0_15px_rgba(0,255,102,0.3)] bg-[#051108] p-1">
              <Image
                src="/classroom-logo.svg"
                alt="Classroom Stealth Logo"
                width={40}
                height={40}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-cyber font-black text-2xl tracking-wider text-[#00ff66] text-neon">
              Alpha-Things
            </span>
          </div>

          <h2 className="text-lg font-cyber font-bold text-white mb-1">
            {isRegister ? 'Registro de Operador Alpha' : 'Acceso Restringido al Portal'}
          </h2>
          <p className="text-xs font-mono text-[#a5f3cf]/70">
            {isRegister
              ? 'Crea tu perfil cifrado para sincronizar tus personalizaciones y favoritos.'
              : 'Inicia sesión con tu cuenta para cargar tu entorno y configuraciones.'}
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center gap-2.5 text-xs font-mono text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister ? (
            <>
              {/* Avatar Picker */}
              <div>
                <label className="block text-[11px] font-mono text-[#00ff66]/80 mb-1.5 uppercase">
                  Distintivo / Avatar Hacker:
                </label>
                <div className="flex items-center justify-between gap-1 p-2 bg-[#020603] border border-[#00ff66]/25 rounded-lg overflow-x-auto">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => {
                        cyberAudio.playBeep(700, 0.03, 'sine');
                        setSelectedAvatar(av);
                      }}
                      className={`w-8 h-8 rounded text-base flex items-center justify-center transition-all ${
                        selectedAvatar === av
                          ? 'bg-[#00ff66]/20 border border-[#00ff66] scale-110 shadow-[0_0_10px_#00ff66]'
                          : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-[11px] font-mono text-[#00ff66]/80 mb-1">
                  NOMBRE DE OPERADOR (USUARIO):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#00ff66]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. Neo_Cyber"
                    className="w-full bg-[#020603] border border-[#00ff66]/30 text-xs font-mono text-white placeholder-[#00ff66]/30 pl-9 pr-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-mono text-[#00ff66]/80 mb-1">
                  CORREO ELECTRÓNICO:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#00ff66]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operador@red-alpha.io"
                    className="w-full bg-[#020603] border border-[#00ff66]/30 text-xs font-mono text-white placeholder-[#00ff66]/30 pl-9 pr-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Login Identifier */
            <div>
              <label className="block text-[11px] font-mono text-[#00ff66]/80 mb-1">
                USUARIO O CORREO:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#00ff66]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Tu usuario o correo"
                  className="w-full bg-[#020603] border border-[#00ff66]/30 text-xs font-mono text-white placeholder-[#00ff66]/30 pl-9 pr-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]"
                />
              </div>
            </div>
          )}

          {/* Password field */}
          <div>
            <label className="block text-[11px] font-mono text-[#00ff66]/80 mb-1">
              CONTRASEÑA DE ACCESO:
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#00ff66]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#020603] border border-[#00ff66]/30 text-xs font-mono text-white placeholder-[#00ff66]/30 pl-9 pr-10 py-2.5 rounded-lg focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-[#00ff66]/60 hover:text-[#00ff66] absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 font-cyber text-xs font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] disabled:opacity-50 rounded-lg transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.7)]"
          >
            <span>{isRegister ? 'CREAR CUENTA Y ENTRAR' : 'AUTENTICAR Y ENTRAR'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-5 pt-4 border-t border-[#00ff66]/15 text-center">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playBeep(600, 0.05, 'sine');
              setIsRegister(!isRegister);
              setErrorMsg(null);
            }}
            className="text-xs font-mono text-[#a5f3cf] hover:text-[#00ff66] transition-colors hover:underline"
          >
            {isRegister
              ? '¿Ya tienes una cuenta creada? Inicia sesión aquí'
              : '¿Primera vez en el portal? Crea tu cuenta aquí'}
          </button>
        </div>

        {/* Instant Demo Quick Access */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-[#39ff14] bg-[#00ff66]/10 border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/20 rounded transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#39ff14]" />
            <span>Acceso Rápido Invitado (Probar sin registrar)</span>
          </button>
        </div>

        {/* Security badge at bottom */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#00ff66]/40 uppercase">
          <Lock className="w-3 h-3 text-[#39ff14]" />
          <span>SESIÓN CIFRADA LOCAL · PRIVACIDAD TOTAL</span>
        </div>
      </div>
    </div>
  );
}
