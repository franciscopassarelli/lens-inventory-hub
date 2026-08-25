import type { Brand, Frame, Movement } from "@/types";
import type { BrandRepository, FrameRepository, MovementRepository } from "./contracts";
import { LocalCollectionRepository } from "./localRepository";
import { STORAGE_KEYS } from "@/services/storage";

/**
 * Punto único de composición. En V2 basta reemplazar estas instancias por
 * ApiFrameRepository / ApiMovementRepository / ApiBrandRepository.
 */
export const frameRepository: FrameRepository = new LocalCollectionRepository<Frame>(
  STORAGE_KEYS.frames,
);
export const movementRepository: MovementRepository = new LocalCollectionRepository<Movement>(
  STORAGE_KEYS.movements,
);
export const brandRepository: BrandRepository = new LocalCollectionRepository<Brand>(
  STORAGE_KEYS.brands,
);

export type { BrandRepository, FrameRepository, MovementRepository };
