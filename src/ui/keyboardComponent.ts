import { LetterEvaluation } from '../core/types';

export type KeyPressHandler = (key: string) => void;

export class KeyboardComponent {
  private containerElement: HTMLElement;
  private keyElements: Map<string, HTMLButtonElement> = new Map();
  private onKeyPress: KeyPressHandler;

  private static readonly KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  constructor(containerId: string = 'virtual-keyboard', onKeyPress: KeyPressHandler) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container do teclado #${containerId} não encontrado.`);
    this.containerElement = el;
    this.onKeyPress = onKeyPress;

    this.render();
    this.setupPhysicalKeyboard();
  }

  public render(): void {
    this.containerElement.innerHTML = '';
    this.keyElements.clear();

    KeyboardComponent.KEYBOARD_ROWS.forEach(rowKeys => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'keyboard-row';

      rowKeys.forEach(key => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'key-btn';
        btn.setAttribute('data-key', key);
        btn.setAttribute('aria-label', key === '⌫' ? 'Apagar letra' : key === 'ENTER' ? 'Confirmar palavra' : `Tecla ${key}`);
        btn.textContent = key;

        if (key === 'ENTER' || key === '⌫') {
          btn.classList.add('key-wide');
        }

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.onKeyPress(key);
        });

        rowDiv.appendChild(btn);
        this.keyElements.set(key, btn);
      });

      this.containerElement.appendChild(rowDiv);
    });
  }

  public updateKeyStatus(letter: string, status: LetterEvaluation): void {
    const upper = letter.toUpperCase();
    const btn = this.keyElements.get(upper);
    if (!btn) return;

    if (status === 'correct') {
      btn.className = 'key-btn correct';
      btn.setAttribute('aria-label', `Tecla ${upper}, correta na posição`);
    } else if (status === 'present' && !btn.classList.contains('correct')) {
      btn.className = 'key-btn present';
      btn.setAttribute('aria-label', `Tecla ${upper}, em outra posição`);
    } else if (status === 'absent' && !btn.classList.contains('correct') && !btn.classList.contains('present')) {
      btn.className = 'key-btn absent';
      btn.setAttribute('aria-label', `Tecla ${upper}, ausente`);
    }

    if (upper === 'ENTER' || upper === '⌫') {
      btn.classList.add('key-wide');
    }
  }

  public resetKeys(): void {
    this.keyElements.forEach((btn, key) => {
      btn.className = 'key-btn';
      if (key === 'ENTER' || key === '⌫') {
        btn.classList.add('key-wide');
      }
      btn.setAttribute('aria-label', key === '⌫' ? 'Apagar letra' : key === 'ENTER' ? 'Confirmar palavra' : `Tecla ${key}`);
    });
  }

  private setupPhysicalKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      // Ignora se o usuário estiver digitando em um input ou textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Enter') {
        this.onKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        this.onKeyPress('⌫');
      } else if (/^[a-zA-ZçÇ]$/.test(e.key) && e.key.length === 1) {
        this.onKeyPress(e.key.toUpperCase());
      }
    });
  }
}
