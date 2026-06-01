export type AuthSession = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type SignInCredentials = {
  email: string;
  password: string;
};
