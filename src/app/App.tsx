import { RouterProvider } from "react-router";
import { router } from "./routes";

function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} hydrateFallbackElement={<HydrateFallback />} />;
}
