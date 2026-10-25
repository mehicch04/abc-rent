"use client";

import { useCallback, useState, type SyntheticEvent } from "react";

/**
 * Auto framing for vehicle images.
 * Studio cutouts on white get trimmed and scaled so every car fills the stage the same way.
 * Real photos (wall, street, showroom behind the car) are detected and shown full bleed instead.
 */
export type CarFrame =
  | { photo: true }
  | { photo: false; origin: string; transform: string; floor: number; width: number };

const cache = new Map<string, CarFrame | null>();

const FIT_W = 0.9;
const FIT_H = 0.68;
const CENTER_Y = 0.58;
const MAX_SCALE = 2.4;

function analyse(img: HTMLImageElement, ratio: number): CarFrame | null {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;
  const w = 72;
  const h = Math.max(8, Math.round((w * nh) / nw));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  let d: Uint8ClampedArray;
  try {
    ctx.drawImage(img, 0, 0, w, h);
    d = ctx.getImageData(0, 0, w, h).data;
  } catch {
    return null;
  }
  const empty = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    return d[i + 3] < 24 || (d[i] > 232 && d[i + 1] > 232 && d[i + 2] > 232);
  };

  // A cutout has a mostly white or transparent border, a photo does not.
  let edge = 0;
  let light = 0;
  for (let x = 0; x < w; x++) {
    edge += 2;
    light += Number(empty(x, 0)) + Number(empty(x, h - 1));
  }
  for (let y = 1; y < h - 1; y++) {
    edge += 2;
    light += Number(empty(0, y)) + Number(empty(w - 1, y));
  }
  if (light / edge < 0.6) return { photo: true };

  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (empty(x, y)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) return null;

  // Where object-contain places the image inside the stage, as fractions of the stage.
  const r = nw / nh;
  const dw = r > ratio ? 1 : r / ratio;
  const dh = r > ratio ? ratio / r : 1;
  const ox = (1 - dw) / 2;
  const oy = (1 - dh) / 2;
  const bx = x0 / w;
  const by = y0 / h;
  const bw = (x1 + 1 - x0) / w;
  const bh = (y1 + 1 - y0) / h;
  const cw = dw * bw;
  const ch = dh * bh;
  const cx = ox + dw * (bx + bw / 2);
  const cy = oy + dh * (by + bh / 2);
  const s = Math.min(FIT_W / cw, FIT_H / ch, MAX_SCALE);
  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

  return {
    photo: false,
    origin: `${pct(cx)} ${pct(cy)}`,
    transform: `translate(${pct(0.5 - cx)}, ${pct(CENTER_Y - cy)}) scale(${s.toFixed(3)})`,
    floor: CENTER_Y + (ch * s) / 2,
    width: cw * s,
  };
}

export function useCarFrame(src: string | undefined, ratio: number) {
  const [frame, setFrame] = useState<CarFrame | null | undefined>(undefined);

  const onLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const key = `${ratio}|${src}`;
      let f = cache.get(key);
      if (f === undefined) {
        f = analyse(e.currentTarget, ratio);
        cache.set(key, f);
      }
      setFrame(f);
    },
    [src, ratio],
  );
  const onError = useCallback(() => setFrame(null), []);

  return { frame, ready: frame !== undefined, onLoad, onError };
}
