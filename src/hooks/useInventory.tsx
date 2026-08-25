import * as React from "react";
import { toast } from "sonner";
import type { Brand, Frame, FrameInput, Movement, MovementInput } from "@/types";
import { frameService } from "@/services/frameService";
import { movementService } from "@/services/movementService";
import { brandService } from "@/services/brandService";
import { seedService } from "@/services/seedService";

interface InventoryContextValue {
  frames: Frame[];
  movements: Movement[];
  brands: Brand[];
  loading: boolean;
  brandName: (id: string) => string;
  createFrame: (input: FrameInput) => Promise<boolean>;
  updateFrame: (id: string, input: FrameInput) => Promise<boolean>;
  deleteFrame: (id: string) => Promise<void>;
  registerMovement: (input: MovementInput) => Promise<boolean>;
  createBrand: (name: string) => Promise<boolean>;
  renameBrand: (id: string, name: string) => Promise<boolean>;
  deleteBrand: (id: string) => Promise<void>;
  restoreDemo: () => Promise<void>;
  clearAll: () => Promise<void>;
}

const InventoryContext = React.createContext<InventoryContextValue | null>(null);

async function run<T>(fn: () => Promise<T>, onSuccess: string): Promise<T | null> {
  try {
    const result = await fn();
    toast.success(onSuccess);
    return result;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    return null;
  }
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [frames, setFrames] = React.useState<Frame[]>([]);
  const [movements, setMovements] = React.useState<Movement[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    const [f, m, b] = await Promise.all([
      frameService.list(),
      movementService.list(),
      brandService.list(),
    ]);
    setFrames(f);
    setMovements(m);
    setBrands(b);
  }, []);

  React.useEffect(() => {
    let active = true;
    (async () => {
      await seedService.seedIfEmpty();
      if (!active) return;
      await refresh();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const value: InventoryContextValue = {
    frames,
    movements,
    brands,
    loading,
    brandName: (id) => brands.find((b) => b.id === id)?.name ?? "—",
    createFrame: async (input) => {
      const res = await run(() => frameService.create(input), "Armazón creado correctamente.");
      await refresh();
      return res !== null;
    },
    updateFrame: async (id, input) => {
      const res = await run(() => frameService.update(id, input), "Armazón actualizado.");
      await refresh();
      return res !== null;
    },
    deleteFrame: async (id) => {
      await run(() => frameService.remove(id), "Armazón eliminado.");
      await refresh();
    },
    registerMovement: async (input) => {
      const res = await run(() => movementService.register(input), "Movimiento registrado.");
      await refresh();
      return res !== null;
    },
    createBrand: async (name) => {
      const res = await run(() => brandService.create(name), "Marca creada.");
      await refresh();
      return res !== null;
    },
    renameBrand: async (id, name) => {
      const res = await run(() => brandService.rename(id, name), "Marca actualizada.");
      await refresh();
      return res !== null;
    },
    deleteBrand: async (id) => {
      await run(() => brandService.remove(id), "Marca eliminada.");
      await refresh();
    },
    restoreDemo: async () => {
      await run(() => seedService.restoreDemo(), "Datos demo restaurados.");
      await refresh();
    },
    clearAll: async () => {
      await run(() => seedService.clearAll(), "Se eliminaron todos los datos locales.");
      await refresh();
    },
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContextValue {
  const ctx = React.useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory debe usarse dentro de InventoryProvider.");
  return ctx;
}
