import "@/styles/globals.css"
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

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatroomProvider>
        <Navigator />
        <main className="flex grow flex-col py-7 max-md:py-3">
          <Header />
          <section className="grow">{children}</section>
          <Footer />
        </main>
      </ChatroomProvider>
    </AuthProvider>
  )
}
