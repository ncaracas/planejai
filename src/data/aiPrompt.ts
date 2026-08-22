import { parseCurrency } from '@/utils/currency'
import { calcMonthlySavings } from '@/utils/simulation'

import type { InsightConversation, SimulationRecord } from './simulation'

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnóstico focado no comprometimento do orçamento: quanto % da renda está comprometida com gastos e dívidas, e o que isso representa para a saúde financeira.>"
  },
  "suggestions": {
    "items": ["<Sugestão prática e concreta para reduzir gastos ou reorganizar o orçamento>"]
  },
  "extraIncome": {
    "items": ["<Ideia prática para gerar renda extra compatível com a realidade brasileira>"]
  },
  "investment": {
    "items": ["<Sugestão de investimento acessível para o perfil apresentado, com foco em atingir a meta>"]
  },
  "motivation": {
    "content": "<Mensagem final motivacional e personalizada, citando a meta pelo nome.>"
  }
}`

export function buildAIPrompt(simulation: SimulationRecord) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation

  const monthlySavings = calcMonthlySavings(simulation)
  const monthlySavingsNeeded =
    parseCurrency(goalAmount) / parseInt(goalDeadline)

  return `Você é um educador financeiro especializado em finanças pessoais. 
    Analise os dados abaixo e gere um diagnóstico financeiro personalizado com linguagem clara, didática e encorajadora, 
    voltado para pessoas sem conhecimento financeiro. O diagnóstico será exibido diretamente ao usuário no app, 
    fale sempre em segunda pessoa ("você tem...", "sua meta...").

    Dados da simulação:
    - Renda mensal bruta: ${income}
    - Custos fixos essenciais: ${expenses}
    - Dívidas e parcelas mensais: ${debts}
    - Valor disponível por mês: ${monthlySavings} reais
    - Meta: ${goalName}
    - Custo da meta: ${goalAmount}
    - Prazo desejado: ${goalDeadline} meses
    - Economia mensal necessária para atingir a meta no prazo: ${monthlySavingsNeeded} reais
    - Saldo após reserva para a meta: ${monthlySavings - monthlySavingsNeeded} reais

    Retorne APENAS um JSON válido, sem texto adicional, sem blocos de código, neste formato exato:

    ${RESPONSE_SCHEMA}

    Regras:
    - Todos os textos em português do Brasil
    - Máximo de 4 itens por lista
    - Seja específico ao citar valores calculados
    - Não repita informações entre seções
    - Nunca use markdown dentro dos valores do JSON
    - Para o campo "feasibility.status", use os seguintes critérios:
      - "viable": saldo após reserva para a meta é maior ou igual a 0
      - "needs_adjustment": saldo negativo de até 20% do valor da economia mensal necessária
      - "unfeasible": saldo negativo superior a 20% do valor da economia mensal necessária`
}

export function buildAIQuestionPrompt(
  simulation: SimulationRecord,
  insight: SimulationRecord['insight'],
  conversations: InsightConversation[],
  question: string,
) {
  return `Você é um educador financeiro especializado em finanças pessoais e está continuando uma conversa sobre uma simulação já analisada.
Responda diretamente à pergunta do usuário, em português do Brasil, com linguagem clara, didática, objetiva e encorajadora. Use segunda pessoa ("você"). Considere os dados da simulação e o insight original como contexto. Não invente dados, não dê garantias de rentabilidade e sinalize quando uma decisão exigir avaliação profissional.

Dados da simulação:
- Renda mensal bruta: ${simulation.income}
- Custos fixos essenciais: ${simulation.expenses}
- Dívidas e parcelas mensais: ${simulation.debts}
- Meta: ${simulation.goalName}
- Custo da meta: ${simulation.goalAmount}
- Prazo desejado: ${simulation.goalDeadline} meses

Insight financeiro original:
${JSON.stringify(insight)}

Histórico da conversa:
${conversations.length ? conversations.map(({ question: previousQuestion, answer }) => `Usuário: ${previousQuestion}\nIA: ${answer}`).join('\n\n') : 'Ainda não há perguntas anteriores.'}

Nova pergunta do usuário:
${question}

Responda apenas com a resposta final, sem JSON, sem markdown e sem repetir o insight inteiro.`
}
