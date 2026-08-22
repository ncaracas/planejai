import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt, buildAIQuestionPrompt } from '@/data/aiPrompt'
import type { InsightConversation, SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import {
  getInsight,
  getInsightAnswer,
  type InsightData,
} from '@/services/aiService'

export const useInsight = (id: string) => {
  const isRequestPending = useRef(false)
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id)

    if (simulation?.insight) {
      return simulation.insight
    }

    return null
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<InsightConversation[]>(
    () => getFormData(id)?.conversations ?? [],
  )
  const [isQuestionLoading, setIsQuestionLoading] = useState(false)
  const [questionError, setQuestionError] = useState<string | null>(null)

  // Necessário o uso do useCallback pois temos que colocar essa função
  // Como array de dependências do useEffect
  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        setInsight(data)

        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord)
      } catch {
        setError('Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  useEffect(() => {
    // Evita loop infinito de requisições para a API do Gemini
    if (insight || isLoading || error || isRequestPending.current) {
      return
    }

    fetchInsight(id)
  }, [id, insight, isLoading, error, fetchInsight])

  const askQuestion = async (question: string) => {
    const trimmedQuestion = question.trim()
    const simulation = getFormData(id)

    if (!trimmedQuestion || !simulation || !insight || isQuestionLoading) {
      return false
    }

    setIsQuestionLoading(true)
    setQuestionError(null)

    try {
      const prompt = buildAIQuestionPrompt(
        simulation,
        insight,
        conversations,
        trimmedQuestion,
      )
      const answer = await getInsightAnswer(prompt)
      const conversation: InsightConversation = {
        question: trimmedQuestion,
        answer,
        createdAt: new Date().toISOString(),
      }
      const nextConversations = [...conversations, conversation]

      setConversations(nextConversations)
      updateSimulation(id, {
        ...simulation,
        insight,
        conversations: nextConversations,
      } as SimulationRecord)
      return true
    } catch {
      setQuestionError('Não foi possível responder agora. Tente novamente.')
      return false
    } finally {
      setIsQuestionLoading(false)
    }
  }

  return {
    insight,
    isLoading,
    error,
    fetchInsight,
    conversations,
    askQuestion,
    isQuestionLoading,
    questionError,
  }
}
