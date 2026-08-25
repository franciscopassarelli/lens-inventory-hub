import type { Brand, Frame, Movement } from "@/types";
import { FRAME_STATUS_LABEL, MOVEMENT_TYPE_LABEL } from "@/types";
import { toCsv, downloadCsv, type CsvRow } from "@/utils/csv";
import { fileStamp } from "@/utils/date";

const FRAME_HEADERS = [
  "Código",
  "Marca",
  "Modelo",
  "Color",
  "Precio compra",
  "Precio venta",
  "Sobre",
  "Fecha ingreso",
  "Fecha egreso",
  "Estado",
  "Observaciones",
];

const MOVEMENT_HEADERS = [
  "Fecha",
  "Código",
  "Marca",
  "Modelo",
  "Tipo",
  "Sobre",
  "Observaciones",
];

function frameRow(frame: Frame, brandName: string): CsvRow {
  return {
    "Código": frame.code,
    Marca: brandName,
    Modelo: frame.model,
    Color: frame.color,
    "Precio compra": frame.purchasePrice,
    "Precio venta": frame.salePrice,
    Sobre: frame.envelopeNumber,
    "Fecha ingreso": frame.entryDate,
    "Fecha egreso": frame.exitDate ?? "",
    Estado: FRAME_STATUS_LABEL[frame.status],
    Observaciones: frame.notes,
  };
}

export const exportService = {
  exportFrames(frames: Frame[], brands: Brand[], filenamePrefix: string): void {
    const brandName = (id: string) => brands.find((b) => b.id === id)?.name ?? "—";
    const csv = toCsv(
      frames.map((f) => frameRow(f, brandName(f.brandId))),
      FRAME_HEADERS,
    );
    downloadCsv(`${filenamePrefix}-${fileStamp()}.csv`, csv);
  },

  exportMovements(movements: Movement[], frames: Frame[], brands: Brand[]): void {
    const rows: CsvRow[] = movements.map((m) => {
      const frame = frames.find((f) => f.id === m.frameId);
      const brand = frame ? brands.find((b) => b.id === frame.brandId)?.name : "";
      return {
        Fecha: m.date,
        "Código": frame?.code ?? "—",
        Marca: brand ?? "—",
        Modelo: frame?.model ?? "—",
        Tipo: MOVEMENT_TYPE_LABEL[m.type],
        Sobre: m.envelopeNumber,
        Observaciones: m.notes,
      };
    });
    downloadCsv(`historial-movimientos-${fileStamp()}.csv`, toCsv(rows, MOVEMENT_HEADERS));
  },
};
