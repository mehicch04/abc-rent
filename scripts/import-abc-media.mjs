import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://abcrentacar.ba/wp-content/themes/abc/assets";
const ROOT = path.resolve(process.cwd(), "public");

const CARS = {
  "mercedes-e-class-2019": "mercedes-e-class-2019",
  "mercedes-e-class-2018": "mercedes-e-class-2018",
  "audi-q7": "audi-q7",
  "skoda-kodiaq": "skoda-kodiaq",
  "skoda-octavia-sedan": "skoda-octavia-2021",
  "skoda-octavia-combi": "skoda-octavia-combi-2018",
  "skoda-karoq": "skoda-karoq",
  "skoda-scala": "skoda-scala",
  "vw-t-cross": "vw-t-cross",
  "vw-polo": "vw-polo",
  "vw-golf-7": "vw-golf-7",
  "vw-touran": "vw-touran",
  "vw-sharan": "vw-sharan",
  "vw-caravelle": "vw-caravelle",
  "vw-transporter": "vw-transporter",
  "mercedes-vito-2020": "mercedes-vito-2020",
  "mercedes-vito-2014": "mercedes-vito-2014",
  "peugeot-3008": "peugeot-3008",
  "seat-arona": "seat-arona",
};

const exists = (p) => access(p).then(() => true, () => false);

async function grab(url, dest) {
  if (await exists(dest)) return "skip";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return "ok";
}

await mkdir(path.join(ROOT, "cars"), { recursive: true });
await mkdir(path.join(ROOT, "videos"), { recursive: true });

const jobs = [];
for (const [theirs, ours] of Object.entries(CARS)) {
  jobs.push([`${BASE}/img/cars/${theirs}-b-1200.webp`, path.join(ROOT, "cars", `${ours}-2.webp`)]);
  jobs.push([`${BASE}/img/cars/${theirs}-c-1200.webp`, path.join(ROOT, "cars", `${ours}-3.webp`)]);
  jobs.push([`${BASE}/video/${theirs}.mp4`, path.join(ROOT, "videos", `${theirs}.mp4`)]);
}

let ok = 0, skip = 0, fail = 0;
for (let i = 0; i < jobs.length; i += 6) {
  const batch = await Promise.allSettled(jobs.slice(i, i + 6).map(([u, d]) => grab(u, d)));
  for (const r of batch) {
    if (r.status === "fulfilled") r.value === "ok" ? ok++ : skip++;
    else { fail++; console.error(r.reason.message); }
  }
}
console.log(`ABC media: ${ok} downloaded, ${skip} already there, ${fail} failed`);
if (fail) process.exitCode = 1;
