import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router";
import { router } from "./routes";

function HydrateFallback() {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-screen">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">{t("loading")}</span>
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} hydrateFallbackElement={<HydrateFallback />} />;
}
