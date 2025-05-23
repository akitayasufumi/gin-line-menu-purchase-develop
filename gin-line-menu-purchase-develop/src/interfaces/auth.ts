export enum ROLE {
  ADMIN,
  USER,
}

export interface AuthSignIn {
  account: string
  password: string
}

export interface AuthRegister {
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface AuthForgotPassword {
  phoneNumber: string
}

export interface AuthToken {
  token: string
}

export interface CurrentUser {
  email: string
  username: string
}

export interface AuthState {
  currentUser: any
  loading: boolean,
  error?: string
}
