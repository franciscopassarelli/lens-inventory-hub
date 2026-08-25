import * as React from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovementFormDialog } from "@/features/movements/MovementFormDialog";
import { MovementHistory } from "@/features/movements/MovementHistory";
import { MovementBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { useInventory } from "@/hooks/useInventory";
import { formatDate } from "@/utils/date";

export function MovementsPage() {
  const { movements, frames, brandName, loading } = useInventory();
  const [open, setOpen] = React.useState(false);

  const recent = [...movements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Movimientos"
        description="Registrá ingresos, ventas, devoluciones y reparaciones. El estado del armazón se actualiza automáticamente."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Registrar movimiento
          </Button>
        }
      />

      {loading ? (
        <LoadingBlock />
      ) : (
        <Tabs defaultValue="recientes">
          <TabsList>
            <TabsTrigger value="recientes">Recientes</TabsTrigger>
            <TabsTrigger value="historial">Historial completo</TabsTrigger>
          </TabsList>

          <TabsContent value="recientes" className="mt-4">
            {recent.length === 0 ? (
              <EmptyState
                title="Sin movimientos"
                description="Registrá el primer movimiento para construir el historial."
                action={<Button onClick={() => setOpen(true)}>Registrar movimiento</Button>}
              />
            ) : (
              <ul className="divide-y rounded-lg border bg-card">
                {recent.map((m) => {
                  const frame = frames.find((f) => f.id === m.frameId);
                  return (
                    <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {frame?.code ?? "—"} ·{" "}
                          {frame ? `${brandName(frame.brandId)} ${frame.model}` : "Armazón eliminado"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(m.date)} · Sobre {m.envelopeNumber || "—"}
                          {m.notes ? ` · ${m.notes}` : ""}
                        </p>
                      </div>
                      <MovementBadge type={m.type} />
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="historial" className="mt-4">
            <MovementHistory />
          </TabsContent>
        </Tabs>
      )}

      <MovementFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
