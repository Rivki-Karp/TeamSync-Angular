interface Register{
  name: string;
  email: string;
  password: string;
}

interface Login{
  email: string;
  password: string;
}

interface AuthResponse{
    user: User;
    token: string;
}

interface AuthState {
  token: string | null;
  user: any | null;
  error: string | null;
  isLoading: boolean;
}