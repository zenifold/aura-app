import { Providers } from "@/components/providers";
import "./globals.css";

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
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
