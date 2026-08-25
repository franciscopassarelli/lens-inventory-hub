import { createFileRoute } from "@tanstack/react-router";
import { FramesPage } from "@/pages/FramesPage";

export const Route = createFileRoute("/armazones")({
  head: () => ({
    meta: [
      { title: "Armazones | Óptica Stock" },
      {
        name: "description",
        content:
          "Listado de armazones con búsqueda por código, marca, modelo y sobre, filtros por estado y precio, y alta o edición rápida.",
      },
      { property: "og:title", content: "Armazones | Óptica Stock" },
      {
        property: "og:description",
        content: "Consultá, filtrá y administrá el stock de armazones de la óptica.",
      },
    ],
  }),
  component: FramesPage,
});
