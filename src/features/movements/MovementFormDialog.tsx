import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/hooks/useInventory";
import { MOVEMENT_TYPE_LABEL, type MovementType } from "@/types";
import { todayISO } from "@/utils/date";

const TYPE_HINT: Record<MovementType, string> = {
  ingreso: "Marca el armazón como En stock y actualiza la fecha de ingreso.",
  venta: "Solo disponible si el armazón está en stock. Lo marca como Vendido con fecha de egreso.",
  devolucion: "Reingresa el armazón: vuelve a En stock y limpia la fecha de egreso.",
  reparacion: "Marca el armazón como En reparación (no disponible para la venta).",
  otro_egreso: "Baja no comercial (rotura, extravío). Sale del stock con fecha de egreso.",
};

export function MovementFormDialog({
  open,
  onOpenChange,
  defaultFrameId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFrameId?: string;
}) {
  const { frames, brandName, registerMovement } = useInventory();
  const [frameId, setFrameId] = React.useState(defaultFrameId ?? "");
  const [type, setType] = React.useState<MovementType>("venta");
  const [date, setDate] = React.useState(todayISO());
  const [envelopeNumber, setEnvelopeNumber] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setFrameId(defaultFrameId ?? "");
    setType("venta");
    setDate(todayISO());
    setEnvelopeNumber("");
    setNotes("");
    setError("");
  }, [open, defaultFrameId]);

  React.useEffect(() => {
    const frame = frames.find((f) => f.id === frameId);
    if (frame) setEnvelopeNumber(frame.envelopeNumber);
  }, [frameId, frames]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frameId) {
      setError("Seleccioná un armazón.");
      return;
    }
    setError("");
    setSaving(true);
    const ok = await registerMovement({ frameId, type, date, envelopeNumber, notes });
    setSaving(false);
    if (ok) onOpenChange(false);
  };

  const sortedFrames = [...frames].sort((a, b) => a.code.localeCompare(b.code));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
          <DialogDescription>
            El movimiento actualiza automáticamente el estado del armazón.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Armazón *</Label>
            <Select value={frameId} onValueChange={setFrameId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar armazón" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {sortedFrames.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.code} · {brandName(f.brandId)} {f.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label>Tipo de movimiento *</Label>
            <Select value={type} onValueChange={(v) => setType(v as MovementType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MOVEMENT_TYPE_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{TYPE_HINT[type]}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="mov-date">Fecha *</Label>
              <Input id="mov-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mov-env">Número de sobre</Label>
              <Input
                id="mov-env"
                value={envelopeNumber}
                onChange={(e) => setEnvelopeNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mov-notes">Observaciones</Label>
            <Textarea id="mov-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
