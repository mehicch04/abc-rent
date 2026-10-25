import type { AppLocale } from "@/i18n/routing";
import type { Company } from "@/lib/company";
import type { TermsContent } from "@/lib/rental-terms";

export const PRIVACY_UPDATED = "2026-10-25";

export function privacyContent(locale: AppLocale, co: Company): TermsContent {
  const phone = co.phones.map((p) => p.value).join(", ");
  const id = co.taxId ? ` ID ${co.taxId}.` : "";
  const addr = co.address ?? "";

  if (locale === "en") {
    return {
      heading: "Privacy policy",
      intro: `How ${co.name} collects, uses and protects your personal data. Last updated on 25 October 2026.`,
      articleLabel: "Section",
      indexLabel: "Contents",
      articles: [
        { n: 1, topic: "Who we are", blocks: [{ type: "p", text: `The controller of your data is ${co.name}, ${addr}.${id} Email: ${co.email}, phone: ${phone}.` }] },
        {
          n: 2,
          topic: "What data we collect",
          blocks: [
            { type: "ul", items: [
              "booking details: first and last name, phone, email, flight number, note, chosen car, dates, locations and extras,",
              "contact form: name, email, phone and your message,",
              "documents you send us yourself on WhatsApp, such as a passport, driving licence or flight ticket,",
              "data in the rental agreement at pick-up, as required by law,",
              "technical data: IP address, device and browser type, kept in server logs for security,",
              "cookies, as described in section 8.",
            ] },
          ],
        },
        {
          n: 3,
          topic: "Why we use it",
          blocks: [
            { type: "ul", items: [
              "to handle your booking and prepare the rental agreement (contract),",
              "to answer your questions and send booking emails (contract and legitimate interest),",
              "to meet legal obligations, such as keeping agreements and accounting records,",
              "to keep the site secure and prevent abuse (legitimate interest),",
              "to measure visits and ads, only with your consent.",
            ] },
            { type: "p", text: "We never sell your data and do not use it for automated decisions." },
          ],
        },
        {
          n: 4,
          topic: "How long we keep it",
          blocks: [
            { type: "p", text: "Booking data in our system is deleted automatically 14 days after the car is returned. Unconfirmed requests whose pick-up date has passed are closed and deleted the same way." },
            { type: "p", text: "Rental agreements and invoices are kept as long as the law requires. Documents sent on WhatsApp are deleted after the rental ends." },
          ],
        },
        {
          n: 5,
          topic: "Who processes it for us",
          blocks: [
            { type: "ul", items: [
              "Vercel (website hosting),",
              "Supabase (database),",
              "Resend (sending booking emails),",
              "Google (Tag Manager, Analytics and Ads, only with consent),",
              "Meta (WhatsApp when you write to us, and ads measurement only with consent).",
            ] },
            { type: "p", text: "These providers may process data outside Bosnia and Herzegovina and the EU, protected by standard contractual clauses or equivalent safeguards." },
          ],
        },
        {
          n: 6,
          topic: "Your rights",
          blocks: [
            { type: "p", text: "You can ask for access, correction, deletion, restriction or transfer of your data, object to processing, and withdraw consent at any time." },
            { type: "p", text: `Write to ${co.email} and we will reply within 30 days. You can also complain to the Personal Data Protection Agency of Bosnia and Herzegovina (azlp.ba) or to the authority in your EU country.` },
          ],
        },
        {
          n: 7,
          topic: "Security",
          blocks: [{ type: "p", text: "The site uses an encrypted connection (HTTPS). Only authorised staff can access the admin area, with a password and secure session." }],
        },
        {
          n: 8,
          topic: "Cookies",
          blocks: [
            { type: "ul", items: [
              "necessary: language, currency and your cookie choice, stored in your browser, always on,",
              "analytics: Google Analytics through Google Tag Manager, only with consent,",
              "marketing: Google Ads and Meta ads measurement, only with consent.",
            ] },
            { type: "p", text: "Until you agree, analytics and marketing tools are not loaded. You can change your choice at any time with Cookie settings at the bottom of every page." },
          ],
        },
        { n: 9, topic: "Changes", blocks: [{ type: "p", text: "If we change this policy, the new version is published on this page with a new date." }] },
      ],
    };
  }

  if (locale === "de") {
    return {
      heading: "Datenschutzerklärung",
      intro: `Wie ${co.name} Ihre personenbezogenen Daten erhebt, nutzt und schützt. Zuletzt aktualisiert am 25. Oktober 2026.`,
      articleLabel: "Abschnitt",
      indexLabel: "Inhalt",
      articles: [
        { n: 1, topic: "Verantwortlicher", blocks: [{ type: "p", text: `Verantwortlich für Ihre Daten ist ${co.name}, ${addr}.${id} E-Mail: ${co.email}, Telefon: ${phone}.` }] },
        {
          n: 2,
          topic: "Welche Daten wir erheben",
          blocks: [
            { type: "ul", items: [
              "Buchungsdaten: Vor und Nachname, Telefon, E-Mail, Flugnummer, Notiz, gewähltes Auto, Daten, Orte und Extras,",
              "Kontaktformular: Name, E-Mail, Telefon und Ihre Nachricht,",
              "Dokumente, die Sie uns selbst per WhatsApp senden, etwa Reisepass, Führerschein oder Flugticket,",
              "Angaben im Mietvertrag bei der Abholung, wie gesetzlich vorgeschrieben,",
              "technische Daten: IP Adresse, Geräte und Browsertyp, zur Sicherheit in Serverprotokollen,",
              "Cookies, wie in Abschnitt 8 beschrieben.",
            ] },
          ],
        },
        {
          n: 3,
          topic: "Wofür wir sie nutzen",
          blocks: [
            { type: "ul", items: [
              "zur Bearbeitung Ihrer Buchung und für den Mietvertrag (Vertrag),",
              "um Ihre Fragen zu beantworten und Buchungs E-Mails zu senden (Vertrag und berechtigtes Interesse),",
              "zur Erfüllung gesetzlicher Pflichten, etwa Aufbewahrung von Verträgen und Buchhaltung,",
              "für die Sicherheit der Seite und gegen Missbrauch (berechtigtes Interesse),",
              "zur Messung von Besuchen und Anzeigen, nur mit Ihrer Einwilligung.",
            ] },
            { type: "p", text: "Wir verkaufen Ihre Daten nie und treffen keine automatisierten Entscheidungen." },
          ],
        },
        {
          n: 4,
          topic: "Speicherdauer",
          blocks: [
            { type: "p", text: "Buchungsdaten in unserem System werden 14 Tage nach der Rückgabe automatisch gelöscht. Unbestätigte Anfragen mit vergangenem Abholdatum werden ebenso geschlossen und gelöscht." },
            { type: "p", text: "Mietverträge und Rechnungen bewahren wir so lange auf, wie das Gesetz es verlangt. Per WhatsApp gesendete Dokumente löschen wir nach Ende der Miete." },
          ],
        },
        {
          n: 5,
          topic: "Auftragsverarbeiter",
          blocks: [
            { type: "ul", items: [
              "Vercel (Hosting der Website),",
              "Supabase (Datenbank),",
              "Resend (Versand von Buchungs E-Mails),",
              "Google (Tag Manager, Analytics und Ads, nur mit Einwilligung),",
              "Meta (WhatsApp, wenn Sie uns schreiben, und Anzeigenmessung nur mit Einwilligung).",
            ] },
            { type: "p", text: "Diese Anbieter können Daten außerhalb von Bosnien und Herzegowina und der EU verarbeiten, geschützt durch Standardvertragsklauseln oder gleichwertige Garantien." },
          ],
        },
        {
          n: 6,
          topic: "Ihre Rechte",
          blocks: [
            { type: "p", text: "Sie können Auskunft, Berichtigung, Löschung, Einschränkung oder Übertragung Ihrer Daten verlangen, der Verarbeitung widersprechen und Ihre Einwilligung jederzeit widerrufen." },
            { type: "p", text: `Schreiben Sie an ${co.email}, wir antworten innerhalb von 30 Tagen. Sie können sich auch bei der Datenschutzagentur von Bosnien und Herzegowina (azlp.ba) oder bei der Aufsichtsbehörde in Ihrem EU Land beschweren.` },
          ],
        },
        { n: 7, topic: "Sicherheit", blocks: [{ type: "p", text: "Die Seite nutzt eine verschlüsselte Verbindung (HTTPS). Nur berechtigte Mitarbeiter haben mit Passwort und sicherer Sitzung Zugang zum Verwaltungsbereich." }] },
        {
          n: 8,
          topic: "Cookies",
          blocks: [
            { type: "ul", items: [
              "notwendig: Sprache, Währung und Ihre Cookie Auswahl, im Browser gespeichert, immer aktiv,",
              "Analyse: Google Analytics über Google Tag Manager, nur mit Einwilligung,",
              "Marketing: Messung von Google Ads und Meta Anzeigen, nur mit Einwilligung.",
            ] },
            { type: "p", text: "Bis zu Ihrer Zustimmung werden keine Analyse und Marketing Werkzeuge geladen. Ihre Auswahl ändern Sie jederzeit über Cookie Einstellungen unten auf jeder Seite." },
          ],
        },
        { n: 9, topic: "Änderungen", blocks: [{ type: "p", text: "Wenn wir diese Erklärung ändern, veröffentlichen wir die neue Fassung hier mit neuem Datum." }] },
      ],
    };
  }

  if (locale === "ar") {
    return {
      heading: "سياسة الخصوصية",
      intro: `كيف تجمع ${co.name} بياناتك الشخصية وتستخدمها وتحميها. آخر تحديث في 25 أكتوبر 2026.`,
      articleLabel: "البند",
      indexLabel: "المحتوى",
      articles: [
        { n: 1, topic: "من نحن", blocks: [{ type: "p", text: `المسؤول عن بياناتك هو ${co.name}، ${addr}.${id} البريد: ${co.email}، الهاتف: ⁦${phone}⁩.` }] },
        {
          n: 2,
          topic: "البيانات التي نجمعها",
          blocks: [
            { type: "ul", items: [
              "بيانات الحجز: الاسم الأول واسم العائلة والهاتف والبريد ورقم الرحلة والملاحظة والسيارة والتواريخ والأماكن والإضافات،",
              "نموذج التواصل: الاسم والبريد والهاتف ورسالتك،",
              "المستندات التي ترسلها لنا بنفسك عبر واتساب، مثل جواز السفر أو رخصة القيادة أو تذكرة الطيران،",
              "بيانات عقد الإيجار عند الاستلام كما يفرض القانون،",
              "بيانات تقنية: عنوان IP ونوع الجهاز والمتصفح، تُحفظ في سجلات الخادم للأمان،",
              "ملفات تعريف الارتباط كما هو موضح في البند 8.",
            ] },
          ],
        },
        {
          n: 3,
          topic: "لماذا نستخدمها",
          blocks: [
            { type: "ul", items: [
              "لمعالجة حجزك وإعداد عقد الإيجار (العقد)،",
              "للرد على أسئلتك وإرسال رسائل الحجز (العقد والمصلحة المشروعة)،",
              "للوفاء بالالتزامات القانونية، مثل حفظ العقود والسجلات المحاسبية،",
              "لحماية الموقع ومنع إساءة الاستخدام (المصلحة المشروعة)،",
              "لقياس الزيارات والإعلانات، فقط بموافقتك.",
            ] },
            { type: "p", text: "لا نبيع بياناتك أبداً ولا نستخدمها لاتخاذ قرارات آلية." },
          ],
        },
        {
          n: 4,
          topic: "مدة الحفظ",
          blocks: [
            { type: "p", text: "تُحذف بيانات الحجز من نظامنا تلقائياً بعد 14 يوماً من إرجاع السيارة. والطلبات غير المؤكدة التي مضى تاريخ استلامها تُغلق وتُحذف بالطريقة نفسها." },
            { type: "p", text: "نحتفظ بعقود الإيجار والفواتير المدة التي يفرضها القانون. والمستندات المرسلة عبر واتساب تُحذف بعد انتهاء الإيجار." },
          ],
        },
        {
          n: 5,
          topic: "من يعالجها لصالحنا",
          blocks: [
            { type: "ul", items: [
              "Vercel (استضافة الموقع)،",
              "Supabase (قاعدة البيانات)،",
              "Resend (إرسال رسائل الحجز)،",
              "Google (Tag Manager وAnalytics وAds، فقط بالموافقة)،",
              "Meta (واتساب عندما تراسلنا، وقياس الإعلانات فقط بالموافقة).",
            ] },
            { type: "p", text: "قد يعالج هؤلاء المزودون البيانات خارج البوسنة والهرسك والاتحاد الأوروبي، مع حماية عبر البنود التعاقدية القياسية أو ضمانات مماثلة." },
          ],
        },
        {
          n: 6,
          topic: "حقوقك",
          blocks: [
            { type: "p", text: "يحق لك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها أو تقييدها أو نقلها، والاعتراض على المعالجة، وسحب موافقتك في أي وقت." },
            { type: "p", text: `راسلنا على ${co.email} ونرد خلال 30 يوماً. ويمكنك أيضاً تقديم شكوى إلى وكالة حماية البيانات الشخصية في البوسنة والهرسك (azlp.ba) أو إلى الجهة المختصة في بلدك.` },
          ],
        },
        { n: 7, topic: "الأمان", blocks: [{ type: "p", text: "يستخدم الموقع اتصالاً مشفراً (HTTPS). ولا يدخل إلى لوحة الإدارة إلا الموظفون المخولون بكلمة مرور وجلسة آمنة." }] },
        {
          n: 8,
          topic: "ملفات تعريف الارتباط",
          blocks: [
            { type: "ul", items: [
              "ضرورية: اللغة والعملة واختيارك لملفات تعريف الارتباط، محفوظة في متصفحك ومفعّلة دائماً،",
              "التحليل: Google Analytics عبر Google Tag Manager، فقط بالموافقة،",
              "التسويق: قياس إعلانات Google وMeta، فقط بالموافقة.",
            ] },
            { type: "p", text: "لا تُحمّل أدوات التحليل والتسويق قبل موافقتك. ويمكنك تغيير اختيارك في أي وقت من إعدادات ملفات تعريف الارتباط أسفل كل صفحة." },
          ],
        },
        { n: 9, topic: "التعديلات", blocks: [{ type: "p", text: "إذا عدّلنا هذه السياسة ننشر النسخة الجديدة في هذه الصفحة بتاريخ جديد." }] },
      ],
    };
  }

  return {
    heading: "Politika privatnosti",
    intro: `Kako ${co.name} prikuplja, koristi i štiti vaše lične podatke. Posljednja izmjena: 25. oktobar 2026.`,
    articleLabel: "Član",
    indexLabel: "Sadržaj",
    articles: [
      { n: 1, topic: "Ko smo mi", blocks: [{ type: "p", text: `Voditelj obrade vaših podataka je ${co.name}, ${addr}.${id} Email: ${co.email}, telefon: ${phone}.` }] },
      {
        n: 2,
        topic: "Koje podatke prikupljamo",
        blocks: [
          { type: "ul", items: [
            "podatke iz rezervacije: ime i prezime, telefon, email, broj leta, napomenu, odabrano vozilo, datume, lokacije i dodatke,",
            "podatke iz kontakt forme: ime, email, telefon i vašu poruku,",
            "dokumente koje nam sami pošaljete na WhatsApp, npr. pasoš, vozačku dozvolu ili avionsku kartu,",
            "podatke u ugovoru o najmu pri preuzimanju vozila, kako to propisuje zakon,",
            "tehničke podatke: IP adresu, vrstu uređaja i preglednika, u logovima servera radi sigurnosti,",
            "kolačiće, kako je opisano u članu 8.",
          ] },
        ],
      },
      {
        n: 3,
        topic: "Zašto ih koristimo",
        blocks: [
          { type: "ul", items: [
            "da obradimo vašu rezervaciju i pripremimo ugovor o najmu (ugovor),",
            "da odgovorimo na vaša pitanja i pošaljemo emailove o rezervaciji (ugovor i legitimni interes),",
            "da ispunimo zakonske obaveze, npr. čuvanje ugovora i računovodstvene dokumentacije,",
            "da zaštitimo sajt i spriječimo zloupotrebu (legitimni interes),",
            "da mjerimo posjete i oglase, samo uz vaš pristanak.",
          ] },
          { type: "p", text: "Vaše podatke nikada ne prodajemo i ne koristimo ih za automatsko donošenje odluka." },
        ],
      },
      {
        n: 4,
        topic: "Koliko dugo ih čuvamo",
        blocks: [
          { type: "p", text: "Podatke o rezervaciji u našem sistemu brišemo automatski 14 dana nakon povrata vozila. Nepotvrđeni upiti kojima je prošao datum preuzimanja zatvaraju se i brišu na isti način." },
          { type: "p", text: "Ugovore o najmu i račune čuvamo onoliko koliko to zakon zahtijeva. Dokumente poslane na WhatsApp brišemo nakon završetka najma." },
        ],
      },
      {
        n: 5,
        topic: "Ko ih obrađuje za nas",
        blocks: [
          { type: "ul", items: [
            "Vercel (hosting sajta),",
            "Supabase (baza podataka),",
            "Resend (slanje emailova o rezervaciji),",
            "Google (Tag Manager, Analytics i Ads, samo uz pristanak),",
            "Meta (WhatsApp kada nam pišete, te mjerenje oglasa samo uz pristanak).",
          ] },
          { type: "p", text: "Ovi pružaoci usluga mogu obrađivati podatke izvan Bosne i Hercegovine i EU, uz zaštitu standardnim ugovornim klauzulama ili jednakovrijednim mjerama." },
        ],
      },
      {
        n: 6,
        topic: "Vaša prava",
        blocks: [
          { type: "p", text: "Možete tražiti pristup, ispravku, brisanje, ograničenje obrade ili prenos svojih podataka, uložiti prigovor na obradu i u svakom trenutku povući pristanak." },
          { type: "p", text: `Pišite na ${co.email} i odgovorićemo u roku od 30 dana. Prigovor možete podnijeti i Agenciji za zaštitu ličnih podataka u Bosni i Hercegovini (azlp.ba) ili nadzornom tijelu u vašoj EU državi.` },
        ],
      },
      { n: 7, topic: "Sigurnost", blocks: [{ type: "p", text: "Sajt koristi šifrovanu vezu (HTTPS). Administraciji pristupaju samo ovlaštene osobe, uz lozinku i sigurnu sesiju." }] },
      {
        n: 8,
        topic: "Kolačići",
        blocks: [
          { type: "ul", items: [
            "nužni: jezik, valuta i vaš izbor kolačića, čuvaju se u vašem pregledniku i uvijek su uključeni,",
            "analitički: Google Analytics preko Google Tag Managera, samo uz pristanak,",
            "marketinški: mjerenje oglasa na Google Ads i Meti, samo uz pristanak.",
          ] },
          { type: "p", text: "Dok ne date pristanak, alati za analitiku i marketing se ne učitavaju. Izbor možete promijeniti u svakom trenutku preko Postavki kolačića na dnu svake stranice." },
        ],
      },
      { n: 9, topic: "Izmjene", blocks: [{ type: "p", text: "Ako izmijenimo ovu politiku, novu verziju objavljujemo na ovoj stranici sa novim datumom." }] },
    ],
  };
}
