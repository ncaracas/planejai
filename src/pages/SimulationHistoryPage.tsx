import { ExternalLink, Goal, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

const formatCurrency = (value: string) =>
  `R$ ${Number(value.replace(/\./g, '').replace(',', '.')).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatDate = (simulation: SimulationRecord) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(simulation.createdAt))
}

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { getSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState(getSimulations)

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations((current) => current.filter((simulation) => simulation.id !== id))
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Histórico de simulações
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe o histórico dos seus planos financeiros.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void navigate('/')}
          className="bg-primary text-primary-foreground flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
        >
          <Plus size={17} /> Nova simulação
        </button>
      </div>

      {simulations.length === 0 ? (
        <section className="bg-card flex flex-col items-center rounded-2xl px-6 py-16 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)]">
          <Goal className="text-primary mb-4" size={32} />
          <h2 className="text-lg font-semibold">Nenhuma simulação salva</h2>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            Crie sua primeira simulação para acompanhar sua evolução financeira.
          </p>
        </section>
      ) : (
        <div className="flex flex-col gap-4">
          {simulations.map((simulation) => (
            <article
              key={simulation.id}
              className="bg-card grid gap-5 rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.14)] sm:grid-cols-[minmax(170px,1.15fr)_repeat(3,minmax(120px,1fr))_auto] sm:items-center sm:gap-4 sm:px-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-foreground text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Goal size={21} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold">{simulation.goalName}</h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">{formatDate(simulation)}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">Custo da meta</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(simulation.goalAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">Prazo</p>
                <p className="mt-1 text-sm font-semibold">{simulation.goalDeadline} meses</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">Economia mensal</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(String(calcMonthlySavings(simulation)).replace('.', ','))}</p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
                <button
                  type="button"
                  aria-label={`Excluir simulação ${simulation.goalName}`}
                  title="Excluir simulação"
                  onClick={() => handleDelete(simulation.id)}
                  className="text-red-500 rounded-lg p-2 transition-opacity hover:opacity-70"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => void navigate(`/resultado/${simulation.id}`)}
                  className="bg-secondary-button border-border flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium whitespace-nowrap transition-opacity hover:opacity-80"
                >
                  <ExternalLink size={14} /> Ver detalhes
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}