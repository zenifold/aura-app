"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

type UserData = {
  id: string;
  email: string;
  name: string | null;
  organizationId: string | null;
  organizationRole: string | null;
};

type AuthContextType = {
  isLoading: boolean;
  userData: UserData | null;
  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  userData: null,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUserData = async () => {
      if (!isUserLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get the JWT token with our custom claims
        const token = await getToken({ template: "Aura-JWT-Template" });
        
        console.log('Syncing user data for:', user.id);
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to sync user data');
        }

        const data = await response.json();
        setUserData({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          organizationId: data.user.organizationId,
          organizationRole: data.user.organizationRole,
        });
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
  }, [user, isUserLoaded, getToken]);

  return (
    <AuthContext.Provider value={{ isLoading, userData, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
