import { describe, it, expect, beforeEach } from 'vitest';
import { StatsManager } from '../src/storage/statsManager';

describe('Gerenciador de Estatísticas e Sequências (Streaks)', () => {
  beforeEach(() => {
    StatsManager.resetStats();
  });

  it('deve inicializar com estatísticas zeradas', () => {
    const stats = StatsManager.getStats();
    expect(stats.played).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.currentStreak).toBe(0);
  });

  it('deve incrementar vitórias e sequência consecutiva', () => {
    StatsManager.recordGame(true, 3);
    let stats = StatsManager.getStats();
    expect(stats.played).toBe(1);
    expect(stats.wins).toBe(1);
    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(1);
    expect(stats.guessesDistribution[3]).toBe(1);

    StatsManager.recordGame(true, 4);
    stats = StatsManager.getStats();
    expect(stats.played).toBe(2);
    expect(stats.wins).toBe(2);
    expect(stats.currentStreak).toBe(2);
    expect(stats.maxStreak).toBe(2);
  });

  it('deve zerar a sequência atual em caso de derrota mas manter a maior sequência', () => {
    StatsManager.recordGame(true, 2);
    StatsManager.recordGame(true, 3);
    expect(StatsManager.getStats().currentStreak).toBe(2);

    StatsManager.recordGame(false, 6);
    const stats = StatsManager.getStats();
    expect(stats.played).toBe(3);
    expect(stats.wins).toBe(2);
    expect(stats.currentStreak).toBe(0);
    expect(stats.maxStreak).toBe(2);
  });

  it('deve calcular a porcentagem de vitórias corretamente', () => {
    StatsManager.recordGame(true, 3);
    StatsManager.recordGame(false, 6);
    expect(StatsManager.getWinPercentage()).toBe(50);
  });
});
