import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/SettingsPage";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración | Óptica Stock" },
      {
        name: "description",
        content: "Restaurá los datos demo o limpiá todos los datos guardados localmente en el navegador.",
      },
      { property: "og:title", content: "Configuración | Óptica Stock" },
      { property: "og:description", content: "Mantenimiento de los datos locales de la aplicación." },
    ],
  }),
  component: SettingsPage,
});
