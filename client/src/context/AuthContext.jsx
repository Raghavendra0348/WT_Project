import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      AuthService.getMe()
        .then((res) => {
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          // token expired / invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const data = await AuthService.login(credentials);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setUser(null);
    AuthService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
