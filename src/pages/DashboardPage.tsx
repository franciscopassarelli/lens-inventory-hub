import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Glasses, PackageCheck, ArrowDownToLine, ArrowUpFromLine, Wallet, Clock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { EmptyState } from "@/components/common/EmptyState";
import { MovementBadge, StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/hooks/useInventory";
import { isAvailable } from "@/services/movementService";
import { daysBetween, formatCurrency, formatDate } from "@/utils/date";

function Kpi({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="size-4 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { frames, movements, brandName, loading } = useInventory();

  const stats = React.useMemo(() => {
    const inStock = frames.filter(isAvailable);
    const out = frames.filter((f) => f.status === "vendido");
    const ingresos = movements.filter((m) => m.type === "ingreso");
    const egresos = movements.filter((m) => m.type === "venta" || m.type === "otro_egreso");
    const stockCost = inStock.reduce((acc, f) => acc + f.purchasePrice, 0);
    const stockRetail = inStock.reduce((acc, f) => acc + f.salePrice, 0);
    const aged = inStock
      .filter((f) => daysBetween(f.entryDate) >= 90)
      .sort((a, b) => daysBetween(b.entryDate) - daysBetween(a.entryDate));
    return { inStock, out, ingresos, egresos, stockCost, stockRetail, aged };
  }, [frames, movements]);

  const recent = React.useMemo(
    () => [...movements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    [movements],
  );

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Resumen del stock de armazones." />
        <LoadingBlock rows={6} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen del stock de armazones y la actividad reciente."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/movimientos">Registrar movimiento</Link>
            </Button>
            <Button asChild>
              <Link to="/armazones">Ver armazones</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi title="Total de armazones" value={String(frames.length)} icon={Glasses} />
        <Kpi title="En stock actualmente" value={String(stats.inStock.length)} hint="Incluye devueltos disponibles" icon={PackageCheck} />
        <Kpi title="Vendidos / egresados" value={String(stats.out.length)} icon={ArrowUpFromLine} />
        <Kpi title="Ingresos registrados" value={String(stats.ingresos.length)} hint="Movimientos de tipo ingreso" icon={ArrowDownToLine} />
        <Kpi title="Egresos registrados" value={String(stats.egresos.length)} hint="Ventas y otros egresos" icon={ArrowUpFromLine} />
        <Kpi
          title="Valor estimado del stock"
          value={formatCurrency(stats.stockCost)}
          hint={`A precio de compra. A precio de venta: ${formatCurrency(stats.stockRetail)}`}
          icon={Wallet}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <EmptyState title="Sin movimientos" description="Todavía no se registraron movimientos." />
            ) : (
              <ul className="divide-y">
                {recent.map((m) => {
                  const frame = frames.find((f) => f.id === m.frameId);
                  return (
                    <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {frame?.code ?? "—"} · {frame ? brandName(frame.brandId) : "Armazón eliminado"}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
                      </div>
                      <MovementBadge type={m.type} />
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Armazones con 90+ días en stock</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.aged.length === 0 ? (
              <EmptyState title="Todo al día" description="No hay armazones con más de 90 días en stock." />
            ) : (
              <ul className="divide-y">
                {stats.aged.slice(0, 8).map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {f.code} · {brandName(f.brandId)} {f.model}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> {daysBetween(f.entryDate)} días · ingresó {formatDate(f.entryDate)}
                      </p>
                    </div>
                    <StatusBadge status={f.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
