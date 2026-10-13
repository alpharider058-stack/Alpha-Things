'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cyberAudio } from '@/lib/audio';
import { Volume2, VolumeX, FastForward, Play, ShieldAlert, Cpu } from 'lucide-react';

interface IntroSequenceProps {
  onComplete: () => void;
  videoSrc?: string;
}

export function IntroSequence({ onComplete, videoSrc }: IntroSequenceProps) {
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(cyberAudio.getMuted());
  const [useVideoFile, setUseVideoFile] = useState<boolean>(Boolean(videoSrc));
  const [videoError, setVideoError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioTriggeredRef = useRef<{ [key: number]: boolean }>({});

  // Sound triggers per phase
  useEffect(() => {
    if (phase === 0 && !audioTriggeredRef.current[0]) {
      audioTriggeredRef.current[0] = true;
      cyberAudio.playLaserBlip();
    } else if (phase === 1 && !audioTriggeredRef.current[1]) {
      audioTriggeredRef.current[1] = true;
      cyberAudio.playBeep(440, 0.15, 'sawtooth');
    } else if (phase === 2 && !audioTriggeredRef.current[2]) {
      audioTriggeredRef.current[2] = true;
      cyberAudio.playBootSweep();
    } else if (phase === 3 && !audioTriggeredRef.current[3]) {
      audioTriggeredRef.current[3] = true;
      cyberAudio.playLockOn();
    } else if (phase === 4 && !audioTriggeredRef.current[4]) {
      audioTriggeredRef.current[4] = true;
      cyberAudio.playLaserBlip();
      cyberAudio.playBeep(880, 0.2, 'sine');
    }
  }, [phase]);

  // Animation timeline progression (approx 9.5s total matching video length)
  useEffect(() => {
    if (useVideoFile && !videoError) return;

    const startTime = Date.now();
    const duration = 9500; // 9.5 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < 2000) {
        setPhase(0); // Matrix rain & Corner HUD
      } else if (elapsed < 4200) {
        setPhase(1); // Circular HUD & Target Reticle
      } else if (elapsed < 6200) {
        setPhase(2); // Alpha symbol glowing
      } else if (elapsed < 8200) {
        setPhase(3); // Motherboard circuit board traces radiating
      } else if (elapsed < 9500) {
        setPhase(4); // "Alpha-Things" text title reveal
      } else {
        clearInterval(timer);
        setTimeout(onComplete, 400);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete, useVideoFile, videoError]);

  const handleSkip = () => {
    cyberAudio.playBeep(1200, 0.05, 'sine');
    onComplete();
  };

  const handleToggleMute = () => {
    const muted = cyberAudio.toggleMute();
    setIsMuted(muted);
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030704] text-[#00ff66] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Fallback to custom cinematic canvas/SVG recreation if video not provided or errored */}
      {useVideoFile && !videoError ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={onComplete}
            onError={() => setVideoError(true)}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Cyber matrix background lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(to_right,#00ff6615_1px,transparent_1px),linear-gradient(to_bottom,#00ff6615_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          {/* CRT scanlines overlay */}
          <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-50 z-20" />

          {/* Corner HUD Brackets matching video frame 00:00 */}
          <div className="absolute inset-6 md:inset-12 pointer-events-none z-10">
            {/* Top-Left Bracket */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#00ff66] shadow-[0_0_10px_#00ff66]" />
            <div className="absolute top-3 left-4 text-[10px] tracking-widest text-[#00ff66]/70 font-mono">
              [SYS.BOOT // OK]
            </div>

            {/* Top-Right Bracket */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#00ff66] shadow-[0_0_10px_#00ff66]" />
            <div className="absolute top-3 right-4 text-[10px] tracking-widest text-[#00ff66]/70 font-mono text-right">
              NET012 · SECURE
            </div>

            {/* Bottom-Left Bracket */}
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#00ff66] shadow-[0_0_10px_#00ff66]" />
            <div className="absolute bottom-3 left-4 text-[10px] tracking-widest text-[#00ff66]/70 font-mono">
              ALPHA-PROTOCOL v2.4
            </div>

            {/* Bottom-Right Bracket */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00ff66] shadow-[0_0_10px_#00ff66]" />
            <div className="absolute bottom-3 right-4 text-[10px] tracking-widest text-[#00ff66]/70 font-mono text-right">
              LAT: 44.92 · LON: -93.21
            </div>
          </div>

          {/* Side Telemetry Panels matching video frames */}
          <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-3 text-[11px] font-mono text-[#00ff66]/70 pointer-events-none z-10 max-w-xs">
            <div className="border border-[#00ff66]/30 bg-[#051108]/80 p-3 shadow-[0_0_10px_rgba(0,255,102,0.1)]">
              <div className="text-[#39ff14] font-semibold text-xs mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>CORE TELEMETRY</span>
              </div>
              <p>MEM_POOL: 0x887F_A01</p>
              <p>STATUS: INITIALIZING</p>
              <p>STREAM: SYNCHRONIZED</p>
              <div className="mt-2 w-full bg-[#00ff66]/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00ff66] h-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="border border-[#00ff66]/30 bg-[#051108]/80 p-3 font-mono text-[10px] text-[#00ff66]/60">
              <p className="text-[#00ff66] font-bold">RETA 01</p>
              <p>00:01:24.08 OK</p>
              <p>00:01:25.12 ACTIVE</p>
              <p>CHANNEL: [ALPHA_NET]</p>
            </div>
          </div>

          {/* Right Telemetry matching video */}
          <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 text-[11px] font-mono text-[#00ff66]/70 pointer-events-none z-10 max-w-xs">
            <div className="border border-[#00ff66]/30 bg-[#051108]/80 p-3 shadow-[0_0_10px_rgba(0,255,102,0.1)]">
              <div className="text-[#39ff14] font-semibold text-xs mb-1">
                MODULE: NET012
              </div>
              <p className="text-[10px] leading-relaxed text-[#00ff66]/60">
                function initAlpha() &#123;<br />
                &nbsp;&nbsp;connectNode(&quot;CINE-OS&quot;);<br />
                &nbsp;&nbsp;authSystem(0x00FF);<br />
                &#125;
              </p>
            </div>
            <div className="border border-[#00ff66]/30 bg-[#051108]/80 p-3 text-[10px] text-[#00ff66]/60">
              <p className="text-[#00ff66] font-bold">SYS_CHECKSUM</p>
              <p>CRC-32: A9B44F10</p>
              <p>SIG: ALPHA_THINGS_AUTH</p>
            </div>
          </div>

          {/* Central Main Stage: Exact recreation of Video Sequence */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-4">
            {/* Phase 1 & 2: Tactical HUD Target Rings (Video 00:02) */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute pointer-events-none flex items-center justify-center"
                >
                  {/* Outer Dashed Rotating Ring */}
                  <div className="w-72 h-72 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] rounded-full border border-dashed border-[#00ff66]/40 animate-radar" />

                  {/* Inner Counter-Rotating Precision Ring */}
                  <div
                    className="absolute w-56 h-56 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] rounded-full border border-[#00ff66]/30 animate-spin"
                    style={{ animationDuration: '14s', animationDirection: 'reverse' }}
                  />

                  {/* Crosshairs & tick marks */}
                  <div className="absolute w-[110%] h-[1px] bg-[#00ff66]/30" />
                  <div className="absolute h-[110%] w-[1px] bg-[#00ff66]/30" />

                  {/* Radar sweep line */}
                  <div
                    className="absolute w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#00ff66]/50 to-[#39ff14] origin-left animate-radar shadow-[0_0_8px_#39ff14]"
                    style={{ left: '50%', top: '50%' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 3 & 4: Motherboard Circuit Traces (Video 00:06) */}
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute pointer-events-none w-80 h-80 sm:w-[420px] sm:h-[420px] flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full h-full text-[#00ff66] filter drop-shadow-[0_0_10px_#00ff66]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    {/* Upper Circuit Branches */}
                    <path d="M 200 130 L 200 60 L 170 30" strokeDasharray="3 3" />
                    <circle cx="170" cy="30" r="4" fill="#39ff14" />
                    <path d="M 200 130 L 200 70 L 230 40 L 270 40" />
                    <circle cx="270" cy="40" r="4" fill="#39ff14" />

                    {/* Top Left Branches */}
                    <path d="M 160 150 L 110 110 L 60 110" />
                    <circle cx="60" cy="110" r="4" fill="#39ff14" />
                    <path d="M 150 170 L 90 140 L 50 140" />
                    <circle cx="50" cy="140" r="3.5" fill="#39ff14" />

                    {/* Top Right Branches */}
                    <path d="M 240 150 L 290 110 L 340 110" />
                    <circle cx="340" cy="110" r="4" fill="#39ff14" />
                    <path d="M 250 170 L 310 140 L 350 140" />
                    <circle cx="350" cy="140" r="3.5" fill="#39ff14" />

                    {/* Middle Left Branches */}
                    <path d="M 140 200 L 70 200 L 40 230" />
                    <circle cx="40" cy="230" r="4" fill="#39ff14" />
                    <path d="M 140 220 L 90 240 L 50 240" />
                    <circle cx="50" cy="240" r="3" fill="#39ff14" />

                    {/* Middle Right Branches */}
                    <path d="M 260 200 L 330 200 L 360 230" />
                    <circle cx="360" cy="230" r="4" fill="#39ff14" />
                    <path d="M 260 220 L 310 240 L 350 240" />
                    <circle cx="350" cy="240" r="3" fill="#39ff14" />

                    {/* Lower Left Branches */}
                    <path d="M 160 250 L 110 290 L 70 290" />
                    <circle cx="70" cy="290" r="4" fill="#39ff14" />
                    <path d="M 170 270 L 140 320 L 100 320" />
                    <circle cx="100" cy="320" r="3.5" fill="#39ff14" />

                    {/* Lower Right Branches */}
                    <path d="M 240 250 L 290 290 L 330 290" />
                    <circle cx="330" cy="290" r="4" fill="#39ff14" />
                    <path d="M 230 270 L 260 320 L 300 320" />
                    <circle cx="300" cy="320" r="3.5" fill="#39ff14" />

                    {/* Center Core Halo */}
                    <circle
                      cx="200"
                      cy="200"
                      r="70"
                      stroke="#00ff66"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Central Neon Alpha Greek Symbol: 'α' (Video 00:04 - 00:08) */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, type: 'spring', damping: 15 }}
                  className="relative z-20 flex items-center justify-center my-6"
                >
                  <div className="relative font-cyber select-none">
                    <span
                      className="text-8xl sm:text-9xl md:text-[140px] font-bold text-[#39ff14] leading-none block drop-shadow-[0_0_20px_#00ff66] drop-shadow-[0_0_40px_#00ff66]"
                      style={{
                        textShadow:
                          '0 0 10px #39ff14, 0 0 25px #00ff66, 0 0 50px rgba(0,255,102,0.8)',
                      }}
                    >
                      α
                    </span>

                    {/* Subtle pulse ring around alpha */}
                    <div className="absolute inset-0 -m-4 border-2 border-[#00ff66]/40 rounded-full animate-ping opacity-25 pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Phase 00:08 - 00:09: Title "Alpha-Things" */}
            <AnimatePresence>
              {phase >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-20 mt-4 text-center"
                >
                  <h1
                    className="font-cyber text-3xl sm:text-4xl md:text-5xl font-black tracking-wider text-[#39ff14] uppercase drop-shadow-[0_0_15px_#00ff66]"
                    style={{
                      textShadow:
                        '0 0 8px #39ff14, 0 0 20px #00ff66, 0 0 35px rgba(0,255,102,0.9)',
                    }}
                  >
                    Alpha-Things
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm font-mono tracking-widest text-[#00ff66]/80 uppercase">
                    [ ACCESS GRANTED · INITIALIZING PORTAL ]
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Intro Control Bar at Bottom */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-6 max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Audio Mute/Unmute */}
        <button
          onClick={handleToggleMute}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-[#00ff66] bg-[#051108]/90 border border-[#00ff66]/40 rounded hover:border-[#00ff66] hover:bg-[#00ff66]/10 transition-colors shadow-[0_0_10px_rgba(0,255,102,0.15)]"
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span>Audio: OFF</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#39ff14]" />
              <span>Audio: ON</span>
            </>
          )}
        </button>

        {/* Progress bar in center */}
        <div className="hidden sm:flex flex-1 items-center gap-3 max-w-xs font-mono text-[11px] text-[#00ff66]/70">
          <div className="flex-1 bg-[#00ff66]/20 h-1 rounded overflow-hidden">
            <div
              className="bg-[#00ff66] h-full transition-all duration-100 shadow-[0_0_6px_#00ff66]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="tabular-nums">{progress}%</span>
        </div>

        {/* Skip button / Instant Access */}
        <button
          onClick={handleSkip}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-cyber font-bold tracking-wider text-[#030704] bg-[#00ff66] hover:bg-[#39ff14] transition-all rounded shadow-[0_0_15px_#00ff66] hover:shadow-[0_0_25px_#39ff14] hover:scale-105 active:scale-95"
        >
          <span>SALTAR INTRO</span>
          <FastForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
