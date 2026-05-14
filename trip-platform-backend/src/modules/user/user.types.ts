export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  createdAt: Date;
}

export interface UpdateProfileBody {
  firstName?: string | undefined;
  lastName?: string | undefined;
  username?: string | undefined;
}

export interface UserDetailResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  createdAt: Date;
}
