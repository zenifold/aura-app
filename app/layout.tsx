import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Aura - Task Management',
  description: 'Modern task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
