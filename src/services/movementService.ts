import { frameRepository, movementRepository } from "@/repositories";
import type { Frame, FrameStatus, Movement, MovementInput, MovementType } from "@/types";
import { createId } from "@/utils/id";

/** Un armazón está disponible cuando puede volver a venderse. */
export function isAvailable(frame: Frame): boolean {
  return frame.status === "en_stock" || frame.status === "devuelto";
}

/** Reglas de negocio centralizadas: qué le pasa al armazón según el movimiento. */
function applyRules(frame: Frame, movement: MovementInput): Partial<Frame> {
  const rules: Record<MovementType, () => Partial<Frame>> = {
    ingreso: () => ({ status: "en_stock" as FrameStatus, entryDate: movement.date, exitDate: null }),
    venta: () => {
      if (!isAvailable(frame)) {
        throw new Error(
          frame.status === "vendido"
            ? "El armazón ya figura como vendido: no se puede volver a vender."
            : "Solo se pueden vender armazones disponibles en stock.",
        );
      }
      return { status: "vendido" as FrameStatus, exitDate: movement.date };
    },
    devolucion: () => {
      if (frame.status === "en_stock") {
        throw new Error("El armazón ya está en stock: no corresponde una devolución.");
      }
      return { status: "en_stock" as FrameStatus, exitDate: null };
    },
    reparacion: () => ({ status: "en_reparacion" as FrameStatus }),
    otro_egreso: () => {
      if (frame.status === "vendido") {
        throw new Error("El armazón ya salió del stock.");
      }
      // Egreso no comercial (rotura, extravío, baja): queda fuera de stock.
      return { status: "vendido" as FrameStatus, exitDate: movement.date };
    },
  };

  return rules[movement.type]();
}

export const movementService = {
  async list(): Promise<Movement[]> {
    return movementRepository.getAll();
  },

  async listByFrame(frameId: string): Promise<Movement[]> {
    const all = await movementRepository.getAll();
    return all.filter((m) => m.frameId === frameId);
  },

  async register(input: MovementInput): Promise<Movement> {
    if (!input.frameId) throw new Error("Seleccioná un armazón.");
    if (!input.date) throw new Error("La fecha es obligatoria.");
    const frame = await frameRepository.getById(input.frameId);
    if (!frame) throw new Error("El armazón no existe.");

    const patch = applyRules(frame, input);

    const movement: Movement = {
      ...input,
      id: createId("mov"),
      createdAt: new Date().toISOString(),
    };
    await movementRepository.create(movement);
    await frameRepository.update(frame.id, { ...patch, updatedAt: new Date().toISOString() });
    return movement;
  },

  async remove(id: string): Promise<void> {
    await movementRepository.remove(id);
  },
};
