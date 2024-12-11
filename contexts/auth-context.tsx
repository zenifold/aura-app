"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type AuthContextType = {
  isLoading: boolean;
  userData: any | null;
  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  userData: null,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUserData = async () => {
      // Only sync if user is loaded and signed in
      if (!isLoaded || !isSignedIn || !user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Syncing user data for:', user.id);
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to sync user data');
        }

        console.log('User data synced:', data);
        setUserData(data.user);
        setError(null);
      } catch (error) {
        console.error('Error syncing user data:', error);
        setError(error instanceof Error ? error.message : 'Failed to sync user data');
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    syncUserData();
  }, [user, isLoaded, isSignedIn]);

  return (
    <AuthContext.Provider value={{ isLoading, userData, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
