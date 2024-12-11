"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/contexts/auth-context";
import { TaskProvider } from "@/contexts/task-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <TaskProvider>
          {children}
        </TaskProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
