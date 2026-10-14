import { SITE_URL } from "@/lib/seo";
import { SITE } from "@/lib/site-config";

export function GET() {
  const u = (p: string) => `${SITE_URL}${p}`;

  const body = `# ${SITE.name}

> Rent a car u Sarajevu, Bosna i Hercegovina. Besplatna dostava vozila na Aerodrom Sarajevo (SJJ) i na adresu u Sarajevu, depozit 200 €, neograničena kilometraža i puno osiguranje. Usluge vozača i transferi s aerodroma. Dvojezično (BS/EN). Rezervacija na upit: gost šalje zahtjev, agencija potvrđuje (bez online plaćanja).

## Osnovno
- Lokacija: ${SITE.address}
- Preuzimanje: poslovnica, Aerodrom Sarajevo ili dostava na adresu u Kantonu Sarajevo
- Radno vrijeme: ${SITE.hours}
- Kontakt: ${SITE.email}, ${SITE.phones[0]?.value ?? ""}
- Model rezervacije: upit, pa potvrda agencije (bez online naplate)

## Stranice (bosanski)
- [Početna](${u("/bs")}): ponuda vozila, provjera dostupnosti, usluge vozača i transferi
- [Vozila](${u("/bs/vozila")}): vozni park s filterima, galerijom i cijenama po danu
- [O nama](${u("/bs/o-nama")}): o agenciji ${SITE.name}
- [Uslovi najma](${u("/bs/uvjeti-najma")}): uslovi, dokumenti i pravila najma
- [Kontakt](${u("/bs/kontakt")}): adresa, telefoni i upit

## Pages (English)
- [Home](${u("/en")}): fleet, availability search, chauffeur and airport transfers
- [Vehicles](${u("/en/vozila")}): fleet with filters, gallery and daily prices
- [About](${u("/en/o-nama")}): about ${SITE.name}
- [Rental terms](${u("/en/uvjeti-najma")}): terms, documents and rental rules
- [Contact](${u("/en/kontakt")}): address, phones and inquiry

## Napomene
- Sitemap: ${u("/sitemap.xml")}
- Admin i API rute nisu za indeksiranje.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
