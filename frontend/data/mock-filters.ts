
export interface Filters {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  cashbackRange: [number, number];
  rating: number[];
  couponOnly: boolean;
}

export const mockFilters: Filters = {
  categories: ["Electronics", "Fashion", "Smart Home"],
  brands: ["SoundWave", "GameOn", "Connectify", "Timeless", "EcoWear"],
  priceRange: [0, 1500],
  cashbackRange: [0, 20],
  rating: [1, 2, 3, 4, 5],
  couponOnly: false,
};
