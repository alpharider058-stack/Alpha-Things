'use client';

import React, { useState } from 'react';
import { MatrixRainCanvas } from '@/components/MatrixRainCanvas';
import { IntroSequence } from '@/components/IntroSequence';
import { CyberHeader } from '@/components/CyberHeader';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedCineOS } from '@/components/FeaturedCineOS';
import { AlphaLinksSection } from '@/components/AlphaLinksSection';
import { HackerTerminal } from '@/components/HackerTerminal';
import { CyberFooter } from '@/components/CyberFooter';
import { IframeModal } from '@/components/IframeModal';
import { cyberAudio } from '@/lib/audio';

export default function Home() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
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

  return (
    <main className="min-h-screen relative bg-[#030704] text-[#c0fce0] overflow-x-hidden selection:bg-[#00ff66] selection:text-black">
      {/* Intro sequence displayed on entry as requested */}
      {showIntro ? (
        <IntroSequence onComplete={handleIntroComplete} />
      ) : (
        <>
          {/* Hacker Matrix Binary Code Rain Canvas */}
          <MatrixRainCanvas opacity={0.88} />

          {/* Foreground Application Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Top Bar Navigation */}
            <CyberHeader
              onReplayIntro={handleReplayIntro}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              activeSection=""
            />


            {/* Main Content Body */}
            <div className="flex-1">
              <HeroSection onReplayIntro={handleReplayIntro} />

              {/* Section 1: Cine-OS Spotlight */}
              <FeaturedCineOS onPreview={handleOpenPreview} />

              {/* Section 2: Alpha Links Section */}
              <AlphaLinksSection onPreview={handleOpenPreview} />

              {/* Section 3: Interactive Hacker Console Terminal */}
              <HackerTerminal
                onReplayIntro={handleReplayIntro}
                onPreview={handleOpenPreview}
              />
            </div>

            {/* Footer */}
            <CyberFooter />
          </div>

          {/* Secure Sandbox Iframe Preview Modal */}
          <IframeModal
            isOpen={modalState.isOpen}
            onClose={handleClosePreview}
            url={modalState.url}
            title={modalState.title}
          />
        </>
      )}
    </main>
  );
}
