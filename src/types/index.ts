export type User = {
  login: string;
  password: string;
  name: string;
  role: "admin" | "user";
};
