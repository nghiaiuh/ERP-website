export interface JwtUserInfo {
  id: string;
  email: string;
  username: string | null;
  displayName?: string | null;
  createdAt: string | null;
}
