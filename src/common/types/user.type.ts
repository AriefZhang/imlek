export enum UserRoles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRoles;
}

export interface JwtPayloadWithExp extends JwtPayload {
  iat: number;
  exp: number;
}

export interface JwtTokens {
  accessToken: string;
}

export interface SignInResponse extends JwtTokens {
  userId: string;
  role: UserRoles;
  hostRole?: UserRoles;
}
