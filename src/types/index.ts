/**
 * Modelos de dominio de la aplicación.
 * Son agnósticos del almacenamiento: los repositorios (local hoy, REST en V2)
 * deben devolver exactamente estas formas.
 */

export type FrameStatus = "en_stock" | "vendido" | "devuelto" | "en_reparacion";

export const FRAME_STATUS_LABEL: Record<FrameStatus, string> = {
  en_stock: "En stock",
  vendido: "Vendido",
  devuelto: "Devuelto",
  en_reparacion: "En reparación",
};

export type MovementType = "ingreso" | "venta" | "devolucion" | "reparacion" | "otro_egreso";

export const MOVEMENT_TYPE_LABEL: Record<MovementType, string> = {
  ingreso: "Ingreso",
  venta: "Venta",
  devolucion: "Devolución",
  reparacion: "Reparación",
  otro_egreso: "Otro egreso",
};

/** Tipos de movimiento que sacan el armazón del stock disponible. */
export const EGRESS_TYPES: MovementType[] = ["venta", "otro_egreso"];

export interface Brand {
  id: string;
  name: string;
  createdAt: string; // ISO
}

export interface Frame {
  id: string;
  code: string;
  brandId: string;
  model: string;
  color: string;
  purchasePrice: number;
  salePrice: number;
  envelopeNumber: string;
  entryDate: string; // ISO date (yyyy-mm-dd)
  exitDate: string | null;
  status: FrameStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  frameId: string;
  type: MovementType;
  date: string; // yyyy-mm-dd
  envelopeNumber: string;
  notes: string;
  createdAt: string;
}

export type FrameInput = Omit<Frame, "id" | "createdAt" | "updatedAt" | "status" | "exitDate"> &
  Partial<Pick<Frame, "status" | "exitDate">>;

export type MovementInput = Omit<Movement, "id" | "createdAt">;
