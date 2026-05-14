export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RefreshBody {
  refreshToken: string;
}

export interface LogoutBody {
  refreshToken: string;
}