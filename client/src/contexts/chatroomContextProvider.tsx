"use client"

import { createContext, ReactNode, useMemo, useState } from "react"

export const ChatroomContext = createContext<any>({})

export default function ChatroomProvider({ children }: { children: ReactNode }) {
  const [chatroomId, setChatroomId] = useState(0)
  const [update, setUpdate] = useState(false)

  const value = useMemo(
    () => ({
      chatroomId,
      setChatroomId,
      update,
      needUpdate: () => {
        setUpdate((u) => !u)
      },
    }),
    [update, chatroomId],
  )

  return <ChatroomContext.Provider value={value}>{children}</ChatroomContext.Provider>
}
