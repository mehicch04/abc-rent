/** Short walkaround videos, keyed by car slug. Files live in /public/videos. */
const VIDEOS: Record<string, string> = {
  "mercedes-e-klasa-2019": "mercedes-e-class-2019",
  "mercedes-e-klasa-2018": "mercedes-e-class-2018",
  "audi-q7": "audi-q7",
  "skoda-kodiaq": "skoda-kodiaq",
  "skoda-octavia-2021": "skoda-octavia-sedan",
  "skoda-octavia-karavan-2018": "skoda-octavia-combi",
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

export function carVideo(slug: string): string | null {
  const name = VIDEOS[slug];
  return name ? `/videos/${name}.mp4` : null;
}
