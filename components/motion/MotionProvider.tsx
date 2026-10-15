"use client";

import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("./features").then((r) => r.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
