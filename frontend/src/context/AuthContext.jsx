import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  fetchUser,
  login as loginUser,
  logout as logoutUser,
  refreshToken,
} from "../pages/auth/auth.js";

const REFRESH_CHECK_INTERVAL = 10 * 60 * 1000; // check every 10 min
const ACTIVITY_THRESHOLD    = 25 * 60 * 1000; // refresh if active in last 25 min

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastActivityRef = useRef(Date.now());

  // Check cookie on load
  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Re-validate session when tab regains focus (catches mid-session expiry)
  // Only fires if we already believe the user is logged in — avoids noisy 401s
  useEffect(() => {
    const handleFocus = () => {
      if (!user) return;
      fetchUser()
        .then(setUser)
        .catch(() => setUser(null));
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  // Track user activity via a ref — no re-renders
  useEffect(() => {
    const update = () => { lastActivityRef.current = Date.now(); };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, update, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, update));
  }, []);

  // Sliding session: refresh every 10 min if active in last 25 min.
  // If idle, do nothing — token expires naturally, next fetchUser() triggers logout.
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const idle = Date.now() - lastActivityRef.current;
      if (idle > ACTIVITY_THRESHOLD) return;
      try {
        await refreshToken();
      } catch {
        setUser(null);
      }
    }, REFRESH_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (email, password) => {
    await loginUser(email, password);
    const userData = await fetchUser();
    setUser(userData);
  };

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
