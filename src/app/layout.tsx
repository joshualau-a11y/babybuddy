import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BabyBuddy – Babysitter buchen",
  description: "Zuverlässige Babysitter in deiner Nähe finden und buchen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
