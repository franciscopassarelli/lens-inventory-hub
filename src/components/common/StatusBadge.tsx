import { Badge } from "@/components/ui/badge";
import { FRAME_STATUS_LABEL, MOVEMENT_TYPE_LABEL, type FrameStatus, type MovementType } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<FrameStatus, string> = {
  en_stock: "bg-primary/10 text-primary border-primary/20",
  vendido: "bg-muted text-muted-foreground border-border",
  devuelto: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  en_reparacion: "bg-chart-5/15 text-chart-5 border-chart-5/30",
};

export function StatusBadge({ status }: { status: FrameStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_CLASS[status])}>
      {FRAME_STATUS_LABEL[status]}
    </Badge>
  );
}

const TYPE_CLASS: Record<MovementType, string> = {
  ingreso: "bg-primary/10 text-primary border-primary/20",
  venta: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  devolucion: "bg-chart-4/20 text-chart-5 border-chart-4/40",
  reparacion: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  otro_egreso: "bg-muted text-muted-foreground border-border",
};

export function MovementBadge({ type }: { type: MovementType }) {
  return (
    <Badge variant="outline" className={cn("font-medium", TYPE_CLASS[type])}>
      {MOVEMENT_TYPE_LABEL[type]}
    </Badge>
  );
}
