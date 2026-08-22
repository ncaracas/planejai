# Planej.ai

Aplicação web de planejamento financeiro pessoal, criada como desafio final do Bootcamp Santander 2026 da DIO.

## O que o projeto faz

O usuário informa sua renda, gastos, dívidas e uma meta financeira. A aplicação calcula a economia mensal necessária e usa a IA do Google Gemini para gerar um insight personalizado, com:

- análise de viabilidade da meta;
- diagnóstico financeiro;
- sugestões práticas;
- ideias de renda extra;
- sugestões de investimento;
- mensagem final personalizada.

As simulações ficam salvas no navegador, sem necessidade de backend ou banco de dados remoto.

## Como executar

### Pré-requisitos

- Node.js instalado;
- uma chave da API do Google Gemini.

### Instalação

Na pasta do projeto, execute:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com a chave da API:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

Opcionalmente, defina o modelo usado pela aplicação:

```env
VITE_GEMINI_MODEL=gemini-flash-latest
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra no navegador o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Tecnologias usadas

- React 19;
- TypeScript;
- Vite;
- React Router;
- Tailwind CSS;
- Lucide React, para os ícones;
- React Loading Skeleton, para o carregamento do insight;
- Google Gemini API, para gerar os diagnósticos e respostas;
- `localStorage`, para salvar simulações e conversas no navegador.

## Melhorias implementadas nos desafios

### Histórico de simulações

Foi criada uma página de histórico para consultar as simulações salvas. Nela é possível ver um resumo da meta, acessar os resultados novamente e excluir registros. A página também suporta os temas claro e escuro e diferentes tamanhos de tela.

### Conversa com o educador financeiro

O card de insight ganhou um campo para perguntas adicionais. A cada pergunta, a IA recebe os dados da simulação, o insight original e o histórico da conversa. Assim, as respostas continuam relacionadas ao planejamento realizado.

Também foram adicionados:

- respostas claras exibidas no próprio card;
- indicador de carregamento;
- mensagem de erro com possibilidade de tentar novamente;
- rolagem automática para a resposta mais recente;
- quantidade ilimitada de perguntas por simulação;
- histórico completo de perguntas e respostas;
- persistência da conversa no `localStorage`.

## Como testar o fluxo principal

1. Execute `npm run dev` e abra a aplicação.
2. Preencha renda mensal, custos fixos, dívidas, nome da meta, custo e prazo.
3. Clique em **Gerar simulação**.
4. Aguarde o insight financeiro aparecer na página de resultados.
5. Faça uma pergunta no campo localizado abaixo do insight e envie.
6. Confirme o carregamento, a resposta da IA e a rolagem automática até a nova resposta.
7. Faça outras perguntas e verifique se todo o histórico continua visível.
8. Volte ao histórico, abra a mesma simulação e confirme que as conversas foram preservadas.

Para validar o projeto por comandos, use:

```bash
npm run build
npm run lint
```

## O que aprendemos durante o desafio

- Como organizar uma aplicação React com componentes, páginas, hooks e rotas.
- Como usar TypeScript para definir os dados das simulações, insights e conversas.
- Como integrar uma API de IA generativa e montar prompts com contexto real do usuário.
- Como controlar estados de carregamento, erro e novas interações assíncronas.
- Como persistir dados no `localStorage` e manter compatibilidade com registros antigos.
- Como criar uma interface responsiva com temas claro e escuro.
- Como validar o projeto com build e lint antes da entrega.
