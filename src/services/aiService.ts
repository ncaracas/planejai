interface GeminiResponse {
  candidates?: {
    content: {
      parts: { text: string }[]
    }
  }[]
  error?: {
    message?: string
  }
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim()
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL?.trim() || 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`

const callGeminiAPI = async (prompt: string) => {
  if (!API_KEY) {
    throw new Error('A chave da API Gemini não foi configurada.')
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  })

  const data = (await response.json()) as GeminiResponse

  if (!response.ok) {
    throw new Error(data.error?.message || `Erro na requisição: ${response.status}`)
  }

  return data
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('A API Gemini não retornou um diagnóstico válido.')
  }

  const json = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')

  return JSON.parse(json) as InsightData
}
