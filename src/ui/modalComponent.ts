import { SecretWordEntry } from '../core/types';
import { StatsManager } from '../storage/statsManager';

export interface ModalCallbacks {
  onPlayAgain: () => void;
  onShare: () => void;
}

export class ModalComponent {
  private overlayElement: HTMLElement;
  private callbacks: ModalCallbacks;

  constructor(overlayId: string = 'game-modal', callbacks: ModalCallbacks) {
    const el = document.getElementById(overlayId);
    if (!el) throw new Error(`Modal overlay #${overlayId} não encontrado.`);
    this.overlayElement = el;
    this.callbacks = callbacks;
    this.setupListeners();
  }

  public showGameResult(won: boolean, secretWord: SecretWordEntry, attemptCount: number): void {
    const statusTitle = document.getElementById('modal-status-text');
    const wordDisplay = document.getElementById('modal-word-display');
    const wordMeaning = document.getElementById('modal-word-meaning');
    const statPlayed = document.getElementById('stat-played');
    const statWinPct = document.getElementById('stat-win-pct');
    const statStreak = document.getElementById('stat-streak');
    const playAgainBtn = document.getElementById('btn-next-word');

    const stats = StatsManager.getStats();

    if (statusTitle) {
      statusTitle.textContent = won
        ? (attemptCount <= 2 ? 'Incrível! 🏆' : attemptCount <= 4 ? 'Sensacional! 🎉' : 'Mandou bem! ✨')
        : 'Quase lá! 💡';
    }

    if (wordDisplay) {
      wordDisplay.textContent = secretWord.displayWord || secretWord.word;
    }

    if (wordMeaning) {
      wordMeaning.textContent = `"${secretWord.meaning}"`;
    }

    if (statPlayed) statPlayed.textContent = stats.played.toString();
    if (statWinPct) statWinPct.textContent = `${StatsManager.getWinPercentage()}%`;
    if (statStreak) statStreak.textContent = stats.currentStreak.toString();

    this.overlayElement.classList.add('active');
    this.overlayElement.setAttribute('aria-hidden', 'false');

    // Focus Trap ergonômico no botão de jogar novamente
    if (playAgainBtn) {
      playAgainBtn.focus();
    }
  }

  public hide(): void {
    this.overlayElement.classList.remove('active');
    this.overlayElement.setAttribute('aria-hidden', 'true');
  }

  public isVisible(): boolean {
    return this.overlayElement.classList.contains('active');
  }

  private setupListeners(): void {
    const playAgainBtn = document.getElementById('btn-next-word');
    const shareBtn = document.getElementById('btn-share-result');

    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.hide();
        this.callbacks.onPlayAgain();
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.callbacks.onShare();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (this.isVisible()) {
        if (e.key === 'Escape') {
          this.hide();
        } else if (e.key === 'Enter') {
          this.hide();
          this.callbacks.onPlayAgain();
        }
      }
    });
  }
}
