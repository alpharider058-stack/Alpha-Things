export interface OSApp {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'games' | 'media' | 'ai' | 'education' | 'tools' | 'custom';
  icon: string; // path to svg or icon name
  accentColor: string;
  defaultUrl?: string;
  isBuiltIn?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
  badge?: string;
  aiDetails?: {
    tagline: string;
    whatItDoes: string;
    whenToUse: string;
    strengths: string[];
    recommendedFor: string;
  };
  mantleModes?: {
    id: string;
    label: string;
    url: string;
    description: string;
    icon: string;
  }[];
}

export interface OSWindow {
  id: string;
  appId: string;
  title: string;
  icon: string;
  url?: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  activeTab?: string;
  activeView?: 'web' | 'info';
}

export const SYSTEM_APPS: OSApp[] = [
  {
    id: 'mantle',
    name: 'Mantle',
    description: 'Suite unificada de Classroom Alpha Five, Biología y Alpha Core en un único entorno.',
    category: 'education',
    icon: '/apps/mantle.svg',
    accentColor: '#8b5cf6',
    defaultUrl: 'https://classroom-alpha-five.vercel.app/',
    defaultWidth: 1060,
    defaultHeight: 680,
    badge: 'UNIFICADO',
    mantleModes: [
      {
        id: 'alpha-five',
        label: 'Classroom Alpha Five',
        url: 'https://classroom-alpha-five.vercel.app/',
        description: 'Aula digital colaborativa para gestión de tareas, clases y asignaturas.',
        icon: '🎓',
      },
      {
        id: 'biologia',
        label: 'Classroom Biología',
        url: 'https://classroom-biologia.vercel.app/',
        description: 'Módulo de ciencias naturales, anatomía interactiva y materiales de biología.',
        icon: '🧬',
      },
      {
        id: 'alpha-hack',
        label: 'Alpha Core & Tools',
        url: 'https://alpha-hack.vercel.app/',
        description: 'Utilidades de terminal, pruebas de concepto y herramientas avanzadas.',
        icon: '⚡',
      },
    ],
  },
  {
    id: 'browser',
    name: 'Navegador',
    description: 'Navegador web híbrido con soporte para Cloud VM (Hyperbeam), proxies y web abierta.',
    category: 'tools',
    icon: '/apps/browser.svg',
    accentColor: '#38bdf8',
    defaultUrl: 'https://www.bing.com',
    defaultWidth: 1060,
    defaultHeight: 700,
    badge: 'HYBRID VM',
  },
  {
    id: 'gtav',
    name: 'GTA V Online',
    description: 'Grand Theft Auto V playable en el navegador con aceleración WebGL.',
    category: 'games',
    icon: '/apps/gtav.svg',
    accentColor: '#10b981',
    defaultUrl: 'https://gta.deloskiyt.pl/',
    defaultWidth: 1100,
    defaultHeight: 700,
    badge: 'WEBGL',
  },
  {
    id: 'cineos',
    name: 'Cine-OS',
    description: 'Entorno de escritorio multimedia interactivo para streaming y entretenimiento.',
    category: 'media',
    icon: '/apps/cineos.svg',
    accentColor: '#06b6d4',
    defaultUrl: 'https://cineosweb.github.io/',
    defaultWidth: 1040,
    defaultHeight: 660,
    badge: 'MULTIMEDIA',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'Motor de búsqueda conversacional con fuentes en tiempo real y fact-checking.',
    category: 'ai',
    icon: '/apps/perplexity.svg',
    accentColor: '#22d3ee',
    defaultUrl: 'https://www.perplexity.ai/',
    defaultWidth: 980,
    defaultHeight: 660,
    badge: 'SEARCH AI',
    aiDetails: {
      tagline: 'Motor de Búsqueda Conversacional con Fuentes en Tiempo Real',
      whatItDoes:
        'Rastrea e indexa la web en tiempo real para responder a cualquier pregunta sintetizando múltiples fuentes directas. Aporta notas al pie con enlaces a los artículos y webs consultadas, resúmenes organizados y preguntas sugeridas para profundizar.',
      whenToUse:
        'Úsala cuando necesites buscar información reciente al minuto, contrastar hechos con enlaces verificables, recopilar fuentes para un trabajo, investigar noticias de actualidad o cuando los buscadores tradicionales te den resultados confusos o saturados de publicidad.',
      strengths: [
        'Citas directas con enlaces web verificables',
        'Información actualizada al segundo',
        'Búsqueda guiada Pro Search con filtros',
        'Mínimas alucinaciones en datos y citas',
      ],
      recommendedFor: 'Investigación web, noticias recientes, consultas académicas y verificación de datos.',
    },
  },
  {
    id: 'claude',
    name: 'Claude AI',
    description: 'Razonamiento complejo, redacción humana impecable y programación avanzada.',
    category: 'ai',
    icon: '/apps/claude.svg',
    accentColor: '#d97757',
    defaultUrl: 'https://claude.ai/',
    defaultWidth: 980,
    defaultHeight: 660,
    badge: 'REASONING',
    aiDetails: {
      tagline: 'Razonamiento Complejo, Escritura Humana y Programación de Élite',
      whatItDoes:
        'Desarrollado por Anthropic con un fuerte enfoque en seguridad, precisión y empatía de tono. Es el modelo referente en comprensión de lenguaje natural, estructuración de código de software avanzado, razonamiento lógico riguroso y análisis de documentos inmensos (PDFs de cientos de páginas).',
      whenToUse:
        'Úsala cuando vayas a programar software o depurar scripts complejos, redactar documentos largos o ensayos con tono humano impecable, sintetizar informes o libros en PDF, o cuando requieras un razonamiento reflexivo profundo sin repeticiones automáticas.',
      strengths: [
        'Programación y refactorización de código limpio',
        'Redacción fluida sin tono robótico',
        'Ventana de contexto colosal (200K+ tokens)',
        'Gran fidelidad lógica y matices conceptuales',
      ],
      recommendedFor: 'Desarrollo de software, análisis de documentos largos, ensayos y razonamiento avanzado.',
    },
  },
  {
    id: 'manus',
    name: 'Manus AI',
    description: 'Agente general autónomo capaz de ejecutar tareas complejas en la nube.',
    category: 'ai',
    icon: '/apps/manus.svg',
    accentColor: '#a1a1aa',
    defaultUrl: 'https://manus.im/app',
    defaultWidth: 980,
    defaultHeight: 660,
    badge: 'GENERAL AGENT',
    aiDetails: {
      tagline: 'Agente General Autónomo para Ejecución de Tareas Complejas',
      whatItDoes:
        'Pionero en el paradigma de agentes que no solo responden texto, sino que navegan por internet, ejecutan código en sandbox, procesan datos en hojas de cálculo y entregan entregables terminados de extremo a extremo sin supervisión continua.',
      whenToUse:
        'Úsala cuando tengas una tarea que requiera múltiples pasos consecutivos en la web (investigar 20 empresas, descargar datos, compararlos y armar un informe estructurado) y prefieras delegar la ejecución completa en vez de chatear paso a paso.',
      strengths: [
        'Autonomía en tareas secuenciales multinivel',
        'Uso activo de herramientas, navegación y código',
        'Generación de entregables finales estructurados',
        'Ahorro masivo de tiempo en flujos de trabajo repetitivos',
      ],
      recommendedFor: 'Automatización de flujos de trabajo, extracción de datos, informes exhaustivos y tareas delegadas.',
    },
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    description: 'Asistente de productividad integrado con el ecosistema Microsoft y web.',
    category: 'ai',
    icon: '/apps/copilot.svg',
    accentColor: '#38bdf8',
    defaultUrl: 'https://copilot.microsoft.com/',
    defaultWidth: 980,
    defaultHeight: 660,
    badge: 'ASSISTANT',
    aiDetails: {
      tagline: 'Compañero Cotidiano Integrado con Bing, DALL-E y Productividad',
      whatItDoes:
        'El asistente de inteligencia artificial de Microsoft integrado con la tecnología GPT de OpenAI, generación de imágenes con DALL-E 3 y conexión en vivo al índice de Bing.',
      whenToUse:
        'Úsala para consultas rápidas diarias, generación rápida de imágenes artísticas a partir de descripciones textuales, redacción de correos electrónicos y consultas generales del día a día.',
      strengths: [
        'Generación gratuita de imágenes con DALL-E',
        'Integración fluida con el ecosistema Microsoft',
        'Estilos de respuesta ajustables (Creativo, Equilibrado, Preciso)',
        'Acceso rápido sin configuraciones avanzadas',
      ],
      recommendedFor: 'Generación de imágenes, consultas cotidianas, redacción de correos y resúmenes ágiles.',
    },
  },
  {
    id: 'arena',
    name: 'LMSYS Chatbot Arena',
    description: 'Punto de referencia ciego para comparar los mejores modelos de IA del mundo.',
    category: 'ai',
    icon: '/apps/arena.svg',
    accentColor: '#f59e0b',
    defaultUrl: 'https://arena.ai/text/direct?model_a=max',
    defaultWidth: 1040,
    defaultHeight: 680,
    badge: 'BENCHMARK',
    aiDetails: {
      tagline: 'Coliseo de Evaluación Comparativa a Doble Ciego entre Modelos',
      whatItDoes:
        'Plataforma de investigación desarrollada por LMSYS Org donde los usuarios prueban y comparan los modelos de IA más avanzados del mundo (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5/2.0 Pro, Llama 3, etc.) cara a cara.',
      whenToUse:
        'Úsala cuando tengas una duda o consulta muy difícil y quieras ver cómo la resuelven dos modelos distintos simultáneamente para elegir la mejor respuesta o descubrir cuál modelo rinde mejor en tu caso particular.',
      strengths: [
        'Acceso directo a múltiples modelos de vanguardia',
        'Comparación cara a cara con la misma consulta',
        'Evaluación objetiva sin sesgo comercial',
        'Ranking global Elo actualizado por la comunidad científica',
      ],
      recommendedFor: 'Comparativa de respuestas complejas, benchmarking, pruebas de prompts y selección del mejor modelo.',
    },
  },
  {
    id: 'settings',
    name: 'Ajustes de Sistema',
    description: 'Personaliza el fondo de pantalla, tipografía, efectos liquid glass y clics.',
    category: 'system',
    icon: '/apps/settings.svg',
    accentColor: '#94a3b8',
    defaultWidth: 780,
    defaultHeight: 560,
    badge: 'SISTEMA',
  },
];
