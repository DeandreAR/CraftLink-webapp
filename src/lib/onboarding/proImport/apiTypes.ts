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
  };
  place_id?: string;
  services?: string[];
};

/** Réponse type RocketAPI — Instagram */
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

/** Réponse type RapidAPI — Facebook Page */
export type FacebookPageApiResponse = {
  page_data: {
    name: string;
    about: string;
    profile_pic: string;
    phone: string | null;
  };
};

export type ProImportApiPayload =
  | { platform: "google"; data: GooglePlaceApiResponse }
  | { platform: "instagram"; data: InstagramProfileApiResponse }
  | { platform: "facebook"; data: FacebookPageApiResponse };
