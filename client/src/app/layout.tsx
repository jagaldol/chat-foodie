import "@/styles/globals.css"
import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import { ReactNode } from "react"
import Header from "@/containers/home/header"
import Footer from "@/containers/home/footer"
import Navigator from "@/containers/home/navigator"
import AuthProvider from "@/contexts/authContextProvider"
import ChatroomProvider from "@/contexts/chatroomContextProvider"

const notoSans = Noto_Sans_KR({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Malgun Gothic", "Roboto", "sans-serif"],
})

export const metadata: Metadata = {
  title: "Chat Foodie",
  description: "음식 추천의 전문가 푸디와 채팅을 해보세요!",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <AuthProvider>
        <ChatroomProvider>
          <body
            className={`${notoSans.className} flex box-border`}
            style={{
              minHeight: "calc(var(--vh, 1vh) * 100)",
            }}
          >
            <Navigator />
            <main className="flex grow flex-col py-7 max-md:py-3">
              <Header />
              <section className="grow">{children}</section>
              <Footer />
            </main>
          </body>
        </ChatroomProvider>
      </AuthProvider>
    </html>
  )
}
