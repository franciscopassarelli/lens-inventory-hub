import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Óptica Stock — Gestión de armazones" },
      {
        name: "description",
        content:
          "Panel con stock actual, valor estimado, movimientos recientes y armazones con más de 90 días en stock.",
      },
      { property: "og:title", content: "Dashboard | Óptica Stock" },
      {
        property: "og:description",
        content: "Resumen del stock de armazones y actividad reciente de la óptica.",
      },
    ],
  }),
  component: DashboardPage,
});
