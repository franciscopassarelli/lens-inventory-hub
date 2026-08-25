import * as React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function SettingsPage() {
  const { frames, movements, brands, restoreDemo, clearAll } = useInventory();
  const [confirm, setConfirm] = React.useState<"demo" | "clear" | null>(null);

  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Los datos se guardan localmente en este navegador. No se envían a ningún servidor."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos almacenados</CardTitle>
            <CardDescription>Resumen de lo guardado en este dispositivo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{frames.length} armazones</p>
            <p>{movements.length} movimientos</p>
            <p>{brands.length} marcas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mantenimiento</CardTitle>
            <CardDescription>
              Restaurar datos demo reemplaza todo el contenido actual. Limpiar borra todo y deja la
              app vacía.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setConfirm("demo")}>
              Restaurar datos demo
            </Button>
            <Button variant="destructive" onClick={() => setConfirm("clear")}>
              Limpiar todos los datos locales
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "demo" ? "¿Restaurar los datos demo?" : "¿Borrar todos los datos locales?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "demo"
                ? "Se reemplazarán todos los armazones, movimientos y marcas actuales por el conjunto de datos de ejemplo."
                : "Se eliminarán todos los armazones, movimientos y marcas guardados en este navegador. Esta acción no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (confirm === "demo") await restoreDemo();
                else await clearAll();
                setConfirm(null);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
