import { ReactNode } from "react"
import Header from "@/containers/home/header"
import Footer from "@/containers/home/footer"
import Navigator from "@/containers/home/navigator"
import AuthProvider from "@/contexts/authContextProvider"
import ChatroomProvider from "@/contexts/chatroomContextProvider"
import AnnounceModal from "@/containers/home/announceModal"

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatroomProvider>
        <Navigator />
        <main className="flex grow flex-col">
          <Header />
          <section className="grow">{children}</section>
          <AnnounceModal />
          <Footer />
        </main>
      </ChatroomProvider>
    </AuthProvider>
  )
}
