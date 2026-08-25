import * as React from "react";
import { Plus, Search, Pencil, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInventory } from "@/hooks/useInventory";
import { FrameFormDialog } from "@/features/frames/FrameFormDialog";
import { FrameDetailDialog } from "@/features/frames/FrameDetailDialog";
import { FRAME_STATUS_LABEL, type Frame, type FrameStatus } from "@/types";
import { isAvailable } from "@/services/movementService";
import { formatCurrency, formatDate } from "@/utils/date";

type SortKey = "code" | "brand" | "model" | "salePrice" | "entryDate" | "status";

export function FramesPage() {
  const { frames, brands, brandName, loading, deleteFrame } = useInventory();

  const [search, setSearch] = React.useState("");
  const [brandId, setBrandId] = React.useState("todas");
  const [status, setStatus] = React.useState<FrameStatus | "todos">("todos");
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [entryFrom, setEntryFrom] = React.useState("");
  const [entryTo, setEntryTo] = React.useState("");
  const [onlyStock, setOnlyStock] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<SortKey>("entryDate");
  const [sortAsc, setSortAsc] = React.useState(false);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Frame | null>(null);
  const [detail, setDetail] = React.useState<Frame | null>(null);
  const [toDelete, setToDelete] = React.useState<Frame | null>(null);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    const result = frames.filter((f) => {
      if (onlyStock && !isAvailable(f)) return false;
      if (brandId !== "todas" && f.brandId !== brandId) return false;
      if (status !== "todos" && f.status !== status) return false;
      if (min !== null && f.salePrice < min) return false;
      if (max !== null && f.salePrice > max) return false;
      if (entryFrom && f.entryDate < entryFrom) return false;
      if (entryTo && f.entryDate > entryTo) return false;
      if (term) {
        const haystack = [f.code, brandName(f.brandId), f.model, f.envelopeNumber]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    const value = (f: Frame): string | number => {
      switch (sortKey) {
        case "brand":
          return brandName(f.brandId);
        case "model":
          return f.model;
        case "salePrice":
          return f.salePrice;
        case "status":
          return FRAME_STATUS_LABEL[f.status];
        case "entryDate":
          return f.entryDate;
        default:
          return f.code;
      }
    };

    return result.sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "es");
      return sortAsc ? cmp : -cmp;
    });
  }, [frames, search, brandId, status, minPrice, maxPrice, entryFrom, entryTo, onlyStock, sortKey, sortAsc, brandName]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setBrandId("todas");
    setStatus("todos");
    setMinPrice("");
    setMaxPrice("");
    setEntryFrom("");
    setEntryTo("");
    setOnlyStock(false);
  };

  const SortHead = ({ label, sortKey: key }: { label: string; sortKey: SortKey }) => (
    <TableHead>
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className="inline-flex items-center gap-1 hover:text-foreground"
      >
        {label}
        <ArrowUpDown className="size-3" />
      </button>
    </TableHead>
  );

  return (
    <div>
      <PageHeader
        title="Armazones"
        description="Registro completo del stock de armazones de la óptica."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Nuevo armazón
          </Button>
        }
      />

      <div className="mb-5 space-y-4 rounded-lg border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por código, marca, modelo o número de sobre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            <Label className="text-xs">Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as FrameStatus | "todos")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {Object.entries(FRAME_STATUS_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Precio de venta (rango)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Mín."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Máx."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Fecha de ingreso</Label>
            <div className="flex gap-2">
              <Input type="date" value={entryFrom} onChange={(e) => setEntryFrom(e.target.value)} />
              <Input type="date" value={entryTo} onChange={(e) => setEntryTo(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Switch id="only-stock" checked={onlyStock} onCheckedChange={setOnlyStock} />
            <Label htmlFor="only-stock" className="text-sm">
              Solo mostrar stock actual
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{filtered.length} resultado(s)</span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={frames.length === 0 ? "Todavía no hay armazones" : "Sin resultados"}
          description={
            frames.length === 0
              ? "Creá tu primer armazón para empezar a controlar el stock."
              : "Probá ajustando la búsqueda o los filtros."
          }
          action={
            frames.length === 0 ? (
              <Button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Nuevo armazón
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortHead label="Código" sortKey="code" />
                  <SortHead label="Marca" sortKey="brand" />
                  <SortHead label="Modelo" sortKey="model" />
                  <TableHead>Color</TableHead>
                  <TableHead>Sobre</TableHead>
                  <SortHead label="P. venta" sortKey="salePrice" />
                  <SortHead label="Ingreso" sortKey="entryDate" />
                  <SortHead label="Estado" sortKey="status" />
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.code}</TableCell>
                    <TableCell>{brandName(f.brandId)}</TableCell>
                    <TableCell>{f.model || "—"}</TableCell>
                    <TableCell>{f.color || "—"}</TableCell>
                    <TableCell>{f.envelopeNumber || "—"}</TableCell>
                    <TableCell>{formatCurrency(f.salePrice)}</TableCell>
                    <TableCell>{formatDate(f.entryDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={f.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Ver detalle" onClick={() => setDetail(f)}>
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Editar"
                          onClick={() => {
                            setEditing(f);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Eliminar"
                          onClick={() => setToDelete(f)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {filtered.map((f) => (
              <div key={f.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{f.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {brandName(f.brandId)} · {f.model || "Sin modelo"}
                    </p>
                  </div>
                  <StatusBadge status={f.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Venta</span>
                  <span className="text-right">{formatCurrency(f.salePrice)}</span>
                  <span className="text-muted-foreground">Sobre</span>
                  <span className="text-right">{f.envelopeNumber || "—"}</span>
                  <span className="text-muted-foreground">Ingreso</span>
                  <span className="text-right">{formatDate(f.entryDate)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDetail(f)}>
                    Detalle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(f);
                      setFormOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setToDelete(f)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <FrameFormDialog open={formOpen} onOpenChange={setFormOpen} frame={editing} />
      <FrameDetailDialog frame={detail} onOpenChange={(open) => !open && setDetail(null)} />

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar el armazón {toDelete?.code}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el armazón y todos sus movimientos asociados. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (toDelete) await deleteFrame(toDelete.id);
                setToDelete(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
