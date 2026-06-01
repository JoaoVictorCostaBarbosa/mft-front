export type AuthSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "User";
    url_img?: string | null;
  };
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  name: string;
  email: string;
  password: string;
};

export type VerifyAccountRequest = {
  email: string;
  code: number;
};
