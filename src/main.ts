import './theme/tokens.css';
import './styles/base.css';

import { ThemeManager } from './theme/themeManager';
import { WordService } from './core/wordService';
import { evaluateGuess } from './core/evaluator';
import { normalizeWord } from './core/normalizer';
import { SecretWordEntry, LetterEvaluation } from './core/types';
import { StatsManager } from './storage/statsManager';
import { BoardComponent } from './ui/boardComponent';
import { KeyboardComponent } from './ui/keyboardComponent';
import { ToastComponent } from './ui/toastComponent';
import { ModalComponent } from './ui/modalComponent';

class GameApp {
  private board: BoardComponent;
  private keyboard: KeyboardComponent;
  private toast: ToastComponent;
  private modal: ModalComponent;

  private currentSecret: SecretWordEntry;
  private currentSecretIndex: number;
  private currentRow: number = 0;
  private currentCol: number = 0;
  private currentGuessLetters: string[] = [];
  private guessHistory: { guess: string; evaluations: LetterEvaluation[] }[] = [];
  private isProcessingGuess: boolean = false;
  private isGameOver: boolean = false;

  constructor() {
    ThemeManager.init();

    this.toast = new ToastComponent('game-toast');
    this.board = new BoardComponent('board-grid');
    this.keyboard = new KeyboardComponent('virtual-keyboard', (key) => this.handleKeyPress(key));

    this.modal = new ModalComponent('game-modal', {
      onPlayAgain: () => this.startNewGame(),
      onShare: () => this.shareResult()
    });

    const initialWordData = WordService.getRandomSecretWord();
    this.currentSecret = initialWordData.entry;
    this.currentSecretIndex = initialWordData.index;

    this.setupUIControls();
    this.updateStreakBadge();
  }

  private handleKeyPress(key: string): void {
    if (this.isGameOver || this.isProcessingGuess) return;

    if (key === 'ENTER') {
      this.submitCurrentGuess();
    } else if (key === '⌫' || key === 'BACKSPACE') {
      this.deleteLetter();
    } else if (/^[A-ZÇ]$/i.test(key) && key.length === 1) {
      this.addLetter(key.toUpperCase());
    }
  }

  private addLetter(letter: string): void {
    if (this.currentCol < 5) {
      this.currentGuessLetters.push(letter);
      this.board.setLetter(this.currentRow, this.currentCol, letter);
      this.currentCol++;
    }
  }

  private deleteLetter(): void {
    if (this.currentCol > 0) {
      this.currentCol--;
      this.currentGuessLetters.pop();
      this.board.removeLetter(this.currentRow, this.currentCol);
    }
  }

  private async submitCurrentGuess(): Promise<void> {
    if (this.currentGuessLetters.length < 5) {
      this.board.shakeRow(this.currentRow);
      this.toast.show('Preencha as 5 letras!');
      return;
    }

    const rawGuess = this.currentGuessLetters.join('');
    const normalizedGuess = normalizeWord(rawGuess);

    // Validação léxica no dicionário
    if (!WordService.isValidGuess(normalizedGuess)) {
      this.board.shakeRow(this.currentRow);
      this.toast.show('Palavra não reconhecida no dicionário');
      return;
    }

    this.isProcessingGuess = true;

    // Avaliação canônica em duas passadas
    const evaluations = evaluateGuess(normalizedGuess, this.currentSecret.word);

    // Decomposição dos caracteres com acento se for o chute vencedor
    const displayLetters = (normalizedGuess === this.currentSecret.word && this.currentSecret.displayWord)
      ? this.currentSecret.displayWord.split('')
      : undefined;

    // Animação de revelação com flip 3D
    await this.board.revealRow(
      this.currentRow,
      evaluations,
      displayLetters,
      (_col, letter, status) => {
        this.keyboard.updateKeyStatus(letter, status);
      }
    );

    this.guessHistory.push({ guess: normalizedGuess, evaluations });

    const won = normalizedGuess === this.currentSecret.word;
    const isLastAttempt = this.currentRow === 5;

    if (won || isLastAttempt) {
      this.isGameOver = true;
      const attemptCount = this.currentRow + 1;
      StatsManager.recordGame(won, attemptCount);
      this.updateStreakBadge();

      // Breve pausa para o jogador celebrar antes de abrir o modal
      setTimeout(() => {
        this.modal.showGameResult(won, this.currentSecret, attemptCount);
      }, 500);
    } else {
      this.currentRow++;
      this.currentCol = 0;
      this.currentGuessLetters = [];
    }

    this.isProcessingGuess = false;
  }

  private startNewGame(): void {
    const nextWordData = WordService.getRandomSecretWord([this.currentSecretIndex]);
    this.currentSecret = nextWordData.entry;
    this.currentSecretIndex = nextWordData.index;

    this.currentRow = 0;
    this.currentCol = 0;
    this.currentGuessLetters = [];
    this.guessHistory = [];
    this.isGameOver = false;
    this.isProcessingGuess = false;

    this.board.initBoard();
    this.keyboard.resetKeys();
    this.updateStreakBadge();
    this.toast.show('Nova palavra sorteada! Boa sorte!', 1500);
  }

  private shareResult(): void {
    const won = this.guessHistory.some(g => g.guess === this.currentSecret.word);
    const score = won ? `${this.currentRow + 1}/6` : 'X/6';
    const streak = StatsManager.getStats().currentStreak;

    let emojiGrid = '';
    this.guessHistory.forEach(entry => {
      const line = entry.evaluations.map(status => {
        if (status === 'correct') return '🟩';
        if (status === 'present') return '🟨';
        return '⬛';
      }).join('');
      emojiGrid += `${line}\n`;
    });

    const shareText = `Adivinha (Modo Ilimitado) ${score}\n🔥 Sequência: ${streak}\n\n${emojiGrid}\nJogue agora!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        this.toast.show('Resultado copiado com sucesso!', 2000);
      }).catch(() => {
        this.toast.show('Não foi possível copiar o texto.');
      });
    }
  }

  private updateStreakBadge(): void {
    const badge = document.getElementById('streak-counter');
    if (badge) {
      badge.textContent = StatsManager.getStats().currentStreak.toString();
    }
  }

  private setupUIControls(): void {
    // Seletor de Temas
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTheme = btn.getAttribute('data-theme-target') as any;
        if (targetTheme) {
          ThemeManager.setTheme(targetTheme);
          themeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });

    // Alternador Modo Daltônico
    const cbBtn = document.getElementById('btn-toggle-colorblind');
    if (cbBtn) {
      cbBtn.addEventListener('click', () => {
        const isEnabled = ThemeManager.toggleColorblindMode();
        cbBtn.classList.toggle('active', isEnabled);
        this.toast.show(isEnabled ? 'Modo Daltônico Ativado (CVD)' : 'Modo Padrão Ativado', 1500);
      });
    }

    // Botão de Ajuda
    const helpBtn = document.getElementById('nav-btn-help');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.toast.show('Descubra a palavra em até 6 tentativas. Verde = certa; Amarelo = deslocada; Cinza = ausente.', 4000);
      });
    }
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
