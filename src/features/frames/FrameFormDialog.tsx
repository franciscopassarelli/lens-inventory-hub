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
import { FRAME_STATUS_LABEL, type Frame, type FrameInput, type FrameStatus } from "@/types";
import { todayISO } from "@/utils/date";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frame?: Frame | null;
}

type FormState = {
  code: string;
  brandId: string;
  model: string;
  color: string;
  purchasePrice: string;
  salePrice: string;
  envelopeNumber: string;
  entryDate: string;
  exitDate: string;
  status: FrameStatus;
  notes: string;
};

const emptyState = (): FormState => ({
  code: "",
  brandId: "",
  model: "",
  color: "",
  purchasePrice: "",
  salePrice: "",
  envelopeNumber: "",
  entryDate: todayISO(),
  exitDate: "",
  status: "en_stock",
  notes: "",
});

export function FrameFormDialog({ open, onOpenChange, frame }: Props) {
  const { brands, createFrame, updateFrame, createBrand } = useInventory();
  const [form, setForm] = React.useState<FormState>(emptyState());
  const [errors, setErrors] = React.useState<{ code?: string; brandId?: string; entryDate?: string }>({});
  const [newBrand, setNewBrand] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setErrors({});
    setNewBrand("");
    if (frame) {
      setForm({
        code: frame.code,
        brandId: frame.brandId,
        model: frame.model,
        color: frame.color,
        purchasePrice: String(frame.purchasePrice),
        salePrice: String(frame.salePrice),
        envelopeNumber: frame.envelopeNumber,
        entryDate: frame.entryDate,
        exitDate: frame.exitDate ?? "",
        status: frame.status,
        notes: frame.notes,
      });
    } else {
      setForm(emptyState());
    }
  }, [open, frame]);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next: { code?: string; brandId?: string; entryDate?: string } = {};
    if (!form.code.trim()) next.code = "El código es obligatorio.";
    if (!form.brandId) next.brandId = "Seleccioná una marca.";
    if (!form.entryDate) next.entryDate = "La fecha de ingreso es obligatoria.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleAddBrand = async () => {
    if (!newBrand.trim()) return;
    const ok = await createBrand(newBrand);
    if (ok) setNewBrand("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const input: FrameInput = {
      code: form.code.trim(),
      brandId: form.brandId,
      model: form.model.trim(),
      color: form.color.trim(),
      purchasePrice: Number(form.purchasePrice) || 0,
      salePrice: Number(form.salePrice) || 0,
      envelopeNumber: form.envelopeNumber.trim(),
      entryDate: form.entryDate,
      exitDate: form.exitDate || null,
      status: form.status,
      notes: form.notes.trim(),
    };
    const ok = frame ? await updateFrame(frame.id, input) : await createFrame(input);
    setSaving(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{frame ? "Editar armazón" : "Nuevo armazón"}</DialogTitle>
          <DialogDescription>
            Los campos código, marca y fecha de ingreso son obligatorios. El código debe ser único.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="code">Código *</Label>
            <Input id="code" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="RB-0001" />
            {errors.code ? <p className="text-xs text-destructive">{errors.code}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label>Marca *</Label>
            <Select value={form.brandId} onValueChange={(v) => set("brandId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brandId ? <p className="text-xs text-destructive">{errors.brandId}</p> : null}
            <div className="flex gap-2 pt-1">
              <Input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Agregar nueva marca"
                className="h-8 text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddBrand}>
                Agregar
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="model">Modelo</Label>
            <Input id="model" value={form.model} onChange={(e) => set("model", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="color">Color</Label>
            <Input id="color" value={form.color} onChange={(e) => set("color", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="purchasePrice">Precio de compra</Label>
            <Input
              id="purchasePrice"
              type="number"
              min="0"
              value={form.purchasePrice}
              onChange={(e) => set("purchasePrice", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="salePrice">Precio de venta</Label>
            <Input
              id="salePrice"
              type="number"
              min="0"
              value={form.salePrice}
              onChange={(e) => set("salePrice", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="envelope">Número de sobre</Label>
            <Input
              id="envelope"
              value={form.envelopeNumber}
              onChange={(e) => set("envelopeNumber", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FRAME_STATUS_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="entryDate">Fecha de ingreso *</Label>
            <Input
              id="entryDate"
              type="date"
              value={form.entryDate}
              onChange={(e) => set("entryDate", e.target.value)}
            />
            {errors.entryDate ? <p className="text-xs text-destructive">{errors.entryDate}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exitDate">Fecha de egreso</Label>
            <Input
              id="exitDate"
              type="date"
              value={form.exitDate}
              onChange={(e) => set("exitDate", e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {frame ? "Guardar cambios" : "Crear armazón"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
