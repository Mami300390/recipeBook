import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hearth & Spoon",
  description: "A warm personal cookbook and public recipe discovery app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
