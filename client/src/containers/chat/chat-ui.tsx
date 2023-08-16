"use client"

import { useState } from "react"
import MessageInputContainer from "@/containers/chat/message-input-container"
import MessagesContainer from "@/containers/chat/messages-container"
import { ChatMessages } from "@/types/chat"

export default function ChatUi() {
  const [messages, setMessages] = useState<ChatMessages[]>([])

  const addMessage = (message: ChatMessages) => {
    setMessages((messagesState) => {
      const saveMessage = { ...message }
      if (saveMessage.id === 0) saveMessage.id = messagesState.length + 1
      return [...messagesState, saveMessage]
    })
  }

  return (
    <div className="flex flex-col min-h-full">
      <MessagesContainer messages={messages} />
      <MessageInputContainer addMessage={addMessage} />
    </div>
  )
}
