import { describe, it, expect } from 'vitest';
import { normalizeWord, isValidLetterPattern } from '../src/core/normalizer';

describe('Normalizador Linguístico para Português', () => {
  it('deve remover acentos agudos, circunflexos, tis e graves', () => {
    expect(normalizeWord('ÍMPAR')).toBe('IMPAR');
    expect(normalizeWord('FÁCIL')).toBe('FACIL');
    expect(normalizeWord('VÊNUS')).toBe('VENUS');
    expect(normalizeWord('ÓRGÃO')).toBe('ORGAO');
    expect(normalizeWord('ÀQUELA')).toBe('AQUELA');
  });

  it('deve normalizar cedilha para C', () => {
    expect(normalizeWord('MAÇÃ')).toBe('MACA');
    expect(normalizeWord('FORÇA')).toBe('FORCA');
  });

  it('deve converter para maiúsculas e remover espaços periféricos', () => {
    expect(normalizeWord('  sagaz  ')).toBe('SAGAZ');
    expect(normalizeWord('termo')).toBe('TERMO');
  });

  it('deve validar o padrão estrito de 5 letras alfabéticas', () => {
    expect(isValidLetterPattern('TERMO')).toBe(true);
    expect(isValidLetterPattern('fácil')).toBe(true); // FÁCIL normaliza para FACIL (5 letras)
    expect(isValidLetterPattern('CASA')).toBe(false);  // 4 letras
    expect(isValidLetterPattern('TERMO1')).toBe(false); // 6 caracteres
  });
});
