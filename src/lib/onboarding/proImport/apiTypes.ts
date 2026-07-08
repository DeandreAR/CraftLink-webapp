/** Réponse type SerpApi / Outscraper — Google My Business */
export type GooglePlaceApiResponse = {
  place_results: {
    title: string;
    rating: number;
    reviews: number;
    thumbnail: string;
    address: string;
    phone_number: string | null;
    description?: string;
    /** Catégories GMB (ex. "Electrician", "Électricien") */
    category?: string;
  };
  place_id?: string;
  services?: string[];
  /** URLs brutes des photos GMB (hors Street View). */
  googlePhotos?: string[];
};

/** Profil Instagram normalisé (Apify posts scraper → bundle). */
export type InstagramProfileApiResponse = {
  response: {
    body: {
      full_name: string;
      biography: string;
      profile_pic_url: string;
      hd_profile_pic_url_info: { url: string };
    };
  };
};

/** Page Facebook normalisée (Apify posts scraper). */
export type FacebookPageApiResponse = {
  page_data: {
    name: string;
    about: string;
    profile_pic: string;
    phone: string | null;
    followers_count?: number | null;
  };
};

export type ProImportApiPayload =
  | { platform: "google"; data: GooglePlaceApiResponse }
  | { platform: "instagram"; data: InstagramProfileApiResponse }
  | { platform: "facebook"; data: FacebookPageApiResponse };
