export type User = {
  login: string;
  password: string;
  name: string;
  role: "admin" | "user";
};

export type CreatedUser = Omit<User, "password"> & {
  id: number;
};

export type AuthResponse = {
  data: {
    user: CreatedUser;
  };
  error: null;
};
