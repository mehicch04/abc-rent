import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: "Rent a car Sarajevo, besplatna dostava na aerodrom / Car rental in Sarajevo with free airport delivery.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1220",
    theme_color: "#0A94DC",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
