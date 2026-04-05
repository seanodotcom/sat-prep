import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Summit SAT",
  description: "Builder-ready SAT prep starter UI for a 30-day score sprint.",
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
