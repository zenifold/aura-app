import { SignIn } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Aura",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white dark:bg-gray-900",
          },
        }}
        afterSignInUrl="/(authenticated)/dashboard"
        redirectUrl="/(authenticated)/dashboard"
      />
    </div>
  );
}
