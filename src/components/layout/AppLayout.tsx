import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Glasses,
  ArrowLeftRight,
  Tags,
  Download,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/armazones", label: "Armazones", icon: Glasses },
  { to: "/movimientos", label: "Movimientos", icon: ArrowLeftRight },
  { to: "/marcas", label: "Marcas", icon: Tags },
  { to: "/exportar", label: "Exportar", icon: Download },
  { to: "/configuracion", label: "Configuración", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4">
      <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Glasses className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-sidebar-foreground">Óptica Stock</p>
        <p className="text-xs text-muted-foreground">Gestión de armazones</p>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = NAV.find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)))?.label ?? "Óptica Stock";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="sticky top-0">
          <Brand />
          <NavLinks />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navegación</SheetTitle>
              <Brand />
              <NavLinks onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
