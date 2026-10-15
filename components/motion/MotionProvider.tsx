"use client";

import { LazyMotion } from "framer-motion";

const idle = () =>
  new Promise<void>((resolve) => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 2500 });
    else setTimeout(resolve, 1200);
  });

const loadFeatures = () => idle().then(() => import("./features").then((r) => r.default));

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
