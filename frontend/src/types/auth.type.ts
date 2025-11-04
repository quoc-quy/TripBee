type Role = "CUSTOMER" | "ADMIN";
export type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  userId: string;
  username: string;
  role: Role;
};
export type LoginSuccessResponse = {
  data: AuthResponse;
};
