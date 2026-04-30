import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "دفتر الوصفات",
  description: "تطبيق عربي لإدارة الوصفات الشخصية واكتشاف وصفات جديدة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
