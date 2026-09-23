# FOCAR.RAW — Regras Inegociáveis de Construção

Sistema de gestão para fotógrafo(a) solo: agendamentos, Kanban de produção, financeiro parcelado e metas. Usuário único (admin).

## Stack (fixo, não trocar)

- **Vite + JavaScript ES6 nativo (módulos `import`/`export`)**. Proibido introduzir React, Vue, Svelte ou qualquer framework de UI.
- **Firebase**: Authentication, Firestore, Storage. Sem backend próprio (sem Node/Express custom).
- Sem bibliotecas de CSS (Tailwind, Bootstrap etc.) — CSS puro com variáveis, arquivos em `src/styles/`.

## Estrutura de pastas (não reorganizar sem necessidade real)

```
src/
├── main.js                 # Inicialização e roteador de telas
├── styles/                 # theme.css, layout.css, kanban.css, components.css
├── config/firebase.js      # Setup de Auth, Firestore e Storage
├── services/                # shoots, finance, storage, whatsapp, auth — um arquivo por domínio
├── views/                   # DashboardView, KanbanView, FinanceView, ShootDetailModal
└── utils/                    # dateUtils, formatters, dom
```

## Autenticação

- **Usuário único (admin)** via Firebase Auth e-mail/senha. Sem cadastro público, sem múltiplos papéis/roles.
- Nunca commitar credenciais. Configuração do Firebase sempre via `import.meta.env.VITE_FIREBASE_*`, lidas de `.env.local` (gitignored). `.env.local.example` é o template público sem valores.

## Modelo de dados (Firestore) — schema fixo

- `shoots/{shootId}`: ensaio/agendamento. Campos obrigatórios: `clientName`, `clientPhone`, `serviceType`, `date`, `location`, `photosContracted`, `deliveryDeadline`, `status` (`agendado | fotografado | em_edicao | pronto_entrega | concluido`), `financial` (ver abaixo).
- `goals/{year}`: metas anuais/semestrais/mensais (`annualTarget`, `semesters.s1/s2`, `months.1..12`).
- `financial.installments[]`: cada parcela tem `number`, `amount`, `dueDate`, `paid`, `paidAt?`. Formas de pagamento: `pix | cartao_credito | cartao_debito | boleto | dinheiro`.
- Não alterar esse schema sem atualizar este documento.

## Storage — escopo atual

- Apenas `/shoots/{shootId}/cover.jpg` e `/shoots/{shootId}/final/`. **Não implementar upload de RAW** (`raw/`) — decisão explícita para não estourar o free tier (5GB) do Firebase Storage.

## Design system

- Cores **somente** via variáveis CSS definidas em [src/styles/theme.css](src/styles/theme.css) (`--color-primary`, `--color-bg`, `--color-success`, etc.). Nunca hardcodar hex fora desse arquivo.
- Modo dark fixo (fundo `#0B111E`) — não implementar modo claro.
- Semânticas de cor são fixas: verde = pago/concluído, laranja = atenção (<72h ou vence hoje), vermelho = vencido/atrasado.

## Regras de negócio fixas

- **Ordenação do Kanban**: dentro de cada coluna, o card com data mais próxima fica sempre no topo.
- **Colunas do Kanban** (não adicionar/remover sem pedido explícito): Agendado → Fotografado/Em Seleção → Em Edição → Pronto para Entrega → Concluído.
- **WhatsApp**: apenas links `wa.me` com mensagem pré-preenchida (deep link). Nunca integrar WhatsApp Business API oficial (custo/complexidade fora de escopo).
- Moeda e datas: formato brasileiro (`R$ 0.000,00`, `dd/mm/aaaa`), locale `pt-BR`.

## Git / ambiente

- Repositório: `https://github.com/pixchdesigner-collab/CH` (branch `main`).
- **Nunca** commitar `.env`, `.env.local` ou qualquer chave/segredo.
- Push exige autenticação interativa do usuário (Git Credential Manager) — não é possível autenticar via terminal não-interativo.
- Ambiente Windows: `node`, `npm`, `git` foram instalados via `winget` nesta máquina; se um comando não for reconhecido no PowerShell, reexecutar prefixando com refresh do PATH a partir do registro (instalação recente pode não estar no PATH do processo corrente).

## Escopo — não expandir sem confirmação do usuário

- Sem multi-usuário/multi-fotógrafo.
- Sem app mobile nativo (é uma SPA web responsiva).
- Sem pagamento online integrado (gateway de pagamento) — controle financeiro é só registro manual de status de parcela.
