import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "香水推荐助手",
  description: "基于偏好、场景和香调的智能香水推荐系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
