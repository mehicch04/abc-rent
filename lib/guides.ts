import { intlLocale, type AppLocale } from "@/i18n/routing";

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: [string, string]; rows: [string, string][] }
  | { type: "note"; text: string };

export type GuideIcon = "fines" | "rules" | "airport" | "trips" | "family";

export type Guide = {
  slug: string;
  icon: GuideIcon;
  minutes: number;
  updated: string;
  cars: "compact" | "family" | "all";
  title: string;
  lead: string;
  blocks: GuideBlock[];
};

type Copy = Omit<Guide, "slug" | "icon" | "minutes" | "updated" | "cars">;

const META = [
  { slug: "saobracajne-kazne-bih", icon: "fines", minutes: 2, cars: "all" },
  { slug: "pravila-voznje-bih", icon: "rules", minutes: 2, cars: "all" },
  { slug: "rent-a-car-aerodrom-sarajevo", icon: "airport", minutes: 2, cars: "compact" },
  { slug: "izleti-iz-sarajeva", icon: "trips", minutes: 3, cars: "all" },
  { slug: "porodicno-vozilo-7-ili-9-sjedista", icon: "family", minutes: 2, cars: "family" },
] as const;

const UPDATED = "2026-10-23";

const W: Record<AppLocale, { to: string; about: string; km: string; eur: string }> = {
  bs: { to: "do", about: "oko", km: "KM", eur: "€" },
  en: { to: "to", about: "about", km: "KM", eur: "€" },
  de: { to: "bis", about: "ca.", km: "KM", eur: "€" },
  ar: { to: "إلى", about: "حوالي", km: "مارك", eur: "يورو" },
};

function amount(l: AppLocale, km: [number, number?], eur: [number, number?]): string {
  const n = (v: number) => v.toLocaleString(intlLocale(l));
  const r = ([a, b]: [number, number?]) => (b ? `${n(a)} ${W[l].to} ${n(b)}` : n(a));
  return `${r(km)} ${W[l].km} (${W[l].about} ${r(eur)} ${W[l].eur})`;
}

const FINE_AMOUNTS: [[number, number?], [number, number?]][] = [
  [[50], [26]],
  [[100, 300], [51, 153]],
  [[400, 1000], [205, 511]],
  [[200, 400], [102, 205]],
  [[200, 400], [102, 205]],
  [[100, 300], [51, 153]],
  [[50, 250], [26, 128]],
  [[100, 300], [51, 153]],
  [[400, 1000], [205, 511]],
  [[400, 1000], [205, 511]],
  [[40], [20]],
  [[30], [15]],
  [[40], [20]],
  [[2000, 3000], [1023, 1534]],
];

const FINE_LABELS: Record<AppLocale, string[]> = {
  bs: [
    "Prekoračenje brzine 10 do 20 km/h",
    "Prekoračenje brzine 20 do 30 km/h",
    "Prekoračenje brzine više od 30 km/h",
    "Mobitel u vožnji bez handsfree uređaja",
    "Nevezan sigurnosni pojas",
    "Prolazak kroz crveno svjetlo",
    "Alkohol 0,3 do 0,8 g/kg",
    "Alkohol 0,8 do 1,5 g/kg",
    "Alkohol preko 1,5 g/kg",
    "Dijete mlađe od 12 godina na prednjem sjedištu",
    "Dijete bez propisane sjedalice",
    "Vožnja danju bez kratkih ili dnevnih svjetala",
    "Bez zimske opreme (1.11. do 1.4.)",
    "Obijesna vožnja (npr. 40 km/h preko u naselju, 60 van naselja)",
  ],
  en: [
    "Speeding by 10 to 20 km/h",
    "Speeding by 20 to 30 km/h",
    "Speeding by more than 30 km/h",
    "Phone while driving without hands free",
    "Not wearing a seat belt",
    "Running a red light",
    "Alcohol 0.3 to 0.8 g/kg",
    "Alcohol 0.8 to 1.5 g/kg",
    "Alcohol above 1.5 g/kg",
    "Child under 12 in the front seat",
    "Child without the required child seat",
    "No dipped or daytime lights during the day",
    "No winter equipment (1 Nov to 1 Apr)",
    "Reckless driving (e.g. 40 km/h over in town, 60 outside)",
  ],
  de: [
    "10 bis 20 km/h zu schnell",
    "20 bis 30 km/h zu schnell",
    "Mehr als 30 km/h zu schnell",
    "Handy am Steuer ohne Freisprechanlage",
    "Nicht angeschnallt",
    "Rote Ampel überfahren",
    "Alkohol 0,3 bis 0,8 g/kg",
    "Alkohol 0,8 bis 1,5 g/kg",
    "Alkohol über 1,5 g/kg",
    "Kind unter 12 auf dem Beifahrersitz",
    "Kind ohne vorgeschriebenen Kindersitz",
    "Tagsüber ohne Abblend oder Tagfahrlicht",
    "Ohne Winterausrüstung (1.11. bis 1.4.)",
    "Rücksichtsloses Fahren (z. B. 40 km/h zu schnell innerorts, 60 außerorts)",
  ],
  ar: [
    "تجاوز السرعة من 10 إلى 20 كم/س",
    "تجاوز السرعة من 20 إلى 30 كم/س",
    "تجاوز السرعة بأكثر من 30 كم/س",
    "استخدام الجوال أثناء القيادة بدون سماعة",
    "عدم ربط حزام الأمان",
    "تجاوز الإشارة الحمراء",
    "الكحول من 0.3 إلى 0.8 غ/كغ",
    "الكحول من 0.8 إلى 1.5 غ/كغ",
    "الكحول أكثر من 1.5 غ/كغ",
    "طفل دون 12 سنة في المقعد الأمامي",
    "طفل بدون كرسي الأطفال المطلوب",
    "القيادة نهاراً بدون أنوار",
    "بدون تجهيزات الشتاء (من 1 نوفمبر إلى 1 أبريل)",
    "القيادة المتهوّرة (مثل تجاوز 40 كم/س داخل المدن و60 خارجها)",
  ],
};

const SPEED: Record<AppLocale, { head: [string, string]; rows: string[] }> = {
  bs: { head: ["Cesta", "Ograničenje"], rows: ["U naselju", "Van naselja", "Brze ceste", "Autoput"] },
  en: { head: ["Road", "Limit"], rows: ["In towns and villages", "Outside towns", "Expressways", "Motorways"] },
  de: { head: ["Straße", "Limit"], rows: ["Innerorts", "Außerorts", "Schnellstraßen", "Autobahn"] },
  ar: { head: ["نوع الطريق", "الحد الأقصى"], rows: ["داخل المدن والقرى", "خارج المدن", "الطرق السريعة", "الأوتوبان"] },
};

function speedTable(l: AppLocale): GuideBlock {
  const limits = ["50 km/h", "80 km/h", "100 km/h", "130 km/h"];
  return { type: "table", head: SPEED[l].head, rows: SPEED[l].rows.map((r, i) => [r, limits[i]] as [string, string]) };
}

function finesTable(l: AppLocale, head: [string, string]): GuideBlock {
  return {
    type: "table",
    head,
    rows: FINE_LABELS[l].map((label, i) => [label, amount(l, FINE_AMOUNTS[i][0], FINE_AMOUNTS[i][1])] as [string, string]),
  };
}

function copy(l: AppLocale): Copy[] {
  switch (l) {
    case "bs":
      return [
        {
          title: "Saobraćajne kazne u BiH (2026): brzina, mobitel, pojas",
          lead: "Koliko iznose kazne za brzinu, mobitel, pojas, alkohol i crveno svjetlo, u KM i eurima.",
          blocks: [
            { type: "p", text: "Kazne u Bosni i Hercegovini propisuje jedan državni zakon, pa su iznosi isti u Sarajevu, Mostaru i Banjoj Luci. Izražene su u konvertibilnim markama, a kurs je fiksan: 1 € = 1,95583 KM. Tabela prati zakon sa izmjenama koje važe od 27. maja 2026." },
            finesTable(l, ["Prekršaj", "Kazna"]),
            { type: "h2", text: "Šta se promijenilo u maju 2026." },
            { type: "ul", items: ["Mobitel u vožnji i nevezan pojas sada koštaju 200 do 400 KM, a ranije 100 do 300 KM.", "Uvedena je obijesna vožnja: prekoračenje brzine za više od 40 km/h u naselju ili 60 km/h van naselja, te ponovljeni prolazak kroz crveno. Kazna je 2.000 do 3.000 KM i zabrana vožnje od šest mjeseci."] },
            { type: "h2", text: "Ograničenja brzine" },
            speedTable(l),
            { type: "h2", text: "Ako vas zaustave u iznajmljenom vozilu" },
            { type: "ul", items: ["Kazna se izdaje vozaču, a ne agenciji. Sačuvajte nalog i javite nam se, pomoći ćemo vam da ga razumijete.", "Uz sebe imajte vozačku dozvolu, pasoš i ugovor o najmu koji dobijete uz vozilo.", "Radari su česti na izlazima iz Sarajeva. Tempomat je najjeftinije osiguranje."] },
            { type: "note", text: "Ovo je sažetak za posjetioce, a ne pravni savjet. Iznosi se mogu promijeniti, a mjerodavan je zakon." },
          ],
        },
        {
          title: "Vožnja u Bosni: pravila koja svaki posjetilac treba znati",
          lead: "Ograničenja brzine, svjetla tokom cijelog dana, alkohol, dječije sjedalice i zimska oprema na jednom mjestu.",
          blocks: [
            { type: "p", text: "U Bosni se vozi desnom stranom i pravila su slična ostatku Evrope. Pet stvari najčešće iznenadi posjetioce." },
            { type: "h2", text: "1. Ograničenja brzine" },
            speedTable(l),
            { type: "p", text: "Znakovi imaju prednost nad općim ograničenjima, a naselja često počinju odmah iza krivine. Usporite čim vidite tablu sa nazivom mjesta." },
            { type: "h2", text: "2. Svjetla i danju i noću" },
            { type: "p", text: "Kratka ili dnevna svjetla moraju biti upaljena kad god se vozilo kreće, i u podne u julu." },
            { type: "h2", text: "3. Alkohol: 0,3 g/kg" },
            { type: "p", text: "Opća granica je 0,3 g/kg. Za vozače mlađe od 21 godine, vozače sa manje od tri godine iskustva i profesionalne vozače granica je nula." },
            { type: "h2", text: "4. Djeca" },
            { type: "ul", items: ["Dijete mlađe od 12 godina ne smije sjediti na prednjem sjedištu.", "Djeca do 5 godina voze se u sjedalici, a od 5 do 12 na booster sjedištu. Recite nam uzrast pri rezervaciji i prava sjedalica će biti u vozilu."] },
            { type: "h2", text: "5. Zimska oprema od 1. novembra do 1. aprila" },
            { type: "p", text: "U tom periodu obavezne su zimske gume, ili ljetne uz lance u vozilu. Naša vozila su pripremljena za sezonu." },
            { type: "h2", text: "Pojas i mobitel" },
            { type: "p", text: "Pojas je obavezan na svim sjedištima, a mobitel se smije koristiti samo uz handsfree. Obje kazne su povećane u maju 2026." },
            { type: "note", text: "Sažetak za posjetioce, a ne pravni savjet. Mjerodavan je zakon." },
          ],
        },
        {
          title: "Rent a car na Aerodromu Sarajevo: preuzimanje korak po korak",
          lead: "Slijećete na Aerodrom Sarajevo (SJJ)? Ovako preuzimate vozilo bez reda, avansa i iznenađenja.",
          blocks: [
            { type: "p", text: "Aerodrom Sarajevo je mali i udaljen oko 20 minuta od Baščaršije. Šalter vam ne treba, vozilo vas čeka na dolascima, besplatno." },
            { type: "h2", text: "Prije leta" },
            { type: "ul", items: ["Odaberite datume na stranici. Vidite samo vozila koja su u tom terminu stvarno slobodna.", "Pošaljite rezervaciju. Ništa ne plaćate unaprijed, a potvrdu sa brojem rezervacije dobijate emailom.", "Upišite broj leta da pratimo vaš dolazak."] },
            { type: "h2", text: "Kada sletite" },
            { type: "ul", items: ["Čekamo vas na dolascima u dogovoreno vrijeme. Ako let kasni, to već znamo.", "Zajedno pregledamo vozilo, pokažete vozačku i pasoš, potpišete ugovor i ostavite depozit.", "Platite najam i krećete."] },
            { type: "h2", text: "Vraćanje vozila" },
            { type: "p", text: "Vratite ga na aerodrom, u poslovnicu ili na vašu adresu u Sarajevu, kako ste odabrali pri rezervaciji. Depozit vam vraćamo pri primopredaji." },
            { type: "h2", text: "Ne dolazite avionom?" },
            { type: "p", text: "Odaberite dostavu na adresu i upišite hotel ili apartman. Dostava košta koliko i jedna vožnja taksijem od aerodroma." },
          ],
        },
        {
          title: "Šest izleta iz Sarajeva za jedan dan",
          lead: "Vrelo Bosne, Bjelašnica, Konjic, Travnik, Mostar i Jajce, sa približnom udaljenošću i vremenom vožnje.",
          blocks: [
            { type: "p", text: "Sarajevo je u sredini zemlje, pa je većina Bosne na dan vožnje. Udaljenosti i vremena su približni i zavise od saobraćaja i sezone." },
            { type: "h2", text: "Vrelo Bosne, oko 15 km i 30 minuta" },
            { type: "p", text: "Izvor rijeke Bosne na Ilidži: park bistrih potoka i duga aleja. Lagana prva vožnja nakon preuzimanja vozila." },
            { type: "h2", text: "Bjelašnica i Jahorina, oko 30 km i 45 minuta" },
            { type: "p", text: "Olimpijske planine. Zimi skijanje, ljeti svjež zrak i staze za šetnju. Zimi je potrebna zimska oprema." },
            { type: "h2", text: "Konjic, oko 60 km i 1 sat" },
            { type: "p", text: "Stara kamena ćuprija na Neretvi i početak najljepše dionice prema Mostaru." },
            { type: "h2", text: "Travnik, oko 90 km i 1 sat i 30 minuta" },
            { type: "p", text: "Tvrđava, Šarena džamija i Plava voda." },
            { type: "h2", text: "Mostar, oko 130 km i 2 sata i 15 minuta" },
            { type: "p", text: "Stari most. Cesta prati zeleni kanjon Neretve, zato krenite rano i stanite u Jablanici i Konjicu." },
            { type: "h2", text: "Jajce, oko 160 km i 2 sata i 30 minuta" },
            { type: "p", text: "Vodopad usred grada i Plivska jezera sa drvenim mlinčićima." },
            { type: "h2", text: "Koje vozilo?" },
            { type: "p", text: "Za dvoje je dovoljan manji auto. Za porodicu s prtljagom odaberite vozilo sa 7 sjedišta, a za grupu kombi sa 9. Sva naša vozila imaju automatski mjenjač i neograničenu kilometražu." },
          ],
        },
        {
          title: "7 ili 9 sjedišta? Kako odabrati porodično vozilo",
          lead: "Koliko osoba, koliko kofera i koliko dječijih sjedalica. Jednostavan način da odaberete pravo vozilo.",
          blocks: [
            { type: "p", text: "Najčešća greška je brojati sjedišta, a zaboraviti prtljag. Vozilo sa sedam sjedišta rijetko nosi i sedam kofera." },
            { type: "h2", text: "Brojite kofere, ne samo ljude" },
            { type: "ul", items: ["Do 5 osoba sa uobičajenim prtljagom: dovoljan je SUV ili karavan.", "6 ili 7 osoba sa lakim prtljagom: vozilo sa 7 sjedišta.", "6 ili 7 osoba sa koferom po osobi, ili 8 i 9 osoba: kombi sa 9 sjedišta i mjestom za oko šest velikih kofera."] },
            { type: "h2", text: "Dječija sjedalica zauzima cijelo mjesto" },
            { type: "p", text: "Sjedalica zauzima cijelo sjedište i ne ide na prednje sjedište za djecu mlađu od 12 godina. Sa dvije sjedalice u vozilu sa 7 sjedišta računajte na najviše pet odraslih. Recite nam uzrast svakog djeteta pri rezervaciji." },
            { type: "h2", text: "Treba li posebna dozvola?" },
            { type: "p", text: "Ne. Vozila do devet sjedišta, uključujući vozača, voze se sa B kategorijom." },
            { type: "h2", text: "Planinske ceste" },
            { type: "p", text: "Sva naša porodična vozila imaju automatski mjenjač, pa su usponi prema Bjelašnici i kanjonu Neretve mnogo lakši i sa punim vozilom." },
          ],
        },
      ];
    case "en":
      return [
        {
          title: "Traffic fines in Bosnia (2026): speeding, phone, seat belt",
          lead: "What speeding, phone use, seat belts, alcohol and red lights cost, in KM and euros.",
          blocks: [
            { type: "p", text: "Fines in Bosnia and Herzegovina are set by one state law, so the amounts are the same in Sarajevo, Mostar and Banja Luka. They are written in convertible marks, pegged to the euro at 1 € = 1.95583 KM. The table follows the law with the changes in force since 27 May 2026." },
            finesTable(l, ["Offence", "Fine"]),
            { type: "h2", text: "What changed in May 2026" },
            { type: "ul", items: ["Using a phone and driving without a seat belt now cost 200 to 400 KM, up from 100 to 300 KM.", "A new offence, reckless driving, covers speeding by more than 40 km/h in town or 60 km/h outside it, and repeated red lights. It carries 2,000 to 3,000 KM and a six month driving ban."] },
            { type: "h2", text: "Speed limits" },
            speedTable(l),
            { type: "h2", text: "If you are stopped in a rental car" },
            { type: "ul", items: ["The fine is issued to the driver, not to the rental company. Keep the notice and tell us, we help you understand it.", "Carry your driving licence, passport and the rental agreement you get with the car.", "Speed cameras are common on the roads out of Sarajevo. Cruise control is the cheapest insurance."] },
            { type: "note", text: "A summary for visitors, not legal advice. Amounts can change and the law is what counts." },
          ],
        },
        {
          title: "Driving in Bosnia: the rules every visitor should know",
          lead: "Speed limits, lights on all day, alcohol, child seats and winter equipment in one place.",
          blocks: [
            { type: "p", text: "Bosnia drives on the right and the rules are close to the rest of Europe. Five points catch visitors out more than anything else." },
            { type: "h2", text: "1. Speed limits" },
            speedTable(l),
            { type: "p", text: "Signs override these general limits, and villages often start right after a bend. Slow down when you see the town sign." },
            { type: "h2", text: "2. Lights on, day and night" },
            { type: "p", text: "Dipped or daytime running lights must be on whenever the car moves, even at noon in July." },
            { type: "h2", text: "3. Alcohol: 0.3 g/kg" },
            { type: "p", text: "The general limit is 0.3 g/kg. For drivers under 21, drivers with less than three years of experience and professional drivers the limit is zero." },
            { type: "h2", text: "4. Children" },
            { type: "ul", items: ["A child under 12 may not sit in the front seat.", "Children up to 5 travel in a child seat and from 5 to 12 on a booster. Tell us their age when you book and the right seat will be in the car."] },
            { type: "h2", text: "5. Winter equipment from 1 November to 1 April" },
            { type: "p", text: "In this period winter tyres are required, or summer tyres with chains in the car. Our cars are prepared for the season." },
            { type: "h2", text: "Seat belts and phones" },
            { type: "p", text: "Belts are compulsory in every seat and a phone may only be used hands free. Both fines went up in May 2026." },
            { type: "note", text: "A summary for visitors, not legal advice. The law is what counts." },
          ],
        },
        {
          title: "Car rental at Sarajevo Airport: pick-up step by step",
          lead: "Landing at Sarajevo Airport (SJJ)? This is how you get your car with no queue, no prepayment and no surprises.",
          blocks: [
            { type: "p", text: "Sarajevo Airport is small and about 20 minutes from the old town. You don't need a rental desk, the car waits for you at arrivals, free of charge." },
            { type: "h2", text: "Before you fly" },
            { type: "ul", items: ["Choose your dates on the website. You only see cars that are really free at that time.", "Send the booking. You pay nothing in advance and get a confirmation with your booking number by email.", "Add your flight number so we can follow your arrival."] },
            { type: "h2", text: "When you land" },
            { type: "ul", items: ["We wait at arrivals at the agreed time. If the flight is late, we already know.", "We check the car together, you show your licence and passport, sign the agreement and leave the deposit.", "You pay the rental and drive away."] },
            { type: "h2", text: "Returning the car" },
            { type: "p", text: "Bring it back to the airport, our office or your address in Sarajevo, whatever you chose when booking. The deposit is returned at hand over." },
            { type: "h2", text: "Not flying?" },
            { type: "p", text: "Choose delivery to your address and enter your hotel or apartment. Delivery costs the same as one taxi ride from the airport." },
          ],
        },
        {
          title: "Six day trips from Sarajevo by car",
          lead: "Vrelo Bosne, Bjelašnica, Konjic, Travnik, Mostar and Jajce, with rough distances and driving times.",
          blocks: [
            { type: "p", text: "Sarajevo sits in the middle of the country, so most of Bosnia is a day trip away. Distances and times are approximate and depend on traffic and season." },
            { type: "h2", text: "Vrelo Bosne, about 15 km and 30 minutes" },
            { type: "p", text: "The spring of the river Bosna at Ilidža: a park of clear streams and a long tree lined avenue. An easy first drive after you pick up the car." },
            { type: "h2", text: "Bjelašnica and Jahorina, about 30 km and 45 minutes" },
            { type: "p", text: "The Olympic mountains. Skiing in winter, cool air and walking trails in summer. In winter the road needs winter equipment." },
            { type: "h2", text: "Konjic, about 60 km and 1 hour" },
            { type: "p", text: "An old stone bridge over the Neretva and the start of the most scenic stretch towards Mostar." },
            { type: "h2", text: "Travnik, about 90 km and 1 hour 30" },
            { type: "p", text: "The fortress, the Coloured Mosque and the Blue Water spring." },
            { type: "h2", text: "Mostar, about 130 km and 2 hours 15" },
            { type: "p", text: "The Old Bridge. The road follows the green Neretva canyon, so leave early and stop in Jablanica and Konjic on the way." },
            { type: "h2", text: "Jajce, about 160 km and 2 hours 30" },
            { type: "p", text: "A waterfall in the middle of town and the Pliva lakes with their wooden watermills." },
            { type: "h2", text: "Which car?" },
            { type: "p", text: "A small car is enough for two. For a family with luggage take a 7 seater, and for a group a 9 seat van. All our cars are automatic with unlimited mileage." },
          ],
        },
        {
          title: "7 or 9 seats? Choosing a family car",
          lead: "How many people, how many bags and how many child seats. A simple way to pick the right car.",
          blocks: [
            { type: "p", text: "The most common mistake is counting seats and forgetting luggage. A car that seats seven rarely carries seven suitcases." },
            { type: "h2", text: "Count bags, not only people" },
            { type: "ul", items: ["Up to 5 people with normal luggage: an SUV or an estate is enough.", "6 or 7 people with light luggage: a 7 seater.", "6 or 7 people with a suitcase each, or 8 and 9 people: a 9 seat van with room for about six large bags."] },
            { type: "h2", text: "A child seat takes a full place" },
            { type: "p", text: "A child seat uses a whole seat and cannot go in the front for children under 12. With two child seats in a 7 seater, plan for five adults at most. Tell us each child's age when booking." },
            { type: "h2", text: "Do you need a special licence?" },
            { type: "p", text: "No. Vehicles with up to nine seats including the driver are driven with a normal category B licence." },
            { type: "h2", text: "Mountain roads" },
            { type: "p", text: "All our family cars are automatic, which makes the climbs to Bjelašnica and the Neretva canyon much easier with a full car." },
          ],
        },
      ];
    case "de":
      return [
        {
          title: "Bußgelder in Bosnien (2026): Tempo, Handy, Gurt",
          lead: "Was Tempo, Handy, Gurt, Alkohol und rote Ampel kosten, in KM und Euro.",
          blocks: [
            { type: "p", text: "Bußgelder in Bosnien und Herzegowina regelt ein gesamtstaatliches Gesetz, die Beträge sind also in Sarajevo, Mostar und Banja Luka gleich. Sie stehen in Konvertibler Mark mit festem Kurs: 1 € = 1,95583 KM. Die Tabelle folgt dem Gesetz mit den Änderungen, die seit dem 27. Mai 2026 gelten." },
            finesTable(l, ["Verstoß", "Bußgeld"]),
            { type: "h2", text: "Was sich im Mai 2026 geändert hat" },
            { type: "ul", items: ["Handy am Steuer und Fahren ohne Gurt kosten jetzt 200 bis 400 KM, vorher 100 bis 300 KM.", "Neu ist das rücksichtslose Fahren: mehr als 40 km/h zu schnell innerorts oder 60 km/h außerorts sowie wiederholtes Überfahren roter Ampeln. Das kostet 2.000 bis 3.000 KM und sechs Monate Fahrverbot."] },
            { type: "h2", text: "Tempolimits" },
            speedTable(l),
            { type: "h2", text: "Wenn Sie im Mietwagen angehalten werden" },
            { type: "ul", items: ["Das Bußgeld geht an den Fahrer, nicht an die Vermietung. Bewahren Sie den Bescheid auf und sagen Sie uns Bescheid, wir helfen beim Verstehen.", "Führen Sie Führerschein, Reisepass und den Mietvertrag mit, den Sie mit dem Auto erhalten.", "Blitzer sind an den Ausfallstraßen von Sarajevo häufig. Der Tempomat ist die günstigste Versicherung."] },
            { type: "note", text: "Eine Zusammenfassung für Besucher, keine Rechtsberatung. Beträge können sich ändern, maßgeblich ist das Gesetz." },
          ],
        },
        {
          title: "Autofahren in Bosnien: Regeln für Besucher",
          lead: "Tempolimits, Licht am Tag, Alkohol, Kindersitze und Winterausrüstung auf einen Blick.",
          blocks: [
            { type: "p", text: "In Bosnien gilt Rechtsverkehr und die Regeln ähneln dem übrigen Europa. Fünf Punkte überraschen Besucher am häufigsten." },
            { type: "h2", text: "1. Tempolimits" },
            speedTable(l),
            { type: "p", text: "Schilder gehen den allgemeinen Limits vor, und Ortschaften beginnen oft direkt hinter einer Kurve. Bremsen Sie am Ortsschild." },
            { type: "h2", text: "2. Licht an, Tag und Nacht" },
            { type: "p", text: "Abblend oder Tagfahrlicht muss immer an sein, sobald das Auto fährt, auch mittags im Juli." },
            { type: "h2", text: "3. Alkohol: 0,3 g/kg" },
            { type: "p", text: "Die allgemeine Grenze liegt bei 0,3 g/kg. Für Fahrer unter 21, Fahrer mit weniger als drei Jahren Fahrpraxis und Berufsfahrer gilt null." },
            { type: "h2", text: "4. Kinder" },
            { type: "ul", items: ["Kinder unter 12 dürfen nicht vorne sitzen.", "Kinder bis 5 fahren im Kindersitz, von 5 bis 12 auf einer Sitzerhöhung. Nennen Sie uns das Alter bei der Buchung, dann ist der passende Sitz im Auto."] },
            { type: "h2", text: "5. Winterausrüstung vom 1. November bis 1. April" },
            { type: "p", text: "In dieser Zeit sind Winterreifen vorgeschrieben, oder Sommerreifen mit Schneeketten im Auto. Unsere Autos sind für die Saison vorbereitet." },
            { type: "h2", text: "Gurt und Handy" },
            { type: "p", text: "Gurtpflicht gilt auf allen Sitzen und telefoniert wird nur mit Freisprechanlage. Beide Bußgelder wurden im Mai 2026 erhöht." },
            { type: "note", text: "Eine Zusammenfassung für Besucher, keine Rechtsberatung. Maßgeblich ist das Gesetz." },
          ],
        },
        {
          title: "Mietwagen am Flughafen Sarajevo: So läuft die Übergabe",
          lead: "Sie landen am Flughafen Sarajevo (SJJ)? So bekommen Sie Ihr Auto ohne Warteschlange, ohne Vorauszahlung und ohne Überraschungen.",
          blocks: [
            { type: "p", text: "Der Flughafen Sarajevo ist klein und etwa 20 Minuten von der Altstadt entfernt. Einen Schalter brauchen Sie nicht, das Auto wartet kostenlos in der Ankunftshalle." },
            { type: "h2", text: "Vor dem Flug" },
            { type: "ul", items: ["Wählen Sie Ihre Daten auf der Website. Sie sehen nur Autos, die in diesem Zeitraum wirklich frei sind.", "Senden Sie die Buchung. Sie zahlen nichts im Voraus und erhalten eine Bestätigung mit Buchungsnummer per E-Mail.", "Geben Sie Ihre Flugnummer an, damit wir Ihre Ankunft verfolgen."] },
            { type: "h2", text: "Nach der Landung" },
            { type: "ul", items: ["Wir warten zur vereinbarten Zeit in der Ankunftshalle. Bei Verspätung wissen wir Bescheid.", "Wir prüfen das Auto gemeinsam, Sie zeigen Führerschein und Reisepass, unterschreiben den Vertrag und hinterlegen die Kaution.", "Sie zahlen die Miete und fahren los."] },
            { type: "h2", text: "Rückgabe" },
            { type: "p", text: "Am Flughafen, in unserem Büro oder an Ihrer Adresse in Sarajevo, wie bei der Buchung gewählt. Die Kaution erhalten Sie bei der Rückgabe zurück." },
            { type: "h2", text: "Sie kommen nicht mit dem Flugzeug?" },
            { type: "p", text: "Wählen Sie Lieferung an Ihre Adresse und geben Sie Hotel oder Apartment an. Die Lieferung kostet so viel wie eine Taxifahrt vom Flughafen." },
          ],
        },
        {
          title: "Sechs Tagesausflüge ab Sarajevo mit dem Auto",
          lead: "Vrelo Bosne, Bjelašnica, Konjic, Travnik, Mostar und Jajce mit ungefähren Entfernungen und Fahrzeiten.",
          blocks: [
            { type: "p", text: "Sarajevo liegt mitten im Land, fast ganz Bosnien ist einen Tagesausflug entfernt. Entfernungen und Zeiten sind Richtwerte und hängen von Verkehr und Jahreszeit ab." },
            { type: "h2", text: "Vrelo Bosne, etwa 15 km und 30 Minuten" },
            { type: "p", text: "Die Quelle der Bosna in Ilidža: ein Park mit klaren Bächen und einer langen Allee. Eine leichte erste Fahrt nach der Übernahme." },
            { type: "h2", text: "Bjelašnica und Jahorina, etwa 30 km und 45 Minuten" },
            { type: "p", text: "Die Olympiaberge. Im Winter Ski, im Sommer frische Luft und Wanderwege. Im Winter ist Winterausrüstung nötig." },
            { type: "h2", text: "Konjic, etwa 60 km und 1 Stunde" },
            { type: "p", text: "Eine alte Steinbrücke über die Neretva und der Beginn der schönsten Strecke nach Mostar." },
            { type: "h2", text: "Travnik, etwa 90 km und 1 Stunde 30" },
            { type: "p", text: "Die Festung, die Bunte Moschee und die Quelle Plava voda." },
            { type: "h2", text: "Mostar, etwa 130 km und 2 Stunden 15" },
            { type: "p", text: "Die Alte Brücke. Die Straße folgt der grünen Neretva Schlucht, also früh losfahren und in Jablanica und Konjic halten." },
            { type: "h2", text: "Jajce, etwa 160 km und 2 Stunden 30" },
            { type: "p", text: "Ein Wasserfall mitten in der Stadt und die Pliva Seen mit ihren Holzmühlen." },
            { type: "h2", text: "Welches Auto?" },
            { type: "p", text: "Für zwei reicht ein kleines Auto. Für die Familie mit Gepäck ein 7 Sitzer, für Gruppen ein Kleinbus mit 9 Sitzen. Alle unsere Autos haben Automatik und unbegrenzte Kilometer." },
          ],
        },
        {
          title: "7 oder 9 Sitze? Das richtige Familienauto",
          lead: "Wie viele Personen, Koffer und Kindersitze. So finden Sie das passende Auto.",
          blocks: [
            { type: "p", text: "Der häufigste Fehler: Sitze zählen und das Gepäck vergessen. Ein Siebensitzer fasst selten sieben Koffer." },
            { type: "h2", text: "Koffer zählen, nicht nur Personen" },
            { type: "ul", items: ["Bis 5 Personen mit normalem Gepäck: SUV oder Kombi genügt.", "6 oder 7 Personen mit leichtem Gepäck: ein Auto mit 7 Sitzen.", "6 oder 7 Personen mit je einem Koffer, oder 8 und 9 Personen: ein Kleinbus mit 9 Sitzen und Platz für etwa sechs große Koffer."] },
            { type: "h2", text: "Ein Kindersitz belegt einen ganzen Platz" },
            { type: "p", text: "Ein Kindersitz braucht einen vollen Sitz und darf für Kinder unter 12 nicht nach vorne. Mit zwei Kindersitzen im 7 Sitzer höchstens fünf Erwachsene einplanen. Nennen Sie uns das Alter jedes Kindes bei der Buchung." },
            { type: "h2", text: "Braucht man einen besonderen Führerschein?" },
            { type: "p", text: "Nein. Fahrzeuge bis neun Sitze einschließlich Fahrer fährt man mit Klasse B." },
            { type: "h2", text: "Bergstraßen" },
            { type: "p", text: "Alle unsere Familienautos haben Automatik, das macht die Anstiege zur Bjelašnica und durch die Neretva Schlucht deutlich entspannter." },
          ],
        },
      ];
    case "ar":
      return [
        {
          title: "المخالفات المرورية في البوسنة 2026: السرعة والجوال والحزام",
          lead: "كم تكلّف مخالفات السرعة والجوال والحزام والكحول والإشارة الحمراء، بالمارك واليورو.",
          blocks: [
            { type: "p", text: "يحدد المخالفات في البوسنة والهرسك قانون واحد على مستوى الدولة، لذلك المبالغ نفسها في سراييفو وموستار وبانيا لوكا. تُكتب بالمارك البوسني المربوط باليورو بسعر ثابت: 1 يورو = 1.95583 KM. يتبع الجدول القانون مع التعديلات السارية منذ 27 مايو 2026." },
            finesTable(l, ["المخالفة", "الغرامة"]),
            { type: "h2", text: "ما الذي تغيّر في مايو 2026" },
            { type: "ul", items: ["استخدام الجوال والقيادة بدون حزام أصبحت غرامتهما من 200 إلى 400 مارك بعد أن كانت من 100 إلى 300.", "مخالفة جديدة باسم القيادة المتهوّرة تشمل تجاوز السرعة بأكثر من 40 كم/س داخل المدن أو 60 كم/س خارجها وتكرار تجاوز الإشارة الحمراء. غرامتها من 2000 إلى 3000 مارك مع سحب الرخصة ستة أشهر."] },
            { type: "h2", text: "حدود السرعة" },
            speedTable(l),
            { type: "h2", text: "إذا أوقفتك الشرطة وأنت بسيارة مستأجرة" },
            { type: "ul", items: ["تُسجَّل المخالفة على السائق وليس على شركة التأجير. احتفظ بالإشعار وأخبرنا، نساعدك على فهمه.", "احمل معك رخصة القيادة وجواز السفر وعقد الإيجار الذي تستلمه مع السيارة.", "الرادارات كثيرة على الطرق الخارجة من سراييفو. مثبّت السرعة أرخص تأمين."] },
            { type: "note", text: "ملخّص للزائر وليس استشارة قانونية. قد تتغير المبالغ، والمرجع هو نص القانون." },
          ],
        },
        {
          title: "القيادة في البوسنة: قواعد يجب أن يعرفها كل زائر",
          lead: "حدود السرعة والأنوار طوال اليوم والكحول وكراسي الأطفال وتجهيزات الشتاء في مكان واحد.",
          blocks: [
            { type: "p", text: "القيادة في البوسنة على يمين الطريق، والقواعد قريبة من بقية أوروبا. خمس نقاط تفاجئ الزائر أكثر من غيرها." },
            { type: "h2", text: "1. حدود السرعة" },
            speedTable(l),
            { type: "p", text: "اللوحات على الطريق مقدَّمة على هذه الحدود العامة، والقرى تبدأ غالباً بعد المنعطف مباشرة. خفّف السرعة عند رؤية لوحة اسم البلدة." },
            { type: "h2", text: "2. الأنوار مضاءة ليلاً ونهاراً" },
            { type: "p", text: "يجب تشغيل الأنوار القصيرة أو أنوار النهار كلما تحركت السيارة، حتى ظهراً في الصيف." },
            { type: "h2", text: "3. الكحول: 0.3 غ/كغ" },
            { type: "p", text: "الحد العام 0.3 غ/كغ. أما للسائق دون 21 سنة ومن خبرته أقل من ثلاث سنوات والسائق المهني فالحد صفر." },
            { type: "h2", text: "4. الأطفال" },
            { type: "ul", items: ["لا يُسمح للطفل دون 12 سنة بالجلوس في المقعد الأمامي.", "الأطفال حتى 5 سنوات في كرسي أطفال، ومن 5 إلى 12 على مقعد رافع. أخبرنا بالعمر عند الحجز وسيكون الكرسي المناسب في السيارة."] },
            { type: "h2", text: "5. تجهيزات الشتاء من 1 نوفمبر إلى 1 أبريل" },
            { type: "p", text: "في هذه الفترة تُشترط إطارات شتوية، أو إطارات صيفية مع سلاسل في السيارة. سياراتنا مجهّزة للموسم." },
            { type: "h2", text: "الحزام والجوال" },
            { type: "p", text: "الحزام إلزامي في كل المقاعد، والجوال يُستخدم فقط عبر السماعة. ارتفعت الغرامتان في مايو 2026." },
            { type: "note", text: "ملخّص للزائر وليس استشارة قانونية. المرجع هو نص القانون." },
          ],
        },
        {
          title: "تأجير سيارة في مطار سراييفو: الاستلام خطوة بخطوة",
          lead: "ستهبط في مطار سراييفو (SJJ)؟ هكذا تستلم سيارتك بلا طابور ولا دفع مقدم ولا مفاجآت.",
          blocks: [
            { type: "p", text: "مطار سراييفو صغير ويبعد نحو 20 دقيقة عن البلدة القديمة. لا تحتاج إلى مكتب تأجير، فالسيارة تنتظرك عند صالة الوصول مجاناً." },
            { type: "h2", text: "قبل السفر" },
            { type: "ul", items: ["اختر تواريخك في الموقع. تظهر لك فقط السيارات المتوفرة فعلاً في تلك الفترة.", "أرسل الحجز. لا تدفع شيئاً مقدماً، ويصلك تأكيد برقم الحجز على بريدك الإلكتروني.", "أضف رقم الرحلة لنتابع وصولك."] },
            { type: "h2", text: "عند الوصول" },
            { type: "ul", items: ["ننتظرك في صالة الوصول في الوقت المتفق عليه. وإذا تأخرت الرحلة فنحن نعلم مسبقاً.", "نفحص السيارة معاً، تُبرز الرخصة وجواز السفر، توقّع العقد وتترك الوديعة.", "تدفع قيمة الإيجار وتنطلق."] },
            { type: "h2", text: "إرجاع السيارة" },
            { type: "p", text: "أعدها إلى المطار أو إلى مكتبنا أو إلى عنوانك في سراييفو حسب ما اخترت عند الحجز. تُعاد الوديعة عند تسليم السيارة." },
            { type: "h2", text: "لن تصل بالطائرة؟" },
            { type: "p", text: "اختر التوصيل إلى العنوان واكتب الفندق أو الشقة. تكلفة التوصيل تعادل مشوار تاكسي واحد من المطار." },
          ],
        },
        {
          title: "ست رحلات بالسيارة من سراييفو في يوم واحد",
          lead: "نبع البوسنة وبيلاشنيتسا وكونيتس وترافنيك وموستار ويايتسه، مع المسافات وأوقات القيادة التقريبية.",
          blocks: [
            { type: "p", text: "سراييفو في وسط البلاد، لذلك معظم البوسنة على بعد رحلة يوم واحد. المسافات والأوقات تقريبية وتختلف حسب الزحام والموسم." },
            { type: "h2", text: "نبع البوسنة، نحو 15 كم و30 دقيقة" },
            { type: "p", text: "منبع نهر البوسنة في إليجا: حديقة من الجداول الصافية وممر طويل تظلّله الأشجار. رحلة أولى سهلة بعد استلام السيارة." },
            { type: "h2", text: "بيلاشنيتسا وياهورينا، نحو 30 كم و45 دقيقة" },
            { type: "p", text: "الجبال الأولمبية. تزلّج في الشتاء، وهواء عليل ومسارات مشي في الصيف. في الشتاء يحتاج الطريق إلى تجهيزات شتوية." },
            { type: "h2", text: "كونيتس، نحو 60 كم وساعة" },
            { type: "p", text: "جسر حجري قديم على نهر نيريتفا وبداية أجمل جزء من الطريق إلى موستار." },
            { type: "h2", text: "ترافنيك، نحو 90 كم وساعة ونصف" },
            { type: "p", text: "القلعة والجامع الملوّن ونبع الماء الأزرق." },
            { type: "h2", text: "موستار، نحو 130 كم وساعتان وربع" },
            { type: "p", text: "الجسر القديم. يسير الطريق بمحاذاة وادي نيريتفا الأخضر، فانطلق مبكراً وتوقّف في يابلانيتسا وكونيتس." },
            { type: "h2", text: "يايتسه، نحو 160 كم وساعتان ونصف" },
            { type: "p", text: "شلال في وسط المدينة وبحيرات بليفا بطواحينها الخشبية." },
            { type: "h2", text: "أي سيارة تختار؟" },
            { type: "p", text: "سيارة صغيرة تكفي لشخصين. للعائلة مع الحقائب اختر سيارة بسبعة مقاعد، وللمجموعة فان بتسعة مقاعد. كل سياراتنا أوتوماتيك وبكيلومترات مفتوحة." },
          ],
        },
        {
          title: "7 أم 9 مقاعد؟ كيف تختار سيارة العائلة",
          lead: "كم شخصاً وكم حقيبة وكم كرسي أطفال. طريقة بسيطة لاختيار السيارة المناسبة.",
          blocks: [
            { type: "p", text: "الخطأ الأكثر شيوعاً هو عدّ المقاعد ونسيان الحقائب. السيارة التي تتسع لسبعة أشخاص قلّما تتسع لسبع حقائب." },
            { type: "h2", text: "احسب الحقائب لا الأشخاص فقط" },
            { type: "ul", items: ["حتى 5 أشخاص بحقائب عادية: تكفي SUV أو ستيشن.", "6 أو 7 أشخاص بحقائب خفيفة: سيارة بسبعة مقاعد.", "6 أو 7 أشخاص بحقيبة لكل شخص، أو 8 و9 أشخاص: فان بتسعة مقاعد يتسع لنحو ست حقائب كبيرة."] },
            { type: "h2", text: "كرسي الطفل يأخذ مقعداً كاملاً" },
            { type: "p", text: "كرسي الأطفال يشغل مقعداً كاملاً ولا يوضع في الأمام للأطفال دون 12 سنة. مع كرسيين في سيارة بسبعة مقاعد احسب خمسة بالغين كحد أقصى. أخبرنا بعمر كل طفل عند الحجز." },
            { type: "h2", text: "هل تحتاج رخصة خاصة؟" },
            { type: "p", text: "لا. المركبات حتى تسعة مقاعد مع السائق تُقاد برخصة عادية من الفئة B." },
            { type: "h2", text: "الطرق الجبلية" },
            { type: "p", text: "كل سياراتنا العائلية أوتوماتيك، وهذا يجعل الصعود إلى بيلاشنيتسا ووادي نيريتفا أسهل بكثير والسيارة ممتلئة." },
          ],
        },
      ];
  }
}

export function getGuides(locale: string): Guide[] {
  const l = (["bs", "en", "de", "ar"].includes(locale) ? locale : "bs") as AppLocale;
  return copy(l).map((c, i) => ({ ...META[i], updated: UPDATED, ...c }));
}

export function getGuide(locale: string, slug: string): Guide | null {
  return getGuides(locale).find((g) => g.slug === slug) ?? null;
}

export const GUIDE_SLUGS = META.map((m) => m.slug);
