import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'

import Skeleton from 'react-loading-skeleton'

import { useInsight } from '@/hooks/useInsight'

import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const {
    insight,
    isLoading,
    error,
    fetchInsight,
    conversations,
    askQuestion,
    isQuestionLoading,
    questionError,
  } = useInsight(simulationId)
  const [question, setQuestion] = useState('')
  const historyEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations.length, isQuestionLoading])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const sent = await askQuestion(question)

    if (sent) {
      setQuestion('')
    }
  }

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId)
          }}
        />
      )}
      {!isLoading && insight && !error && (
        <>
          <div className="lg:scrollbar-thin lg:max-h-93 lg:overflow-y-auto lg:pr-2 lg:[scrollbar-color:var(--border)_transparent]">
            <Content insight={insight} />

            {conversations.map((conversation) => (
              <div
                key={conversation.createdAt}
                className="border-border mt-5 border-t pt-4 text-sm"
              >
                <p className="text-foreground mb-2 flex items-center gap-2 font-semibold">
                  <MessageCircle className="text-primary" size={20} /> Você
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {conversation.question}
                </p>
                <p className="text-foreground mb-2 flex items-center gap-2 font-semibold">
                  <MessageCircle className="text-primary" size={20} /> Resposta da IA
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {conversation.answer}
                </p>
              </div>
            ))}
            {isQuestionLoading && (
              <p className="text-muted-foreground border-border mt-5 border-t pt-4 text-sm">
                A IA está preparando uma resposta...
              </p>
            )}
            <div ref={historyEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-2">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Quais são os investimentos mais seguros para aumentar minha renda?"
              disabled={isQuestionLoading}
              aria-label="Faça uma pergunta sobre sua simulação"
              className="bg-input text-foreground placeholder:text-muted-foreground min-w-0 flex-1 rounded-2xl px-4 py-3 text-xs outline-none ring-primary focus:ring-1 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!question.trim() || isQuestionLoading}
              aria-label="Enviar pergunta"
              className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={17} />
            </button>
          </form>
          {questionError && (
            <p className="text-red-500 mt-2 text-xs" role="alert">
              {questionError}
            </p>
          )}
        </>
      )}
    </div>
  )
}
