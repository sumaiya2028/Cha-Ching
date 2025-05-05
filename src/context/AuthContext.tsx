import { createContext } from "react";

type User = {
  name: string;
  picture: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// ✅ Export ONLY the context (not a hook or component)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
