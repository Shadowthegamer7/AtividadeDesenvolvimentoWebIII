import { UserStats } from '../core/types';
import { LocalStorageService } from './localStorageService';

const STATS_STORAGE_KEY = 'adivinha_stats';

const DEFAULT_STATS: UserStats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessesDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
};

export class StatsManager {
  private static stats: UserStats = LocalStorageService.getItem<UserStats>(STATS_STORAGE_KEY, { ...DEFAULT_STATS });

  public static getStats(): UserStats {
    return { ...this.stats };
  }

  public static recordGame(won: boolean, attemptsCount: number): UserStats {
    this.stats.played++;

    if (won) {
      this.stats.wins++;
      this.stats.currentStreak++;
      if (this.stats.currentStreak > this.stats.maxStreak) {
        this.stats.maxStreak = this.stats.currentStreak;
      }

      const safeAttempt = Math.min(Math.max(attemptsCount, 1), 6);
      this.stats.guessesDistribution[safeAttempt] = (this.stats.guessesDistribution[safeAttempt] || 0) + 1;
    } else {
      this.stats.currentStreak = 0;
    }

    this.stats.lastCompletedDate = new Date().toISOString();
    LocalStorageService.setItem(STATS_STORAGE_KEY, this.stats);

    return { ...this.stats };
  }

  public static getWinPercentage(): number {
    if (this.stats.played === 0) return 0;
    return Math.round((this.stats.wins / this.stats.played) * 100);
  }

  public static resetStats(): void {
    this.stats = { ...DEFAULT_STATS, guessesDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } };
    LocalStorageService.setItem(STATS_STORAGE_KEY, this.stats);
  }
}
