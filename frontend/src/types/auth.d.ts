export interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface GoogleJwtPayload {
  name: string;
  email: string;
  sub: string;
}
