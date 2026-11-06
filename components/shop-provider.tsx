"use client";

import { Toaster } from "sonner";
import { CartDrawer } from "@/components/cart-drawer";

export function ShopProvider({ children }: { children: React.ReactNode }) {
  return <>{children}<CartDrawer /><Toaster position="bottom-center" richColors closeButton /></>;
}
