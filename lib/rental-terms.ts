import { SITE } from "@/lib/site-config";
import type { AppLocale } from "@/i18n/routing";

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
const PHONES = SITE.phones.map((p) => p.value).join(", ");

export const RENTAL_TERMS: Record<AppLocale, TermsContent> = {
  bs: {
    heading: "Uslovi najma",
    intro: `Opći uslovi najma vozila agencije ${SITE.name}, napisani jednostavno. Ako nešto nije jasno, pišite nam prije rezervacije.`,
    articleLabel: "Član",
    indexLabel: "Sadržaj",
    articles: [
      {
        n: 1,
        topic: "Rezervacija",
        blocks: [
          { type: "p", text: "Rezervaciju šaljete preko web stranice, WhatsAppa ili telefonom. Nakon rezervacije na stranici odmah dobijate email sa brojem rezervacije, a mi je potvrđujemo emailom, porukom ili pozivom." },
          { type: "p", text: "Ništa ne plaćate unaprijed. Rezervaciju možete besplatno izmijeniti ili otkazati najkasnije 24 sata prije preuzimanja vozila." },
        ],
      },
      {
        n: 2,
        topic: "Vozač i dokumenti",
        blocks: [
          { type: "p", text: "Pri preuzimanju vozila potrebno je pokazati:" },
          { type: "ul", items: ["važeću vozačku dozvolu,", "ličnu kartu ili pasoš."] },
          { type: "p", text: "Dokumente ne šaljete unaprijed, pregledamo ih zajedno pri preuzimanju. Vozilom smiju upravljati samo vozači upisani u ugovor o najmu." },
        ],
      },
      {
        n: 3,
        topic: "Cijena i šta je uključeno",
        blocks: [
          { type: "p", text: "U cijenu najma uključeno je:" },
          { type: "ul", items: ["neograničena kilometraža,", "osnovno osiguranje vozila,", "besplatno preuzimanje i vraćanje na Aerodromu Sarajevo (SJJ) i u poslovnici,", "pomoć na cesti 0 do 24."] },
          { type: "p", text: "Puno osiguranje bez depozita možete dodati za 10 € dnevno. Svi dodaci koje odaberete vide se u obračunu prije slanja rezervacije." },
          { type: "p", text: "Ništa ne plaćate unaprijed. Najam i odabrane dodatke plaćate pri preuzimanju vozila." },
        ],
      },
      {
        n: 4,
        topic: "Depozit",
        blocks: [
          { type: "p", text: `Depozit iznosi ${STD} € za većinu vozila, a ${PREM} € za Audi Q7 i Mercedes E klasu. Tačan iznos piše uz svako vozilo.` },
          { type: "p", text: "Depozit ostavljate u gotovini pri preuzimanju i dobijate ga nazad u cijelosti kada vratite vozilo u urednom stanju." },
          { type: "p", text: "Ako ne želite ostaviti depozit, odaberite puno osiguranje bez depozita za 10 € dnevno." },
        ],
      },
      {
        n: 5,
        topic: "Preuzimanje i povrat",
        blocks: [
          { type: "p", text: "Vozilo preuzimate i vraćate na Aerodromu Sarajevo ili u našoj poslovnici bez doplate. Možemo ga dovesti i na vašu adresu u Sarajevu, uz cijenu jedne vožnje taksijem od aerodroma, a iznos javljamo uz potvrdu rezervacije." },
          { type: "p", text: "Pri preuzimanju zajedno pregledamo vozilo i u ugovor upisujemo kilometražu, gorivo i postojeća oštećenja. Vozilo vraćate sa istom količinom goriva." },
        ],
      },
      {
        n: 6,
        topic: "Dodaci i usluge",
        blocks: [
          { type: "ul", items: ["dječija sjedalica (1 do 5 godina): 5 € dnevno,", "booster sjedište (5 do 10 godina): 10 € dnevno,", "prelazak granice: 15 € jednokratno,", "dodatni vozač: 5 € dnevno,", "čišćenje vozila: 15 € jednokratno,", "privatni vozač: 50 € dnevno, gorivo nije uključeno,", "auto i vozač, sve uključeno: 150 € dnevno (vozilo, vozač, gorivo i parking)."] },
        ],
      },
      {
        n: 7,
        topic: "Korištenje vozila",
        blocks: [
          { type: "p", text: "Korisnik se obavezuje:" },
          { type: "ul", items: ["da će vozilo koristiti pažljivo i poštovati saobraćajne propise,", "da u vozilu neće pušiti,", "da vozilo neće davati osobama koje nisu upisane u ugovor,", "da vozilo neće voziti izvan Bosne i Hercegovine bez prethodnog dogovora."] },
          { type: "p", text: "Kazne za saobraćajne prekršaje nastale tokom najma plaća vozač." },
        ],
      },
      {
        n: 8,
        topic: "Saobraćajna nezgoda ili kvar",
        blocks: [
          { type: "p", text: "Kod nezgode odmah pozovite policiju, a zatim nas. Ne pomjerajte vozilo dok policija ne napravi zapisnik, jer bez njega osiguranje može odbiti štetu." },
          { type: "p", text: "Kod kvara nazovite nas ili pišite na WhatsApp. Dostupni smo 0 do 24." },
        ],
      },
      {
        n: 9,
        topic: "Kontakt",
        blocks: [{ type: "p", text: `${SITE.name}, ${SITE.address}. Telefon: ${PHONES}. Email: ${SITE.email}.` }],
      },
    ],
  },

  en: {
    heading: "Rental terms",
    intro: `General rental terms of ${SITE.name}, in plain words. If anything is unclear, message us before you book.`,
    articleLabel: "Article",
    indexLabel: "Contents",
    articles: [
      {
        n: 1,
        topic: "Booking",
        blocks: [
          { type: "p", text: "You book through the website, WhatsApp or by phone. A booking made on the website sends you an email with your booking number right away, and we confirm it by email, message or call." },
          { type: "p", text: "You pay nothing in advance. You can change or cancel free of charge up to 24 hours before pick-up." },
        ],
      },
      {
        n: 2,
        topic: "Driver and documents",
        blocks: [
          { type: "p", text: "At pick-up please show:" },
          { type: "ul", items: ["a valid driving licence,", "an ID card or passport."] },
          { type: "p", text: "You don't send documents in advance, we check them together at pick-up. Only drivers named in the rental agreement may drive the car." },
        ],
      },
      {
        n: 3,
        topic: "Price and what is included",
        blocks: [
          { type: "p", text: "The rental price includes:" },
          { type: "ul", items: ["unlimited mileage,", "basic insurance,", "free pick-up and return at Sarajevo Airport (SJJ) and at our office,", "24/7 roadside assistance."] },
          { type: "p", text: "Full insurance with no deposit can be added for 10 € per day. Every extra you choose is shown in the price breakdown before you send the booking." },
          { type: "p", text: "You pay nothing in advance. The rental and any extras are paid at pick-up." },
        ],
      },
      {
        n: 4,
        topic: "Deposit",
        blocks: [
          { type: "p", text: `The deposit is ${STD} € for most cars and ${PREM} € for the Audi Q7 and Mercedes E-Class. The exact amount is shown on every car.` },
          { type: "p", text: "You leave it in cash at pick-up and get it back in full when the car is returned in good order." },
          { type: "p", text: "If you prefer not to leave a deposit, choose full insurance with no deposit for 10 € per day." },
        ],
      },
      {
        n: 5,
        topic: "Pick-up and return",
        blocks: [
          { type: "p", text: "Pick-up and return at Sarajevo Airport or our office are free. We can also bring the car to your address in Sarajevo for the price of one taxi ride from the airport, and we tell you the amount when we confirm your booking." },
          { type: "p", text: "At pick-up we inspect the car together and note mileage, fuel and any existing damage in the agreement. The car goes back with the same amount of fuel." },
        ],
      },
      {
        n: 6,
        topic: "Extras and services",
        blocks: [
          { type: "ul", items: ["child seat (age 1 to 5): 5 € per day,", "booster seat (age 5 to 10): 10 € per day,", "cross border: 15 € once,", "additional driver: 5 € per day,", "cleaning: 15 € once,", "private driver: 50 € per day, fuel not included,", "car and driver, all inclusive: 150 € per day (car, driver, fuel and parking)."] },
        ],
      },
      {
        n: 7,
        topic: "Use of the car",
        blocks: [
          { type: "p", text: "The renter agrees:" },
          { type: "ul", items: ["to drive carefully and follow traffic rules,", "not to smoke in the car,", "not to let anyone drive who is not named in the agreement,", "not to leave Bosnia and Herzegovina without arranging it with us first."] },
          { type: "p", text: "Traffic fines during the rental are paid by the driver." },
        ],
      },
      {
        n: 8,
        topic: "Accident or breakdown",
        blocks: [
          { type: "p", text: "After an accident call the police first, then us. Don't move the car until the police have made a report, because without it the insurance may refuse the claim." },
          { type: "p", text: "For a breakdown call us or send a WhatsApp message. We are available 24/7." },
        ],
      },
      {
        n: 9,
        topic: "Contact",
        blocks: [{ type: "p", text: `${SITE.name}, ${SITE.address}. Phone: ${PHONES}. Email: ${SITE.email}.` }],
      },
    ],
  },

  de: {
    heading: "Mietbedingungen",
    intro: `Allgemeine Mietbedingungen von ${SITE.name}, einfach erklärt. Wenn etwas unklar ist, schreiben Sie uns vor der Buchung.`,
    articleLabel: "Artikel",
    indexLabel: "Inhalt",
    articles: [
      {
        n: 1,
        topic: "Buchung",
        blocks: [
          { type: "p", text: "Sie buchen über die Website, WhatsApp oder telefonisch. Nach einer Buchung auf der Website erhalten Sie sofort eine E-Mail mit Ihrer Buchungsnummer, und wir bestätigen per E-Mail, Nachricht oder Anruf." },
          { type: "p", text: "Sie zahlen nichts im Voraus. Änderung oder Stornierung ist bis 24 Stunden vor der Abholung kostenlos." },
        ],
      },
      {
        n: 2,
        topic: "Fahrer und Dokumente",
        blocks: [
          { type: "p", text: "Bei der Abholung zeigen Sie bitte:" },
          { type: "ul", items: ["einen gültigen Führerschein,", "Personalausweis oder Reisepass."] },
          { type: "p", text: "Dokumente schicken Sie nicht vorab, wir prüfen sie gemeinsam bei der Abholung. Fahren dürfen nur die im Mietvertrag eingetragenen Fahrer." },
        ],
      },
      {
        n: 3,
        topic: "Preis und Leistungen",
        blocks: [
          { type: "p", text: "Im Mietpreis enthalten:" },
          { type: "ul", items: ["unbegrenzte Kilometer,", "Basisversicherung,", "kostenlose Übergabe und Rückgabe am Flughafen Sarajevo (SJJ) und in unserem Büro,", "Pannenhilfe rund um die Uhr."] },
          { type: "p", text: "Jedes gewählte Extra sehen Sie in der Preisübersicht, bevor Sie die Buchung senden." },
        ],
      },
      {
        n: 4,
        topic: "Kaution",
        blocks: [
          { type: "p", text: `Die Kaution beträgt ${STD} € für die meisten Autos und ${PREM} € für Audi Q7 und Mercedes E-Klasse. Der genaue Betrag steht bei jedem Auto.` },
          { type: "p", text: "Sie hinterlegen sie bar bei der Abholung und erhalten sie vollständig zurück, wenn das Auto in ordentlichem Zustand zurückkommt." },
          { type: "p", text: "Ohne Kaution mieten Sie mit der Vollkasko ohne Kaution für 10 € pro Tag." },
        ],
      },
      {
        n: 5,
        topic: "Abholung und Rückgabe",
        blocks: [
          { type: "p", text: "Abholung und Rückgabe am Flughafen Sarajevo oder in unserem Büro sind kostenlos. Wir bringen das Auto auch zu Ihrer Adresse in Sarajevo, zum Preis einer Taxifahrt vom Flughafen. Den Betrag nennen wir mit der Bestätigung." },
          { type: "p", text: "Bei der Übergabe prüfen wir das Auto gemeinsam und tragen Kilometerstand, Tankfüllung und vorhandene Schäden in den Vertrag ein. Das Auto wird mit gleicher Tankfüllung zurückgegeben." },
        ],
      },
      {
        n: 6,
        topic: "Extras und Services",
        blocks: [
          { type: "ul", items: ["Kindersitz (1 bis 5 Jahre): 5 € pro Tag,", "Sitzerhöhung (5 bis 10 Jahre): 10 € pro Tag,", "Grenzübertritt: 15 € einmalig,", "Zusatzfahrer: 5 € pro Tag,", "Reinigung: 15 € einmalig,", "Privatfahrer: 50 € pro Tag, ohne Kraftstoff,", "Auto mit Fahrer, alles inklusive: 150 € pro Tag (Auto, Fahrer, Kraftstoff und Parken)."] },
        ],
      },
      {
        n: 7,
        topic: "Nutzung des Fahrzeugs",
        blocks: [
          { type: "p", text: "Der Mieter verpflichtet sich:" },
          { type: "ul", items: ["vorsichtig zu fahren und die Verkehrsregeln zu beachten,", "im Auto nicht zu rauchen,", "niemanden fahren zu lassen, der nicht im Vertrag steht,", "Bosnien und Herzegowina nur nach vorheriger Absprache zu verlassen."] },
          { type: "p", text: "Bußgelder während der Miete zahlt der Fahrer." },
        ],
      },
      {
        n: 8,
        topic: "Unfall oder Panne",
        blocks: [
          { type: "p", text: "Nach einem Unfall rufen Sie zuerst die Polizei und dann uns. Bewegen Sie das Auto nicht, bis die Polizei ein Protokoll erstellt hat, denn ohne Protokoll kann die Versicherung den Schaden ablehnen." },
          { type: "p", text: "Bei einer Panne rufen Sie uns an oder schreiben per WhatsApp. Wir sind rund um die Uhr erreichbar." },
        ],
      },
      {
        n: 9,
        topic: "Kontakt",
        blocks: [{ type: "p", text: `${SITE.name}, ${SITE.address}. Telefon: ${PHONES}. E-Mail: ${SITE.email}.` }],
      },
    ],
  },

  ar: {
    heading: "شروط الإيجار",
    intro: `الشروط العامة لتأجير السيارات لدى ${SITE.name}، بكلمات بسيطة. إذا لم يكن أي شيء واضحاً فراسلنا قبل الحجز.`,
    articleLabel: "البند",
    indexLabel: "المحتويات",
    articles: [
      {
        n: 1,
        topic: "الحجز",
        blocks: [
          { type: "p", text: "تحجز عبر الموقع أو واتساب أو بالهاتف. عند الحجز عبر الموقع يصلك فوراً بريد إلكتروني برقم الحجز، ونؤكده لك بالبريد أو برسالة أو باتصال." },
          { type: "p", text: "لا تدفع شيئاً مقدماً. يمكنك تعديل الحجز أو إلغاؤه مجاناً حتى 24 ساعة قبل الاستلام." },
        ],
      },
      {
        n: 2,
        topic: "السائق والوثائق",
        blocks: [
          { type: "p", text: "عند الاستلام يُرجى إبراز:" },
          { type: "ul", items: ["رخصة قيادة سارية،", "بطاقة هوية أو جواز سفر."] },
          { type: "p", text: "لا ترسل الوثائق مسبقاً، بل نراجعها معاً عند الاستلام. يحق القيادة فقط للسائقين المذكورين في عقد الإيجار." },
        ],
      },
      {
        n: 3,
        topic: "السعر وما يشمله",
        blocks: [
          { type: "p", text: "يشمل سعر الإيجار:" },
          { type: "ul", items: ["كيلومترات مفتوحة،", "تأمين أساسي،", "استلام وتسليم مجاني في مطار سراييفو (SJJ) وفي مكتبنا،", "مساعدة على الطريق على مدار الساعة."] },
          { type: "p", text: "يمكنك إضافة التأمين الشامل بدون وديعة مقابل 10 يورو يومياً. كل إضافة تختارها تظهر في تفاصيل السعر قبل إرسال الحجز." },
          { type: "p", text: "لا تدفع شيئاً مقدماً. تدفع الإيجار والإضافات عند استلام السيارة." },
        ],
      },
      {
        n: 4,
        topic: "الوديعة",
        blocks: [
          { type: "p", text: `الوديعة ${STD} يورو لمعظم السيارات و${PREM} يورو لأودي Q7 ومرسيدس الفئة E. المبلغ الدقيق مكتوب عند كل سيارة.` },
          { type: "p", text: "تتركها نقداً عند الاستلام وتستعيدها كاملة عند إرجاع السيارة بحالة جيدة." },
          { type: "p", text: "إذا كنت لا تريد ترك وديعة فاختر التأمين الشامل بدون وديعة مقابل 10 يورو يومياً." },
        ],
      },
      {
        n: 5,
        topic: "الاستلام والإرجاع",
        blocks: [
          { type: "p", text: "الاستلام والإرجاع في مطار سراييفو أو في مكتبنا مجاناً. ويمكننا إيصال السيارة إلى عنوانك في سراييفو مقابل أجرة مشوار تاكسي واحد من المطار، ونخبرك بالمبلغ عند تأكيد الحجز." },
          { type: "p", text: "عند الاستلام نفحص السيارة معاً ونسجّل في العقد عدد الكيلومترات ومستوى الوقود وأي أضرار موجودة. تُعاد السيارة بنفس كمية الوقود." },
        ],
      },
      {
        n: 6,
        topic: "الإضافات والخدمات",
        blocks: [
          { type: "ul", items: ["كرسي أطفال (من 1 إلى 5 سنوات): 5 يورو يومياً،", "مقعد رافع (من 5 إلى 10 سنوات): 10 يورو يومياً،", "عبور الحدود: 15 يورو مرة واحدة،", "سائق إضافي: 5 يورو يومياً،", "تنظيف السيارة: 15 يورو مرة واحدة،", "سائق خاص: 50 يورو يومياً، الوقود غير مشمول،", "سيارة مع سائق شامل كل شيء: 150 يورو يومياً (السيارة والسائق والوقود والمواقف)."] },
        ],
      },
      {
        n: 7,
        topic: "استخدام السيارة",
        blocks: [
          { type: "p", text: "يلتزم المستأجر بما يلي:" },
          { type: "ul", items: ["القيادة بحذر واحترام قوانين المرور،", "عدم التدخين داخل السيارة،", "عدم السماح لأي شخص غير مذكور في العقد بالقيادة،", "عدم مغادرة البوسنة والهرسك دون اتفاق مسبق معنا."] },
          { type: "p", text: "المخالفات المرورية خلال فترة الإيجار يدفعها السائق." },
        ],
      },
      {
        n: 8,
        topic: "الحادث أو العطل",
        blocks: [
          { type: "p", text: "بعد أي حادث اتصل بالشرطة أولاً ثم بنا. لا تحرّك السيارة قبل أن تُعدّ الشرطة محضراً، لأن التأمين قد يرفض التعويض بدونه." },
          { type: "p", text: "عند حدوث عطل اتصل بنا أو راسلنا على واتساب. نحن متاحون على مدار الساعة." },
        ],
      },
      {
        n: 9,
        topic: "التواصل",
        blocks: [{ type: "p", text: `${SITE.name}، ${SITE.address}. الهاتف: ${PHONES}. البريد الإلكتروني: ${SITE.email}.` }],
      },
    ],
  },
};
