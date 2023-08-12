import "@/styles/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] }) // google font Inter으로 tailwind 사용하여 기본 폰트 지정

export const metadata: Metadata = {
  title: "Chat Foodie",
  description: "음식 추천의 전문가 푸디와 채팅을 해보세요!",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <h1 className="text-xl">ChatFoodie</h1>
        {children}
      </body>
    </html>
  )
}
