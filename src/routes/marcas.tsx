import { createFileRoute } from "@tanstack/react-router";
import { BrandsPage } from "@/pages/BrandsPage";

export const Route = createFileRoute("/marcas")({
  head: () => ({
    meta: [
      { title: "Marcas | Óptica Stock" },
      {
        name: "description",
        content: "Alta, edición y baja de marcas de armazones, con la cantidad de armazones asociados.",
      },
      { property: "og:title", content: "Marcas | Óptica Stock" },
      { property: "og:description", content: "Administración de marcas de armazones." },
    ],
  }),
  component: BrandsPage,
});
