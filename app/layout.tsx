import "./globals.css";
import { Inter as FontSans } from "next/font/google"; 

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata = {
  title: "LiveDocs",
  description: "Your go-to collaborative editor.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased", fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
