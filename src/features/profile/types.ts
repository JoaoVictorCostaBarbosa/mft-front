export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  url_img?: string | null;
};
