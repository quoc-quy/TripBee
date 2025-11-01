import type { AuthResponse } from "../types/auth.type";
import http from "../utils/http";

export const registerAccount = (body: {
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
}) => http.post<AuthResponse>("auth/register", body);

export const loginAccount = (body: { email: string; password: string }) =>
  http.post("auth/login", body);
