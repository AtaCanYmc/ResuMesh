export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  module: string;
  message: string;
  created_at: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}
