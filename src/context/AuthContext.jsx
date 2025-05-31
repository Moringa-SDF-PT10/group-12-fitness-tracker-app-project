import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load current user from localStorage on init
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fitbuddy-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  // Register a new user (returns true on success, error string on failure)
  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('fitbuddy-users')) || [];

    // Check for duplicate email
    const emailExists = users.some(user => user.email === email);
    if (emailExists) return 'Email already registered';

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('fitbuddy-users', JSON.stringify(users));

    return true;
  };

  // Login an existing user (returns true on success, error string on failure)
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('fitbuddy-users')) || [];
    const foundUser = users.find(
      user => user.email === email && user.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('fitbuddy-current-user', JSON.stringify(foundUser));
      return true;
    } else {
      return 'Invalid credentials';
    }
  };

  // Logout current user
  const logout = () => {
    localStorage.removeItem('fitbuddy-current-user');
    setUser(null);
  };

  // Optional: Keep in sync across tabs
  useEffect(() => {
    const syncUser = () => {
      const saved = localStorage.getItem('fitbuddy-current-user');
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
