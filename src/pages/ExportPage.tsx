import { Download } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/hooks/useInventory";
import { exportService } from "@/services/exportService";
import { isAvailable } from "@/services/movementService";
import { toast } from "sonner";

export function ExportPage() {
  const { frames, movements, brands } = useInventory();
  const inStock = frames.filter(isAvailable);

  const guard = (count: number, action: () => void, label: string) => {
    if (count === 0) {
      toast.error("No hay datos para exportar en esta sección.");
      return;
    }
    action();
    toast.success(`${label} descargado.`);
  };

  const items = [
    {
      title: "Stock actual",
      description:
        "Armazones disponibles hoy (en stock o devueltos). Incluye código, marca, modelo, precios, sobre y fechas.",
      count: inStock.length,
      onClick: () => exportService.exportFrames(inStock, brands, "stock-actual"),
      label: "Stock actual",
    },
    {
      title: "Todos los armazones",
      description:
        "Listado histórico completo, con estado actual y fechas de ingreso y egreso de cada armazón.",
      count: frames.length,
      onClick: () => exportService.exportFrames(frames, brands, "todos-los-armazones"),
      label: "Listado de armazones",
    },
    {
      title: "Historial de movimientos",
      description:
        "Todos los movimientos registrados: fecha, código, marca, modelo, tipo, sobre y observaciones.",
      count: movements.length,
      onClick: () => exportService.exportMovements(movements, frames, brands),
      label: "Historial de movimientos",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Exportar"
        description="Descargá tus datos en CSV (UTF-8, compatible con Excel). El nombre del archivo incluye la fecha."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.count} registro(s)</span>
              <Button onClick={() => guard(item.count, item.onClick, item.label)}>
                <Download className="size-4" /> Descargar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
