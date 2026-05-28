import { useEffect, useState } from "react";

const KEY = "talentmatch_user";
const AUTH_EVENT = "talentmatch_auth_changed";

export type UserRole = "student" | "company" | "recruiter";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

function readUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => readUser());

  useEffect(() => {
    const syncUser = () => setUser(readUser());
    window.addEventListener("storage", syncUser);
    window.addEventListener(AUTH_EVENT, syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(AUTH_EVENT, syncUser);
    };
  }, []);

  const persist = (u: AuthUser | null) => {
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
    setUser(u);
    window.dispatchEvent(new Event(AUTH_EVENT));
  };

  const login = (u: AuthUser) => persist(u);
  const logout = () => persist(null);

  return { user, login, logout };
}
