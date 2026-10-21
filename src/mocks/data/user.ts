import type { StoredUserData, UserData } from '../../types';

export const makeFakeStoredUserData = (
  overrides: Partial<StoredUserData> = {}
): StoredUserData => ({
  email: 'user@test.com',
  avatarUrl: 'avatar.jpg',
  isPro: true,
  name: 'Test User',
  ...overrides,
});

export const makeFakeUserData = (overrides: Partial<UserData> = {}): UserData => ({
  ...makeFakeStoredUserData(overrides),
  token: 'user-token',
  ...overrides,
});
