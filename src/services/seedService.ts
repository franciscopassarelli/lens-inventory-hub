import { brandRepository, frameRepository, movementRepository } from "@/repositories";
import { buildSeedData } from "@/data/seed";
import { STORAGE_KEYS, localStorageAdapter } from "./storage";

export const seedService = {
  /** Siembra datos demo solo la primera vez que se abre la app. */
  async seedIfEmpty(): Promise<void> {
    const seeded = localStorageAdapter.read<boolean>(STORAGE_KEYS.seeded, false);
    if (seeded) return;
    await seedService.restoreDemo();
  },

  async restoreDemo(): Promise<void> {
    const { brands, frames, movements } = buildSeedData();
    await brandRepository.replaceAll(brands);
    await frameRepository.replaceAll(frames);
    await movementRepository.replaceAll(movements);
    localStorageAdapter.write(STORAGE_KEYS.seeded, true);
  },

  async clearAll(): Promise<void> {
    await brandRepository.replaceAll([]);
    await frameRepository.replaceAll([]);
    await movementRepository.replaceAll([]);
    localStorageAdapter.write(STORAGE_KEYS.seeded, true);
  },
};
