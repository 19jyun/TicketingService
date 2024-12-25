import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const login = (username: string) => {
    setUsername(username);
    localStorage.setItem('username', username); 
  };

  const logout = () => {
    setUsername(null); 
    localStorage.removeItem('username'); 
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
