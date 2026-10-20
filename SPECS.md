# Especificação Técnica de Implementação (SPECS.md)
## Jogo Casual de Adivinhação de Palavras — Sistema Multi-Tema

**Documento:** Projeto Técnico e Arquitetura de Software  
**Versão:** 1.0.0  
**Data:** 2026-10-20  
**Status:** Aprovado para Implementação  
**Design Escolhido:** Sistema Multi-Tema Completo (*Minimal Zen Dark* padrão, com suporte a *Neo-Brutalist Arcade*, *Editorial Café Warm* e *Modo Daltônico/CVD*)  
**Documentos de Referência:**  
- [PRD - Jogo de Adivinhação de Palavras](file:///c:/Users/User/Downloads/ProjetoAtividade/docs/plans/2026-10-20-jogo-adivinhacao-palavras.md)  
- [Diretrizes de Agentes (AGENTS.md)](file:///c:/Users/User/Downloads/ProjetoAtividade/AGENTS.md)  
- [Protótipo Interativo Funcional (index.html)](file:///c:/Users/User/Downloads/ProjetoAtividade/index.html)  

---

## 1. Visão Geral da Arquitetura & Objetivos de Engenharia

O projeto é concebido como uma Single Page Application (SPA) progressiva (**PWA**) com arquitetura **100% Client-Side**. Não há dependência de servidores de backend ou banco de dados remoto no MVP, garantindo:
1. **Privacidade e Descentralização:** Zero armazenamento de dados sensíveis; todo o progresso do usuário reside no navegador (`LocalStorage`).
2. **Performance Instantânea:** Carregamento inicial em menos de **800ms** (LCP), taxa estável de **60 FPS** em todas as animações, e tamanho total de bundle inferior a **120 KB** (gzipped).
3. **Resiliência Offline Total:** Após a primeira visita, o jogo é 100% funcional sem conexão à internet através de Service Worker.
4. **Excelência Inclusiva (a11y):** Conformidade estrita com a **WCAG 2.2 Níveis AA e AAA**, implementando dupla codificação por símbolos, razão de contraste superior a 4.5:1 e suporte integral a leitores de tela e navegação por teclado.

```
+-------------------------------------------------------------------------+
|                              CAMADA UI / DOM                            |
|  [Header / Temas]      [Grade 6x5 / Animações]      [Teclado Virtual]   |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                        CONTROLLER & EVENT DISPATCHER                    |
|          (Gerenciamento de Foco, Eventos de Toque e Teclado Físico)     |
+-------------------------------------------------------------------------+
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
+-----------------------------------+   +---------------------------------+
|        MOTOR DE JOGO (CORE)       |   |       SISTEMA DE TEMAS          |
|  • Algoritmo Canônico (2 Passadas)|   |  • CSS Custom Properties        |
|  • Normalização de Acentos PT-BR  |   |  • Modo Daltônico (CVD)         |
|  • Validação no Dicionário        |   |  • Sem FOUC (Anti-Flash)        |
+-----------------------------------+   +---------------------------------+
                  │                                   │
                  ▼                                   ▼
+-----------------------------------+   +---------------------------------+
|         CACHE & DICIONÁRIO        |   |       PERSISTÊNCIA LOCAL        |
|  • curatedWords.json (~2.5k)      |   |  • Partida Ativa (Auto-save)    |
|  • validGuesses.bin / Set (~9k)   |   |  • Estatísticas & Streaks       |
+-----------------------------------+   +---------------------------------+
```

---

## 2. Stack Tecnológica & Dependências

- **Runtime & Compilação:** [Node.js](https://nodejs.org/) (v20+) + [Vite](https://vitejs.dev/) (v5+).
- **Linguagem:** **TypeScript 5.x** com modo estrito (`strict: true`, `noImplicitAny: true`).
- **UI Architecture:** Vanilla TypeScript modular com componentização limpa baseada no DOM (ou React 18+ sem dependências de UI pesadas). O uso de Vanilla TS é a abordagem recomendada para garantir peso mínimo (<80KB) e zero overhead de reconciliação de Virtual DOM.
- **Estilização:** CSS Moderno nativo com **CSS Custom Properties** (Variáveis CSS), Flexbox e CSS Grid. Zero frameworks pesados de CSS (como Tailwind ou Bootstrap) para garantir renderização instantânea sem bloat.
- **PWA:** `vite-plugin-pwa` ou Service Worker customizado com estratégia *Cache-First* para assets estáticos.
- **Testes Unitários:** [Vitest](https://vitest.dev/) para validação do motor de regras, tratamento de acentuação e algoritmos de pontuação.

---

## 3. Estrutura de Diretórios e Módulos do Projeto

```
projeto-adivinha/
├── index.html                      # Ponto de entrada HTML e Casca da Aplicação
├── package.json                    # Dependências e scripts de automação
├── tsconfig.json                   # Configuração estrita do TypeScript
├── vite.config.ts                  # Configuração do Vite e plugin PWA
├── public/
│   ├── favicon.ico
│   ├── icon-192.png                # Ícone PWA (Maskable)
│   ├── icon-512.png
│   ├── manifest.webmanifest        # Manifesto da aplicação PWA
│   └── data/
│       ├── secrets.json            # Lista curada de palavras secretas (~2.500)
│       └── dictionary.txt          # Léxico estendido de chutes válidos (~9.000)
├── src/
│   ├── main.ts                     # Bootstrap da aplicação
│   ├── core/                       # Regras puras de negócio (Zero dependência de DOM)
│   │   ├── evaluator.ts            # Algoritmo de validação de chutes em 2 passadas
│   │   ├── normalizer.ts           # Tratamento inteligente de acentos e cedilhas
│   │   ├── wordService.ts          # Sorteio aleatório e busca rápida no dicionário
│   │   └── types.ts                # Interfaces e tipos TypeScript de domínio
│   ├── storage/                    # Gerenciamento de estado local
│   │   ├── localStorageService.ts  # Abstração com tratamento de exceções (private mode)
│   │   └── statsManager.ts         # Cálculo de sequências (streaks) e histórico
│   ├── theme/                      # Motor de estilos e acessibilidade
│   │   ├── themeManager.ts         # Alternador entre Minimal, Arcade, Café e Daltônico
│   │   └── tokens.css              # Definição dos tokens para cada tema
│   ├── ui/                         # Renderização de componentes de interface
│   │   ├── boardComponent.ts       # Grade 6x5 e animações (Pop, Flip, Shake)
│   │   ├── keyboardComponent.ts    # Teclado virtual e listeners físicos
│   │   ├── modalComponent.ts       # Modal de vitória/derrota e estatísticas
│   │   └── toastComponent.ts       # Alertas dinâmicos e live regions ARIA
│   └── styles/
│       ├── base.css                # Reset e estrutura de viewport (100dvh)
│       ├── board.css               # Estilos de células e transições 3D
│       └── keyboard.css            # Layout ergonômico das teclas
└── tests/
    ├── evaluator.test.ts           # Testes canônicos do Wordle (letras repetidas)
    ├── normalizer.test.ts          # Testes de acentuação (ex: ÍMPAR, MAÇÃ, SAGAZ)
    └── stats.test.ts               # Testes de sequência e persistência
```

---

## 4. Modelagem de Dados & Tipos TypeScript (`src/core/types.ts`)

```typescript
/** Estado de avaliação de uma letra após o chute */
export type LetterEvaluation = 'correct' | 'present' | 'absent' | 'empty';

/** Estrutura de uma célula individual do tabuleiro */
export interface TileState {
  letter: string;             // Letra sem acento (ex: 'A')
  displayLetter?: string;      // Letra com acento visual oficial (ex: 'Ã')
  status: LetterEvaluation;
}

/** Configuração dos 3 temas suportados */
export type ThemeId = 'minimal-dark' | 'neo-arcade' | 'editorial-warm';

/** Estrutura da palavra secreta com metadados educativos */
export interface SecretWordEntry {
  word: string;               // Palavra sem acento normalizada (ex: "SAGAZ")
  displayWord: string;        // Palavra oficial formatada (ex: "SAGAZ" ou "ÍMPAR")
  meaning: string;            // Definição sucinta de dicionário
  class?: string;             // Ex: "adjetivo", "substantivo"
}

/** Objeto de estatísticas persistido no LocalStorage */
export interface UserStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessesDistribution: { [attempt: number]: number }; // Contagem de 1 a 6
  lastCompletedDate?: string;
}

/** Estado da partida em andamento (para restauração após reload) */
export interface ActiveGameSession {
  secretWord: SecretWordEntry;
  guesses: string[];          // Lista de palavras já submetidas
  currentAttempt: number;     // Linha ativa (0 a 5)
  isCompleted: boolean;
  hasWon: boolean;
}

/** Preferências de interface do usuário */
export interface UserPreferences {
  theme: ThemeId;
  colorblindMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}
```

---

## 5. Algoritmo Canônico de Avaliação (`src/core/evaluator.ts`)

O tratamento de **letras repetidas** deve seguir estritamente o algoritmo canônico do Wordle/Termo para evitar falsos positivos (ex: a palavra secreta possui apenas um `A` e o jogador chuta `ARARA`).

### 5.1. Algoritmo em Duas Passadas

```typescript
import { LetterEvaluation } from './types';

export function evaluateGuess(guess: string, secret: string): LetterEvaluation[] {
  const result: LetterEvaluation[] = new Array(5).fill('absent');
  const secretChars = secret.split('');
  const guessChars = guess.split('');
  
  // Mapa de frequência de letras disponíveis na palavra secreta
  const letterCounts: { [char: string]: number } = {};
  for (const char of secretChars) {
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }

  // 1ª Passada: Identificar todas as posições EXATAS (Verdes / 'correct')
  // Os acertos exatos consom as letras da palavra secreta prioritariamente
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === secretChars[i]) {
      result[i] = 'correct';
      letterCounts[guessChars[i]]--;
    }
  }

  // 2ª Passada: Identificar letras DESLOCADAS (Amarelas / 'present')
  // Apenas atribui se ainda houver ocorrências não consumidas
  for (let i = 0; i < 5; i++) {
    if (result[i] !== 'correct') {
      const char = guessChars[i];
      if (letterCounts[char] && letterCounts[char] > 0) {
        result[i] = 'present';
        letterCounts[char]--;
      } else {
        result[i] = 'absent';
      }
    }
  }

  return result;
}
```

### 5.2. Normalização e Tratamento de Acentos (`src/core/normalizer.ts`)

No Português, o jogador digita sem acentos. A normalização utiliza a decomposição canônica Unicode (NFD):

```typescript
export function normalizeWord(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos diacríticos
    .replace(/Ç/gi, 'C')             // Normaliza cedilha
    .toUpperCase()
    .trim();
}
```

Ao revelar uma palavra que originalmente contém acentos (ex: `ÍMPAR`), o frontend substitui as letras normalizadas pelas originais com acento visual no momento da animação de revelação.

---

## 6. Sistema Multi-Tema & Tokens de Design (`src/theme/`)

A troca dinâmica de temas é gerenciada via atributos no elemento `<body>`:
- `data-theme="minimal-dark"` (Padrão)
- `data-theme="neo-arcade"`
- `data-theme="editorial-warm"`
- `data-colorblind="true|false"` (Modo Daltônico Universal)

### 6.1. Definição Central de Tokens CSS (`src/theme/tokens.css`)

```css
/* ========================================================
   TEMA 1: MINIMAL DARK / ZEN FOCUS (Tema Padrão)
   ======================================================== */
[data-theme="minimal-dark"] {
  --bg-primary: #0F1115;
  --bg-surface: #1A1D24;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --border-cell: 1px solid #282D37;
  --border-active: 2px solid #64748B;
  --radius-cell: 4px;
  --radius-key: 6px;
  --radius-modal: 12px;
  --font-family: 'Inter', sans-serif;
  --font-ui: 'Inter', sans-serif;
  --shadow-cell: none;
  --shadow-key: none;

  /* Cores Funcionais Acessíveis */
  --color-correct: #10B981;
  --color-correct-text: #FFFFFF;
  --color-present: #F59E0B;
  --color-present-text: #0F1115;
  --color-absent: #334155;
  --color-absent-text: #94A3B8;
  --color-key-default: #262B35;
  --color-key-action: #333C4D;
  --focus-ring: #60A5FA;
}

/* ========================================================
   TEMA 2: NEO-BRUTALIST ARCADE
   ======================================================== */
[data-theme="neo-arcade"] {
  --bg-primary: #FFFDF0;
  --bg-surface: #FFFFFF;
  --text-primary: #121212;
  --text-secondary: #4A4A4A;
  --border-cell: 2.5px solid #121212;
  --border-active: 3px solid #121212;
  --radius-cell: 4px;
  --radius-key: 4px;
  --radius-modal: 8px;
  --font-family: 'Space Grotesk', sans-serif;
  --font-ui: 'Space Grotesk', sans-serif;
  --shadow-cell: 3px 3px 0px #121212;
  --shadow-key: 2px 2px 0px #121212;

  --color-correct: #00E599;
  --color-correct-text: #121212;
  --color-present: #FFE600;
  --color-present-text: #121212;
  --color-absent: #CBD5E1;
  --color-absent-text: #64748B;
  --color-key-default: #FFFFFF;
  --color-key-action: #FF3366;
  --focus-ring: #121212;
}

/* ========================================================
   TEMA 3: EDITORIAL WARM / CAFÉ LITERÁRIO
   ======================================================== */
[data-theme="editorial-warm"] {
  --bg-primary: #F7F4EE;
  --bg-surface: #FFFFFF;
  --text-primary: #2C2621;
  --text-secondary: #7A7067;
  --border-cell: 1.5px solid #DDD5C7;
  --border-active: 2px solid #A89F91;
  --radius-cell: 8px;
  --radius-key: 6px;
  --radius-modal: 16px;
  --font-family: 'Merriweather', 'Georgia', serif;
  --font-ui: 'Plus Jakarta Sans', sans-serif;
  --shadow-cell: 0 2px 6px rgba(60, 45, 30, 0.05);
  --shadow-key: 0 2px 0px #CFC7B7;

  --color-correct: #4A6B53;
  --color-correct-text: #FAF8F5;
  --color-present: #C88D41;
  --color-present-text: #FAF8F5;
  --color-absent: #D8D2C7;
  --color-absent-text: #7A7067;
  --color-key-default: #EFECE6;
  --color-key-action: #DDD5C7;
  --focus-ring: #C05C46;
}

/* ========================================================
   MODO DALTÔNICO UNIVERSAL (WCAG 2.2 AAA - PALETA WONG)
   ======================================================== */
[data-colorblind="true"] {
  --color-correct: #E66100 !important;      /* Laranja de alto contraste */
  --color-correct-text: #FFFFFF !important;
  --color-present: #0072B2 !important;      /* Azul Celeste */
  --color-present-text: #FFFFFF !important;
  --color-absent: #4A4A4A !important;       /* Grafite escuro */
  --color-absent-text: #FFFFFF !important;
  --focus-ring: #FFDF00 !important;
}
```

### 6.2. Prevenção de FOUC (Flash of Unstyled Content)

No `<head>` do `index.html`, insere-se um script inline síncrono para ler o tema do `localStorage` antes da pintura inicial:

```html
<script>
  (function() {
    const savedTheme = localStorage.getItem('adivinha_theme') || 'minimal-dark';
    const isColorblind = localStorage.getItem('adivinha_colorblind') === 'true';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-colorblind', isColorblind);
  })();
</script>
```

---

## 7. Componentes de Interface & Micro-interações (`src/ui/`)

### 7.1. Grade de Células (Board Grid)
- **Dimensões e Proporção:** Grade 6x5 em `aspect-ratio: 5/6`, contida em container com `max-width: 330px`.
- **Animações Fluidas:**
  1. **Pop de Digitação:** Escala de `1.0` ➔ `1.12` ➔ `1.0` em **100ms** com curva elástica `cubic-bezier(0.18, 0.89, 0.32, 1.28)`.
  2. **Flip 3D Sequencial:** Rotação no eixo X (`rotateX(90deg)` na subida para aplicar a cor e `rotateX(0deg)` na descida). Duração de **450ms** por célula com escalonamento (*stagger*) de **180ms** entre cada uma das 5 colunas.
  3. **Shake de Erro:** Oscilação horizontal (`±6px`) de **400ms** na linha ativa quando a palavra não existir no léxico ou tiver menos de 5 letras.
- **Dupla Codificação Visual (a11y):** Quando `data-colorblind="true"`, cada célula avaliada renderiza um marcador tipográfico fixo no topo direito:
  - Correto: `✓`
  - Deslocado: `◆`
  - Ausente: `✕`

### 7.2. Teclado Virtual Ergonômico (Mobile-First)
- **Target Sizes (WCAG 2.5.8):** Teclas com altura mínima de **52px** em dispositivos móveis, com área invisível expandida (`::after` de 4px) para evitar toques concorrentes.
- **Prevenção de Zoom Acidental:** Aplicar `touch-action: manipulation` e `user-select: none`.
- **Suporte a Teclado Físico:** Listener em `window.addEventListener('keydown')` capturando letras de `A` a `Z`, `Enter`, `Backspace` e `Escape`.

### 7.3. Modal de Fim de Partida & Rejogabilidade Ilimitada
- **Gatilho de Vitória/Derrota:** Aberto suavemente após a conclusão da animação de flip da última letra.
- **Conteúdo Exibido:**
  - Título comemorativo (*"Sensacional! 🎉"* ou *"Quase lá! 💡"*).
  - Exibição da palavra oficial com sua definição do dicionário.
  - Grade de estatísticas (Partidas, % Vitórias, Sequência Atual e Maior Sequência).
  - **Botão "Jogar Próxima Palavra":** Recebe o foco automático do teclado (`autofocus`). Pressionar `Enter` inicia imediatamente uma nova rodada sem recarregar a página.
  - **Botão "Copiar Grade de Emojis":** Gera resumo sem spoiler para compartilhamento no WhatsApp e Twitter (ex: `Adivinha #42 3/6\n🟩⬛🟨⬛⬛\n🟩🟩🟩🟩🟩`).

---

## 8. Persistência de Dados (`src/storage/`)

### 8.1. Estrutura das Chaves no `LocalStorage`

| Chave | Tipo | Descrição |
| :--- | :--- | :--- |
| `adivinha_stats` | `UserStats` (JSON) | Partidas, vitórias, sequência atual, melhor sequência e distribuição. |
| `adivinha_active_game` | `ActiveGameSession` (JSON) | Estado atual da partida para restauro se a aba for fechada. |
| `adivinha_theme` | `string` | Tema ativo (`minimal-dark`, `neo-arcade`, `editorial-warm`). |
| `adivinha_colorblind` | `boolean` | Flag de ativação do Modo Daltônico. |

### 8.2. Tratamento de Falhas e Navegação Anônima

```typescript
export class LocalStorageService {
  public static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage indisponível ou limite de quota atingido.', e);
    }
  }

  public static getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }
}
```

---

## 9. Diretrizes de Acessibilidade (WCAG 2.2 Checklist)

- [x] **SC 1.4.3 (Contraste Mínimo):** Razão de contraste mínima de 4.5:1 para texto normal e 3:1 para componentes de interface.
- [x] **SC 1.4.1 (Uso de Cores):** Nenhuma informação essencial é transmitida unicamente por cor; ativação de símbolos geométricos (`✓`, `◆`, `✕`) no modo daltônico.
- [x] **SC 2.1.1 (Teclado):** Toda a experiência de jogo e todos os modais podem ser operados exclusivamente via teclado físico.
- [x] **SC 2.4.3 (Ordem de Foco):** Focus trap rígido dentro dos modais abertos e retorno do foco ao elemento de origem ao fechar.
- [x] **SC 2.5.8 (Tamanho do Alvo):** Teclas virtuais com altura mínima de 52px e botões de cabeçalho de 44x44px.
- [x] **SC 4.1.3 (Mensagens de Status):** Avisos dinâmicos gerenciados com `aria-live="polite"` (anúncio de rodada avaliada) e `role="alert"` (erros de palavra não reconhecida).

---

## 10. Estratégia PWA & Capacidade Offline

### 10.1. Manifesto da Aplicação (`public/manifest.webmanifest`)

```json
{
  "name": "Adivinha - Jogo Casual de Palavras",
  "short_name": "Adivinha",
  "description": "Jogo casual e inteligente de adivinhação de palavras com modo ilimitado e multi-temas.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F1115",
  "theme_color": "#0F1115",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 10.2. Service Worker (`public/sw.js`)
Configuração de cache com estratégia **Cache-First** para:
- HTML, JavaScript e CSS minificados.
- Arquivos de dados de palavras (`secrets.json` e `dictionary.txt`).
- Fontes do Google Fonts em cache permanente (`CacheStorage`).

---

## 11. Plano de Testes Automatizados (Vitest)

O motor de regras será coberto por uma suíte de testes unitários automatizados em `tests/evaluator.test.ts`:

1. **Teste de Chute Correto Perfeito:** Chute `TERMO` contra segredo `TERMO` ➔ `['correct', 'correct', 'correct', 'correct', 'correct']`.
2. **Teste de Letras Repetidas Excedentes:** Chute `ARARA` contra segredo `SAGAZ` (possui apenas 2 'A's) ➔ apenas os dois primeiros 'A's recebem marcação amarela/verde; o terceiro é marcado como `absent`.
3. **Teste de Precedência Verde sobre Amarelo:** Chute `PAPEL` contra segredo `PLENA` ➔ a letra `P` na posição 0 é verde; o segundo `P` na posição 2 é cinza.
4. **Teste de Normalização de Acentuação:** Chute de `FACIL` validado com sucesso contra a palavra secreta `FÁCIL`.
5. **Teste de Validação de Léxico:** Chute de sequência inexistente (`ZXQTB`) rejeitado sem consumo de tentativa.

---

## 12. Fases de Execução do Roadmap

| Fase | Entregáveis Técnicos | Critério de Sucesso |
| :--- | :--- | :--- |
| **Fase 1: Setup & Engine** | Configuração Vite + TypeScript + `evaluator.ts` + Dicionários | 100% dos testes unitários passando no Vitest |
| **Fase 2: UI & Board** | Grade 6x5 reativa + Teclado virtual ergonômico | Digitação fluida e atalhos físicos operacionais |
| **Fase 3: Multi-Tema** | Tokens CSS dos 3 temas + Modo Daltônico + Anti-FOUC | Troca instantânea de tema sem travamentos |
| **Fase 4: Estatísticas** | LocalStorage + Modal de Vitória/Definição + Emojis | Histórico e streaks calculados corretamente |
| **Fase 5: PWA & Auditoria**| Service Worker + Manifest + Auditoria Lighthouse | Nota 100 em Acessibilidade e Performance |
