'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BootScreen } from '@/components/os/BootScreen';
import { LockScreen } from '@/components/os/LockScreen';
import { Desktop } from '@/components/os/Desktop';

function OSContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [osPhase, setOsPhase] = useState<'boot' | 'lock' | 'desktop'>('boot');

  // Enforce tab title 'Inicio - Classroom' as requested
  useEffect(() => {
    document.title = 'Inicio - Classroom';
  }, []);

  const handleBootComplete = () => {
    setOsPhase('lock');
  };

  const handleUnlockComplete = () => {
    setOsPhase('desktop');
  };

  const handleLockScreen = () => {
    setOsPhase('lock');
  };

  const fontFamily = user?.settings?.fontFamily || 'inter';
  const fontClass =
    fontFamily === 'sf-pro'
      ? 'font-sf-pro'
      : fontFamily === 'outfit'
      ? 'font-outfit'
      : fontFamily === 'jetbrains'
      ? 'font-jetbrains'
      : fontFamily === 'fira'
      ? 'font-fira'
      : fontFamily === 'orbitron'
      ? 'font-orbitron'
      : fontFamily === 'rajdhani'
      ? 'font-rajdhani'
      : 'font-inter';

  return (
    <div className={`${fontClass} min-h-screen w-screen overflow-hidden bg-[#07090e] text-white select-none`}>
      {/* OS Boot Sequence on initial web entry */}
      {osPhase === 'boot' && (
        <BootScreen onComplete={handleBootComplete} videoSrc="/Animacion_de_inicio.mp4" />
      )}

      {/* OS Desktop Environment is always mounted underneath once past boot */}
      {osPhase !== 'boot' && (
        <Desktop onLockScreen={handleLockScreen} />
      )}

      {/* Lock / Welcome Screen Overlay with slide-up transition */}
      {osPhase === 'lock' && (
        <LockScreen
          isLocked={osPhase === 'lock'}
          onUnlocked={handleUnlockComplete}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <OSContent />
    </AuthProvider>
  );
}
