import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Admin, Supervisor } from './interfaces/database';

type UserInfo = {message:string, user:Supervisor & {contractor_id:number} | Admin};

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  userInfo?: UserInfo;
  signIn: (id: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);

  const baseUrl = import.meta.env.VITE_LOCAL_API ?? '';

  // Sign-in function
  const signIn = async (id: string, password: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSignedIn(true);
        setUserInfo(data);
        localStorage.setItem('isSignedIn', 'true');
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        console.error('Sign-in failed:', data.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Sign-out function
  const signOut = () => {
    setIsSignedIn(false);
    setUserInfo(undefined);
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('userInfo');
  };

  useEffect(() => {
    const storedIsSignedIn = localStorage.getItem('isSignedIn');
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedIsSignedIn === 'true' && storedUserInfo) {
      setIsSignedIn(true);
      setUserInfo(JSON.parse(storedUserInfo));
    }
    setIsLoaded(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, userInfo, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
