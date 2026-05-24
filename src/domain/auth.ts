export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export type SignUpFormInput = {
  email: string;
  password: string;
  fullName?: string;
  whatsappNumber?: string;
};

export type SignInFormInput = {
  email: string;
  password: string;
};
