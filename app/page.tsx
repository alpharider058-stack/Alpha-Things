'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { MatrixRainCanvas } from '@/components/MatrixRainCanvas';
import { IntroSequence } from '@/components/IntroSequence';
import { AuthModal } from '@/components/AuthModal';
import { CustomizationModal } from '@/components/CustomizationModal';
import { AddLinkModal } from '@/components/AddLinkModal';
import { CyberHeader } from '@/components/CyberHeader';
import { HeroSection } from '@/components/HeroSection';
import { GtaSection } from '@/components/GtaSection';
import { FeaturedCineOS } from '@/components/FeaturedCineOS';
import { AiHubSection } from '@/components/AiHubSection';
import { AlphaLinksSection } from '@/components/AlphaLinksSection';
import { HackerTerminal } from '@/components/HackerTerminal';
import { CyberFooter } from '@/components/CyberFooter';
import { IframeModal } from '@/components/IframeModal';
import { cyberAudio } from '@/lib/audio';

function PortalContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => cyberAudio.getMuted());
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleToggleMute = () => {
    const muted = cyberAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleOpenPreview = (url: string, title: string) => {
    setModalState({
      isOpen: true,
      url,
      title,
    });
  };

  const handleClosePreview = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Font and theme classes based on user settings
  const colorTheme = user?.settings?.colorTheme || 'matrix';
  const fontFamily = user?.settings?.fontFamily || 'jetbrains';
  const fontSize = user?.settings?.fontSize || 'normal';

  const fontClass =
    fontFamily === 'orbitron'
      ? 'font-orbitron'
      : fontFamily === 'sharetech'
      ? 'font-sharetech'
      : fontFamily === 'rajdhani'
      ? 'font-rajdhani'
      : fontFamily === 'fira'
      ? 'font-fira'
      : fontFamily === 'inter'
      ? 'font-inter'
      : 'font-jetbrains';

  const sizeClass =
    fontSize === 'compact'
      ? 'text-xs'
      : fontSize === 'large'
      ? 'text-base'
      : 'text-sm';

  return (
    <div
      className={`theme-${colorTheme} ${fontClass} ${sizeClass} min-h-screen relative bg-[#030704] text-[#c0fce0] overflow-x-hidden selection:bg-[#00ff66] selection:text-black transition-colors duration-300`}
    >
      {/* Intro sequence displayed on entry */}
      {showIntro ? (
        <IntroSequence onComplete={handleIntroComplete} />
      ) : !isAuthenticated && !isLoading ? (
        /* Mandatory Authentication Gate on entry as requested */
        <>
          <MatrixRainCanvas opacity={0.88} />
          <AuthModal />
        </>
      ) : (
        /* Authenticated Main Portal */
        <>
          {/* Reactive Cyber Background */}
          <MatrixRainCanvas
            opacity={0.88}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
          />

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <CyberHeader
              onReplayIntro={handleReplayIntro}
              onOpenCustomizer={() => setIsCustomizerOpen(true)}
              onOpenAddLink={() => setIsAddLinkOpen(true)}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />

            <div className="flex-1">
              <HeroSection onReplayIntro={handleReplayIntro} />
              <GtaSection onPreview={handleOpenPreview} />
              <FeaturedCineOS onPreview={handleOpenPreview} />
              <AiHubSection onPreview={handleOpenPreview} />
              <AlphaLinksSection
                onPreview={handleOpenPreview}
                onOpenAddLink={() => setIsAddLinkOpen(true)}
              />
              <HackerTerminal
                onReplayIntro={handleReplayIntro}
                onPreview={handleOpenPreview}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
              />
            </div>

            <CyberFooter />
          </div>

          {/* Customization Studio Modal */}
          <CustomizationModal
            isOpen={isCustomizerOpen}
            onClose={() => setIsCustomizerOpen(false)}
          />

          {/* Add Link Modal */}
          <AddLinkModal
            isOpen={isAddLinkOpen}
            onClose={() => setIsAddLinkOpen(false)}
          />

          {/* In-App Preview Modal */}
          <IframeModal
            isOpen={modalState.isOpen}
            onClose={handleClosePreview}
            url={modalState.url}
            title={modalState.title}
          />
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <PortalContent />
    </AuthProvider>
  );
}
