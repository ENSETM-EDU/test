export interface Member {
  id: string;
  name: string;
  created_at?: string;
}

export interface Pairing {
  id: string;
  date: string;
  pairs: [string, string][];
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
}