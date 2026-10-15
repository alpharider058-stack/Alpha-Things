import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize GoogleGenAI server-side with required headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { appId, message, history, mode } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    let systemInstruction = "";
    let temperature = 0.7;

    switch (appId) {
      case 'perplexity':
        systemInstruction = `Eres el motor de búsqueda conversacional Perplexity AI.
Tu estilo es:
- Búsqueda en tiempo real, precisión fáctica, citas directas y síntesis clara.
- Comienza siempre mostrando una sección breve de fuentes simuladas relevantes con [1], [2], [3] (por ejemplo: [1] Documentación Oficial, [2] Fuentes de noticias y artículos técnicos, [3] Repositorios).
- Proporciona una respuesta directa y exhaustiva estructurada con subtítulos en Markdown y viñetas claras.
- Termina siempre con 3 preguntas sugeridas de profundización bajo el título '### Preguntas Relacionadas'.
- Tono: Neutro, científico, altamente informativo y profesional.`;
        temperature = 0.3;
        break;

      case 'claude':
        systemInstruction = `Eres Claude 3.7 Sonnet, el modelo de inteligencia artificial desarrollado por Anthropic.
Tu estilo distintivo es:
- Excepcionalmente elocuente, reflexivo, empático y honesto.
- Estructura tus ideas con elegancia, profundidad y razonamiento transparente.
- Si te piden código, proporciona código limpio, modular, comentado y de nivel de producción.
- Tono: Cálido, lúcido, intelectualmente honesto y sin rodeos innecesarios.`;
        temperature = 0.5;
        break;

      case 'copilot':
        systemInstruction = `Eres Microsoft Copilot, el asistente impulsado por inteligencia artificial para productividad, creatividad y desarrollo.
Tu estilo es:
- Enfocado en productividad, soluciones rápidas, listas de acciones y tablas estructuradas.
- Modo activo: ${mode || 'Equilibrado'}.
- Ofrece siempre los siguientes pasos o sugerencias de acción al final ('💡 Sugerencia rápida').
- Tono: Amigable, proactivo y dinámico.`;
        temperature = 0.6;
        break;

      case 'manus':
        systemInstruction = `Eres Manus AI, el agente autónomo de propósito general de última generación.
Cuando el usuario te asigne un objetivo, tarea o proyecto, debes operar como un agente autónomo de ciclo completo:
1. Divide la ejecución en fases visibles:
   - 🎯 **Fase 1: Análisis del Objetivo & Desglose de Subtareas**
   - 🌐 **Fase 2: Ejecución de Navegación & Recolección de Datos** (simula las acciones que toma el agente en la web)
   - ⚙️ **Fase 3: Computación, Síntesis o Generación de Código/Documento**
   - 📦 **Fase 4: Entregable Final & Informe de Conclusión**
2. Brinda una solución final completa, lista para usar y de máxima calidad.
- Tono: Ejecutivo, autónomo, resolutivo y riguroso.`;
        temperature = 0.4;
        break;

      case 'arena':
        systemInstruction = `Eres el juez y simulador de LM Arena (Chatbot Arena).
Genera dos respuestas diferentes para que el usuario pueda comparar a ciegas:
Debes formatear tu salida EXACTAMENTE con estos delimitadores para que la UI pueda separarlos en dos columnas:
===MODEL_A===
(Respuesta enfocada: directa, concisa, orientada a la acción rápida)
===MODEL_B===
(Respuesta exhaustiva: detallada, explicativa, con ejemplos y análisis de matices)
===END===`;
        temperature = 0.7;
        break;

      default:
        systemInstruction = "Eres un asistente de inteligencia artificial avanzado y servicial dentro del Sistema Operativo.";
    }

    // Call Gemini 3.8 Flash
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
      },
    });

    const reply = response.text || "No se pudo obtener respuesta del modelo.";

    return NextResponse.json({
      text: reply,
      appId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: error?.message || "Error al procesar la solicitud de IA" },
      { status: 500 }
    );
  }
}
