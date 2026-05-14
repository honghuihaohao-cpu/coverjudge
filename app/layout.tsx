import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoverJudge — AI 封面裁判",
  description: "上传封面，AI 预测点击率。分 B站/抖音/视频号 三个平台独立评分。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`h-full antialiased bg-zinc-50 dark:bg-zinc-950 ${geist.className}`}>{children}</body>
    </html>
  );
}
