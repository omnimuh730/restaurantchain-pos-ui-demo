import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import {
  AuthSkeleton,
  LayoutSkeleton,
  FloorPlanSkeleton,
  OrdersSkeleton,
  KitchenSkeleton,
  AnalyticsSkeleton,
  SettingsSkeleton,
  PaymentSkeleton,
} from "./pages/pos/components/Skeletons";

function withSuspense(LazyComp: ComponentType<any>, fallback: ReactNode) {
  return (
    <Suspense fallback={fallback}>
      <LazyComp />
    </Suspense>
  );
}

const importSignIn = () => import("./pages/pos/SignIn");
const importSignUp = () => import("./pages/pos/SignUp");
const importLockScreen = () => import("./pages/pos/LockScreen");
const importPOSLayout = () => import("./pages/pos/POSLayout");
const importFloorPlan = () => import("./pages/pos/floor-plan");
const importOrders = () => import("./pages/pos/orders");
const importKitchen = () => import("./pages/pos/kitchen");
const importAnalytics = () => import("./pages/pos/Analytics");
const importSettings = () => import("./pages/pos/settings");
const importPayment = () => import("./pages/pos/payment");

const SignIn = lazy(importSignIn);
const SignUp = lazy(importSignUp);
const LockScreen = lazy(importLockScreen);
const POSLayout = lazy(importPOSLayout);
const FloorPlan = lazy(importFloorPlan);
const Orders = lazy(importOrders);
const Kitchen = lazy(importKitchen);
const Analytics = lazy(importAnalytics);
const Settings = lazy(importSettings);
const Payment = lazy(importPayment);

// Prefetch POS chunks in the background so in-app navigation is instant.
// Each import is wrapped in catch so a failed prefetch never blanks the app.
if (typeof window !== "undefined") {
  const prefetch = () => {
    const safe = (fn: () => Promise<unknown>) => fn().catch(() => {});
    safe(importPOSLayout);
    safe(importAnalytics);
    safe(importFloorPlan);
    safe(importOrders);
    safe(importKitchen);
    safe(importSettings);
    safe(importPayment);
  };
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
  } else {
    setTimeout(prefetch, 1500);
  }
}

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/pos/analytics" replace /> },
  { path: "/signin", element: withSuspense(SignIn, <AuthSkeleton />) },
  { path: "/signup", element: withSuspense(SignUp, <AuthSkeleton />) },
  { path: "/lock", element: withSuspense(LockScreen, <AuthSkeleton />) },
  {
    path: "/pos",
    element: withSuspense(POSLayout, <LayoutSkeleton />),
    children: [
      { index: true, element: <Navigate to="/pos/analytics" replace /> },
      { path: "floor-plan", element: withSuspense(FloorPlan, <FloorPlanSkeleton />) },
      { path: "orders", element: withSuspense(Orders, <OrdersSkeleton />) },
      { path: "kitchen", element: withSuspense(Kitchen, <KitchenSkeleton />) },
      { path: "analytics", element: withSuspense(Analytics, <AnalyticsSkeleton />) },
      { path: "settings", element: withSuspense(Settings, <SettingsSkeleton />) },
      { path: "payment", element: withSuspense(Payment, <PaymentSkeleton />) },
    ],
  },
  { path: "*", element: <Navigate to="/signin" replace /> },
]);
