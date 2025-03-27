import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  principal: string | null;
  setPrincipal: (p: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  principal: null,
  setPrincipal: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [principal, setPrincipal] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ principal, setPrincipal }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
