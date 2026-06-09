"use client";

import { useEffect } from "react";
import { staticAssetPath } from "@/lib/paths";

export function OfflineReady() {
  useEffect(() => {
    if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
      navigator.serviceWorker.register(staticAssetPath("/sw.js")).catch(() => {
        // Offline support is an enhancement; the quiz itself has no network dependency.
      });
    }
  }, []);

  return null;
}
