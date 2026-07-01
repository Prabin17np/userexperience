export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export interface AuthError {
  field?: string;
  message: string;
}