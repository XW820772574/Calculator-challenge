import './globals.css';
import { Html } from 'next/document';

export const metadata = {
  title: 'Go+ConnectRPC 计算器',
  description: '使用 Go 后端 + Next.js 前端实现的全栈计算器应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
