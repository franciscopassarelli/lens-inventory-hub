import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MovementBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { useInventory } from "@/hooks/useInventory";
import { MOVEMENT_TYPE_LABEL, type MovementType } from "@/types";
import { formatDate } from "@/utils/date";

export function MovementHistory() {
  const { movements, frames, brands, brandName } = useInventory();
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<MovementType | "todos">("todos");
  const [brandId, setBrandId] = React.useState("todas");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const rows = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return movements
      .map((m) => {
        const frame = frames.find((f) => f.id === m.frameId);
        return { movement: m, frame };
      })
      .filter(({ movement, frame }) => {
        if (type !== "todos" && movement.type !== type) return false;
        if (brandId !== "todas" && frame?.brandId !== brandId) return false;
        if (from && movement.date < from) return false;
        if (to && movement.date > to) return false;
        if (term) {
          const haystack = [
            frame?.code,
            frame?.model,
            movement.envelopeNumber,
            movement.notes,
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(term)) return false;
        }
        return true;
      })
      .sort((a, b) => b.movement.date.localeCompare(a.movement.date));
  }, [movements, frames, search, type, brandId, from, to]);

  const clear = () => {
    setSearch("");
    setType("todos");
    setBrandId("todas");
    setFrom("");
    setTo("");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5">
          <Label className="text-xs">Buscar</Label>
          <Input
            placeholder="Código, sobre, notas"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Tipo</Label>
          <Select value={type} onValueChange={(v) => setType(v as MovementType | "todos")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {Object.entries(MOVEMENT_TYPE_LABEL).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Marca</Label>
          <Select value={brandId} onValueChange={setBrandId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Desde</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Hasta</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="lg:col-span-5">
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpiar filtros
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Sin movimientos"
          description="No hay movimientos que coincidan con los filtros aplicados."
        />
      ) : (
        <>
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sobre</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ movement, frame }) => (
                  <TableRow key={movement.id}>
                    <TableCell>{formatDate(movement.date)}</TableCell>
                    <TableCell className="font-medium">{frame?.code ?? "—"}</TableCell>
                    <TableCell>{frame ? brandName(frame.brandId) : "—"}</TableCell>
                    <TableCell>{frame?.model ?? "—"}</TableCell>
                    <TableCell>
                      <MovementBadge type={movement.type} />
                    </TableCell>
                    <TableCell>{movement.envelopeNumber || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {movement.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {rows.map(({ movement, frame }) => (
              <div key={movement.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{frame?.code ?? "—"}</p>
                  <MovementBadge type={movement.type} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {frame ? `${brandName(frame.brandId)} ${frame.model}` : "Armazón eliminado"}
                </p>
                <p className="mt-2 text-sm">
                  {formatDate(movement.date)} · Sobre {movement.envelopeNumber || "—"}
                </p>
                {movement.notes ? (
                  <p className="mt-1 text-sm text-muted-foreground">{movement.notes}</p>
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
