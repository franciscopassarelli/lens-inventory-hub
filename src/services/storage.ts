/** Abstracción mínima de almacenamiento clave/valor (SSR-safe). */
export interface StorageAdapter {
  read<T>(key: string, fallback: T): T;
  write<T>(key: string, value: T): void;
  remove(key: string): void;
}

const memory = new Map<string, string>();

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

export const localStorageAdapter: StorageAdapter = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = isBrowser() ? window.localStorage.getItem(key) : (memory.get(key) ?? null);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  write<T>(key: string, value: T): void {
    const raw = JSON.stringify(value);
    if (isBrowser()) window.localStorage.setItem(key, raw);
    else memory.set(key, raw);
  },
  remove(key: string): void {
    if (isBrowser()) window.localStorage.removeItem(key);
    else memory.delete(key);
  },
};

export const STORAGE_KEYS = {
  frames: "optica.frames.v1",
  movements: "optica.movements.v1",
  brands: "optica.brands.v1",
  seeded: "optica.seeded.v1",
} as const;
