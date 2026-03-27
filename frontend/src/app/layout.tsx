import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import ErpLayout from "@/components/layout/ErpLayout";

export const metadata: Metadata = {
  title: "吉航旅遊 ERP",
  description: "吉航旅遊 ERP 管理系統 — 全面前端展示",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <ErpLayout>{children}</ErpLayout>
        </Providers>
      </body>
    </html>
  );
}
