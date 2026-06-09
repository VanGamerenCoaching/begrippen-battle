import type { Metadata } from "next";
import "./globals.css";
import { OfflineReady } from "@/components/OfflineReady";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Begrippen Battle",
  description: "Offline onderwijsquiz met docentinput en vaste quizregels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        <OfflineReady />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
