import { frameRepository, movementRepository } from "@/repositories";
import type { Frame, FrameInput, Movement } from "@/types";
import { createId } from "@/utils/id";

function validate(input: FrameInput): void {
  if (!input.code?.trim()) throw new Error("El código es obligatorio.");
  if (!input.brandId) throw new Error("La marca es obligatoria.");
  if (!input.entryDate) throw new Error("La fecha de ingreso es obligatoria.");
  if (input.purchasePrice < 0 || input.salePrice < 0) {
    throw new Error("Los precios no pueden ser negativos.");
  }
}

async function assertUniqueCode(code: string, ignoreId?: string): Promise<void> {
  const frames = await frameRepository.getAll();
  const dup = frames.some(
    (f) => f.id !== ignoreId && f.code.trim().toLowerCase() === code.trim().toLowerCase(),
  );
  if (dup) throw new Error("Ya existe un armazón con ese código.");
}

export const frameService = {
  async list(): Promise<Frame[]> {
    return frameRepository.getAll();
  },

  async getById(id: string): Promise<Frame | null> {
    return frameRepository.getById(id);
  },

  async create(input: FrameInput): Promise<Frame> {
    validate(input);
    await assertUniqueCode(input.code);
    const now = new Date().toISOString();
    const frame: Frame = {
      ...input,
      code: input.code.trim(),
      id: createId("frame"),
      status: input.status ?? "en_stock",
      exitDate: input.exitDate ?? null,
      createdAt: now,
      updatedAt: now,
    };
    await frameRepository.create(frame);

    // Historial coherente: todo alta genera su movimiento de ingreso.
    const movement: Movement = {
      id: createId("mov"),
      frameId: frame.id,
      type: "ingreso",
      date: frame.entryDate,
      envelopeNumber: frame.envelopeNumber,
      notes: "Ingreso automático al registrar el armazón.",
      createdAt: now,
    };
    await movementRepository.create(movement);
    return frame;
  },

  async update(id: string, input: FrameInput): Promise<Frame> {
    validate(input);
    await assertUniqueCode(input.code, id);
    return frameRepository.update(id, {
      ...input,
      code: input.code.trim(),
      updatedAt: new Date().toISOString(),
    });
  },

  async remove(id: string): Promise<void> {
    await frameRepository.remove(id);
    const movements = await movementRepository.getAll();
    await movementRepository.replaceAll(movements.filter((m) => m.frameId !== id));
  },
};
