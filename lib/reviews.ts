import { SITE } from "@/lib/site-config";

export type Review = { author: string; rating: number; text: string; time?: string; url?: string; lang?: string };
export type ReviewsData = { score: number; count: number; url: string; reviews: Review[] };

export const MANUAL_REVIEWS: Review[] = [
  { author: "Ainhoa Fernández Moreno", rating: 5, lang: "en", text: "They were excellent. I contacted them via WhatsApp, and they quickly offered me the car that best suited my needs. They delivered it to the apartment where I was staying, and later I returned it at the airport." },
  { author: "Edin Sahovic", rating: 5, lang: "bs", text: "Izuzetno profesionalan odnos i odličan vozni park koji omogućava da svako pronađe vozilo koje odgovara njegovim potrebama i mogućnostima. Osoblje izuzetno susretljivo, svaka čast, sve pohvale!!" },
  { author: "A K", rating: 5, lang: "de", text: "Sehr empfehlenswert! Der Buchungsprozess war unkompliziert, das Auto top gepflegt und zuverlässig. Auch die Reisetipps und Unterstützung vor Ort waren klasse, perfekter Service für stressfreies Reisen. Jederzeit wieder!" },
  { author: "SALIM", rating: 5, lang: "ar", text: "تجربة ممتازة. تم استلام السيارة من المطار بكل سهولة، وكذلك تسليمها في المطار كان سريعًا ومنظمًا. السيارة كانت نظيفة وفي حالة ممتازة، والخدمة احترافية. أنصح بالتعامل معهم." },
  { author: "Rania Altikarly", rating: 5, lang: "en", text: "Had a very smooth experience with ABC rent a car. They were waiting for me in the airport, took the car smoothly with small security deposit that was returned when I gave the car back. Very nice people, professional and on time." },
  { author: "Denzele 1998", rating: 5, lang: "bs", text: "Sve pohvale za agenciju.. Vise puta koristio njihovu uslugu. Svaki auto koji sam vozio je uredan, ispravan i spreman za put oko svijeta.. Radujem se ponovnom saradnjom.." },
  { author: "Krt Krt", rating: 5, lang: "de", text: "Autos Top gepflegt, Preise sehr fair und die Kommunikation 10/10. Jedes mal wieder!" },
  { author: "البلكي بهاء", rating: 5, lang: "ar", text: "محل تأجير السيارات في سراييفو يستحق التقدير والاحترام مواعيد رائعة ومصداقية في التعامل والأسعار جيدة وأقل من غيرها اشكر الاخ سمير ووالده" },
  { author: "M. Youssef", rating: 5, lang: "en", text: "I honestly couldn't have asked for a better car rental experience. They made the whole process quick, straightforward, and completely stress-free." },
  { author: "Saima", rating: 5, lang: "bs", text: "Sve preporuke! Auto je bilo u besprekornom stanju i nismo imali nikakvih problema tokom korišćenja. Zaposleni je bio izuzetno ljubazan i profesionalan." },
  { author: "Omar Zubair", rating: 5, lang: "de", text: "Icha habe einen VW polo gemietet und es hat alles super gelaufen. Sehr freundliche Personal und sogar die Kaution für auto nicht so tuer nur 200€ . Vielen Dank" },
  { author: "Futun’s", rating: 5, lang: "ar", text: "كانت تجربتي مع الشركة ممتازة، وبكل أمانة باتعامل معهم مرة ثانية إذا زرت سراييفو باذن الله." },
];

/** Reviews in the visitor's language come first; the rest keep their original order. */
function byLocale(list: Review[], locale: string): Review[] {
  const rank = (r: Review) => (r.lang === locale ? 0 : r.lang === "en" ? 1 : 2);
  return list.map((r, i) => ({ r, i })).sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i).map((x) => x.r);
}

type PlaceReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; uri?: string };
};

type PlaceResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlaceReview[];
};

export async function getReviews(locale: string): Promise<ReviewsData> {
  const base: ReviewsData = {
    score: SITE.rating.score,
    count: SITE.rating.count,
    url: SITE.map.link,
    reviews: byLocale(MANUAL_REVIEWS, locale),
  };
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const id = process.env.GOOGLE_PLACE_ID;
  if (!key || !id) return base;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${id}?languageCode=${locale}`,
      {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri" },
        next: { revalidate: 43200 },
      },
    );
    if (!res.ok) return base;
    const data = (await res.json()) as PlaceResponse;
    const fetched = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "",
        rating: r.rating ?? 5,
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        time: r.relativePublishTimeDescription,
        url: r.authorAttribution?.uri,
      }))
      .filter((r) => r.author && r.text);
    return {
      score: data.rating ?? base.score,
      count: data.userRatingCount ?? base.count,
      url: data.googleMapsUri ?? base.url,
      reviews: fetched.length ? fetched : byLocale(MANUAL_REVIEWS, locale),
    };
  } catch {
    return base;
  }
}
