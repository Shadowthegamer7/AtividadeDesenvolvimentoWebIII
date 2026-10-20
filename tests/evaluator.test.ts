import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../src/core/evaluator';

describe('Motor de Avaliação Canônica (Wordle / Termo)', () => {
  it('deve marcar todas as letras como corretas quando a palavra for idêntica', () => {
    const result = evaluateGuess('TERMO', 'TERMO');
    expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });

  it('deve marcar letras ausentes como absent', () => {
    const result = evaluateGuess('PLANO', 'TERMO');
    expect(result).toEqual(['absent', 'absent', 'absent', 'absent', 'correct']);
  });

  it('deve priorizar a posição exata (verde) sobre letras deslocadas (amarela)', () => {
    // Palavra secreta: PLENA (possui apenas 1 'P')
    // Chute: PAPEL (possui 2 'P's, um na pos 0 e outro na pos 2)
    const result = evaluateGuess('PAPEL', 'PLENA');
    expect(result[0]).toBe('correct'); // P na pos 0 está certo
    expect(result[2]).toBe('absent');  // P na pos 2 é excedente
  });

  it('deve respeitar a contagem de letras repetidas em chutes com múltiplos caracteres', () => {
    // Segredo: SAGAZ (tem dois 'A's nas posições 1 e 3)
    // Chute: ARARA (tem três 'A's nas posições 0, 2, 4)
    const result = evaluateGuess('ARARA', 'SAGAZ');
    // Como nenhum 'A' está na posição 1 ou 3:
    // os dois primeiros 'A's (pos 0 e pos 2) ficam amarelos ('present')
    // o terceiro 'A' (pos 4) fica cinza ('absent')
    expect(result[0]).toBe('present');
    expect(result[1]).toBe('absent'); // R não existe em SAGAZ
    expect(result[2]).toBe('present');
    expect(result[3]).toBe('absent'); // R não existe em SAGAZ
    expect(result[4]).toBe('absent'); // 'A' excedente
  });

  it('deve disparar erro se as palavras não tiverem exatamente 5 letras', () => {
    expect(() => evaluateGuess('CASA', 'TERMO')).toThrow();
    expect(() => evaluateGuess('TERMO', 'LONGA')).not.toThrow();
  });
});
