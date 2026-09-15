import type { OfferDescription } from '../types/offer-description';

export const offerDescription: OfferDescription = {
  id: '57e155c8-7e39-4469-8645-3c0d3348d8a2',
  title: 'Loft Studio in the Central Area',
  description: 'A new spacious villa, one floor. All commodities, jacuzzi and beautiful scenery. Ideal for families or friends.',
  type: 'hotel',
  price: 499,
  images: [
    'https://15.design.htmlacademy.pro/static/hotel/11.jpg',
    'https://15.design.htmlacademy.pro/static/hotel/20.jpg',
    'https://15.design.htmlacademy.pro/static/hotel/16.jpg',
    'https://15.design.htmlacademy.pro/static/hotel/1.jpg',
    'https://15.design.htmlacademy.pro/static/hotel/6.jpg',
    'https://15.design.htmlacademy.pro/static/hotel/2.jpg'
  ],
  city: {
    name: 'Amsterdam',
    location: {
      latitude: 52.37454,
      longitude: 4.897976,
      zoom: 13
    }
  },
  location: {
    latitude: 52.36354,
    longitude: 4.911976,
    zoom: 16
  },
  goods: [
    'Cable TV',
    'Laptop friendly workspace',
    'Coffee machine',
    'Washer',
    'Wi-Fi',
    'Fridge',
    'Air conditioning',
    'Heating',
    'Towels',
    'Kitchen',
    'Baby seat',
    'Breakfast'
  ],
  host: {
    isPro: true,
    name: 'Angelina',
    avatarUrl: 'https://15.design.htmlacademy.pro/static/host/avatar-angelina.jpg'
  },
  isPremium: true,
  isFavorite: false,
  rating: 4,
  bedrooms: 4,
  maxAdults: 6
};

