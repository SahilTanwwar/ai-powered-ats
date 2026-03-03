import { createContext, useContext, useEffect, useReducer, useMemo } from "react";

const AuthContext = createContext(null);

// â”€â”€â”€ JWT helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function isTokenExpired(decoded) {
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

// â”€â”€â”€ Reducer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const initialState = {
  user:            null,
  token:           null,
  isAuthenticated: false,
  loading:         true,
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

// â”€â”€â”€ Provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // On mount: read from localStorage
  useEffect(() => {
    const token = localStorage.getItem("ats_token");
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded && !isTokenExpired(decoded)) {
        dispatch({ type: "LOGIN", user: decoded, token });
        return;
      }
      // Token exists but expired â€” clear it
      localStorage.removeItem("ats_token");
      localStorage.removeItem("ats_user");
    }
    dispatch({ type: "SET_LOADING", loading: false });
  }, []);

  const login = (token) => {
    const decoded = decodeJwt(token);
    if (!decoded || isTokenExpired(decoded)) {
      throw new Error("Invalid token received");
    }
    localStorage.setItem("ats_token", token);
    localStorage.setItem("ats_user", JSON.stringify(decoded));
    dispatch({ type: "LOGIN", user: decoded, token });
  };

  const logout = () => {
    localStorage.removeItem("ats_token");
    localStorage.removeItem("ats_user");
    dispatch({ type: "LOGOUT" });
  };

  const value = useMemo(() => ({ ...state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
