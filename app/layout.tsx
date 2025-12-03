import type { Metadata } from "next";
import "./globals.css";
import CronInitializer from "@/components/cron-initializer";
import { Toaster } from "@/components/ui/sonner";

// Averta font is loaded via CSS @font-face in globals.css
// Font files should be placed in the fonts/ directory at the project root

export const metadata: Metadata = {
  title: "Phone Number Reservation - Quickteller Business",
  description: "Reserve your phone number for the Quickteller Business campaign",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-averta antialiased"
      >
        <CronInitializer />
        <Toaster position="top-right" richColors closeButton />
        {children}
      </body>
    </html>
  );
}
