import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Playground",
  description: "AI를 배우고 실험하는 작은 놀이터",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
