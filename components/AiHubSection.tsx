'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Monitor,
  Search,
  Bot,
  Brain,
  Cpu,
  Layers,
  Zap,
  Globe,
  Terminal,
  Trophy,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { cyberAudio } from '@/lib/audio';

interface AiHubSectionProps {
  onPreview: (url: string, title: string) => void;
}

interface AiToolItem {
  id: string;
  name: string;
  tagline: string;
  url: string;
  domain: string;
  category: string;
  badge: string;
  iconName: 'search' | 'brain' | 'bot' | 'zap' | 'trophy';
  whatItDoes: string;
  whenToUse: string;
  strengths: string[];
  recommendedFor: string;
  accentColor: string;
}

const AI_DIRECTORY: AiToolItem[] = [
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    tagline: 'Motor de Búsqueda Conversacional con Fuentes en Tiempo Real',
    url: 'https://www.perplexity.ai/',
    domain: 'perplexity.ai',
    category: 'Búsqueda Web & Fact-Checking',
    badge: 'LIVE WEB CRAWLER',
    iconName: 'search',
    whatItDoes:
      'Rastrea e indexa la web en tiempo real para responder a cualquier pregunta sintetizando múltiples fuentes directas. Aporta notas al pie con enlaces a los artículos y webs consultadas, resúmenes organizados y preguntas sugeridas para profundizar.',
    whenToUse:
      'Úsala cuando necesites buscar información reciente al minuto, contrastar hechos con enlaces verificables, recopilar fuentes para un trabajo, investigar noticias de actualidad o cuando los buscadores tradicionales te den resultados confusos o saturados de publicidad.',
    strengths: ['Citas directas con enlaces', 'Información en tiempo real', 'Búsqueda guiada Pro Search', 'Sin alucinaciones en datos duros'],
    recommendedFor: 'Investigación web, noticias recientes, consultas académicas y verificación de datos.',
    accentColor: '#00f0ff',
  },
  {
    id: 'claude',
    name: 'Claude AI',
    tagline: 'Razonamiento Complejo, Escritura Humana y Programación de Élite',
    url: 'https://claude.ai/',
    domain: 'claude.ai',
    category: 'Razonamiento & Análisis Profundo',
    badge: '200K+ CONTEXT WINDOW',
    iconName: 'brain',
    whatItDoes:
      'Desarrollado por Anthropic con un fuerte enfoque en seguridad, precisión y empatía de tono. Es el modelo referente en comprensión de lenguaje natural, estructuración de código de software avanzado, razonamiento lógico riguroso y análisis de documentos inmensos (PDFs de cientos de páginas).',
    whenToUse:
      'Úsala cuando vayas a programar software o depurar scripts complejos, redactar documentos largos o ensayos con tono humano impecable, sintetizar informes o libros en PDF, o cuando requieras un razonamiento reflexivo profundo sin repeticiones automáticas.',
    strengths: ['Programación y refactorización', 'Redacción fluida sin tono robótico', 'Ventana de contexto colosal (200K+)', 'Gran fidelidad lógica'],
    recommendedFor: 'Desarrollo de software, análisis de documentos largos, ensayos y razonamiento avanzado.',
    accentColor: '#d946ef',
  },
  {
    id: 'manus',
    name: 'Manus AI',
    tagline: 'Agente Autónomo de Ejecución Completa y Tareas Multi-Paso',
    url: 'https://manus.im/app',
    domain: 'manus.im',
    category: 'Agente Autónomo & Automatización',
    badge: 'AUTONOMOUS WORKFLOW',
    iconName: 'bot',
    whatItDoes:
      'Es un agente de inteligencia artificial de propósito general capaz de navegar por internet de manera autónoma, ejecutar herramientas informáticas, procesar datos masivos y resolver misiones completas paso a paso sin que tengas que supervisar cada clic.',
    whenToUse:
      'Úsala cuando tengas una tarea multi-paso tediosa que implique actuar (por ejemplo: "investiga 15 competidores de un sector, compila sus precios y características, y hazme un informe en hoja de cálculo"), en vez de consultar solo una respuesta textual estática.',
    strengths: ['Navegación web autónoma', 'Ejecución de código en sandbox', 'Flujos de trabajo complejos', 'Extracción y estructuración de datos'],
    recommendedFor: 'Automatización de tareas, estudios de mercado, scraping y proyectos multi-paso.',
    accentColor: '#39ff14',
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    tagline: 'Copiloto de Productividad Diaria, Bing Search y DALL-E 3',
    url: 'https://copilot.microsoft.com/',
    domain: 'copilot.microsoft.com',
    category: 'Productividad Diaria & Creatividad',
    badge: 'DALL-E 3 + OFFICE',
    iconName: 'zap',
    whatItDoes:
      'El ecosistema de asistencia diaria de Microsoft potenciado por modelos de OpenAI y la indexación de Bing. Destaca por su generación de imágenes artísticas y fotorrealistas de alta resolución con DALL-E sin coste, resúmenes web y redacción de textos cotidianos.',
    whenToUse:
      'Úsala para tu día a día: generar imágenes gratuitas para presentaciones o avatares a partir de descripciones, resumir páginas web mientras navegas, redactar correos formales o cuando necesitas un asistente rápido integrado con herramientas de oficina.',
    strengths: ['Generación de imágenes con DALL-E', 'Integración nativa con Microsoft', 'Búsqueda web cotidiana', 'Acceso gratuito y versátil'],
    recommendedFor: 'Generación de imágenes, resumen de textos diarios, productividad de oficina y correos.',
    accentColor: '#ffb703',
  },
  {
    id: 'arena',
    name: 'Chatbot Arena (Direct Max)',
    tagline: 'Coliseo de Modelos de Vanguardia y Evaluación a Ciegas',
    url: 'https://arena.ai/text/direct?model_a=max',
    domain: 'arena.ai',
    category: 'Benchmark & Comparativa de Élite',
    badge: 'GLOBAL LEADERBOARD #1',
    iconName: 'trophy',
    whatItDoes:
      'La plataforma oficial de LMSYS (Large Model Systems Organization) donde compiten cara a cara todos los mejores modelos del mundo (GPT-4o, Claude 3.5 Sonnet, Gemini Pro, Llama, Mistral). En el modo Direct con "Max" te conecta directamente con el modelo líder de la tabla clasificatoria mundial.',
    whenToUse:
      'Úsala cuando quieras probar el modelo más inteligente del planeta en este instante, comparar cómo responden dos inteligencias artificiales a la misma pregunta difícil, o testear qué IA resuelve mejor un problema técnico antes de pagar por una suscripción.',
    strengths: ['Acceso a los mejores modelos del mundo', 'Ranking ciego e imparcial', 'Comparativa cara a cara', 'Modo Direct Max ultra potente'],
    recommendedFor: 'Comparar IAs, experimentar con modelos top del mundo y evaluar capacidades límites.',
    accentColor: '#ff0055',
  },
];

export function AiHubSection({ onPreview }: AiHubSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCopy = (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    cyberAudio.playLaserBlip();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenExternal = (url: string) => {
    cyberAudio.playLockOn();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredItems = AI_DIRECTORY.filter((item) => {
    if (activeFilter !== 'all' && item.id !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.whatItDoes.toLowerCase().includes(q) ||
        item.whenToUse.toLowerCase().includes(q) ||
        item.strengths.some((s) => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <section id="seccion-ia" className="relative py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Tactical Section Header */}
      <div className="relative mb-8 p-6 rounded-2xl bg-[#030b05]/85 border border-[#00ff66]/30 shadow-[0_0_30px_rgba(0,255,102,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial-[circle_at_center,rgba(0,255,102,0.1)_0%,transparent_70%] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[#00ff66] uppercase">
                {'// INTELIGENCIA_ARTIFICIAL_NEXUS'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00ff66]/15 text-[#39ff14] border border-[#00ff66]/30">
                5 SISTEMAS TOP
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white tracking-wide flex items-center gap-2">
              <span>Matriz de Inteligencias Artificiales</span>
              <Cpu className="w-6 h-6 text-[#39ff14]" />
            </h2>

            <p className="text-xs sm:text-sm font-mono text-[#a5f3cf]/80 max-w-3xl">
              Descubre qué hace cada una de las principales IAs del mundo y una guía táctica precisa para saber{' '}
              <strong className="text-[#39ff14]">cuál deberías utilizar</strong> según tu tarea u objetivo.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative shrink-0 w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#00ff66]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por caso de uso..."
              className="w-full bg-[#020703] border border-[#00ff66]/35 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#a5f3cf]/40 focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]"
            />
          </div>
        </div>

        {/* Quick Goal Helper Selector: ¿Cuál debería usar en cada caso? */}
        <div className="mt-6 pt-5 border-t border-[#00ff66]/15">
          <div className="flex items-center gap-2 mb-2.5">
            <HelpCircle className="w-4 h-4 text-[#39ff14]" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              ¿Cuál deberías usar según tu objetivo? Selecciona tu caso:
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              onClick={() => {
                cyberAudio.playBeep(600, 0.03, 'sine');
                setActiveFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#39ff14] font-bold shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                  : 'bg-[#020703] border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              Mostrar Todas (5)
            </button>

            <button
              onClick={() => {
                cyberAudio.playBeep(650, 0.03, 'sine');
                setActiveFilter('perplexity');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'perplexity'
                  ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-[#020703] border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              <span>🔍 Investigar en la Web con Fuentes</span>
              <span className="text-[10px] opacity-75 font-normal">→ Perplexity</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playBeep(680, 0.03, 'sine');
                setActiveFilter('claude');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'claude'
                  ? 'bg-[#d946ef]/20 border-[#d946ef] text-[#d946ef] font-bold shadow-[0_0_12px_rgba(217,70,239,0.3)]'
                  : 'bg-[#020703] border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              <span>🧠 Programar Código y Redactar a Fondo</span>
              <span className="text-[10px] opacity-75 font-normal">→ Claude</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playBeep(720, 0.03, 'sine');
                setActiveFilter('manus');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'manus'
                  ? 'bg-[#39ff14]/20 border-[#39ff14] text-[#39ff14] font-bold shadow-[0_0_12px_rgba(57,255,20,0.3)]'
                  : 'bg-[#020703] border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              <span>🤖 Automatizar Tareas con Agente</span>
              <span className="text-[10px] opacity-75 font-normal">→ Manus</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playBeep(750, 0.03, 'sine');
                setActiveFilter('copilot');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'copilot'
                  ? 'bg-[#ffb703]/20 border-[#ffb703] text-[#ffb703] font-bold shadow-[0_0_12px_rgba(255,183,3,0.3)]'
                  : 'bg-[#020703] border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              <span>⚡ Productividad Diaria e Imágenes</span>
              <span className="text-[10px] opacity-75 font-normal">→ Copilot</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playBeep(800, 0.03, 'sine');
                setActiveFilter('arena');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'arena'
                  ? 'bg-[#ff0055]/20 border-[#ff0055] text-[#ff0055] font-bold shadow-[0_0_12px_rgba(255,0,85,0.3)]'
                  : 'bg-[#020703] border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              <span>⚔️ Comparar los Mejores Modelos Mundiales</span>
              <span className="text-[10px] opacity-75 font-normal">→ Arena AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of AI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((ai) => {
          const isCopied = copiedId === ai.id;

          return (
            <div
              key={ai.id}
              className="group relative rounded-2xl bg-[#030905]/90 border border-[#00ff66]/25 hover:border-[#00ff66]/70 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${ai.accentColor}, transparent)`,
                }}
              />

              <div className="p-6 space-y-5">
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${ai.accentColor}15`,
                        borderColor: `${ai.accentColor}40`,
                        color: ai.accentColor,
                      }}
                    >
                      {ai.iconName === 'search' && <Search className="w-6 h-6" />}
                      {ai.iconName === 'brain' && <Brain className="w-6 h-6" />}
                      {ai.iconName === 'bot' && <Bot className="w-6 h-6" />}
                      {ai.iconName === 'zap' && <Zap className="w-6 h-6" />}
                      {ai.iconName === 'trophy' && <Trophy className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-cyber font-bold text-white group-hover:text-[#39ff14] transition-colors">
                          {ai.name}
                        </h3>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border"
                          style={{
                            backgroundColor: `${ai.accentColor}15`,
                            borderColor: `${ai.accentColor}35`,
                            color: ai.accentColor,
                          }}
                        >
                          {ai.badge}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#a5f3cf]/70 mt-0.5">{ai.domain}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-1 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 shrink-0">
                    {ai.category}
                  </span>
                </div>

                {/* Subtitle / Tagline */}
                <p className="text-xs font-mono font-medium text-white/90 border-l-2 pl-3 py-0.5" style={{ borderColor: ai.accentColor }}>
                  {ai.tagline}
                </p>

                {/* Section 1: ¿Qué hace? */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#020703]/80 border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00ff66] uppercase">
                    <Bot className="w-3.5 h-3.5" />
                    <span>¿Qué hace exactamente?</span>
                  </div>
                  <p className="text-xs font-mono text-[#c0fce0]/80 leading-relaxed">
                    {ai.whatItDoes}
                  </p>
                </div>

                {/* Section 2: ¿Cuál deberías usar en este caso? */}
                <div
                  className="space-y-1.5 p-3.5 rounded-xl border"
                  style={{
                    backgroundColor: `${ai.accentColor}08`,
                    borderColor: `${ai.accentColor}30`,
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase" style={{ color: ai.accentColor }}>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>¿Cuándo deberías usarla tú?</span>
                  </div>
                  <p className="text-xs font-mono text-white/90 leading-relaxed">
                    {ai.whenToUse}
                  </p>
                </div>

                {/* Strengths Pills */}
                <div>
                  <span className="text-[10px] font-mono text-[#a5f3cf]/60 uppercase block mb-1.5">
                    Puntos Fuertes Destacados:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ai.strengths.map((str, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80"
                      >
                        ✓ {str}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 py-4 bg-[#051108]/90 border-t border-[#00ff66]/15 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {/* Open Direct in New Tab */}
                  <button
                    onClick={() => handleOpenExternal(ai.url)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#00ff66] text-black hover:bg-[#39ff14] shadow-[0_0_12px_rgba(0,255,102,0.3)] transition-all"
                  >
                    <span>Abrir {ai.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {/* In-App Preview */}
                  <button
                    onClick={() => {
                      cyberAudio.playLaserBlip();
                      onPreview(ai.url, ai.name);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-[#00ff66]/35 text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
                    title="Previsualizar en ventana integrada"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Previsualizar</span>
                  </button>
                </div>

                {/* Copy URL */}
                <button
                  onClick={(e) => handleCopy(ai.id, ai.url, e)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                  title="Copiar enlace directo"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#39ff14]" />
                      <span className="text-[#39ff14]">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cyber Quick Decision Cheat Sheet */}
      <div className="mt-8 p-6 rounded-2xl bg-[#030905]/80 border border-[#00ff66]/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <h4 className="text-sm font-cyber font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#39ff14]" />
          <span>Resumen Táctico de Decisión Rápida (Cheat Sheet):</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#020703] border border-[#00f0ff]/30 space-y-1">
            <span className="text-[10px] text-[#00f0ff] uppercase font-bold block">1. Perplexity AI</span>
            <p className="text-white font-semibold">¿Necesitas buscar información en tiempo real con fuentes verificadas?</p>
            <p className="text-[11px] text-[#a5f3cf]/70">Ideal para noticias, datos recientes y citas exactas.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#020703] border border-[#d946ef]/30 space-y-1">
            <span className="text-[10px] text-[#d946ef] uppercase font-bold block">2. Claude AI</span>
            <p className="text-white font-semibold">¿Necesitas programar código complejo o redactar textos largos?</p>
            <p className="text-[11px] text-[#a5f3cf]/70">Ideal para desarrollo, PDFs extensos y razonamiento lógico.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#020703] border border-[#39ff14]/30 space-y-1">
            <span className="text-[10px] text-[#39ff14] uppercase font-bold block">3. Manus AI</span>
            <p className="text-white font-semibold">¿Quieres que la IA ejecute y complete tareas sola en la web?</p>
            <p className="text-[11px] text-[#a5f3cf]/70">Ideal para automatizar flujos de trabajo e investigación profunda.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#020703] border border-[#ffb703]/30 space-y-1">
            <span className="text-[10px] text-[#ffb703] uppercase font-bold block">4. Copilot</span>
            <p className="text-white font-semibold">¿Quieres generar imágenes gratis o ayuda en tu día a día?</p>
            <p className="text-[11px] text-[#a5f3cf]/70">Ideal para DALL-E 3, resúmenes web y productividad ofimática.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#020703] border border-[#ff0055]/30 space-y-1">
            <span className="text-[10px] text-[#ff0055] uppercase font-bold block">5. Arena AI</span>
            <p className="text-white font-semibold">¿Quieres comparar modelos o probar el #1 del ranking mundial?</p>
            <p className="text-[11px] text-[#a5f3cf]/70">Ideal para benchmarks ciegos y potencia directa de vanguardia.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
