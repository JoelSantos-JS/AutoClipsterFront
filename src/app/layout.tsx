import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "AutoClipster",
  description: "Automated clip management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#121416] min-h-screen">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
