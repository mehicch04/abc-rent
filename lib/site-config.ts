export const SITE = {
  name: "ABC Rent a Car",
  shortName: "ABC Rent",
  domain: "abcrentacar.ba",
  email: "info@abcrentacar.ba",
  phones: [
    { label: "Tel", value: "+387 62 652 954", href: "tel:+38762652954" },
    { label: "Mob", value: "+387 62 160 942", href: "tel:+38762160942" },
  ],
  whatsapp: "38762652954",
  hours: "0 do 24h, svaki dan",
  open24: true,
  address: "Munira Gavrankapetanovića 108, 71210 Sarajevo",
  city: "Sarajevo",
  region: "Kanton Sarajevo",
  map: {
    lat: 43.837469,
    lng: 18.3302792,
    link: "https://maps.google.com/?cid=7151839974306582764",
  },
  rating: { score: 5.0, count: 189 },
  socials: {
    facebook: null as string | null,
    instagram: null as string | null,
  },
  deposit: { standard: 200, premium: 300 },
  gtmId: "GTM-WKG2ZLLP",
  brandColor: "#0A94DC",
} as const;

export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/vozila", key: "vehicles" },
  { href: "/vodici", key: "guides" },
  { href: "/o-nama", key: "about" },
  { href: "/uvjeti-najma", key: "terms" },
  { href: "/kontakt", key: "contact" },
] as const;

export const LOCATIONS = [
  { name: "Poslovnica Sarajevo", street: "Munira Gavrankapetanovića 108", city: "71210 Sarajevo" },
  { name: "Aerodrom Sarajevo (SJJ)", street: "Kurta Schorka 36", city: "71210 Sarajevo" },
  { name: "Dostava na adresu", street: "Bilo koja adresa u Kantonu Sarajevo", city: "Sarajevo" },
] as const;
