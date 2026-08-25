import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge, MovementBadge } from "@/components/common/StatusBadge";
import { useInventory } from "@/hooks/useInventory";
import type { Frame } from "@/types";
import { formatCurrency, formatDate, daysBetween } from "@/utils/date";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

export function FrameDetailDialog({
  frame,
  onOpenChange,
}: {
  frame: Frame | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { movements, brandName } = useInventory();
  if (!frame) return null;

  const history = movements
    .filter((m) => m.frameId === frame.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Dialog open={!!frame} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {frame.code}
            <StatusBadge status={frame.status} />
          </DialogTitle>
          <DialogDescription>
            {brandName(frame.brandId)} · {frame.model || "Sin modelo"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Color" value={frame.color || "—"} />
          <Field label="Sobre" value={frame.envelopeNumber || "—"} />
          <Field label="Precio compra" value={formatCurrency(frame.purchasePrice)} />
          <Field label="Precio venta" value={formatCurrency(frame.salePrice)} />
          <Field label="Fecha ingreso" value={formatDate(frame.entryDate)} />
          <Field label="Fecha egreso" value={formatDate(frame.exitDate)} />
          <Field label="Días en stock" value={`${daysBetween(frame.entryDate, frame.exitDate ?? undefined)} días`} />
        </div>

        {frame.notes ? (
          <div className="rounded-md border bg-muted/40 p-3 text-sm">{frame.notes}</div>
        ) : null}

        <div>
          <p className="mb-2 text-sm font-semibold">Historial de movimientos</p>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin movimientos registrados.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {history.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center gap-2 p-3 text-sm">
                  <MovementBadge type={m.type} />
                  <span className="text-muted-foreground">{formatDate(m.date)}</span>
                  {m.envelopeNumber ? (
                    <span className="text-muted-foreground">Sobre {m.envelopeNumber}</span>
                  ) : null}
                  {m.notes ? <span className="w-full text-muted-foreground">{m.notes}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
