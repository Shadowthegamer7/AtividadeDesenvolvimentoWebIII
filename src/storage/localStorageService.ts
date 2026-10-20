/**
 * Serviço de persistência local seguro contra falhas, navegação privada e ambientes Node/SSR.
 */
export class LocalStorageService {
  private static isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' &&
             typeof window.localStorage !== 'undefined' &&
             typeof window.localStorage.getItem === 'function';
    } catch {
      return false;
    }
  }

  public static setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[LocalStorageService] Não foi possível salvar a chave "${key}":`, e);
      return false;
    }
  }

  public static getItem<T>(key: string, fallback: T): T {
    if (!this.isAvailable()) return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[LocalStorageService] Erro ao deserializar chave "${key}":`, e);
      return fallback;
    }
  }

  public static removeItem(key: string): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[LocalStorageService] Erro ao remover chave "${key}":`, e);
    }
  }
}
