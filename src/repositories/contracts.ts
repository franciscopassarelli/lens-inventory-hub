import type { Brand, Frame, Movement } from "@/types";

/**
 * Contratos de repositorio. Toda persistencia pasa por acá.
 * V1: implementaciones Local* con localStorage.
 * V2: implementaciones Api* (fetch REST) sin tocar servicios ni UI.
 * Por eso todos los métodos son asíncronos.
 */
export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
  replaceAll(entities: T[]): Promise<void>;
}

export type FrameRepository = Repository<Frame>;
export type MovementRepository = Repository<Movement>;
export type BrandRepository = Repository<Brand>;
