export type SessionUser = {
  username: string;
  fullName?: string;
  document?: string;
  role: string;
};

export type Session = {
  token: string;
  tokenType: string;
  expiresAt: string;
  user: SessionUser;
};
