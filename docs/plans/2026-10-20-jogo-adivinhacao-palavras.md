# PRD - Jogo Casual de Adivinhação de Palavras (Estilo Termo / Wordle)

**Data de Criação:** 2026-10-20  
**Status:** Aprovado para Desenvolvimento  
**Versão:** 1.0.0  
**Autores:** Antigravity & Usuário  

---

## 1. Visão Geral & Resumo Executivo

O projeto consiste em um **jogo casual de adivinhação de palavras** em Português do Brasil, operando no modelo **Web App Responsivo / PWA**, 100% gratuito, limpo e sem anúncios.

Inspirado nos grandes sucessos do gênero como *Termo* e *Wordle*, a jogabilidade é baseada em dedução ortográfica posicional com pistas visuais por cores (verde, amarelo e cinza) em até 6 tentativas para palavras de 5 letras. O foco inicial está na fluidez, alta rejogabilidade (com o **Modo Ilimitado / Treino Livre** como modo principal para sessões consecutivas), retenção orgânica, rastreamento de sequências (*streaks*) e compartilhamento em redes sociais.

---

## 2. Objetivos e Métricas de Sucesso (KPIs)

### 2.1. Objetivos do Produto
- **Acessibilidade Imediata:** Acesso instantâneo via navegador sem cadastro, login ou download de loja de aplicativos.
- **Fricção Zero:** Inicialização ultrarrápida (menos de 1 segundo de carregamento) e jogabilidade offline via PWA.
- **Engajamento e Rejogabilidade:** Permitir que o jogador desfrute de partidas infinitas consecutivas no Modo Ilimitado, sem bloqueios de tempo ou barreiras de energia/vida.
- **Tratamento Idiomático de Excelência:** Validação e suporte primoroso para a língua portuguesa, incluindo tratamento transparente de acentos e cedilha.

### 2.2. Métricas de Sucesso (KPIs)
- **Tempo de Sessão e Partidas por Usuário:** Média de 3 a 5 partidas consecutivas por sessão no Modo Ilimitado.
- **Taxa de Conclusão de Partida:** > 85% de partidas iniciadas que chegam a uma vitória ou derrota.
- **Taxa de Compartilhamento:** > 15% das vitórias compartilhadas através da grade de emojis no WhatsApp, X (Twitter) ou Instagram Stories.
- **Performance Web (Core Web Vitals):** LCP < 1.2s, INP < 100ms, CLS = 0.

---

## 3. Personas e Casos de Uso

### 3.1. Persona Principal: "O Pensador Casual"
- **Perfil:** Usuário de smartphone ou computador em momentos de pausa (transporte público, intervalo de almoço ou antes de dormir).
- **Necessidade:** Um passatempo inteligente de 2 a 5 minutos que estimule o vocabulário e a lógica sem estresse ou frustração por propagandas invasivas.
- **Comportamento:** Gosta de registrar seu progresso, bater seus próprios recordes de vitórias seguidas e desafiar amigos ou familiares compartilhando o resultado.

---

## 4. Mecânicas de Jogo e Regras de Negócio

### 4.1. Regras do Jogo
1. **Tamanho da Palavra:** Cada partida possui uma palavra secreta de **5 letras**.
2. **Limite de Tentativas:** O jogador possui **6 tentativas** para acertar a palavra secreta.
3. **Validação do Chute:**
   - O palpite deve ser uma palavra real existente no dicionário oficial de palavras aceitas do jogo.
   - Não são aceitas sequências aleatórias de letras (ex: `AAAAA`, `ZXQTB`). Se a palavra não existir, a linha treme (efeito *shake*) e o jogador não perde a tentativa.
4. **Sistema de Cores de Feedback:**
   - 🟩 **Verde (Correto):** A letra existe na palavra secreta e está na posição exata.
   - 🟨 **Amarelo (Deslocado):** A letra existe na palavra secreta, mas está em outra posição.
   - ⬛ **Cinza (Inexistente):** A letra não pertence à palavra secreta.
5. **Regra de Letras Repetidas (Algoritmo Canônico Wordle):**
   - As letras verdes (posições corretas) têm prioridade de atribuição.
   - Se a palavra secreta tiver apenas uma ocorrência da letra `A` e o usuário chutar uma palavra com dois `A`s, apenas um deles será colorido (verde se estiver na posição certa, ou amarelo se na posição errada); o segundo `A` excedente será marcado como cinza.
6. **Tratamento de Acentuação em Português:**
   - O jogador digita sem se preocupar em colocar acentos (ex: digita `SAGAZ` ou `FUMAR`).
   - Se a palavra correta contiver acento (ex: `ÍMPAR`, `MAÇÃ`, `FÁCIL`), a interface adiciona os acentos e cedilhas automaticamente na revelação, mantendo a digitação simples e ágil tanto no teclado virtual quanto no teclado físico.

### 4.2. Modo Ilimitado / Treino Livre
- O jogo sorteia uma palavra aleatória da lista de palavras secretas curadas.
- Ao vencer ou perder, o jogador visualiza a palavra correta com sua definição sucinta e pode clicar imediatamente no botão **"Próxima Palavra" / "Jogar Novamente"**.
- O histórico de vitórias da sessão e a sequência atual são mantidos continuamente.

---

## 5. Requisitos Funcionais de Interface (UI/UX)

```
+------------------------------------------+
|  [?] AJUDA       ADIVINHA       [STATS]  |
+------------------------------------------+
|                                          |
|            [ T ][ E ][ R ][ M ][ O ]     |
|            [   ][   ][   ][   ][   ]     |
|            [   ][   ][   ][   ][   ]     |
|            [   ][   ][   ][   ][   ]     |
|            [   ][   ][   ][   ][   ]     |
|            [   ][   ][   ][   ][   ]     |
|                                          |
+------------------------------------------+
|  [Q][W][E][R][T][Y][U][I][O][P]          |
|    [A][S][D][F][G][H][J][K][L]           |
|   [ENTER] [Z][X][C][V][B][N][M] [⌫]      |
+------------------------------------------+
```

### 5.1. Componentes Principais
1. **Header Superior:**
   - Botão de Ajuda / "Como Jogar" (modal com exemplos visuais das cores).
   - Título e logo minimalista do jogo.
   - Botão de Estatísticas / Histórico.
   - Alternador de Tema (Modo Escuro / Claro / Modo Alto Contraste para daltônicos).

2. **Grade de Palpites (Board Grid):**
   - Matriz 6 x 5 com células quadradas de bordas sutis.
   - Animação de digitação: leve efeito de pulso (*scale pop*) ao preencher cada letra.
   - Animação de revelação: rotação no eixo X (*flip animation*) letra a letra da esquerda para a direita ao pressionar `ENTER`.
   - Animação de erro: tremor horizontal (*shake*) caso a palavra seja inválida ou incompleta.

3. **Teclado Virtual na Tela:**
   - Layout padrão QWERTY adaptado para telas sensíveis ao toque (mobile-first).
   - Teclas de utilidade: `ENTER` e `DEL` (Backspace) com tamanho ergonômico.
   - As teclas do teclado virtual atualizam dinamicamente suas cores conforme as letras são testadas no tabuleiro, auxiliando a dedução do jogador.
   - Suporte nativo completo a teclas do teclado físico (Desktop e tablets).

4. **Modal de Fim de Partida:**
   - Mensagem de parabéns ou incentivo.
   - Exibição destacada da palavra secreta com link ou popover com sua definição no dicionário.
   - Dashboard de estatísticas:
     - Partidas Jogadas.
     - % de Vitórias.
     - Sequência Atual (*Current Streak*).
     - Melhor Sequência (*Max Streak*).
     - Gráfico de distribuição de tentativas (em quantos chutes o jogador costuma acertar).
   - **Botão de Compartilhamento:** copia para a área de transferência a grade em emojis (ex: `Adivinha #14 3/6\n🟩⬛🟨⬛⬛\n🟩🟩🟩🟩🟩`).
   - **Botão "Jogar Novamente":** reinicia uma nova rodada instantaneamente.

5. **Modal de Ajuda / Tutorial:**
   - Explicação concisa das regras com 3 linhas de exemplo demonstrando uma letra verde, uma amarela e uma cinza.

---

## 6. Arquitetura Técnica & Stack Recomendada

### 6.1. Stack Tecnológica
- **Linguagem & Framework:** TypeScript + React / Vite (ou HTML5/CSS3/Vanilla TS moderno sem dependências pesadas).
- **Estilização:** CSS moderno com Custom Properties (Variáveis CSS) para suporte nativo e instantâneo a temas Claro/Escuro e Modo Daltônico.
- **PWA (Progressive Web App):**
  - `manifest.json` com ícones em alta resolução e modo `standalone`.
  - Service Worker para cache local de assets (HTML, JS, CSS, fontes e dicionário), permitindo jogar 100% offline.
- **Persistência de Dados:** `window.localStorage` para armazenar:
  - Estado da partida ativa (letras já digitadas na rodada).
  - Objeto de estatísticas (jogos, vitórias, sequência, distribuição).
  - Preferências de acessibilidade e tema.

### 6.2. Estrutura de Dicionário
- **Lista de Palavras Secretas (`words.json`):** Lista curada com cerca de 1.500 a 3.000 substantivos e adjetivos comuns de 5 letras em português, excluindo palavras arcaicas, ofensivas ou conjugações verbais obscuras.
- **Lista de Validação de Chutes (`validGuesses.json`):** Dicionário ampliado com mais de 8.000 palavras em português para aceitar qualquer palpite válido do jogador, evitando a frustração de "palavra não reconhecida".

---

## 7. Requisitos Não-Funcionais (NFRs)

- **Performance:**
  - Tamanho total do pacote inicial < 150 KB (gzipped).
  - Taxa de quadros constante de 60 FPS nas animações CSS de revelação e digitação.
- **Acessibilidade (a11y):**
  - Rótulos ARIA (`aria-label`) para cada célula informando o estado da letra para leitores de tela (ex: *"letra A, correta"*).
  - Modo Alto Contraste que substitui Verde/Amarelo por Laranja/Azul Celeste para facilitar a visualização por daltônicos.
- **Compatibilidade:**
  - Compatível com Google Chrome, Safari, Firefox, Edge em iOS, Android, macOS e Windows.

---

## 8. Roadmap de Implementação

| Fase | Entregável | Detalhes |
| :--- | :--- | :--- |
| **Fase 1: Motor de Regras** | `gameLogic.ts` & Dicionário | Implementação do algoritmo de validação de palavras, tratamento de letras repetidas e testes unitários. |
| **Fase 2: Interface & Grid** | Layout HTML/CSS + Teclado | Grid responsivo de 6x5 e teclado virtual com suporte a teclado físico e mobile. |
| **Fase 3: Ciclo do Jogo** | Interatividade e Animações | Animações de flip, shake, atualização dinâmica de cores nas teclas e tabuleiro. |
| **Fase 4: Estatísticas & Modais**| Telas de Ajuda e Fim de Jogo | Modal de vitória/derrota com estatísticas em LocalStorage e gerador de grade de emojis compartilhável. |
| **Fase 5: PWA & Polimento** | Service Worker & Acessibilidade | Configuração de PWA para instalação no celular/desktop e implementação do Modo Alto Contraste. |
