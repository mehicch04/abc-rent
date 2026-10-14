import { SITE } from "@/lib/site-config";

export type Review = { author: string; rating: number; text: string; time?: string; url?: string };
export type ReviewsData = { score: number; count: number; url: string; reviews: Review[] };

export const MANUAL_REVIEWS: Review[] = [];

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
    reviews: MANUAL_REVIEWS,
  };
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const id = process.env.GOOGLE_PLACE_ID;
  if (!key || !id) return base;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${id}?languageCode=${locale === "en" ? "en" : "bs"}`,
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
      reviews: [...fetched, ...MANUAL_REVIEWS],
    };
  } catch {
    return base;
  }
}
