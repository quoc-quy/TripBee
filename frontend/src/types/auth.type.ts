import type { User } from "./user.type";

type Role = "CUSTOMER" | "ADMIN";
export type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  userId: User;
  username: string;
  role: Role;
};
