import type { Brand, Frame, Movement } from "@/types";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function buildSeedData(): { brands: Brand[]; frames: Frame[]; movements: Movement[] } {
  const now = new Date().toISOString();
  const brandNames = ["Ray-Ban", "Vogue", "Oakley", "Vulk", "Prada"];
  const brands: Brand[] = brandNames.map((name, i) => ({
    id: `brand_seed_${i + 1}`,
    name,
    createdAt: now,
  }));

  const byName = (n: string) => brands.find((b) => b.name === n)!.id;

  const raw: Array<{
    code: string;
    brand: string;
    model: string;
    color: string;
    purchasePrice: number;
    salePrice: number;
    envelopeNumber: string;
    entryDays: number;
    status: Frame["status"];
    exitDays?: number;
    notes?: string;
  }> = [
    { code: "RB-0001", brand: "Ray-Ban", model: "Aviator Classic", color: "Dorado", purchasePrice: 48000, salePrice: 96000, envelopeNumber: "S-1001", entryDays: 220, status: "en_stock", notes: "Modelo clásico, buena rotación." },
    { code: "RB-0002", brand: "Ray-Ban", model: "Wayfarer", color: "Negro", purchasePrice: 45000, salePrice: 92000, envelopeNumber: "S-1002", entryDays: 150, status: "vendido", exitDays: 20 },
    { code: "VO-0101", brand: "Vogue", model: "VO5239", color: "Carey", purchasePrice: 26000, salePrice: 55000, envelopeNumber: "S-1003", entryDays: 130, status: "en_stock" },
    { code: "VO-0102", brand: "Vogue", model: "VO4161", color: "Rosa", purchasePrice: 24000, salePrice: 51000, envelopeNumber: "S-1004", entryDays: 60, status: "en_stock" },
    { code: "OK-0201", brand: "Oakley", model: "Holbrook", color: "Gris mate", purchasePrice: 62000, salePrice: 124000, envelopeNumber: "S-1005", entryDays: 95, status: "en_reparacion", notes: "Bisagra floja, en taller." },
    { code: "OK-0202", brand: "Oakley", model: "Crosslink", color: "Azul", purchasePrice: 58000, salePrice: 118000, envelopeNumber: "S-1006", entryDays: 40, status: "en_stock" },
    { code: "VK-0301", brand: "Vulk", model: "Nomad", color: "Negro mate", purchasePrice: 18000, salePrice: 39000, envelopeNumber: "S-1007", entryDays: 200, status: "en_stock" },
    { code: "VK-0302", brand: "Vulk", model: "Rider", color: "Verde", purchasePrice: 19500, salePrice: 42000, envelopeNumber: "S-1008", entryDays: 12, status: "en_stock" },
    { code: "VK-0303", brand: "Vulk", model: "Urban", color: "Bordó", purchasePrice: 17000, salePrice: 36000, envelopeNumber: "S-1009", entryDays: 75, status: "vendido", exitDays: 5 },
    { code: "PR-0401", brand: "Prada", model: "PR 17WV", color: "Negro", purchasePrice: 88000, salePrice: 175000, envelopeNumber: "S-1010", entryDays: 110, status: "en_stock", notes: "Alta gama, vitrina principal." },
    { code: "PR-0402", brand: "Prada", model: "PR 01OV", color: "Havana", purchasePrice: 92000, salePrice: 182000, envelopeNumber: "S-1011", entryDays: 33, status: "devuelto", notes: "Devuelto por el cliente, sin uso." },
    { code: "RB-0003", brand: "Ray-Ban", model: "Round Metal", color: "Bronce", purchasePrice: 51000, salePrice: 99000, envelopeNumber: "S-1012", entryDays: 18, status: "en_stock" },
    { code: "VO-0103", brand: "Vogue", model: "VO5305", color: "Celeste", purchasePrice: 25000, salePrice: 53000, envelopeNumber: "S-1013", entryDays: 240, status: "en_stock", notes: "Mucho tiempo en stock." },
    { code: "OK-0203", brand: "Oakley", model: "Airdrop", color: "Negro", purchasePrice: 60000, salePrice: 120000, envelopeNumber: "S-1014", entryDays: 8, status: "en_stock" },
  ];

  const frames: Frame[] = [];
  const movements: Movement[] = [];

  raw.forEach((item, index) => {
    const id = `frame_seed_${index + 1}`;
    const entryDate = isoDaysAgo(item.entryDays);
    const exitDate = item.exitDays !== undefined ? isoDaysAgo(item.exitDays) : null;

    frames.push({
      id,
      code: item.code,
      brandId: byName(item.brand),
      model: item.model,
      color: item.color,
      purchasePrice: item.purchasePrice,
      salePrice: item.salePrice,
      envelopeNumber: item.envelopeNumber,
      entryDate,
      exitDate,
      status: item.status,
      notes: item.notes ?? "",
      createdAt: now,
      updatedAt: now,
    });

    movements.push({
      id: `mov_seed_${index + 1}_in`,
      frameId: id,
      type: "ingreso",
      date: entryDate,
      envelopeNumber: item.envelopeNumber,
      notes: "Ingreso inicial de mercadería.",
      createdAt: now,
    });

    if (item.status === "vendido" && exitDate) {
      movements.push({
        id: `mov_seed_${index + 1}_out`,
        frameId: id,
        type: "venta",
        date: exitDate,
        envelopeNumber: item.envelopeNumber,
        notes: "Venta en mostrador.",
        createdAt: now,
      });
    }

    if (item.status === "en_reparacion") {
      movements.push({
        id: `mov_seed_${index + 1}_rep`,
        frameId: id,
        type: "reparacion",
        date: isoDaysAgo(10),
        envelopeNumber: item.envelopeNumber,
        notes: "Enviado a taller.",
        createdAt: now,
      });
    }

    if (item.status === "devuelto") {
      movements.push({
        id: `mov_seed_${index + 1}_sale`,
        frameId: id,
        type: "venta",
        date: isoDaysAgo(25),
        envelopeNumber: item.envelopeNumber,
        notes: "Venta previa.",
        createdAt: now,
      });
      movements.push({
        id: `mov_seed_${index + 1}_ret`,
        frameId: id,
        type: "devolucion",
        date: isoDaysAgo(15),
        envelopeNumber: item.envelopeNumber,
        notes: "Devolución del cliente.",
        createdAt: now,
      });
    }
  });

  return { brands, frames, movements };
}
