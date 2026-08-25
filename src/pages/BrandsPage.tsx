import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInventory } from "@/hooks/useInventory";
import type { Brand } from "@/types";

export function BrandsPage() {
  const { brands, frames, loading, createBrand, renameBrand, deleteBrand } = useInventory();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Brand | null>(null);
  const [name, setName] = React.useState("");
  const [toDelete, setToDelete] = React.useState<Brand | null>(null);

  const count = (brandId: string) => frames.filter((f) => f.brandId === brandId).length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editing ? await renameBrand(editing.id, name) : await createBrand(name);
    if (ok) {
      setOpen(false);
      setName("");
      setEditing(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Marcas"
        description="Administrá las marcas disponibles al cargar armazones."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setName("");
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Nueva marca
          </Button>
        }
      />

      {loading ? (
        <LoadingBlock rows={4} />
      ) : brands.length === 0 ? (
        <EmptyState
          title="No hay marcas cargadas"
          description="Creá la primera marca para poder registrar armazones."
          action={
            <Button
              onClick={() => {
                setEditing(null);
                setName("");
                setOpen(true);
              }}
            >
              Nueva marca
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marca</TableHead>
                <TableHead>Armazones asociados</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell>{count(b.id)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Editar marca"
                        onClick={() => {
                          setEditing(b);
                          setName(b.name);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Eliminar marca"
                        onClick={() => setToDelete(b)}
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
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar marca" : "Nueva marca"}</DialogTitle>
            <DialogDescription>El nombre es obligatorio y no puede repetirse.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="brand-name">Nombre</Label>
              <Input
                id="brand-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ray-Ban"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editing ? "Guardar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar la marca {toDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && count(toDelete.id) > 0
                ? `Esta marca tiene ${count(toDelete.id)} armazón(es) asociados. Reasignalos o eliminalos antes de borrarla.`
                : "La marca dejará de estar disponible al cargar armazones."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (toDelete) await deleteBrand(toDelete.id);
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
