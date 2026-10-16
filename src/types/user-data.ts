

export type StoredUserData = {
  email: string;
  avatarUrl: string;
  isPro: boolean;
  name: string;
};

export type UserData = StoredUserData & {
  token: string;
};
