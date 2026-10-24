export type Category = 'Ăn uống' | 'Cafe' | 'Check-in' | 'Hotel' | 'Quán cà phê' | 'Check-in/Du lịch' | 'Về đêm';
export type RatingDetail = { food_scenery: number; space: number; service: number; price: number };
export type Place = {
  id: string; name: string; slug: string | null; description: string | null; category: Category;
  city: string; address: string; price_min: number | null; price_max: number | null;
  opening_hours: string | null; phone: string | null; latitude: number | null; longitude: number | null;
  cover_image: string | null; images: string[]; average_rating: number; total_reviews: number; view_count?: number;
  created_at: string; status?: 'pending' | 'published' | 'rejected';
};
export type Review = { id: string; user_id: string; place_id: string; rating: number; rating_detail: RatingDetail; comment: string; images: string[]; created_at: string; profiles?: { display_name: string | null; avatar_url: string | null } | null };
