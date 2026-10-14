import { SITE } from "@/lib/site-config";

export type TermsBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type TermsArticle = {
  n: number;
  topic: string;
  blocks: TermsBlock[];
};

export type TermsContent = {
  heading: string;
  intro: string;
  articleLabel: string;
  indexLabel: string;
  articles: TermsArticle[];
};

const STD = SITE.deposit.standard;
const PREM = SITE.deposit.premium;

export const RENTAL_TERMS: Record<"bs" | "en", TermsContent> = {
  bs: {
    heading: "Uslovi najma",
    intro: `Opći uslovi najma vozila agencije ${SITE.name}. Molimo vas da ih pažljivo pročitate prije preuzimanja vozila.`,
    articleLabel: "Član",
    indexLabel: "Sadržaj",
    articles: [
      {
        n: 1,
        topic: "Rezervacija",
        blocks: [
          {
            type: "p",
            text: "Rezervaciju možete poslati putem web stranice, WhatsAppa ili telefonom. Rezervacija je važeća kada je potvrdimo emailom, porukom ili pozivom.",
          },
          {
            type: "p",
            text: "Rezervaciju možete besplatno izmijeniti ili otkazati najkasnije 24 sata prije preuzimanja vozila.",
          },
        ],
      },
      {
        n: 2,
        topic: "Vozač i dokumenti",
        blocks: [
          { type: "p", text: "Za preuzimanje vozila potrebno je:" },
          {
            type: "ul",
            items: [
              "važeća vozačka dozvola,",
              "lična karta ili pasoš,",
              "kreditna ili debitna kartica za depozit.",
            ],
          },
          {
            type: "p",
            text: "Vozilom smiju upravljati samo vozači navedeni u ugovoru o najmu.",
          },
        ],
      },
      {
        n: 3,
        topic: "Cijena i šta je uključeno",
        blocks: [
          { type: "p", text: "U cijenu najma uključeno je:" },
          {
            type: "ul",
            items: [
              "neograničena kilometraža,",
              "puno osiguranje vozila,",
              "besplatna dostava na Aerodrom Sarajevo (SJJ) i na adresu u Kantonu Sarajevo,",
              "pomoć na cesti 0 do 24.",
            ],
          },
          {
            type: "p",
            text: "Cijena na stranici je cijena koju plaćate. Nema skrivenih troškova.",
          },
        ],
      },
      {
        n: 4,
        topic: "Depozit",
        blocks: [
          {
            type: "p",
            text: `Depozit iznosi ${STD} € za sva vozila, osim za Audi Q7 i Mercedes E klasu, gdje iznosi ${PREM} €.`,
          },
          {
            type: "p",
            text: "Depozit se vraća u cijelosti nakon urednog povrata vozila.",
          },
        ],
      },
      {
        n: 5,
        topic: "Preuzimanje i povrat",
        blocks: [
          {
            type: "p",
            text: "Vozilo preuzimate i vraćate na dogovorenoj lokaciji i u dogovoreno vrijeme. Pri preuzimanju zajedno pregledamo vozilo i u ugovor upisujemo stanje kilometraže, goriva i eventualna oštećenja.",
          },
          {
            type: "p",
            text: "Vozilo se vraća s istom količinom goriva s kojom je preuzeto.",
          },
        ],
      },
      {
        n: 6,
        topic: "Korištenje vozila",
        blocks: [
          { type: "p", text: "Korisnik se obavezuje:" },
          {
            type: "ul",
            items: [
              "da će vozilo koristiti pažljivo i u skladu sa saobraćajnim propisima,",
              "da u vozilu neće pušiti,",
              "da vozilo neće davati trećim osobama koje nisu navedene u ugovoru,",
              "da vozilo neće voziti izvan Bosne i Hercegovine bez prethodnog dogovora s agencijom.",
            ],
          },
          {
            type: "p",
            text: "Kazne za saobraćajne prekršaje nastale tokom najma snosi korisnik.",
          },
        ],
      },
      {
        n: 7,
        topic: "Saobraćajna nezgoda ili kvar",
        blocks: [
          {
            type: "p",
            text: "U slučaju nezgode odmah pozovite policiju i nas. Ne pomjerajte vozilo dok policija ne dođe. Mi ćemo vas voditi kroz sve dalje korake.",
          },
          {
            type: "p",
            text: "U slučaju kvara javite nam se na telefon ili WhatsApp. Dostupni smo 0 do 24.",
          },
        ],
      },
      {
        n: 8,
        topic: "Usluga vozača i transferi",
        blocks: [
          {
            type: "p",
            text: "Uz najam vozila nudimo uslugu profesionalnog vozača i transfer s Aerodroma Sarajevo ili na aerodrom. Cijenu i termin dogovaramo pojedinačno.",
          },
        ],
      },
      {
        n: 9,
        topic: "Kontakt",
        blocks: [
          {
            type: "p",
            text: `${SITE.name}, ${SITE.address}. Telefon: ${SITE.phones.map((p) => p.value).join(", ")}. Email: ${SITE.email}.`,
          },
        ],
      },
    ],
  },

  en: {
    heading: "Rental terms",
    intro: `General vehicle rental terms of ${SITE.name}. Please read them carefully before collecting the vehicle.`,
    articleLabel: "Article",
    indexLabel: "Contents",
    articles: [
      {
        n: 1,
        topic: "Booking",
        blocks: [
          {
            type: "p",
            text: "You can send a booking request through the website, WhatsApp or by phone. A booking is valid once we confirm it by email, message or call.",
          },
          {
            type: "p",
            text: "You can change or cancel your booking free of charge up to 24 hours before pickup.",
          },
        ],
      },
      {
        n: 2,
        topic: "Driver and documents",
        blocks: [
          { type: "p", text: "To collect the vehicle you need:" },
          {
            type: "ul",
            items: [
              "a valid driving licence,",
              "an ID card or passport,",
              "a credit or debit card for the deposit.",
            ],
          },
          {
            type: "p",
            text: "Only the drivers named in the rental agreement may drive the vehicle.",
          },
        ],
      },
      {
        n: 3,
        topic: "Price and what is included",
        blocks: [
          { type: "p", text: "The rental price includes:" },
          {
            type: "ul",
            items: [
              "unlimited mileage,",
              "full insurance,",
              "free delivery to Sarajevo Airport (SJJ) and to any address in Sarajevo Canton,",
              "24/7 roadside assistance.",
            ],
          },
          {
            type: "p",
            text: "The price you see is the price you pay. No hidden fees.",
          },
        ],
      },
      {
        n: 4,
        topic: "Deposit",
        blocks: [
          {
            type: "p",
            text: `The deposit is ${STD} € for every vehicle, except the Audi Q7 and Mercedes E-Class, where it is ${PREM} €.`,
          },
          {
            type: "p",
            text: "The deposit is refunded in full once the vehicle is returned in order.",
          },
        ],
      },
      {
        n: 5,
        topic: "Pickup and return",
        blocks: [
          {
            type: "p",
            text: "You collect and return the vehicle at the agreed place and time. At pickup we inspect the vehicle together and record mileage, fuel level and any existing damage in the agreement.",
          },
          {
            type: "p",
            text: "The vehicle is returned with the same amount of fuel as at pickup.",
          },
        ],
      },
      {
        n: 6,
        topic: "Use of the vehicle",
        blocks: [
          { type: "p", text: "The renter agrees:" },
          {
            type: "ul",
            items: [
              "to drive carefully and follow traffic regulations,",
              "not to smoke in the vehicle,",
              "not to let anyone drive who is not named in the agreement,",
              "not to leave Bosnia and Herzegovina without arranging it with us first.",
            ],
          },
          {
            type: "p",
            text: "Traffic fines incurred during the rental are paid by the renter.",
          },
        ],
      },
      {
        n: 7,
        topic: "Accident or breakdown",
        blocks: [
          {
            type: "p",
            text: "In case of an accident, call the police and us immediately. Do not move the vehicle until the police arrive. We will guide you through the next steps.",
          },
          {
            type: "p",
            text: "In case of a breakdown, call us or send a WhatsApp message. We are available 24/7.",
          },
        ],
      },
      {
        n: 8,
        topic: "Chauffeur service and transfers",
        blocks: [
          {
            type: "p",
            text: "Alongside car rental we offer a professional chauffeur service and transfers to and from Sarajevo Airport. Price and time are agreed individually.",
          },
        ],
      },
      {
        n: 9,
        topic: "Contact",
        blocks: [
          {
            type: "p",
            text: `${SITE.name}, ${SITE.address}. Phone: ${SITE.phones.map((p) => p.value).join(", ")}. Email: ${SITE.email}.`,
          },
        ],
      },
    ],
  },
};
