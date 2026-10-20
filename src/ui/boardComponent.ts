import { LetterEvaluation } from '../core/types';

export class BoardComponent {
  private gridElement: HTMLElement;
  private rows: HTMLElement[] = [];
  private tiles: HTMLElement[][] = [];

  constructor(gridElementId: string = 'board-grid') {
    const el = document.getElementById(gridElementId);
    if (!el) throw new Error(`Elemento #${gridElementId} não encontrado no DOM.`);
    this.gridElement = el;
    this.initBoard();
  }

  public initBoard(): void {
    this.gridElement.innerHTML = '';
    this.rows = [];
    this.tiles = [];

    for (let r = 0; r < 6; r++) {
      const row = document.createElement('div');
      row.className = 'board-row';
      row.id = `row-${r}`;
      row.setAttribute('role', 'row');
      row.setAttribute('aria-label', `Tentativa ${r + 1} de 6`);

      const rowTiles: HTMLElement[] = [];

      for (let c = 0; c < 5; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile-${r}-${c}`;
        tile.setAttribute('role', 'gridcell');
        tile.setAttribute('aria-label', `Letra ${c + 1}: Vazio`);

        const symbolSpan = document.createElement('span');
        symbolSpan.className = 'tile-symbol';
        symbolSpan.setAttribute('aria-hidden', 'true');
        tile.appendChild(symbolSpan);

        const letterSpan = document.createElement('span');
        letterSpan.className = 'tile-text';
        tile.appendChild(letterSpan);

        row.appendChild(tile);
        rowTiles.push(tile);
      }

      this.gridElement.appendChild(row);
      this.rows.push(row);
      this.tiles.push(rowTiles);
    }
  }

  public setLetter(row: number, col: number, letter: string): void {
    if (row < 0 || row >= 6 || col < 0 || col >= 5) return;
    const tile = this.tiles[row][col];
    const letterSpan = tile.querySelector('.tile-text') as HTMLElement;
    letterSpan.textContent = letter;
    tile.classList.add('pop');
    tile.setAttribute('aria-label', `Letra ${col + 1}: ${letter}`);
  }

  public removeLetter(row: number, col: number): void {
    if (row < 0 || row >= 6 || col < 0 || col >= 5) return;
    const tile = this.tiles[row][col];
    const letterSpan = tile.querySelector('.tile-text') as HTMLElement;
    letterSpan.textContent = '';
    tile.classList.remove('pop');
    tile.setAttribute('aria-label', `Letra ${col + 1}: Vazio`);
  }

  public shakeRow(row: number): void {
    if (row < 0 || row >= 6) return;
    const rowEl = this.rows[row];
    rowEl.classList.remove('shake');
    void rowEl.offsetWidth; // Força reflow para reiniciar animação
    rowEl.classList.add('shake');
  }

  public async revealRow(
    row: number,
    evaluations: LetterEvaluation[],
    displayLetters?: string[],
    onTileReveal?: (col: number, letter: string, status: LetterEvaluation) => void
  ): Promise<void> {
    if (row < 0 || row >= 6) return;

    for (let c = 0; c < 5; c++) {
      await new Promise(resolve => setTimeout(resolve, c === 0 ? 0 : 180));

      const tile = this.tiles[row][c];
      const letterSpan = tile.querySelector('.tile-text') as HTMLElement;
      const symbolSpan = tile.querySelector('.tile-symbol') as HTMLElement;
      const status = evaluations[c];

      tile.classList.add('flip');

      // Aplica classes de cor
      tile.classList.add(status);

      // Aplica letra com acento visual oficial se fornecida
      if (displayLetters && displayLetters[c]) {
        letterSpan.textContent = displayLetters[c];
      }

      // Aplica símbolo de acessibilidade para daltônicos
      if (status === 'correct') {
        symbolSpan.textContent = '✓';
      } else if (status === 'present') {
        symbolSpan.textContent = '◆';
      } else {
        symbolSpan.textContent = '✕';
      }

      tile.setAttribute('aria-label', `Letra ${c + 1}: ${letterSpan.textContent}, ${this.getStatusDescription(status)}`);

      if (onTileReveal) {
        onTileReveal(c, letterSpan.textContent || '', status);
      }
    }

    // Aguarda o término da animação da última célula
    await new Promise(resolve => setTimeout(resolve, 350));
  }

  private getStatusDescription(status: LetterEvaluation): string {
    switch (status) {
      case 'correct': return 'correta na posição';
      case 'present': return 'em outra posição';
      case 'absent': return 'ausente na palavra';
      default: return 'não avaliada';
    }
  }
}
