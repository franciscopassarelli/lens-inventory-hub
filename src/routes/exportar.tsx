import { createFileRoute } from "@tanstack/react-router";
import { ExportPage } from "@/pages/ExportPage";

export const Route = createFileRoute("/exportar")({
  head: () => ({
    meta: [
      { title: "Exportar CSV | Óptica Stock" },
      {
        name: "description",
        content:
          "Descargá en CSV el stock actual, el listado completo de armazones y el historial de movimientos.",
      },
      { property: "og:title", content: "Exportar CSV | Óptica Stock" },
      { property: "og:description", content: "Exportaciones CSV del inventario de la óptica." },
    ],
  }),
  component: ExportPage,
});
