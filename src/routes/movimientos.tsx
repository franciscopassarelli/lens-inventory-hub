import { createFileRoute } from "@tanstack/react-router";
import { MovementsPage } from "@/pages/MovementsPage";

export const Route = createFileRoute("/movimientos")({
  head: () => ({
    meta: [
      { title: "Movimientos | Óptica Stock" },
      {
        name: "description",
        content:
          "Registrá ingresos, ventas, devoluciones y reparaciones, y consultá el historial completo con filtros.",
      },
      { property: "og:title", content: "Movimientos | Óptica Stock" },
      {
        property: "og:description",
        content: "Historial y registro de movimientos de armazones.",
      },
    ],
  }),
  component: MovementsPage,
});
