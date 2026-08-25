import type { Repository } from "./contracts";
import { localStorageAdapter, type StorageAdapter } from "@/services/storage";

interface Entity {
  id: string;
}

/** Repositorio genérico sobre una colección guardada en una clave del storage. */
export class LocalCollectionRepository<T extends Entity> implements Repository<T> {
  constructor(
    private readonly key: string,
    private readonly storage: StorageAdapter = localStorageAdapter,
  ) {}

  private load(): T[] {
    return this.storage.read<T[]>(this.key, []);
  }

  private save(items: T[]): void {
    this.storage.write(this.key, items);
  }

  async getAll(): Promise<T[]> {
    return this.load();
  }

  async getById(id: string): Promise<T | null> {
    return this.load().find((item) => item.id === id) ?? null;
  }

  async create(entity: T): Promise<T> {
    const items = this.load();
    items.push(entity);
    this.save(items);
    return entity;
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    const items = this.load();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("No se encontró el registro a actualizar.");
    const next = { ...items[index], ...patch, id } as T;
    items[index] = next;
    this.save(items);
    return next;
  }

  async remove(id: string): Promise<void> {
    this.save(this.load().filter((item) => item.id !== id));
  }

  async replaceAll(entities: T[]): Promise<void> {
    this.save(entities);
  }
}
