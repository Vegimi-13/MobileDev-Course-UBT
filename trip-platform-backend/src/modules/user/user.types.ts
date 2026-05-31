export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
}

export interface UpdateProfileBody {
  firstName?: string | undefined;
  lastName?: string | undefined;
  username?: string | undefined;
  bio?: string | undefined;
  avatarUrl?: string | undefined;
}

export interface UserDetailResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
}
