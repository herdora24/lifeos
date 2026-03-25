const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export type AIProvider = 'openai' | 'gemini';

export interface AIRequest {
  prompt: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
}

export async function generateContent(request: AIRequest): Promise<string> {
  const { prompt, provider = 'openai', temperature = 0.7, maxTokens = 500 } = request;

  if (provider === 'gemini' && GEMINI_API_KEY) {
    return generateWithGemini(prompt, temperature, maxTokens);
  }

  if (provider === 'openai' && OPENAI_API_KEY) {
    return generateWithOpenAI(prompt, temperature, maxTokens);
  }

  return getFallbackContent(prompt);
}

async function generateWithOpenAI(prompt: string, temperature: number, maxTokens: number): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Contenido no disponible';
}

async function generateWithGemini(prompt: string, temperature: number, maxTokens: number): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    }
  );

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Contenido no disponible';
}

function getFallbackContent(prompt: string): string {
  if (prompt.toLowerCase().includes('oración') || prompt.toLowerCase().includes('prayer')) {
    return 'Señor, gracias por este nuevo día. Guía mis pasos y bendice mis decisiones. Amén.';
  }
  if (prompt.toLowerCase().includes('biblia') || prompt.toLowerCase().includes('bible')) {
    return 'La palabra de Dios es viva y eficaz. Que hoy puedas encontrar sabiduría en sus páginas.';
  }
  if (prompt.toLowerCase().includes('meditación') || prompt.toLowerCase().includes('meditation')) {
    return 'En este momento de quietud, encuentra paz y claridad para tu día.';
  }
  return 'Contenido generado por IA. Configura tu API key para obtener contenido personalizado.';
}

export async function generatePrayer(type: 'morning' | 'night'): Promise<string> {
  const prompt = type === 'morning'
    ? 'Genera una oración matutina breve y significativa en español que inspire gratitud y propósito para el día.'
    : 'Genera una oración nocturna breve en español para cerrar el día con gratitud y paz.';
  return generateContent({ prompt });
}

export async function generateBibleReflection(book: string, chapter: number): Promise<string> {
  const prompt = `Genera una reflexión breve en español sobre ${book} capítulo ${chapter} que sea significativa y aplicable a la vida diaria.`;
  return generateContent({ prompt });
}

export async function generateMeditationFocus(): Promise<string> {
  const prompt = 'Genera un tema de meditación breve en español relacionado con paz interior, gratitud o crecimiento personal.';
  return generateContent({ prompt });
}
