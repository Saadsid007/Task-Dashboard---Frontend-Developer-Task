import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Dashboard - Bajarangs Assignment",
  description: "Full-stack task management with authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
