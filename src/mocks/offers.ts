import { Offer } from '../types/offer';

export const offers : Offer[] = [
  {
    id: 'b74ff2c3-7d70-4887-b347-3d8024a64a04',
    title: 'Loft Studio in the Central Area',
    type: 'house',
    price: 914,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/19.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.868610000000004,
      longitude: 2.342499,
      zoom: 16
    },
    isFavorite: true,
    isPremium: false,
    rating: 2.4
  },
  {
    id: '62421a39-034a-49e2-ab0c-50aea4fd1606',
    title: 'The Pondhouse - A Magical Place',
    type: 'room',
    price: 179,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/14.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.858610000000006,
      longitude: 2.330499,
      zoom: 16
    },
    isFavorite: false,
    isPremium: false,
    rating: 4.6
  },
  {
    id: 'a8b1fefb-f651-47bf-a4a8-86cb9b638a6f',
    title: 'The Joshua Tree House',
    type: 'room',
    price: 101,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/1.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.834610000000005,
      longitude: 2.335499,
      zoom: 16
    },
    isFavorite: true,
    isPremium: false,
    rating: 1.1
  },
  {
    id: '1ba330e8-a7db-4c5e-a6fb-3ae326deaa34',
    title: 'The house among olive ',
    type: 'room',
    price: 201,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/18.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.85761,
      longitude: 2.358499,
      zoom: 16
    },
    isFavorite: true,
    isPremium: true,
    rating: 2.4
  },
  {
    id: '0e62d507-aa4a-459c-8b22-606fa8533806',
    title: 'Wood and stone place',
    type: 'apartment',
    price: 475,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/4.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.87561,
      longitude: 2.375499,
      zoom: 16
    },
    isFavorite: false,
    isPremium: true,
    rating: 1.8
  },
];
