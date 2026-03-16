export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface GoogleJwtPayload {
  name: string;
  email: string;
  sub: string;
}

export interface signInData {
  email: string;
  password: string;
  role: string;
}
