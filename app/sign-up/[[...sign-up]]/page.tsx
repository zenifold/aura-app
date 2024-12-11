import { SignUp } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Aura",
  description: "Create your account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white dark:bg-gray-900",
          },
        }}
        afterSignUpUrl="/(authenticated)/dashboard"
        redirectUrl="/(authenticated)/dashboard"
      />
    </div>
  );
}
