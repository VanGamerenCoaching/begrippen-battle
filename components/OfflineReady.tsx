"use client";

import { useEffect } from "react";
import { appPath } from "@/lib/paths";

export function OfflineReady() {
  useEffect(() => {
    if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
      navigator.serviceWorker.register(appPath("/sw.js")).catch(() => {
        // Offline support is an enhancement; the quiz itself has no network dependency.
      });
    }
  }, []);

  return null;
}
