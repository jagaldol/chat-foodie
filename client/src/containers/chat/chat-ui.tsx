"use client"

import { useEffect, useState } from "react"
import MessageInputContainer from "@/containers/chat/message-input-container"
import MessageBoxListContainer from "@/containers/chat/message-box-list-container"
import { ChatMessage } from "@/types/chat"
import { scrollDownChatBox } from "@/containers/chat/message-box-list"

export default function ChatUi() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const addMessage = (message: ChatMessage) => {
    setMessages((messagesState) => {
      const saveMessage = { ...message }
      if (saveMessage.id === 0) saveMessage.id = messagesState.length + 1
      return [...messagesState, saveMessage]
    })
  }

  useEffect(() => {
    scrollDownChatBox()
  }, [messages])

  return (
    <div className="flex flex-col min-h-full">
      <MessageBoxListContainer messages={messages} />
      <MessageInputContainer messages={messages} addMessage={addMessage} />
    </div>
  )
}
