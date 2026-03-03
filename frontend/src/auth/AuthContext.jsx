import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function isExpired(user) {
  if (!user?.exp) return false;
  return Date.now() >= user.exp * 1000;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => (token ? decodeJwt(token) : null));

  useEffect(() => {
    if (token) {
      const parsed = decodeJwt(token);
      if (!parsed || isExpired(parsed)) {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        return;
      }
      localStorage.setItem("token", token);
      setUser(parsed);
      return;
    }
    localStorage.removeItem("token");
    setUser(null);
  }, [token]);

  useEffect(() => {
    const onExpired = () => setToken("");
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthed: !!token, setToken, logout: () => setToken("") }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
