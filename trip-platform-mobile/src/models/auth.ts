export type AuthMode = "login" | "register";

export type AuthForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  firstName: string;
  lastName: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const initialAuthForm: AuthForm = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};
