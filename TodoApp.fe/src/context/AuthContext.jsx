import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (authResponse) => {
    // authResponse = { token, username, role, expiresAt } trả về từ API
    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("user", JSON.stringify({
      username: authResponse.username,
      role: authResponse.role,
    }));
    setUser({ username: authResponse.username, role: authResponse.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}