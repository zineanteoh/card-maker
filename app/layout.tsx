import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Maker",
  description: "Create your own custom gift cards!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
