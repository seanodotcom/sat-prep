import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Summit SAT",
  description: "A focused SAT prep app for daily missions, review, and measurable progress.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
