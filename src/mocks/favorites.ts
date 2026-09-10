import type { Offer } from '../types/offer';

export const favorites : Offer[] = [
  {
    id: '57e155c8-7e39-4469-8645-3c0d3348d8a2',
    title: 'The Pondhouse - A Magical Place',
    type: 'hotel',
    price: 201,
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
      latitude: 48.843610000000005,
      longitude: 2.338499,
      zoom: 16
    },
    isFavorite: true,
    isPremium: true,
    rating: 1.2
  },
  {
    id: '8ede32ca-f914-4965-9154-ab2d3aebfb15',
    title: 'Canal View Prinsengracht',
    type: 'apartment',
    price: 313,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/9.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.84461,
      longitude: 2.374499,
      zoom: 16
    },
    isFavorite: true,
    isPremium: false,
    rating: 2.1
  },
  {
    id: '35568cbb-56be-4966-b87e-fc53e379f579',
    title: 'Wood and stone place',
    type: 'room',
    price: 234,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/19.jpg',
    city: {
      name: 'Hamburg',
      location: {
        latitude: 53.550341,
        longitude: 10.000654,
        zoom: 13
      }
    },
    location: {
      latitude: 53.550341,
      longitude: 9.980654000000001,
      zoom: 16
    },
    isFavorite: true,
    isPremium: false,
    rating: 2.5
  },
  {
    id: '2829d17c-d7de-4bf2-b39e-84887b175d20',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'apartment',
    price: 282,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/8.jpg',
    city: {
      name: 'Dusseldorf',
      location: {
        latitude: 51.225402,
        longitude: 6.776314,
        zoom: 13
      }
    },
    location: {
      latitude: 51.250402,
      longitude: 6.7853140000000005,
      zoom: 16
    },
    isFavorite: true,
    isPremium: false,
    rating: 4
  },
  {
    id: '8cb9e2e3-4086-4f0b-8b2a-5e0083655d65',
    title: 'Loft Studio in the Central Area',
    type: 'house',
    price: 406,
    previewImage: 'https://15.design.htmlacademy.pro/static/hotel/8.jpg',
    city: {
      name: 'Dusseldorf',
      location: {
        latitude: 51.225402,
        longitude: 6.776314,
        zoom: 13
      }
    },
    location: {
      latitude: 51.239402000000005,
      longitude: 6.756314000000001,
      zoom: 16
    },
    isFavorite: true,
    isPremium: true,
    rating: 2.1
  },
];
