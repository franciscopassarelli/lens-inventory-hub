import { brandRepository, frameRepository } from "@/repositories";
import type { Brand } from "@/types";
import { createId } from "@/utils/id";

export const brandService = {
  async list(): Promise<Brand[]> {
    const brands = await brandRepository.getAll();
    return brands.sort((a, b) => a.name.localeCompare(b.name, "es"));
  },

  async create(name: string): Promise<Brand> {
    const clean = name.trim();
    if (!clean) throw new Error("El nombre de la marca es obligatorio.");
    const existing = await brandRepository.getAll();
    if (existing.some((b) => b.name.toLowerCase() === clean.toLowerCase())) {
      throw new Error("Ya existe una marca con ese nombre.");
    }
    return brandRepository.create({
      id: createId("brand"),
      name: clean,
      createdAt: new Date().toISOString(),
    });
  },

  async rename(id: string, name: string): Promise<Brand> {
    const clean = name.trim();
    if (!clean) throw new Error("El nombre de la marca es obligatorio.");
    const existing = await brandRepository.getAll();
    if (existing.some((b) => b.id !== id && b.name.toLowerCase() === clean.toLowerCase())) {
      throw new Error("Ya existe una marca con ese nombre.");
    }
    return brandRepository.update(id, { name: clean });
  },

  async remove(id: string): Promise<void> {
    const frames = await frameRepository.getAll();
    const count = frames.filter((f) => f.brandId === id).length;
    if (count > 0) {
      throw new Error(
        `No se puede eliminar: hay ${count} armazón(es) asociados. Reasigná o eliminá esos armazones primero.`,
      );
    }
    await brandRepository.remove(id);
  },

  /** Devuelve la marca existente o la crea si no existe (usado desde el alta de armazón). */
  async ensureByName(name: string): Promise<Brand> {
    const clean = name.trim();
    const existing = await brandRepository.getAll();
    const found = existing.find((b) => b.name.toLowerCase() === clean.toLowerCase());
    if (found) return found;
    return brandService.create(clean);
  },
};
