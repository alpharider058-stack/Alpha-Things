const fs = require('fs');
const path = require('path');

const icons = {
  'gtav.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5f5f5"/>
      <stop offset="50%" stop-color="#cccccc"/>
      <stop offset="100%" stop-color="#777777"/>
    </linearGradient>
    <linearGradient id="fiveGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0f5132"/>
      <stop offset="30%" stop-color="#198754"/>
      <stop offset="70%" stop-color="#20c997"/>
      <stop offset="100%" stop-color="#0f5132"/>
    </linearGradient>
    <filter id="glassShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Squircle Base -->
  <rect x="6" y="6" width="116" height="116" rx="26" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" filter="url(#glassShadow)"/>
  <!-- Specular rim -->
  <path d="M 32 7 Q 64 6 96 7" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/>
  
  <!-- Roman Numeral V -->
  <path d="M 34 26 L 54 26 L 64 78 L 74 26 L 94 26 L 76 98 L 52 98 Z" fill="url(#vGrad)" stroke="#111" stroke-width="2"/>
  
  <!-- "FIVE" Ribbon Banner -->
  <g transform="translate(0, 10)">
    <rect x="22" y="56" width="84" height="24" rx="4" fill="url(#fiveGrad)" stroke="#f8f9fa" stroke-width="1.2"/>
    <!-- Subtle guilloche lines -->
    <line x1="24" y1="60" x2="104" y2="60" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
    <line x1="24" y1="76" x2="104" y2="76" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
    <!-- FIVE Text -->
    <text x="64" y="73" font-family="'Times New Roman', Georgia, serif" font-weight="900" font-size="15" letter-spacing="4" fill="#ffffff" text-anchor="middle" font-style="italic">FIVE</text>
  </g>
</svg>`,

  'mantle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="mantleBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="50%" stop-color="#161b22"/>
      <stop offset="100%" stop-color="#010409"/>
    </linearGradient>
    <linearGradient id="mantleGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="mantleGlass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
    <filter id="mantleFilter" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#8b5cf6" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#mantleBg)" stroke="rgba(139,92,246,0.3)" stroke-width="1.5"/>
  <rect x="7" y="7" width="114" height="57" rx="27" fill="url(#mantleGlass)"/>
  
  <!-- Stylized Mantle M Logo (Crystalline / Liquid Shield) -->
  <g filter="url(#mantleFilter)">
    <!-- Outer liquid geometry -->
    <path d="M 28 88 L 28 42 L 50 42 L 64 68 L 78 42 L 100 42 L 100 88 L 84 88 L 84 62 L 72 84 L 56 84 L 44 62 L 44 88 Z" fill="url(#mantleGlow)"/>
    <!-- Specular inner highlight -->
    <path d="M 32 46 L 46 46 L 64 78 L 82 46 L 96 46" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" fill="none"/>
    <circle cx="64" cy="40" r="4" fill="#38bdf8"/>
  </g>
</svg>`,

  'perplexity.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="perpBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1b1e"/>
      <stop offset="100%" stop-color="#040b0d"/>
    </linearGradient>
    <linearGradient id="perpGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#perpBg)" stroke="rgba(34,211,238,0.3)" stroke-width="1.5"/>
  <!-- Perplexity Geometric Infinity Knot -->
  <g transform="translate(64,64) scale(1.1)" stroke="url(#perpGlow)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M 0 -28 L 0 28"/>
    <path d="M -24 -14 L 24 14"/>
    <path d="M -24 14 L 24 -14"/>
    <path d="M -20 -20 L 0 -28 L 20 -20 L 24 0 L 20 20 L 0 28 L -20 20 L -24 0 Z"/>
  </g>
  <circle cx="64" cy="64" r="5" fill="#22d3ee"/>
</svg>`,

  'claude.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="claudeBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1f1814"/>
      <stop offset="100%" stop-color="#0c0907"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#claudeBg)" stroke="rgba(217,119,87,0.3)" stroke-width="1.5"/>
  <!-- Claude 14-point terracotta starburst -->
  <g transform="translate(64,64)">
    <g fill="#D97757">
      <ellipse cx="0" cy="0" rx="9" ry="34"/>
      <ellipse cx="0" cy="0" rx="9" ry="34" transform="rotate(25.7)"/>
      <ellipse cx="0" cy="0" rx="9" ry="34" transform="rotate(51.4)"/>
      <ellipse cx="0" cy="0" rx="9" ry="34" transform="rotate(77.1)"/>
      <ellipse cx="0" cy="0" rx="9" ry="34" transform="rotate(102.8)"/>
      <ellipse cx="0" cy="0" rx="9" ry="34" transform="rotate(128.5)"/>
      <ellipse cx="0" cy="0" rx="9" ry="34" transform="rotate(154.2)"/>
    </g>
    <circle cx="0" cy="0" r="14" fill="#CC6B49"/>
    <circle cx="0" cy="0" r="6" fill="#F4A261"/>
  </g>
</svg>`,

  'manus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="manusBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="manusGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#a1a1aa"/>
      <stop offset="100%" stop-color="#71717a"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#manusBg)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
  <!-- Manus Futuristic Monogram & Robotic Agent Emblem -->
  <g transform="translate(64, 64) scale(0.9)">
    <path d="M -32 26 L -32 -26 L -10 6 L 0 -8 L 10 6 L 32 -26 L 32 26 L 18 26 L 18 -4 L 8 16 L -8 16 L -18 -4 L -18 26 Z" fill="url(#manusGrad)"/>
    <circle cx="0" cy="-22" r="6" fill="#38bdf8"/>
  </g>
</svg>`,

  'copilot.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="copilotBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="ribbon1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0078d4"/>
      <stop offset="50%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
    <linearGradient id="ribbon2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#copilotBg)" stroke="rgba(99,102,241,0.3)" stroke-width="1.5"/>
  <!-- Microsoft Copilot Torus Ribbon Loop -->
  <g transform="translate(64, 64) scale(0.95)">
    <path d="M -26 -16 C -26 -32 -6 -36 8 -22 C 16 -14 26 2 26 16 C 26 32 6 36 -8 22 C -16 14 -26 -2 -26 -16 Z" fill="none" stroke="url(#ribbon1)" stroke-width="14" stroke-linecap="round"/>
    <path d="M 26 16 C 26 32 6 36 -8 22 C -16 14 -26 -2 -26 -16" fill="none" stroke="url(#ribbon2)" stroke-width="14" stroke-linecap="round"/>
  </g>
</svg>`,

  'arena.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="arenaBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1307"/>
      <stop offset="100%" stop-color="#0a0502"/>
    </linearGradient>
    <linearGradient id="arenaGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#arenaBg)" stroke="rgba(251,191,36,0.3)" stroke-width="1.5"/>
  <!-- Arena LMSYS Colosseum & Swords Emblem -->
  <g transform="translate(64,64) scale(0.9)">
    <ellipse cx="0" cy="0" rx="36" ry="24" fill="none" stroke="url(#arenaGold)" stroke-width="4.5" stroke-dasharray="14 5"/>
    <ellipse cx="0" cy="0" rx="24" ry="16" fill="none" stroke="#fbbf24" stroke-width="3.5"/>
    <path d="M -18 18 L 18 -18 M 18 18 L -18 -18" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
  </g>
</svg>`,

  'cineos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="cineBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c1e19"/>
      <stop offset="100%" stop-color="#020906"/>
    </linearGradient>
    <linearGradient id="cineGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#cineBg)" stroke="rgba(16,185,129,0.3)" stroke-width="1.5"/>
  <!-- Cine-OS Monitor / Screen + Play -->
  <rect x="26" y="32" width="76" height="52" rx="8" fill="none" stroke="url(#cineGrad)" stroke-width="4"/>
  <path d="M 54 46 L 76 58 L 54 70 Z" fill="url(#cineGrad)"/>
  <line x1="44" y1="92" x2="84" y2="92" stroke="url(#cineGrad)" stroke-width="4" stroke-linecap="round"/>
  <line x1="64" y1="84" x2="64" y2="92" stroke="url(#cineGrad)" stroke-width="4"/>
</svg>`,

  'settings.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="setBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#27272a"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="gearGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e4e4e7"/>
      <stop offset="100%" stop-color="#71717a"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#setBg)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
  <g transform="translate(64,64)">
    <circle cx="0" cy="0" r="14" fill="none" stroke="url(#gearGrad)" stroke-width="8"/>
    <!-- Gear teeth -->
    ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => `
      <rect x="-4" y="-32" width="8" height="10" rx="2" fill="url(#gearGrad)" transform="rotate(${deg})"/>
    `).join('')}
  </g>
</svg>`
};

Object.entries(icons).forEach(([filename, svgContent]) => {
  const targetPath = path.join(process.cwd(), 'public', 'apps', filename);
  fs.writeFileSync(targetPath, svgContent);
  console.log('Wrote ' + targetPath);
});
