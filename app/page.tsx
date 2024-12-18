import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Always redirect authenticated users to the authenticated dashboard
  redirect("/(authenticated)/dashboard");
}
