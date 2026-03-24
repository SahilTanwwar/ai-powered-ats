import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

const AuthContext = createContext(null);

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + padding);
}

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(decoded) {
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.user, token: action.token, isAuthenticated: true, loading: false };
    case "LOGOUT":
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const clearStoredAuth = useCallback(() => {
    localStorage.removeItem("ats_token");
    localStorage.removeItem("ats_user");
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    dispatch({ type: "LOGOUT" });
  }, [clearStoredAuth]);

  const login = useCallback(
    (token) => {
      if (!token) {
        logout();
        return;
      }

      const decoded = decodeJwt(token);
      if (!decoded || isTokenExpired(decoded)) {
        throw new Error("Invalid token received");
      }

      localStorage.setItem("ats_token", token);
      localStorage.setItem("ats_user", JSON.stringify(decoded));
      dispatch({ type: "LOGIN", user: decoded, token });
    },
    [logout]
  );

  useEffect(() => {
    const token = localStorage.getItem("ats_token");
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded && !isTokenExpired(decoded)) {
        dispatch({ type: "LOGIN", user: decoded, token });
        return;
      }
      clearStoredAuth();
    }
    dispatch({ type: "SET_LOADING", loading: false });
  }, [clearStoredAuth]);

  useEffect(() => {
    const handleExpiredAuth = () => logout();
    window.addEventListener("auth:expired", handleExpiredAuth);
    return () => window.removeEventListener("auth:expired", handleExpiredAuth);
  }, [logout]);

  const value = useMemo(
    () => ({
      ...state,
      isAuthed: state.isAuthenticated,
      setToken: login,
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
