export type OfferLocation = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type City = {
  name: string;
  location: OfferLocation;
};

export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  previewImage: string;
  city: City;
  location: OfferLocation;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
}
